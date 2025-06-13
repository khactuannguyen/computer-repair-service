import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ContactBar from "@/components/layout/contact-bar"
import { ThemeProvider } from "@/components/theme-provider"
import { TranslationProvider } from "@/components/providers/translation-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LaptopSun - Dịch vụ sửa chữa Macbook & Laptop chuyên nghiệp",
  description:
    "Dịch vụ sửa chữa MacBook và máy tính xách tay chuyên nghiệp với thời gian xử lý nhanh chóng và giá cả cạnh tranh. Đặt lịch hẹn sửa chữa ngay hôm nay.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TranslationProvider>
            <div className="flex min-h-screen flex-col">
              <ContactBar />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
