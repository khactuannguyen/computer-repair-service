import { locales, defaultLocale } from "@/lib/i18n/config"
import type { Locale } from "@/lib/i18n/config"

export function getBrowserLanguage(): Locale {
  if (typeof window === "undefined") return defaultLocale

  // Get browser language
  const browserLang = navigator.language.split("-")[0].toLowerCase()

  // Check if browser language is supported
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale
  }

  return defaultLocale
}

export function getInitialLocale(): Locale {
  // First try to load locale from localStorage
  if (typeof window !== "undefined") {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && locales.includes(savedLocale as Locale)) {
      return savedLocale as Locale
    }
  }

  // If no saved locale, detect browser language
  return getBrowserLanguage()
}
