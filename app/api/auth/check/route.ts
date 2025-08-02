import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { withErrorHandler } from "@/lib/utils/error-middleware";

export const GET = withErrorHandler(async function GET() {
  const session = await getSession();
  if (session) {
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
});
