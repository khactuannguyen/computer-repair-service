import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import FAQ from "@/lib/db/models/FAQ"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang") || "vi"
    const category = searchParams.get("category")
    const isActive = searchParams.get("active")

    // Build query
    const query: any = { lang }
    if (category) {
      query.category = category
    }
    if (isActive !== null) {
      query.isActive = isActive === "true"
    }

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: 1 }).lean()

    return NextResponse.json({
      success: true,
      data: faqs,
    })
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch FAQs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { documentId, translations, category, order, isActive } = body

    // Validate required fields
    if (!documentId || !translations || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const faqDocuments = []

    // Create documents for each language
    for (const [lang, translation] of Object.entries(translations)) {
      const faqDoc = new FAQ({
        documentId,
        lang,
        question: translation.question,
        answer: translation.answer,
        category,
        order: order || 0,
        isActive: isActive !== false,
      })

      faqDocuments.push(faqDoc)
    }

    // Save all language versions
    const savedFAQs = await FAQ.insertMany(faqDocuments)

    return NextResponse.json({
      success: true,
      data: savedFAQs,
    })
  } catch (error) {
    console.error("Error creating FAQ:", error)
    return NextResponse.json({ success: false, error: "Failed to create FAQ" }, { status: 500 })
  }
}
