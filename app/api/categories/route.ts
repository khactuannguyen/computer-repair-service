import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "vi";
    const isActive = searchParams.get("active");

    // Build query
    const query: any = { lang };
    if (isActive !== null) {
      query.isActive = isActive === "true";
    }

    const categories = await Category.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { documentId, translations, order, isActive } = body;

    // Validate required fields
    if (!documentId || !translations) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const categoryDocuments = [];

    // Create documents for each language
    for (const [lang, translation] of Object.entries(translations)) {
      const categoryDoc = new Category({
        documentId,
        lang,
        name: translation.name,
        description: translation.description,
        slug: translation.slug,
        order: order || 0,
        isActive: isActive !== false,
      });

      categoryDocuments.push(categoryDoc);
    }

    // Save all language versions
    const savedCategories = await Category.insertMany(categoryDocuments);

    return NextResponse.json({
      success: true,
      data: savedCategories,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
