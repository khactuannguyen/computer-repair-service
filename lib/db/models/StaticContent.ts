import mongoose, { Schema, type Document } from "mongoose";
import { LocalizedStringSchema, type LocalizedString } from "./LocalizedString";

export interface IStaticContent extends Document {
  key: string;
  type: "banner" | "about" | "footer" | "policy" | "hero" | "feature";
  title?: LocalizedString;
  content: LocalizedString;
  imageUrl?: string;
  buttonText?: LocalizedString;
  buttonUrl?: string;
  isActive: boolean;
  order: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const StaticContentSchema = new Schema<IStaticContent>(
  {
    key: {
      type: String,
      required: [true, "Key is required"],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["banner", "about", "footer", "policy", "hero", "feature"],
    },
    title: {
      type: LocalizedStringSchema,
    },
    content: {
      type: LocalizedStringSchema,
      required: [true, "Content is required"],
    },
    imageUrl: {
      type: String,
    },
    buttonText: {
      type: LocalizedStringSchema,
    },
    buttonUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

StaticContentSchema.index({ key: 1 });
StaticContentSchema.index({ type: 1, isActive: 1, order: 1 });

export default mongoose.models.StaticContent ||
  mongoose.model<IStaticContent>("StaticContent", StaticContentSchema);
