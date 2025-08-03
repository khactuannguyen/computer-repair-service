import { en } from "./translations/en"
import { vi } from "./translations/vi"
import type { Locale } from "./config"

export const translations = {
  en,
  vi,
}

export type TranslationKey = keyof typeof vi
export type NestedTranslationKey = string

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".")
  let value: any = translations[locale]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      // Fallback to Vietnamese if key not found
      value = translations.vi
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          console.warn(`Translation key "${key}" not found in fallback locale "vi"`)
          return key // Return key if not found in fallback
        }
      }
      break
    }
  }

  return typeof value === "string" ? value : key
}
