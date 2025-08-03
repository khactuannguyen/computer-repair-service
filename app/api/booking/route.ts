import { NextRequest, NextResponse } from "next/server";
import { submitBookingForm } from "@/lib/actions/booking-actions";
import { withErrorHandler } from "@/lib/utils/error-middleware";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const data = await req.json();
  const result = await submitBookingForm(data);
  return NextResponse.json(result);
});
