"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Always render navigation, even if translation not ready
  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.book_appointment"), href: "/book-appointment" },
    { name: t("nav.track_order"), href: "/track-order" },
    { name: t("nav.blog"), href: "/blog" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        scrolled && "shadow-sm"
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">LaptopSun</span>
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 lg:h-10 lg:w-10">
                <Image
                  src="/laptopsun-logo.svg"
                  alt="LaptopSun Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-bold text-gray-900">
                  LaptopSun
                </span>
                <span className="hidden lg:block text-xs text-gray-600">
                  {t("brand.slogan")}
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={
              mobileMenuOpen ? t("nav.close_menu") : t("nav.open_menu")
            }
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold leading-6 transition-colors relative",
                pathname === item.href
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              {item.name}
              {pathname === item.href && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-4 lg:items-center">
          <LanguageSwitcher />
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-black font-semibold"
          >
            <Link href="/book-appointment">{t("nav.book_now")}</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={cn(
            "fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-transform duration-300",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">LaptopSun</span>
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                  <Image
                    src="/laptopsun-logo.svg"
                    alt="LaptopSun Logo"
                    fill
                    className="object-contain"
                  />
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
              <div className="space-y-2 py-6">
                {navigation.map((item, idx) => (
                  <Link
                    key={item.href + idx}
                    href={item.href}
                    className={cn(
                      "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-gray-900 hover:bg-gray-50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name || item.href}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-4">
                <LanguageSwitcher />
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
                >
                  <Link
                    href="/book-appointment"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.book_now")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
