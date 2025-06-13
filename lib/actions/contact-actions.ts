"use server"

interface ContactFormData {
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
}

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Example implementation with Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    /*const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.CONTACT_EMAIL,
      subject: `Contact Form: ${formData.subject}`,
      text: `
        Name: ${formData.fullName}
        Email: ${formData.email}
        Phone: ${formData.phone}
        
        Message:
        ${formData.message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <h3>Message:</h3>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
      `,
    };*/
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.CONTACT_EMAIL,
      subject: `Liên hệ: ${formData.subject}`,
      text: `
      Họ tên: ${formData.fullName}
      Email: ${formData.email}
      Số điện thoại: ${formData.phone}
      
      Nội dung:
      ${formData.message}
      `,
      html: `
      <h2>Thông tin liên hệ mới</h2>
      <p><strong>Họ tên:</strong> ${formData.fullName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Số điện thoại:</strong> ${formData.phone}</p>
      <p><strong>Chủ đề:</strong> ${formData.subject}</p>
      <h3>Nội dung:</h3>
      <p>${formData.message.replace(/\n/g, "<br>")}</p>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Email sent successfully",
      id: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Failed to send email",
    }
  }
}
