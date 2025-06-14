"use server"

import { Resend } from "resend"

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
const resend = new Resend(process.env.RESEND_API_KEY)

function formatDate(date: Date): string {
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function getDeviceTypeName(deviceType: string): string {
  const deviceTypes: Record<string, string> = {
    macbook: "MacBook",
    "macbook-pro": "MacBook Pro",
    "macbook-air": "MacBook Air",
    "windows-laptop": "Laptop Windows",
    "gaming-laptop": "Laptop Gaming",
    other: "Khác",
  }
  return deviceTypes[deviceType] || deviceType
}

export async function submitBookingForm(formData: BookingFormData) {
  try {
    // Format the date for display
    const formattedDate = formatDate(new Date(formData.preferredDate))
    const deviceTypeName = getDeviceTypeName(formData.deviceType)

    // For development/preview environments, simulate email sending
    if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview" || !process.env.RESEND_API_KEY) {
      console.log("=== BOOKING EMAIL SIMULATION ===")
      console.log("Customer Email:", formData.email)
      console.log("Store Email:", process.env.CONTACT_EMAIL || "contact@laptopsun.com")
      console.log("Booking Data:", {
        fullName: formData.fullName,
        phone: formData.phone,
        deviceType: deviceTypeName,
        service: formData.serviceId,
        date: formattedDate,
        time: formData.preferredTime,
        problem: formData.problemDescription,
      })
      console.log("=== END SIMULATION ===")

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        success: true,
        message: "Đặt lịch thành công! Email xác nhận đã được gửi.",
        customerEmailId: "dev-simulation",
        storeEmailId: "dev-simulation",
      }
    }

    // Prepare HTML content for customer email
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background-color: #FACC15; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #000; margin: 0; font-size: 24px;">✅ Xác nhận đặt lịch sửa chữa</h1>
          </div>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Xin chào <strong>${formData.fullName}</strong>,</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Cảm ơn bạn đã đặt lịch sửa chữa với <strong>LaptopSun</strong>. Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ sớm nhất để xác nhận.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #FACC15; padding-bottom: 8px;">📋 Thông tin đặt lịch</h3>
          
          <div style="margin-bottom: 15px;">
            <strong>👤 Thông tin khách hàng:</strong><br>
            • Họ và tên: ${formData.fullName}<br>
            • Email: ${formData.email}<br>
            • Số điện thoại: ${formData.phone}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>💻 Thông tin thiết bị:</strong><br>
            • Loại thiết bị: ${deviceTypeName}<br>
            • Dịch vụ: ${formData.serviceId}<br>
            • Mô tả vấn đề: ${formData.problemDescription}
          </div>
          
          <div>
            <strong>📅 Thời gian hẹn:</strong><br>
            • Ngày: ${formattedDate}<br>
            • Giờ: ${formData.preferredTime}
          </div>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <p style="margin: 0; font-size: 14px;">
            <strong>📞 Bước tiếp theo:</strong><br>
            Chúng tôi sẽ liên hệ với bạn trong vòng 2-4 giờ làm việc để xác nhận lịch hẹn và cung cấp thêm thông tin chi tiết.
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
          <p style="margin: 0;">
            <strong>LaptopSun - Chuyên gia sửa chữa laptop</strong><br>
            📧 Email: contact@laptopsun.com<br>
            📱 Hotline: 1900-xxxx
          </p>
        </div>
      </div>
    `

    // Prepare HTML content for store notification
    const storeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <div style="background-color: #FACC15; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #000; margin: 0; text-align: center;">🔔 ĐƠN ĐẶT LỊCH MỚI</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #FACC15; padding-bottom: 8px;">👤 Thông tin khách hàng</h3>
          <p><strong>Họ và tên:</strong> ${formData.fullName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Số điện thoại:</strong> ${formData.phone}</p>
          
          <h3 style="color: #333; border-bottom: 2px solid #FACC15; padding-bottom: 8px;">💻 Thông tin thiết bị</h3>
          <p><strong>Loại thiết bị:</strong> ${deviceTypeName}</p>
          <p><strong>Dịch vụ:</strong> ${formData.serviceId}</p>
          <p><strong>Mô tả vấn đề:</strong> ${formData.problemDescription}</p>
          
          <h3 style="color: #333; border-bottom: 2px solid #FACC15; padding-bottom: 8px;">📅 Thời gian hẹn</h3>
          <p><strong>Ngày:</strong> ${formattedDate}</p>
          <p><strong>Giờ:</strong> ${formData.preferredTime}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; font-size: 14px;">
            <strong>⚠️ Hành động cần thiết:</strong><br>
            Vui lòng liên hệ với khách hàng trong vòng 2-4 giờ để xác nhận lịch hẹn.
          </p>
        </div>
      </div>
    `

    // Send emails using Resend
    const emailPromises = []

    // Send confirmation email to customer
    emailPromises.push(
      resend.emails.send({
        from: `LaptopSun <${process.env.SMTP_FROM_EMAIL || "noreply@laptopsun.com"}>`,
        to: formData.email,
        subject: `✅ Xác nhận đặt lịch sửa chữa - LaptopSun`,
        html: customerHtml,
      }),
    )

    // Send notification email to store
    emailPromises.push(
      resend.emails.send({
        from: `LaptopSun <${process.env.SMTP_FROM_EMAIL || "noreply@laptopsun.com"}>`,
        to: process.env.CONTACT_EMAIL || "contact@laptopsun.com",
        subject: `🔔 Đơn đặt lịch mới: ${formData.fullName} - ${deviceTypeName}`,
        html: storeHtml,
      }),
    )

    const [customerEmail, storeEmail] = await Promise.all(emailPromises)

    return {
      success: true,
      message: "Đặt lịch thành công! Email xác nhận đã được gửi.",
      customerEmailId: customerEmail.data?.id,
      storeEmailId: storeEmail.data?.id,
    }
  } catch (error) {
    console.error("Error sending booking emails:", error)

    return {
      success: false,
      message: "Đặt lịch thành công nhưng có lỗi khi gửi email xác nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất.",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
