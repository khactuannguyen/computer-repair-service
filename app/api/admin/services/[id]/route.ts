import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import Service from "@/lib/db/models/Service"
import Category from "@/lib/db/models/Category"
import { checkAuth } from "@/lib/auth/auth"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await checkAuth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const service = await Service.findById(params.id)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Get category information
    const category = await Category.findOne({
      documentId: service.categoryDocumentId,
      locale: service.locale,
    })

    return NextResponse.json({
      success: true,
      service: {
        ...service.toObject(),
        category,
      },
    })
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await checkAuth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const data = await request.json()

    // Validate category exists for the same locale
    if (data.categoryDocumentId) {
      const service = await Service.findById(params.id)
      if (!service) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 })
      }

      const categoryExists = await Category.findOne({
        documentId: data.categoryDocumentId,
        locale: service.locale,
      })

      if (!categoryExists) {
        return NextResponse.json({ error: "Category not found for this locale" }, { status: 400 })
      }
    }

    const service = await Service.findByIdAndUpdate(
      params.id,
      {
        ...data,
        slug: data.name ? data.name.toLowerCase().replace(/\s+/g, "-") : undefined,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      service,
      message: "Service updated successfully",
    })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await checkAuth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const service = await Service.findByIdAndDelete(params.id)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Deleted service translation: ${service.locale}`,
    })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
