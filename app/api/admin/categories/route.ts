import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db/mongodb"
import Category from "@/lib/db/models/Category"
import { withErrorHandler, UserError } from "@/lib/utils/error-middleware"
import { v4 as uuidv4 } from "uuid"

// GET: List all categories with optional documentId filter
export const GET = withErrorHandler(async function GET(req: NextRequest) {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const documentId = searchParams.get("documentId")
  const locale = searchParams.get("locale")

  const query: any = {}

  if (documentId) {
    // Get all translations for a specific document
    query.documentId = documentId
  } else if (locale) {
    // Get all categories for a specific locale
    query.locale = locale
  }

  const categories = await Category.find(query).sort({ order: 1, createdAt: -1 })

  if (documentId) {
    // Group by locale for easier frontend handling
    const grouped = categories.reduce((acc, cat) => {
      acc[cat.locale] = cat
      return acc
    }, {})
    return NextResponse.json({ success: true, data: grouped })
  }

  return NextResponse.json({ success: true, data: categories })
})

// POST: Create new category translation
export const POST = withErrorHandler(async function POST(req: NextRequest) {
  await dbConnect()
  const data = await req.json()

  const { documentId, locale, name, description, slug, order, isActive } = data

  // Validate required fields
  if (!locale || !name || !description) {
    throw new UserError("Missing required fields", 400)
  }

  // Generate documentId if not provided (first translation)
  const finalDocumentId = documentId || uuidv4()

  try {
    const category = await Category.create({
      documentId: finalDocumentId,
      locale,
      name,
      description,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      order: order || 0,
      isActive: isActive !== false,
    })

    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      throw new UserError("Category already exists for this locale", 400)
    }
    throw new UserError(error.message, 400)
  }
})
