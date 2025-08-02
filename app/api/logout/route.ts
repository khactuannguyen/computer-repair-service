import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/utils/error-middleware";

export const POST = withErrorHandler(async function POST() {
  // Remove the auth cookie (adjust the cookie name as needed)
  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": `auth-token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`, // adjust cookie name if needed
      },
    }
  );
});
