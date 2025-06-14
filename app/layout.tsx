import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TranslationProvider } from "@/components/providers/translation-provider";
import { Toaster } from "@/components/ui/toaster";
import { defaultLocale } from "@/lib/i18n/config";

const inter = Inter({ subsets: ["latin"] });

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
};

export const viewport: Viewport = {
  themeColor: "#FACC15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body className={inter.className}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationProvider>{children}</TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
