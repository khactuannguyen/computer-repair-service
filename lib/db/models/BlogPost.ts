import mongoose, { Schema, type Document } from "mongoose"

export interface IBlogPost extends Document {
  title: {
    vi: string
    en: string
  }
  slug: string
  content: {
    vi: string
    en: string
  }
  excerpt: {
    vi: string
    en: string
  }
  coverImageUrl?: string
  tags: string[]
  isPublished: boolean
  publishedAt?: Date
  author: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      vi: {
        type: String,
        required: [true, "Vietnamese title is required"],
        trim: true,
      },
      en: {
        type: String,
        required: [true, "English title is required"],
        trim: true,
      },
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      vi: {
        type: String,
        required: [true, "Vietnamese content is required"],
      },
      en: {
        type: String,
        required: [true, "English content is required"],
      },
    },
    excerpt: {
      vi: {
        type: String,
        required: [true, "Vietnamese excerpt is required"],
      },
      en: {
        type: String,
        required: [true, "English excerpt is required"],
      },
    },
    coverImageUrl: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
  },
  { timestamps: true },
)

// Ensure indexes
BlogPostSchema.index({ slug: 1 })
BlogPostSchema.index({ isPublished: 1, publishedAt: -1 })
BlogPostSchema.index({ tags: 1 })

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema)
