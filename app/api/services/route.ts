import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import Service from "@/lib/db/models/Service"
import Category from "@/lib/db/models/Category"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const locale = searchParams.get("locale") || "vi"
    const categoryDocumentId = searchParams.get("categoryDocumentId")
    const featured = searchParams.get("featured")
    const isActive = searchParams.get("active")

    // Build query
    const query: any = { locale }
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
          locale,
        }).lean()

        return {
          ...service,
          category,
        }
      }),
    )

    // If no services found for requested locale, fallback to Vietnamese
    if (servicesWithCategories.length === 0 && locale !== "vi") {
      const fallbackQuery = { ...query, locale: "vi" }
      const fallbackServices = await Service.find(fallbackQuery).sort({ order: 1, name: 1 }).lean()

      const fallbackServicesWithCategories = await Promise.all(
        fallbackServices.map(async (service) => {
          const category = await Category.findOne({
            documentId: service.categoryDocumentId,
            locale: "vi",
          }).lean()

          return {
            ...service,
            category,
          }
        }),
      )

      return NextResponse.json({
        success: true,
        data: fallbackServicesWithCategories,
        fallback: true,
        requestedLocale: locale,
        actualLocale: "vi",
      })
    }

    return NextResponse.json({
      success: true,
      data: servicesWithCategories,
      fallback: false,
      locale,
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 })
  }
}
