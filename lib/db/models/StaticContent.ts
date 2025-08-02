import mongoose from "mongoose"

const StaticContentSchema = new mongoose.Schema(
  {
    documentId: {
      type: String,
      required: true,
      index: true,
    },
    lang: {
      type: String,
      required: true,
      enum: ["vi", "en"],
      index: true,
    },
    key: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["hero", "about", "feature", "cta", "footer"],
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
    },
    buttonUrl: {
      type: String,
    },
    imageUrl: {
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
  },
  {
    timestamps: true,
  },
)

// Compound indexes for efficient queries
StaticContentSchema.index({ documentId: 1, lang: 1 }, { unique: true })
StaticContentSchema.index({ lang: 1, key: 1, isActive: 1 })
StaticContentSchema.index({ lang: 1, type: 1, isActive: 1, order: 1 })

export default mongoose.models.StaticContent || mongoose.model("StaticContent", StaticContentSchema)
