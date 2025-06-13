"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TranslationContext } from "@/hooks/use-translation"
import type { Locale } from "@/lib/i18n/config"
import { defaultLocale, locales } from "@/lib/i18n/config"

interface TranslationProviderProps {
  children: React.ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // First try to load locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && locales.includes(savedLocale as Locale)) {
      setLocale(savedLocale as Locale)
      return
    }

    // If no saved locale, detect browser language
    const detectBrowserLanguage = (): Locale => {
      if (typeof window === "undefined") return defaultLocale

      // Get browser language
      const browserLang = navigator.language.split("-")[0].toLowerCase()

      // Check if browser language is supported
      if (locales.includes(browserLang as Locale)) {
        return browserLang as Locale
      }

      return defaultLocale
    }

    const detectedLocale = detectBrowserLanguage()
    setLocale(detectedLocale)
    localStorage.setItem("locale", detectedLocale)
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale: handleSetLocale }}>{children}</TranslationContext.Provider>
  )
}
