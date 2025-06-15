import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create reusable transporter object using SMTP transport
function createTransporter() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("Missing required SMTP environment variables");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // Additional options for better compatibility
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // For development/preview environments, log email instead of sending
    if (
      process.env.NODE_ENV === "development" ||
      process.env.VERCEL_ENV === "preview"
    ) {
      console.log("=== EMAIL SIMULATION ===");
      console.log("From:", process.env.FROM_EMAIL);
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("HTML Content:", html);
      console.log("=== END SIMULATION ===");

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        messageId: "dev-simulation-" + Date.now(),
        message: "Email simulated successfully (development mode)",
      };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"LaptopSun.vn" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Failed to send email",
    };
  }
}

// Utility function to validate email address
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to sanitize HTML content
export function sanitizeHtml(content: string): string {
  return content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
