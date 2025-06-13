import { en } from "./translations/en"
import { vi } from "./translations/vi"
import type { Locale } from "./config"

export const translations = {
  en,
  vi,
}

export type TranslationKey = keyof typeof en
export type NestedTranslationKey = string

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".")
  let value: any = translations[locale]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      // Fallback to English if key not found
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key // Return key if not found in fallback
        }
      }
      break
    }
  }

  return typeof value === "string" ? value : key
}
