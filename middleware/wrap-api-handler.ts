import logger from "@/lib/utils/logger";

export function withApiErrorHandler(
  handler: (req: Request, ...args: any[]) => Promise<Response>
) {
  return async (req: Request, ...args: any[]): Promise<Response> => {
    try {
      return await handler(req, ...args);
    } catch (error: any) {
      logger.error("API Error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          message: error?.message || "Unknown error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  };
}
