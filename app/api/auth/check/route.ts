import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (session) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
        },
      })
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
