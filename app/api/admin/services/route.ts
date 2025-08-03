import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db/mongodb"
import Service from "@/lib/db/models/Service"
import Category from "@/lib/db/models/Category"
import { checkAuth } from "@/lib/auth/auth"
import { v4 as uuidv4 } from "uuid"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await checkAuth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("documentId")
    const locale = searchParams.get("locale")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const query: any = {}

    if (documentId) {
      // Get all translations for a specific document
      query.documentId = documentId
      const services = await Service.find(query).populate({
        path: "categoryDocumentId",
        select: "name order description",
      })

      // Group by locale for easier frontend handling
      const grouped = services.reduce((acc, service) => {
        acc[service.locale] = service
        return acc
      }, {})

      return NextResponse.json({ success: true, data: grouped })
    }

    if (locale) {
      query.locale = locale
    }

    if (category && category !== "all") {
      query.categoryDocumentId = category
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const skip = (page - 1) * limit
    const services = await Service.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit)

    // Populate category information
    const servicesWithCategories = await Promise.all(
      services.map(async (service) => {
        const category = await Category.findOne({
          documentId: service.categoryDocumentId,
          locale: service.locale,
        })
        return {
          ...service.toObject(),
          category,
        }
      }),
    )

    const total = await Service.countDocuments(query)

    return NextResponse.json({
      success: true,
      services: servicesWithCategories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await checkAuth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const data = await request.json()

    const {
      documentId,
      locale,
      name,
      description,
      shortDescription,
      categoryDocumentId,
      price,
      estimatedTime,
      icon,
      warranty,
      isActive,
      isFeatured,
      order,
    } = data

    // Validate required fields
    if (!locale || !name || !description || !categoryDocumentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate documentId if not provided (first translation)
    const finalDocumentId = documentId || uuidv4()

    // Validate category exists
    const categoryExists = await Category.findOne({
      documentId: categoryDocumentId,
      locale,
    })

    if (!categoryExists) {
      return NextResponse.json({ error: "Category not found for this locale" }, { status: 400 })
    }

    const service = new Service({
      documentId: finalDocumentId,
      locale,
      name,
      description,
      shortDescription,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      categoryDocumentId,
      price,
      estimatedTime,
      icon: icon || "laptop",
      warranty,
      isActive: isActive !== false,
      isFeatured: isFeatured === true,
      order: order || 0,
    })

    await service.save()

    return NextResponse.json({
      success: true,
      service,
      message: "Service created successfully",
    })
  } catch (error: any) {
    console.error("Error creating service:", error)

    if (error.code === 11000) {
      return NextResponse.json({ error: "Service already exists for this locale" }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
