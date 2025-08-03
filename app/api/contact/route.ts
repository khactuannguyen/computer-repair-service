import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/actions/contact-actions";
import { withErrorHandler } from "@/lib/utils/error-middleware";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const data = await req.json();
  const result = await sendContactEmail(data);
  return NextResponse.json(result);
});
