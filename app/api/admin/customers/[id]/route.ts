import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Customer from "@/lib/db/models/Customer";

export const dynamic = "force-dynamic";

// GET /api/admin/customers/[id] - Get customer detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const customer = await Customer.findById(params.id).lean();
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Customer not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, customer });
}

// PUT /api/admin/customers/[id] - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const body = await request.json();
  const update: any = {};
  if (body.name) update.name = body.name;
  if (body.phone) {
    // Check if phone exists for another customer
    const existing = await Customer.findOne({
      phone: body.phone,
      _id: { $ne: params.id },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Phone number already exists" },
        { status: 409 }
      );
    }
    update.phone = body.phone;
  }
  if (body.email !== undefined) update.email = body.email;
  if (body.note !== undefined) update.note = body.note;
  const customer = await Customer.findByIdAndUpdate(params.id, update, {
    new: true,
  });
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Customer not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, customer });
}

// DELETE /api/admin/customers/[id] - Delete customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const customer = await Customer.findByIdAndDelete(params.id);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Customer not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true });
}
