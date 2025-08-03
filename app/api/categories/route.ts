import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db/mongodb"
import Category from "@/lib/db/models/Category"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const locale = searchParams.get("locale") || "vi"
    const isActive = searchParams.get("active")

    // Build query
    const query: any = { locale }
    if (isActive !== null) {
      query.isActive = isActive === "true"
    }

    const categories = await Category.find(query).sort({ order: 1, name: 1 }).lean()

    // If no categories found for requested locale, fallback to Vietnamese
    if (categories.length === 0 && locale !== "vi") {
      const fallbackQuery = { ...query, locale: "vi" }
      const fallbackCategories = await Category.find(fallbackQuery).sort({ order: 1, name: 1 }).lean()

      return NextResponse.json({
        success: true,
        data: fallbackCategories,
        fallback: true,
        requestedLocale: locale,
        actualLocale: "vi",
      })
    }

    return NextResponse.json({
      success: true,
      data: categories,
      fallback: false,
      locale,
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}
