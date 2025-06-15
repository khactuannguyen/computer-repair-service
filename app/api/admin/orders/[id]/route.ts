import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import RepairOrder from "@/lib/db/models/RepairOrder";
import User from "@/lib/db/models/User";
import { checkRole, checkAuth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/orders/[id] - Get order detail
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await checkAuth();
  await connectToDatabase();
  const orderDoc = await RepairOrder.findById(params.id);
  if (!orderDoc)
    return NextResponse.json(
      { success: false, error: "Order not found" },
      { status: 404 }
    );
  const order = orderDoc.toObject();
  // Populate technician name if assigned
  let assignedToName = null;
  if (order.assignedTo) {
    const techDoc = await User.findById(order.assignedTo);
    assignedToName = techDoc ? techDoc.name : null;
  }
  return NextResponse.json({
    success: true,
    order: { ...order, assignedToName },
  });
}

// PUT /api/admin/orders/[id] - Update order (only allowed fields)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await checkRole(["admin", "receptionist", "technician"]);
  await connectToDatabase();
  const body = await request.json();
  // Allow updating these fields
  const allowedFields = [
    "status",
    "estimatedCost",
    "estimatedCompletionDate",
    "assignedTo",
    "internalNotes",
    "trackingCode",
    "service",
  ];
  const update: any = {};
  for (const key of allowedFields) {
    if (key in body) update[key] = body[key];
  }
  // If trackingCode is being updated, check uniqueness
  if (update.trackingCode) {
    const existing = await RepairOrder.findOne({
      trackingCode: update.trackingCode,
      _id: { $ne: params.id },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Mã đơn hàng đã tồn tại" },
        { status: 409 }
      );
    }
  }
  const order = await RepairOrder.findByIdAndUpdate(params.id, update, {
    new: true,
  }).lean();
  if (!order)
    return NextResponse.json(
      { success: false, error: "Order not found" },
      { status: 404 }
    );
  return NextResponse.json({ success: true, order });
}
