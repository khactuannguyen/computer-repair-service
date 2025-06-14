"use server"

import { login, logout, createDefaultAdmin } from "@/lib/auth/auth"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      success: false,
      error: "Email và mật khẩu là bắt buộc",
    }
  }

  try {
    // Ensure default admin exists
    // await createDefaultAdmin()

    const result = await login(email, password)

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      }
    }

    return {
      success: true,
      user: result.user,
    }
  } catch (error) {
    console.error("Login action error:", error)
    return {
      success: false,
      error: "Đã xảy ra lỗi khi đăng nhập",
    }
  }
}

export async function logoutAction() {
  await logout()
  redirect("/admin/login")
}
