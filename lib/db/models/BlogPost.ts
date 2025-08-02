import mongoose from "mongoose"

const BlogPostSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ["security", "maintenance", "tips", "news", "tutorials"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    readTime: {
      type: Number,
      required: true,
    },
    publishedAt: {
      type: Date,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Compound indexes for efficient queries
BlogPostSchema.index({ documentId: 1, lang: 1 }, { unique: true })
BlogPostSchema.index({ lang: 1, isPublished: 1, publishedAt: -1 })
BlogPostSchema.index({ lang: 1, category: 1, isPublished: 1 })

export default mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema)
