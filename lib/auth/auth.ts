import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"
import User from "@/lib/db/models/User"
import connectToDatabase from "@/lib/db/mongodb"
import bcrypt from "bcryptjs"

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
    console.error("JWT verification error:", error)
    return null
  }
}

export async function login(email: string, password: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      console.log("User not found:", email)
      return { success: false, error: "Email hoặc mật khẩu không đúng" }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email)
      return { success: false, error: "Email hoặc mật khẩu không đúng" }
    }

    // Create a JWT token
    const token = await signJWT({
      id: user._id.toString(),
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
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Đã xảy ra lỗi khi đăng nhập" }
  }
}

export async function logout() {
  cookies().delete("auth-token")
}

export async function getSession() {
  try {
    const token = cookies().get("auth-token")?.value
    if (!token) return null

    const payload = await verifyJWT(token)
    if (!payload) return null

    // Verify user still exists in database
    await connectToDatabase()
    const user = await User.findById(payload.id)
    if (!user) return null

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    }
  } catch (error) {
    console.error("Get session error:", error)
    return null
  }
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

// Helper function to create default admin user
export async function createDefaultAdmin() {
  try {
    await connectToDatabase()

    const existingAdmin = await User.findOne({ role: "admin" })
    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    const hashedPassword = await bcrypt.hash("admin123", 12)

    const adminUser = new User({
      name: "Administrator",
      email: "admin@laptopsun.com",
      password: hashedPassword,
      role: "admin",
      phone: "0123456789",
    })

    await adminUser.save()
    console.log("Default admin user created: admin@laptopsun.com / admin123")
  } catch (error) {
    console.error("Error creating default admin:", error)
  }
}
