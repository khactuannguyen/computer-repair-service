import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Service from "@/lib/db/models/Service";
import Category from "@/lib/db/models/Category";

// GET: List all categories (for dropdown, etc.)
export async function GET() {
  await dbConnect();
  const categories = await Category.find({}).sort({ name: 1 });
  return NextResponse.json(categories);
}
