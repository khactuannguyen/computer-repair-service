import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import Testimonial from "@/lib/db/models/Testimonial"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang") || "vi"
    const serviceType = searchParams.get("serviceType")
    const featured = searchParams.get("featured")
    const published = searchParams.get("published")

    // Build query
    const query: any = { lang }
    if (serviceType) {
      query.serviceType = serviceType
    }
    if (featured !== null) {
      query.isFeatured = featured === "true"
    }
    if (published !== null) {
      query.isPublished = published === "true"
    }

    const testimonials = await Testimonial.find(query).sort({ order: 1, publishedAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: testimonials,
    })
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { documentId, translations, rating, serviceType, isPublished, isFeatured, order, publishedAt } = body

    // Validate required fields
    if (!documentId || !translations || !rating || !serviceType) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const testimonialDocuments = []

    // Create documents for each language
    for (const [lang, translation] of Object.entries(translations)) {
      const testimonialDoc = new Testimonial({
        documentId,
        lang,
        customerName: translation.customerName,
        customerTitle: translation.customerTitle,
        content: translation.content,
        rating,
        serviceType,
        isPublished: isPublished === true,
        isFeatured: isFeatured === true,
        order: order || 0,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      })

      testimonialDocuments.push(testimonialDoc)
    }

    // Save all language versions
    const savedTestimonials = await Testimonial.insertMany(testimonialDocuments)

    return NextResponse.json({
      success: true,
      data: savedTestimonials,
    })
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json({ success: false, error: "Failed to create testimonial" }, { status: 500 })
  }
}
