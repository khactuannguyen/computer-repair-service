import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/utils/logger";

export function middleware(request: NextRequest) {
  const { method, url, headers } = request;
  const userAgent = headers.get("user-agent") || "";
  const ip =
    request.ip ||
    headers.get("x-forwarded-for") ||
    headers.get("x-real-ip") ||
    "unknown";

  logger.info(`[REQUEST] ${method} ${url} - UA: ${userAgent} - IP: ${ip}`);

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for static files and favicon
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
