import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LaptopSun - Dịch vụ sửa chữa Macbook & Laptop chuyên nghiệp",
  description:
    "Dịch vụ sửa chữa MacBook và máy tính xách tay chuyên nghiệp với thời gian xử lý nhanh chóng và giá cả cạnh tranh. Đặt lịch hẹn sửa chữa ngay hôm nay.",
  generator: "v0.dev",
  icons: {
    icon: "/laptopsun-logo.png",
    apple: "/laptopsun-logo.png",
  },
  manifest: "/manifest.json",
  themeColor: "#ffc907",
}

// This is the root layout - it should be minimal since we use route groups
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
