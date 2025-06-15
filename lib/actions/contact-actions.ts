"use server";

import { sendEmail, isValidEmail, sanitizeHtml } from "@/lib/email/smtp";
import connectToDatabase from "@/lib/db/mongodb";
import ContactMessage from "@/lib/db/models/ContactMessage";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function validateContactForm(formData: ContactFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate required fields
  if (!formData.fullName || formData.fullName.trim().length < 2) {
    errors.push("Họ tên phải có ít nhất 2 ký tự");
  }

  // Email: optional, but if filled must be valid
  if (formData.email && !isValidEmail(formData.email)) {
    errors.push("Email không hợp lệ");
  }

  if (!formData.subject || formData.subject.trim().length < 3) {
    errors.push("Chủ đề phải có ít nhất 3 ký tự");
  }

  // Message: optional, but if filled must be at least 10 chars
  if (
    formData.message &&
    formData.message.trim().length > 0 &&
    formData.message.trim().length < 10
  ) {
    errors.push("Nội dung phải có ít nhất 10 ký tự");
  }

  // Phone: required, must be at least 10 digits
  if (!formData.phone || formData.phone.trim().length < 10) {
    errors.push("Số điện thoại phải có ít nhất 10 số");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Validate form data
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors.join(", "),
      };
    }

    // Check if TO_EMAIL is configured
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
      email: formData.email ? formData.email.trim().toLowerCase() : "",
      phone: sanitizeHtml(formData.phone.trim()),
      subject: sanitizeHtml(formData.subject.trim()),
      message: formData.message ? sanitizeHtml(formData.message.trim()) : "",
    };

    // Save contact message to database
    await connectToDatabase();
    const contactMessage = new ContactMessage({
      name: sanitizedData.fullName,
      email: sanitizedData.email || undefined,
      phone: sanitizedData.phone || undefined,
      subject: sanitizedData.subject,
      message: sanitizedData.message,
      status: "new",
    });

    await contactMessage.save();

    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <div style="background-color: #FACC15; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #000; margin: 0; text-align: center;">📧 Liên hệ mới từ Website</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #FACC15; padding-bottom: 8px;">👤 Thông tin khách hàng</h3>
          <p><strong>Họ và tên:</strong> ${sanitizedData.fullName}</p>
          <p><strong>Email:</strong> ${
            sanitizedData.email || "Không cung cấp"
          }</p>
          <p><strong>Số điện thoại:</strong> ${
            sanitizedData.phone || "Không cung cấp"
          }</p>
          <p><strong>Chủ đề:</strong> ${sanitizedData.subject}</p>
          
          <h3 style="color: #333; border-bottom: 2px solid #FACC15; padding-bottom: 8px;">💬 Nội dung tin nhắn</h3>
          <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #FACC15;">
            <p style="margin: 0; white-space: pre-wrap;">${
              sanitizedData.message || "Không có nội dung."
            }</p>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
          <p style="margin: 0; font-size: 14px;">
            <strong>📅 Thời gian:</strong> ${new Date().toLocaleString(
              "vi-VN"
            )}<br>
            <strong>🌐 Nguồn:</strong> Website LaptopSun<br>
            <strong>ID Tin nhắn:</strong> ${contactMessage._id}
          </p>
        </div>
      </div>
    `;

    // Send email to admin
    const result = await sendEmail({
      to: process.env.TO_EMAIL,
      subject: "New Contact from Website",
      html: htmlContent,
    });

    if (result.success) {
      return {
        success: true,
        message:
          "Tin nhắn đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất.",
        messageId: result.messageId,
        contactId: contactMessage._id.toString(),
      };
    } else {
      return {
        success: false,
        message: "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.",
      };
    }
  } catch (error) {
    console.error("Error in sendContactEmail:", error);
    return {
      success: false,
      message: "Có lỗi hệ thống xảy ra. Vui lòng thử lại sau.",
    };
  }
}
