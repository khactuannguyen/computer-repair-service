import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import Service from "@/lib/db/models/Service"
import Category from "@/lib/db/models/Category"

export async function GET(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang")

    if (lang) {
      // Get specific language version
      const service = await Service.findOne({
        documentId: params.documentId,
        lang,
      }).lean()

      if (!service) {
        return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
      }

      // Populate category
      const category = await Category.findOne({
        documentId: service.categoryDocumentId,
        lang,
      }).lean()

      return NextResponse.json({
        success: true,
        data: {
          ...service,
          category,
        },
      })
    } else {
      // Get all language versions
      const services = await Service.find({
        documentId: params.documentId,
      }).lean()

      if (services.length === 0) {
        return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: services,
      })
    }
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    await connectDB()

    const body = await request.json()
    const { translations, categoryDocumentId, price, estimatedTime, icon, warranty, isActive, isFeatured, order } = body

    const updatedServices = []

    // Update each language version
    for (const [lang, translation] of Object.entries(translations)) {
      const updatedService = await Service.findOneAndUpdate(
        { documentId: params.documentId, lang },
        {
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
          isActive,
          isFeatured,
          order,
          updatedAt: new Date(),
        },
        { new: true, upsert: true },
      )

      updatedServices.push(updatedService)
    }

    return NextResponse.json({
      success: true,
      data: updatedServices,
    })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ success: false, error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    await connectDB()

    // Delete all language versions
    const result = await Service.deleteMany({
      documentId: params.documentId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} service documents`,
    })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ success: false, error: "Failed to delete service" }, { status: 500 })
  }
}
