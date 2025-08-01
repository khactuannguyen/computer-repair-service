import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/utils/logger";

export class HttpError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export class UserError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
    this.name = "UserError";
  }
}

export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  handler: T
): (...args: Parameters<T>) => Promise<any> {
  return async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error: any) {
      // Known HTTP/User error
      if (
        error instanceof HttpError ||
        error instanceof UserError ||
        (error.status && error.message)
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status || 400 }
        );
      }
      // Unknown error
      logger.error("[Unhandled Exception]", { error });
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
