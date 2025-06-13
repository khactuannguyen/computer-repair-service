"use client"

import { createContext, useContext } from "react"
import type { Locale } from "@/lib/i18n/config"
import { getTranslation } from "@/lib/i18n"
import { defaultLocale } from "@/lib/i18n/config"

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const TranslationContext = createContext<TranslationContextType>({
  locale: defaultLocale,
  setLocale: () => {},
})

export function useTranslation() {
  const context = useContext(TranslationContext)

  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }

  const { locale } = context

  const t = (key: string): string => {
    return getTranslation(locale, key)
  }

  return { t, locale, setLocale: context.setLocale }
}
