import mongoose, { Schema, type Document } from "mongoose";
import { LocalizedStringSchema, type LocalizedString } from "./LocalizedString";

export interface ITestimonial extends Document {
  customerName: string;
  customerTitle: LocalizedString;
  content: LocalizedString;
  rating: number;
  avatarUrl?: string;
  serviceType: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerTitle: {
      type: LocalizedStringSchema,
      required: [true, "Customer title is required"],
    },
    content: {
      type: LocalizedStringSchema,
      required: [true, "Content is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    avatarUrl: {
      type: String,
      default: "/placeholder-user.jpg",
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      enum: ["macbook", "laptop", "data_recovery", "hardware_upgrade", "other"],
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
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

TestimonialSchema.index({ isPublished: 1, order: 1 });
TestimonialSchema.index({ isFeatured: 1, publishedAt: -1 });
TestimonialSchema.index({ serviceType: 1, isPublished: 1 });

export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
