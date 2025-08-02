import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import BlogPost from "@/lib/db/models/BlogPost"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang") || "vi"
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const published = searchParams.get("published")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")

    // Build query
    const query: any = { lang }
    if (category) {
      query.category = category
    }
    if (featured !== null) {
      query.isFeatured = featured === "true"
    }
    if (published !== null) {
      query.isPublished = published === "true"
    }

    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .populate("author", "name email")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { documentId, translations, tags, category, isPublished, isFeatured, readTime, publishedAt, author } = body

    // Validate required fields
    if (!documentId || !translations || !category || !author) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const blogPostDocuments = []

    // Create documents for each language
    for (const [lang, translation] of Object.entries(translations)) {
      const blogPostDoc = new BlogPost({
        documentId,
        lang,
        title: translation.title,
        slug: translation.slug,
        content: translation.content,
        excerpt: translation.excerpt,
        tags: tags || [],
        category,
        isPublished: isPublished === true,
        isFeatured: isFeatured === true,
        readTime: readTime || 5,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        author,
      })

      blogPostDocuments.push(blogPostDoc)
    }

    // Save all language versions
    const savedBlogPosts = await BlogPost.insertMany(blogPostDocuments)

    return NextResponse.json({
      success: true,
      data: savedBlogPosts,
    })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ success: false, error: "Failed to create blog post" }, { status: 500 })
  }
}
