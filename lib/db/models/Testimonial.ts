import mongoose, { Schema, type Document } from "mongoose";

export interface ITestimonial extends Document {
  customerName: string;
  customerTitle?: string;
  content: {
    vi: string;
    en: string;
  };
  rating: number;
  avatarUrl?: string;
  isPublished: boolean;
  publishedAt?: Date;
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
      type: String,
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
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    avatarUrl: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Ensure indexes
TestimonialSchema.index({ isPublished: 1, publishedAt: -1 });
TestimonialSchema.index({ rating: -1 });

export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
