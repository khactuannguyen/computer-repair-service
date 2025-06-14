import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LaptopSun Admin - Quản lý hệ thống",
  description: "Hệ thống quản lý dịch vụ sửa chữa LaptopSun",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-gray-50">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
