import { Schema } from "mongoose"

// Remove the old LocalizedString schema since we're using separate documents
export interface ILocalizedString {
  vi: string
  en: string
  zh?: string
}

// Keep this for backward compatibility but we'll phase it out
export const LocalizedStringSchema = new Schema<ILocalizedString>(
  {
    vi: { type: String, required: true },
    en: { type: String, required: true },
    zh: { type: String },
  },
  { _id: false },
)

export type LocalizedString = ILocalizedString
