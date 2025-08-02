import mongoose from "mongoose"

const CategorySchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index for efficient queries
CategorySchema.index({ documentId: 1, lang: 1 }, { unique: true })
CategorySchema.index({ lang: 1, isActive: 1, order: 1 })

export default mongoose.models.Category || mongoose.model("Category", CategorySchema)
