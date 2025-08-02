import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import Category from "@/lib/db/models/Category"

export async function GET(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const lang = searchParams.get("lang")

    if (lang) {
      // Get specific language version
      const category = await Category.findOne({
        documentId: params.documentId,
        lang,
      }).lean()

      if (!category) {
        return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: category,
      })
    } else {
      // Get all language versions
      const categories = await Category.find({
        documentId: params.documentId,
      }).lean()

      if (categories.length === 0) {
        return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: categories,
      })
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    await connectDB()

    const body = await request.json()
    const { translations, order, isActive } = body

    const updatedCategories = []

    // Update each language version
    for (const [lang, translation] of Object.entries(translations)) {
      const updatedCategory = await Category.findOneAndUpdate(
        { documentId: params.documentId, lang },
        {
          name: translation.name,
          description: translation.description,
          slug: translation.slug,
          order,
          isActive,
          updatedAt: new Date(),
        },
        { new: true, upsert: true },
      )

      updatedCategories.push(updatedCategory)
    }

    return NextResponse.json({
      success: true,
      data: updatedCategories,
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    await connectDB()

    // Delete all language versions
    const result = await Category.deleteMany({
      documentId: params.documentId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} category documents`,
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 })
  }
}
