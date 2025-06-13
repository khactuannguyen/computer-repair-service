"use client"

import { useTranslation } from "@/hooks/use-translation"
import { useEffect } from "react"

export function HtmlLangProvider() {
  const { locale } = useTranslation()

  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale
    }
  }, [locale])

  return null
}
