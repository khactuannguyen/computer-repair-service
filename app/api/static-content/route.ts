import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import StaticContent from "@/lib/db/models/StaticContent"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang") || "vi"
    const key = searchParams.get("key")
    const type = searchParams.get("type")
    const isActive = searchParams.get("active")

    // Build query
    const query: any = { lang }
    if (key) {
      query.key = key
    }
    if (type) {
      query.type = type
    }
    if (isActive !== null) {
      query.isActive = isActive === "true"
    }

    const content = await StaticContent.find(query).sort({ order: 1, createdAt: 1 }).lean()

    return NextResponse.json({
      success: true,
      data: content,
    })
  } catch (error) {
    console.error("Error fetching static content:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch static content" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { documentId, key, type, translations, buttonUrl, imageUrl, isActive, order } = body

    // Validate required fields
    if (!documentId || !key || !type || !translations) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const staticContentDocuments = []

    // Create documents for each language
    for (const [lang, translation] of Object.entries(translations)) {
      const staticContentDoc = new StaticContent({
        documentId,
        lang,
        key,
        type,
        title: translation.title,
        content: translation.content,
        buttonText: translation.buttonText,
        buttonUrl,
        imageUrl,
        isActive: isActive !== false,
        order: order || 0,
      })

      staticContentDocuments.push(staticContentDoc)
    }

    // Save all language versions
    const savedStaticContent = await StaticContent.insertMany(staticContentDocuments)

    return NextResponse.json({
      success: true,
      data: savedStaticContent,
    })
  } catch (error) {
    console.error("Error creating static content:", error)
    return NextResponse.json({ success: false, error: "Failed to create static content" }, { status: 500 })
  }
}
