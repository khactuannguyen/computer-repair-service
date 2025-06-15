import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import RepairOrder from "@/lib/db/models/RepairOrder";
import User from "@/lib/db/models/User";
import { checkRole, checkAuth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/orders - List all orders (with optional filters)
export async function GET(request: NextRequest) {
  await checkAuth();
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const query: any = {};
  if (status && status !== "all") query.status = status;
  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { customerName: searchRegex },
      { customerPhone: searchRegex },
      { trackingCode: searchRegex },
      { deviceType: searchRegex },
    ];
  }
  const orders = await RepairOrder.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, orders });
}

// POST /api/admin/orders - Create new order
export async function POST(request: NextRequest) {
  await checkRole(["admin", "receptionist"]);
  await connectToDatabase();
  const body = await request.json();
  // Validate required fields
  if (!body.trackingCode || !body.service) {
    return NextResponse.json(
      { success: false, error: "Missing trackingCode or service" },
      { status: 400 }
    );
  }
  // Ensure trackingCode is unique
  const existing = await RepairOrder.findOne({
    trackingCode: body.trackingCode,
  });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "Mã đơn hàng đã tồn tại" },
      { status: 409 }
    );
  }
  const order = await RepairOrder.create(body);
  return NextResponse.json({ success: true, order });
}
