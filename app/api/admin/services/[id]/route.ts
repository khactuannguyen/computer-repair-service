import { type NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Service from "@/lib/db/models/Service";
import { checkAuth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const service = await Service.findById(params.id).populate({
      path: "category",
      select: "name order description",
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();

    // Validate category is required and is a valid ObjectId
    if (!data.category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }
    // Optionally: check if category exists
    const categoryExists = await Service.db
      .model("Category")
      .findById(data.category);
    if (!categoryExists) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    const service = await Service.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      service,
      message: "Service updated successfully",
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await checkAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const service = await Service.findByIdAndDelete(params.id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
