import mongoose from "mongoose"

const ServiceSchema = new mongoose.Schema(
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
    shortDescription: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    features: [
      {
        type: String,
      },
    ],
    price: {
      from: {
        type: Number,
        required: true,
      },
      to: {
        type: Number,
        required: true,
      },
    },
    estimatedTime: {
      type: String,
      required: true,
    },
    categoryDocumentId: {
      type: String,
      required: true,
      index: true,
    },
    icon: {
      type: String,
      default: "laptop",
    },
    warranty: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
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
ServiceSchema.index({ documentId: 1, lang: 1 }, { unique: true })
ServiceSchema.index({ lang: 1, isActive: 1, isFeatured: 1 })
ServiceSchema.index({ lang: 1, categoryDocumentId: 1, isActive: 1 })

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema)
