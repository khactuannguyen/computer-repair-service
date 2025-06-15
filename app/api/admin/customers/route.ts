import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Customer from "@/lib/db/models/Customer";

export const dynamic = "force-dynamic";

// GET /api/admin/customers - List all customers
export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const query: any = {};
  if (search) {
    const searchRegex = new RegExp(search, "i");
    query.$or = [
      { name: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
    ];
  }
  const customers = await Customer.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, customers });
}

// POST /api/admin/customers - Create new customer
export async function POST(request: NextRequest) {
  await connectToDatabase();
  const body = await request.json();
  if (!body.name || !body.phone) {
    return NextResponse.json(
      { success: false, error: "Missing name or phone" },
      { status: 400 }
    );
  }
  // Check if phone already exists
  const existing = await Customer.findOne({ phone: body.phone });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "Phone number already exists" },
      { status: 409 }
    );
  }
  const customer = await Customer.create({
    name: body.name,
    phone: body.phone,
    email: body.email || undefined,
    note: body.note || undefined,
  });
  return NextResponse.json({ success: true, customer });
}
