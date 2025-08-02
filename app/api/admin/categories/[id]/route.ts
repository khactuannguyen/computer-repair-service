import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Category from "@/lib/db/models/Category";
import { withErrorHandler, UserError } from "@/lib/utils/error-middleware";

// GET: Get category by id
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const category = await Category.findById(params.id);
    if (!category) throw new UserError("Not found", 404);
    return NextResponse.json(category);
  }
);

// PUT: Update category
export const PUT = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const data = await req.json();
    try {
      const updated = await Category.findByIdAndUpdate(params.id, data, {
        new: true,
      });
      if (!updated) throw new UserError("Not found", 404);
      return NextResponse.json(updated);
    } catch (error: any) {
      throw new UserError(error.message, 400);
    }
  }
);

// DELETE: Remove category
export const DELETE = withErrorHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    try {
      const deleted = await Category.findByIdAndDelete(params.id);
      if (!deleted) throw new UserError("Not found", 404);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      throw new UserError(error.message, 400);
    }
  }
);
