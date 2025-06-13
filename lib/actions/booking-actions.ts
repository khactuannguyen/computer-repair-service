"use server"

import { Resend } from "resend"
import { formatDate } from "@/lib/utils"

interface BookingFormData {
  fullName: string
  email: string
  phone: string
  deviceType: string
  serviceId: string
  problemDescription: string
  preferredDate: string
  preferredTime: string
}

// Initialize Resend with your API key
// We'll use a placeholder API key for now - you'll need to replace this with your actual key
const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789")

export async function submitBookingForm(formData: BookingFormData) {
  try {
    // Format the date for display
    const formattedDate = formatDate(new Date(formData.preferredDate))

    // For development/preview, log the email content and return success
    if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview") {
      console.log("Development/Preview mode: Email would be sent with the following data:", {
        customer: formData.email,
        store: process.env.CONTACT_EMAIL,
        subject: `Xác nhận đặt lịch sửa chữa - LaptopSun`,
        data: formData,
      })

      return {
        success: true,
        message: "Đặt lịch thành công (Preview mode - email not actually sent)",
        customerEmailId: "preview-mode",
        storeEmailId: "preview-mode",
      }
    }

    // Prepare HTML content for customer email
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://your-website.com/laptopsun-logo.png" alt="LaptopSun Logo" style="max-width: 150px; height: auto;" />
        </div>
        <div style="background-color: #FACC15; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #000; margin: 0; text-align: center;">Xác nhận đặt lịch sửa chữa</h2>
        </div>
        <p>Xin chào <strong>${formData.fullName}</strong>,</p>
        <p>Cảm ơn bạn đã đặt lịch sửa chữa với LaptopSun. Dưới đây là thông tin chi tiết về lịch hẹn của bạn:</p>
        
        <h3 style="color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Thông tin khách hàng</h3>
        <p><strong>Họ và tên:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Số điện thoại:</strong> ${formData.phone}</p>
        
        <h3 style="color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Thông tin thiết bị</h3>
        <p><strong>Loại thiết bị:</strong> ${formData.deviceType}</p>
        <p><strong>Dịch vụ:</strong> ${formData.serviceId}</p>
        <p><strong>Mô tả vấn đề:</strong> ${formData.problemDescription}</p>
        
        <h3 style="color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Thời gian hẹn</h3>
        <p><strong>Ngày:</strong> ${formattedDate}</p>
        <p><strong>Giờ:</strong> ${formData.preferredTime}</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0;">Chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn trong thời gian sớm nhất.</p>
          <p style="margin: 10px 0 0;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại trên website.</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
          <p>Trân trọng,<br>Đội ngũ LaptopSun</p>
        </div>
      </div>
    `

    // Prepare HTML content for store notification
    const storeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="background-color: #FACC15; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #000; margin: 0; text-align: center;">THÔNG TIN ĐẶT LỊCH MỚI</h2>
        </div>
        
        <h3 style="color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Thông tin khách hàng</h3>
        <p><strong>Họ và tên:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Số điện thoại:</strong> ${formData.phone}</p>
        
        <h3 style="color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Thông tin thiết bị</h3>
        <p><strong>Loại thiết bị:</strong> ${formData.deviceType}</p>
        <p><strong>Dịch vụ:</strong> ${formData.serviceId}</p>
        <p><strong>Mô tả vấn đề:</strong> ${formData.problemDescription}</p>
        
        <h3 style="color: #333; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Thời gian hẹn</h3>
        <p><strong>Ngày:</strong> ${formattedDate}</p>
        <p><strong>Giờ:</strong> ${formData.preferredTime}</p>
      </div>
    `

    // Send emails using Resend
    const [customerEmail, storeEmail] = await Promise.all([
      resend.emails.send({
        from: `LaptopSun <${process.env.SMTP_FROM_EMAIL || "noreply@laptopsun.com"}>`,
        to: formData.email,
        subject: `Xác nhận đặt lịch sửa chữa - LaptopSun`,
        html: customerHtml,
      }),
      resend.emails.send({
        from: `LaptopSun <${process.env.SMTP_FROM_EMAIL || "noreply@laptopsun.com"}>`,
        to: process.env.CONTACT_EMAIL || "contact@laptopsun.com",
        subject: `Đơn đặt lịch mới: ${formData.fullName} - ${formData.deviceType}`,
        html: storeHtml,
      }),
    ])

    return {
      success: true,
      message: "Đặt lịch thành công",
      customerEmailId: customerEmail.id,
      storeEmailId: storeEmail.id,
    }
  } catch (error) {
    console.error("Error sending booking emails:", error)

    // For development/preview, return success even if there's an error
    if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview") {
      console.log("Development/Preview mode: Simulating successful email sending")
      return {
        success: true,
        message: "Đặt lịch thành công (Preview mode - email not actually sent)",
        customerEmailId: "preview-mode",
        storeEmailId: "preview-mode",
      }
    }

    return {
      success: false,
      message: "Có lỗi xảy ra khi gửi email xác nhận",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
