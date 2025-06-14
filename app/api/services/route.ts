import { type NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import Service from "@/lib/db/models/Service";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    const query: any = { isActive: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    let servicesQuery = Service.find(query).sort({ order: 1, createdAt: -1 });

    if (limit) {
      servicesQuery = servicesQuery.limit(Number.parseInt(limit));
    }

    const services = await servicesQuery;

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
