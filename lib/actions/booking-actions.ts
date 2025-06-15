"use server";

import { sendEmail, isValidEmail, sanitizeHtml } from "@/lib/email/smtp";
import connectToDatabase from "@/lib/db/mongodb";
import Booking from "@/lib/db/models/Booking";

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  deviceType: string;
  serviceId: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
}

function validateBookingForm(formData: BookingFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate required fields
  if (!formData.fullName || formData.fullName.trim().length < 2) {
    errors.push("Họ tên phải có ít nhất 2 ký tự");
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.push("Email không hợp lệ");
  }

  if (!formData.phone || formData.phone.trim().length < 10) {
    errors.push("Số điện thoại phải có ít nhất 10 số");
  }

  if (!formData.deviceType) {
    errors.push("Vui lòng chọn loại thiết bị");
  }

  if (!formData.serviceId) {
    errors.push("Vui lòng chọn dịch vụ");
  }

  if (
    !formData.problemDescription ||
    formData.problemDescription.trim().length < 10
  ) {
    errors.push("Mô tả vấn đề phải có ít nhất 10 ký tự");
  }

  if (!formData.preferredDate) {
    errors.push("Vui lòng chọn ngày hẹn");
  }

  if (!formData.preferredTime) {
    errors.push("Vui lòng chọn giờ hẹn");
  }

  // Validate date is not in the past
  const selectedDate = new Date(formData.preferredDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    errors.push("Ngày hẹn không thể là ngày trong quá khứ");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDeviceTypeName(deviceType: string): string {
  const deviceTypes: Record<string, string> = {
    macbook: "MacBook",
    "macbook-pro": "MacBook Pro",
    "macbook-air": "MacBook Air",
    "windows-laptop": "Laptop Windows",
    "gaming-laptop": "Laptop Gaming",
    other: "Khác",
  };
  return deviceTypes[deviceType] || deviceType;
}

export async function submitBookingForm(formData: BookingFormData) {
  try {
    // Validate form data
    const validation = validateBookingForm(formData);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors.join(", "),
      };
    }

    // Check if required environment variables are configured
    if (!process.env.TO_EMAIL) {
      console.error("TO_EMAIL environment variable is not configured");
      return {
        success: false,
        message: "Cấu hình email chưa được thiết lập",
      };
    }

    // Sanitize user input
    const sanitizedData = {
      fullName: sanitizeHtml(formData.fullName.trim()),
      email: formData.email.trim().toLowerCase(),
      phone: sanitizeHtml(formData.phone.trim()),
      deviceType: formData.deviceType,
      serviceId: sanitizeHtml(formData.serviceId),
      problemDescription: sanitizeHtml(formData.problemDescription.trim()),
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
    };

    // Save booking to database
    await connectToDatabase();
    const booking = new Booking({
      name: sanitizedData.fullName,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      deviceType: sanitizedData.deviceType,
      serviceId: sanitizedData.serviceId,
      problemDescription: sanitizedData.problemDescription,
      preferredDate: new Date(sanitizedData.preferredDate),
      preferredTime: sanitizedData.preferredTime,
      status: "pending",
    });

    await booking.save();

    const formattedDate = formatDate(new Date(sanitizedData.preferredDate));
    const deviceTypeName = getDeviceTypeName(sanitizedData.deviceType);

    // Create customer confirmation email with brand colors
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #FACC15 0%, #F59E0B 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">✅ Xác nhận đặt lịch sửa chữa</h1>
            <p style="color: #000; margin: 8px 0 0 0; font-size: 16px;">LaptopSun - Nhanh chóng, Chuẩn xác, Đúng hẹn</p>
          </div>
        </div>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Xin chào <strong style="color: #FACC15;">${
          sanitizedData.fullName
        }</strong>,</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Cảm ơn bạn đã đặt lịch sửa chữa với <strong style="color: #FACC15;">LaptopSun</strong>. Chúng tôi đã nhận được yêu cầu của bạn và sẽ liên hệ sớm nhất để xác nhận.</p>
        
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #FACC15;">
          <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #FACC15; padding-bottom: 10px; font-size: 20px;">📋 Thông tin đặt lịch</h3>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #FACC15;">👤 Thông tin khách hàng:</strong><br>
            <div style="margin-left: 20px; margin-top: 8px;">
              • <strong>Họ và tên:</strong> ${sanitizedData.fullName}<br>
              • <strong>Email:</strong> ${sanitizedData.email}<br>
              • <strong>Số điện thoại:</strong> ${sanitizedData.phone}
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #FACC15;">💻 Thông tin thiết bị:</strong><br>
            <div style="margin-left: 20px; margin-top: 8px;">
              • <strong>Loại thiết bị:</strong> ${deviceTypeName}<br>
              • <strong>Dịch vụ:</strong> ${sanitizedData.serviceId}<br>
              • <strong>Mô tả vấn đề:</strong> ${
                sanitizedData.problemDescription
              }
            </div>
          </div>
          
          <div>
            <strong style="color: #FACC15;">📅 Thời gian hẹn:</strong><br>
            <div style="margin-left: 20px; margin-top: 8px;">
              • <strong>Ngày:</strong> ${formattedDate}<br>
              • <strong>Giờ:</strong> ${sanitizedData.preferredTime}
            </div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #2196f3;">
          <p style="margin: 0; font-size: 15px; line-height: 1.6;">
            <strong style="color: #1976d2;">📞 Bước tiếp theo:</strong><br>
            Chúng tôi sẽ liên hệ với bạn trong vòng <strong>2-4 giờ làm việc</strong> để xác nhận lịch hẹn và cung cấp thêm thông tin chi tiết về dịch vụ.
          </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px; border-top: 2px solid #FACC15; padding-top: 20px;">
          <div style="background-color: #FACC15; color: #000; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">
              🏪 LaptopSun - Chuyên gia sửa chữa laptop
            </p>
          </div>
          <p style="margin: 5px 0;">
            📧 Email: ${process.env.TO_EMAIL || "booking@laptopsun.vn"}<br>
            📱 Hotline: 0857 270 270<br>
            🏠 Địa chỉ: 995 CMT8, Phường 7, Quận Tân Bình, TP.HCM
          </p>
        </div>
      </div>
    `;

    // Create admin notification email with brand colors
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #FACC15 0%, #F59E0B 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px;">
          <h2 style="color: #000; margin: 0; text-align: center; font-size: 24px; font-weight: bold;">🔔 ĐƠN ĐẶT LỊCH MỚI</h2>
          <p style="color: #000; margin: 8px 0 0 0; text-align: center; font-size: 14px;">LaptopSun - Hệ thống quản lý</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 12px; border-left: 4px solid #FACC15;">
          <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #FACC15; padding-bottom: 10px; font-size: 18px;">👤 Thông tin khách hàng</h3>
          <div style="margin-left: 15px;">
            <p><strong>Họ và tên:</strong> <span style="color: #FACC15;">${
              sanitizedData.fullName
            }</span></p>
            <p><strong>Email:</strong> ${sanitizedData.email}</p>
            <p><strong>Số điện thoại:</strong> ${sanitizedData.phone}</p>
          </div>
          
          <h3 style="color: #333; border-bottom: 2px solid #FACC15; padding-bottom: 10px; font-size: 18px; margin-top: 25px;">💻 Thông tin thiết bị</h3>
          <div style="margin-left: 15px;">
            <p><strong>Loại thiết bị:</strong> <span style="color: #FACC15;">${deviceTypeName}</span></p>
            <p><strong>Dịch vụ:</strong> ${sanitizedData.serviceId}</p>
            <p><strong>Mô tả vấn đề:</strong> ${
              sanitizedData.problemDescription
            }</p>
          </div>
          
          <h3 style="color: #333; border-bottom: 2px solid #FACC15; padding-bottom: 10px; font-size: 18px; margin-top: 25px;">📅 Thời gian hẹn</h3>
          <div style="margin-left: 15px;">
            <p><strong>Ngày:</strong> <span style="color: #FACC15;">${formattedDate}</span></p>
            <p><strong>Giờ:</strong> <span style="color: #FACC15;">${
              sanitizedData.preferredTime
            }</span></p>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); padding: 20px; border-radius: 12px; margin-top: 25px; border-left: 4px solid #ffc107;">
          <p style="margin: 0; font-size: 15px; line-height: 1.6;">
            <strong style="color: #856404;">⚠️ Hành động cần thiết:</strong><br>
            Vui lòng liên hệ với khách hàng trong vòng <strong>2-4 giờ</strong> để xác nhận lịch hẹn.<br>
            <strong>ID Booking:</strong> <code style="background: #f8f9fa; padding: 2px 6px; border-radius: 4px;">${
              booking._id
            }</code>
          </p>
        </div>
        
        <div style="margin-top: 25px; padding: 20px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; border-left: 4px solid #2196f3;">
          <p style="margin: 0; font-size: 14px; line-height: 1.6;">
            <strong style="color: #1976d2;">📅 Thời gian nhận:</strong> ${new Date().toLocaleString(
              "vi-VN"
            )}<br>
            <strong style="color: #1976d2;">🌐 Nguồn:</strong> Website LaptopSun<br>
            <strong style="color: #1976d2;">📧 Email khách hàng:</strong> ${
              sanitizedData.email
            }
          </p>
        </div>
      </div>
    `;

    // Send emails
    const emailPromises = [];

    // Send confirmation email to customer
    emailPromises.push(
      sendEmail({
        to: sanitizedData.email,
        subject: "✅ Xác nhận đặt lịch sửa chữa - LaptopSun",
        html: customerHtml,
      })
    );

    // Send notification email to admin
    emailPromises.push(
      sendEmail({
        to: process.env.TO_EMAIL,
        subject: "🔔 Đơn đặt lịch mới từ Website - LaptopSun",
        html: adminHtml,
      })
    );

    const [customerResult, adminResult] = await Promise.all(emailPromises);

    // Check if at least one email was sent successfully
    if (customerResult.success || adminResult.success) {
      let message = "Đặt lịch thành công!";

      if (customerResult.success && adminResult.success) {
        message += " Email xác nhận đã được gửi.";
      } else if (customerResult.success) {
        message += " Email xác nhận đã được gửi cho bạn.";
      } else if (adminResult.success) {
        message += " Thông tin đã được gửi đến hệ thống.";
      }

      return {
        success: true,
        message,
        bookingId: booking._id.toString(),
        customerEmailId: customerResult.messageId,
        adminEmailId: adminResult.messageId,
      };
    } else {
      return {
        success: false,
        message:
          "Đặt lịch thành công nhưng có lỗi khi gửi email xác nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất.",
      };
    }
  } catch (error) {
    console.error("Error in submitBookingForm:", error);
    return {
      success: false,
      message: "Có lỗi hệ thống xảy ra. Vui lòng thử lại sau.",
    };
  }
}
