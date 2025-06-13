"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TranslationContext } from "@/hooks/use-translation"
import type { Locale } from "@/lib/i18n/config"
import { defaultLocale } from "@/lib/i18n/config"

interface TranslationProviderProps {
  children: React.ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Load locale from localStorage on mount
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && (savedLocale === "en" || savedLocale === "vi")) {
      setLocale(savedLocale)
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale: handleSetLocale }}>{children}</TranslationContext.Provider>
  )
}
