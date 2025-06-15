"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/mongodb";
import RepairOrder from "@/lib/db/models/RepairOrder";
import User from "@/lib/db/models/User";
import { generateTrackingCode } from "@/lib/utils/tracking-code";
import { getSession } from "@/lib/auth/auth";
import mongoose from "mongoose";

export async function createRepairOrder(formData: FormData) {
  await connectToDatabase();

  try {
    // Lấy trackingCode và service từ formData
    const trackingCode = formData.get("trackingCode")?.toString();
    const service = formData.get("service")?.toString();
    if (!trackingCode || !service) {
      return { error: "Vui lòng nhập mã đơn hàng và chọn dịch vụ" };
    }
    // Kiểm tra trùng mã đơn hàng
    const existing = await RepairOrder.findOne({ trackingCode });
    if (existing) {
      return { error: "Mã đơn hàng đã tồn tại" };
    }
    const newOrder = new RepairOrder({
      trackingCode,
      service,
      customerName: formData.get("customerName"),
      customerPhone: formData.get("customerPhone"),
      customerEmail: formData.get("customerEmail") || undefined,
      deviceType: formData.get("deviceType"),
      deviceBrand: formData.get("deviceBrand") || undefined,
      deviceModel: formData.get("deviceModel") || undefined,
      serialNumber: formData.get("serialNumber") || undefined,
      issueDescription: formData.get("issueDescription"),
      estimatedCost: formData.get("estimatedCost")
        ? Number(formData.get("estimatedCost"))
        : undefined,
      estimatedCompletionDate:
        formData.get("estimatedCompletionDate") || undefined,
      assignedTo: formData.get("assignedTo") || undefined,
      internalNotes: formData.get("internalNotes")
        ? [formData.get("internalNotes")]
        : [],
    });

    await newOrder.save();

    revalidatePath("/admin/management/orders");
    redirect("/admin/management/orders");
  } catch (error) {
    console.error("Error creating repair order:", error);
    return { error: "Đã xảy ra lỗi khi tạo đơn sửa chữa" };
  }
}

export async function updateRepairOrder(orderId: string, formData: FormData) {
  await connectToDatabase();

  try {
    const updateData: any = {
      customerName: formData.get("customerName"),
      customerPhone: formData.get("customerPhone"),
      customerEmail: formData.get("customerEmail") || undefined,
      deviceType: formData.get("deviceType"),
      deviceBrand: formData.get("deviceBrand") || undefined,
      deviceModel: formData.get("deviceModel") || undefined,
      serialNumber: formData.get("serialNumber") || undefined,
      issueDescription: formData.get("issueDescription"),
      status: formData.get("status"),
      estimatedCost: formData.get("estimatedCost")
        ? Number(formData.get("estimatedCost"))
        : undefined,
      finalCost: formData.get("finalCost")
        ? Number(formData.get("finalCost"))
        : undefined,
      estimatedCompletionDate:
        formData.get("estimatedCompletionDate") || undefined,
    };

    const assignedToId = formData.get("assignedTo");
    if (assignedToId && assignedToId !== "none") {
      updateData.assignedTo = new mongoose.Types.ObjectId(
        assignedToId as string
      );
    } else {
      updateData.assignedTo = undefined;
    }

    if (updateData.status === "completed" && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    const updatedOrder = await RepairOrder.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return { error: "Không tìm thấy đơn sửa chữa" };
    }

    revalidatePath("/admin/management/orders");
    revalidatePath(`/admin/management/orders/${orderId}`);
    redirect("/admin/management/orders");
  } catch (error) {
    console.error("Error updating repair order:", error);
    return { error: "Đã xảy ra lỗi khi cập nhật đơn sửa chữa" };
  }
}

export async function deleteRepairOrder(orderId: string) {
  await connectToDatabase();

  try {
    const session = await getSession();
    if (session?.role !== "admin") {
      return { error: "Bạn không có quyền xóa đơn sửa chữa" };
    }

    const deletedOrder = await RepairOrder.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return { error: "Không tìm thấy đơn sửa chữa" };
    }

    revalidatePath("/admin/management/orders");
    return { success: true };
  } catch (error) {
    console.error("Error deleting repair order:", error);
    return { error: "Đã xảy ra lỗi khi xóa đơn sửa chữa" };
  }
}

export async function addInternalNote(orderId: string, formData: FormData) {
  await connectToDatabase();

  try {
    const note = formData.get("note") as string;
    if (!note) {
      return { error: "Ghi chú không được để trống" };
    }

    const session = await getSession();
    const noteWithUser = `${session?.name} (${new Date().toLocaleString(
      "vi-VN"
    )}): ${note}`;

    const updatedOrder = await RepairOrder.findByIdAndUpdate(
      orderId,
      { $push: { internalNotes: noteWithUser } },
      { new: true }
    );

    if (!updatedOrder) {
      return { error: "Không tìm thấy đơn sửa chữa" };
    }

    revalidatePath(`/admin/management/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding internal note:", error);
    return { error: "Đã xảy ra lỗi khi thêm ghi chú" };
  }
}

export async function getRepairOrderByTracking(
  trackingCode: string,
  phone: string
) {
  await connectToDatabase();

  try {
    const order = await RepairOrder.findOne({
      trackingCode,
      customerPhone: phone,
    }).lean();

    if (!order) {
      return {
        error:
          "Không tìm thấy đơn sửa chữa với mã theo dõi và số điện thoại này",
      };
    }

    if (order.assignedTo) {
      const technician = await User.findById(order.assignedTo)
        .select("name")
        .lean();
      if (technician) {
        order.technicianName = technician.name;
      }
    }

    return { order };
  } catch (error) {
    console.error("Error fetching repair order:", error);
    return { error: "Đã xảy ra lỗi khi tìm kiếm đơn sửa chữa" };
  }
}
