"use server";

import { login } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // Allow custom session duration (in minutes), fallback to 60 minutes (1 hour)
  const sessionMinutes = Number(formData.get("sessionMinutes")) || 60;
  const sessionAge = sessionMinutes * 60;
  if (!email || !password) {
    return {
      success: false,
      error: "Email và mật khẩu là bắt buộc",
    };
  }
  try {
    const result = await login(email, password, sessionAge);
    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }
    return {
      success: true,
      user: result.user,
    };
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      error: "Đã xảy ra lỗi khi đăng nhập",
    };
  }
}

export async function logoutAction() {
  redirect("/admin/login");
}
