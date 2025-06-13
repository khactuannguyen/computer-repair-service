import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"
import User from "@/lib/db/models/User"
import connectToDatabase from "@/lib/db/mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function signJWT(payload: any) {
  const secret = new TextEncoder().encode(JWT_SECRET)

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)

  return token
}

export async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function login(email: string, password: string) {
  await connectToDatabase()

  const user = await User.findOne({ email })
  if (!user) return null

  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) return null

  // Create a JWT token
  const token = await signJWT({
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
  })

  // Set the token in cookies
  cookies().set("auth-token", token, {
    httpOnly: true,
    maxAge: MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export async function logout() {
  cookies().delete("auth-token")
}

export async function getSession() {
  const token = cookies().get("auth-token")?.value
  if (!token) return null

  const payload = await verifyJWT(token)
  return payload
}

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  const payload = await verifyJWT(token)
  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return payload
}

export async function checkAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/admin/login")
  }
  return session
}

export async function checkRole(allowedRoles: string[]) {
  const session = await getSession()
  if (!session) {
    redirect("/admin/login")
  }

  if (!allowedRoles.includes(session.role as string)) {
    redirect("/admin/unauthorized")
  }

  return session
}
