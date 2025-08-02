import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import Service from "@/lib/db/models/Service"
import Category from "@/lib/db/models/Category"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang") || "vi"
    const categoryDocumentId = searchParams.get("categoryDocumentId")
    const featured = searchParams.get("featured")
    const isActive = searchParams.get("active")

    // Build query
    const query: any = { lang }
    if (categoryDocumentId) {
      query.categoryDocumentId = categoryDocumentId
    }
    if (featured !== null) {
      query.isFeatured = featured === "true"
    }
    if (isActive !== null) {
      query.isActive = isActive === "true"
    }

    const services = await Service.find(query).sort({ order: 1, name: 1 }).lean()

    // Populate category information
    const servicesWithCategories = await Promise.all(
      services.map(async (service) => {
        const category = await Category.findOne({
          documentId: service.categoryDocumentId,
          lang,
        }).lean()

        return {
          ...service,
          category,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: servicesWithCategories,
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      documentId,
      translations,
      categoryDocumentId,
      price,
      estimatedTime,
      icon,
      warranty,
      isActive,
      isFeatured,
      order,
    } = body

    // Validate required fields
    if (!documentId || !translations || !categoryDocumentId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const serviceDocuments = []

    // Create documents for each language
    for (const [lang, translation] of Object.entries(translations)) {
      const serviceDoc = new Service({
        documentId,
        lang,
        name: translation.name,
        description: translation.description,
        shortDescription: translation.shortDescription,
        slug: translation.slug,
        features: translation.features,
        categoryDocumentId,
        price,
        estimatedTime,
        icon,
        warranty,
        isActive: isActive !== false,
        isFeatured: isFeatured === true,
        order: order || 0,
      })

      serviceDocuments.push(serviceDoc)
    }

    // Save all language versions
    const savedServices = await Service.insertMany(serviceDocuments)

    return NextResponse.json({
      success: true,
      data: savedServices,
    })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ success: false, error: "Failed to create service" }, { status: 500 })
  }
}
