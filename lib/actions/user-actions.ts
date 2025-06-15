"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { getSession } from "@/lib/auth/auth";

export async function createUser(formData: FormData) {
  await connectToDatabase();

  try {
    const session = await getSession();
    if (session?.role !== "admin") {
      return { error: "Bạn không có quyền tạo người dùng mới" };
    }

    const email = formData.get("email") as string;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { error: "Email đã được sử dụng" };
    }

    const newUser = new User({
      name: formData.get("name"),
      email,
      password: formData.get("password"),
      role: formData.get("role"),
    });

    await newUser.save();

    revalidatePath("/admin/management/users");
    redirect("/admin/management/users");
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Đã xảy ra lỗi khi tạo người dùng mới" };
  }
}

export async function updateUser(userId: string, formData: FormData) {
  await connectToDatabase();

  try {
    const session = await getSession();
    if (session?.role !== "admin") {
      return { error: "Bạn không có quyền cập nhật người dùng" };
    }

    const updateData: any = {
      name: formData.get("name"),
      role: formData.get("role"),
    };

    // Only update password if provided
    const password = formData.get("password") as string;
    if (password) {
      updateData.password = password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return { error: "Không tìm thấy người dùng" };
    }

    revalidatePath("/admin/management/users");
    redirect("/admin/management/users");
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Đã xảy ra lỗi khi cập nhật người dùng" };
  }
}

export async function deleteUser(userId: string) {
  await connectToDatabase();

  try {
    const session = await getSession();
    if (session?.role !== "admin") {
      return { error: "Bạn không có quyền xóa người dùng" };
    }

    // Prevent deleting yourself
    if (session.id === userId) {
      return { error: "Bạn không thể xóa tài khoản của chính mình" };
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return { error: "Không tìm thấy người dùng" };
    }

    revalidatePath("/admin/management/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Đã xảy ra lỗi khi xóa người dùng" };
  }
}
