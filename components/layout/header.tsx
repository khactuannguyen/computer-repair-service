"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useTranslation()
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.book_appointment"), href: "/book-appointment" },
    { name: t("nav.blog"), href: "/blog" },
    { name: t("nav.contact"), href: "/contact" },
  ]

  return (
    <>
      {/* Top contact bar - hidden on mobile */}
      <div className="hidden lg:block bg-gray-900 text-white py-2">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Hotline: 1900-xxxx</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@laptopsun.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Giờ làm việc: T2-T7: 8:00-19:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          scrolled && "shadow-sm",
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">LaptopSun</span>
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 lg:h-10 lg:w-10">
                  <Image src="/laptopsun-logo.svg" alt="LaptopSun Logo" fill className="object-contain" priority />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg lg:text-xl font-bold text-gray-900">LaptopSun</span>
                  <span className="hidden lg:block text-xs text-gray-600">Nhanh chóng - Chuẩn xác - Đúng hẹn</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <LanguageSwitcher />
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{mobileMenuOpen ? t("nav.close_menu") : t("nav.open_menu")}</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-semibold leading-6 transition-colors relative",
                  pathname === item.href ? "text-yellow-600" : "text-gray-900 hover:text-yellow-600",
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-4 lg:items-center">
            <LanguageSwitcher />
            <Link href="/track-order">
              <Button variant="outline" size="sm">
                Tra cứu đơn hàng
              </Button>
            </Link>
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link href="/book-appointment">{t("nav.book_now")}</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden",
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          aria-hidden={!mobileMenuOpen}
        >
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className={cn(
              "fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-transform",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">LaptopSun</span>
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <Image src="/laptopsun-logo.svg" alt="LaptopSun Logo" fill className="object-contain" />
                  </div>
                  <span className="text-xl font-bold">LaptopSun</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">{t("nav.close_menu")}</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                {/* Contact info for mobile */}
                <div className="py-6 space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>Hotline: 1900-xxxx</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>contact@laptopsun.com</span>
                  </div>
                </div>

                {/* Navigation links */}
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors",
                        pathname === item.href ? "bg-yellow-50 text-yellow-600" : "text-gray-900 hover:bg-gray-50",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/track-order"
                    className="block -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tra cứu đơn hàng
                  </Link>
                </div>

                {/* Action buttons */}
                <div className="py-6 space-y-4">
                  <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Link href="/book-appointment" onClick={() => setMobileMenuOpen(false)}>
                      {t("nav.book_now")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
