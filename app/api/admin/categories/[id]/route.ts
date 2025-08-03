import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db/mongodb"
import Category from "@/lib/db/models/Category"
import { withErrorHandler, UserError } from "@/lib/utils/error-middleware"

// GET: Get category by id
export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect()
  const category = await Category.findById(params.id)
  if (!category) throw new UserError("Category not found", 404)
  return NextResponse.json({ success: true, data: category })
})

// PUT: Update category translation
export const PUT = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect()
  const data = await req.json()

  try {
    const updated = await Category.findByIdAndUpdate(
      params.id,
      {
        name: data.name,
        description: data.description,
        slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, "-"),
        order: data.order,
        isActive: data.isActive,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    )

    if (!updated) throw new UserError("Category not found", 404)
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    throw new UserError(error.message, 400)
  }
})

// DELETE: Remove category translation
export const DELETE = withErrorHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await dbConnect()

  try {
    const deleted = await Category.findByIdAndDelete(params.id)
    if (!deleted) throw new UserError("Category not found", 404)

    return NextResponse.json({
      success: true,
      message: `Deleted category translation: ${deleted.locale}`,
    })
  } catch (error: any) {
    throw new UserError(error.message, 400)
  }
})
