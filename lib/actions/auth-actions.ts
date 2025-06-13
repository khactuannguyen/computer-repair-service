"use server"

import { login, logout } from "@/lib/auth/auth"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      error: "Email và mật khẩu là bắt buộc",
    }
  }

  try {
    const user = await login(email, password)

    if (!user) {
      return {
        error: "Email hoặc mật khẩu không đúng",
      }
    }

    redirect("/admin/dashboard")
  } catch (error) {
    console.error("Login error:", error)
    return {
      error: "Đã xảy ra lỗi khi đăng nhập",
    }
  }
}

export async function logoutAction() {
  await logout()
  redirect("/admin/login")
}
