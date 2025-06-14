import { Schema } from "mongoose";

export interface ILocalizedString {
  vi: string;
  en: string;
}

export const LocalizedStringSchema = new Schema<ILocalizedString>(
  {
    vi: {
      type: String,
      required: [true, "Vietnamese text is required"],
      trim: true,
    },
    en: {
      type: String,
      required: [true, "English text is required"],
      trim: true,
    },
  },
  { _id: false }
);

export type LocalizedString = ILocalizedString;
