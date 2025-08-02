import mongoose from "mongoose"

const TestimonialSchema = new mongoose.Schema(
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
    customerName: {
      type: String,
      required: true,
    },
    customerTitle: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ["macbook", "laptop", "data-recovery", "general"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Compound indexes for efficient queries
TestimonialSchema.index({ documentId: 1, lang: 1 }, { unique: true })
TestimonialSchema.index({ lang: 1, isPublished: 1, isFeatured: 1, order: 1 })

export default mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema)
