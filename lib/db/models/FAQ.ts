import mongoose from "mongoose"

const FAQSchema = new mongoose.Schema(
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
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["general", "warranty", "pricing", "technical", "support"],
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

// Compound indexes for efficient queries
FAQSchema.index({ documentId: 1, lang: 1 }, { unique: true })
FAQSchema.index({ lang: 1, category: 1, isActive: 1, order: 1 })

export default mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema)
