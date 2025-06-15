import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";

// GET: List all categories
export async function GET() {
  await dbConnect();
  const categories = await Category.find({}).sort({ createdAt: -1 });
  return NextResponse.json(categories);
}

// POST: Create new category
export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  try {
    const category = await Category.create(data);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
