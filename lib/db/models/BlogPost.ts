import mongoose, { Schema, type Document } from "mongoose";
import { LocalizedStringSchema, type LocalizedString } from "./LocalizedString";

export interface IBlogPost extends Document {
  title: LocalizedString;
  slug: string;
  content: LocalizedString;
  excerpt: LocalizedString;
  coverImageUrl?: string;
  tags: string[];
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: Date;
  author: mongoose.Types.ObjectId;
  viewCount: number;
  readTime: number;
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: LocalizedStringSchema,
      required: [true, "Title is required"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: LocalizedStringSchema,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: LocalizedStringSchema,
      required: [true, "Excerpt is required"],
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
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
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
    viewCount: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      default: 5,
    },
    seoTitle: {
      type: LocalizedStringSchema,
    },
    seoDescription: {
      type: LocalizedStringSchema,
    },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ isPublished: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1, isPublished: 1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ isFeatured: 1, publishedAt: -1 });

export default mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
