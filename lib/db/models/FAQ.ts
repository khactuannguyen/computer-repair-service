import mongoose, { Schema, type Document } from "mongoose";

export interface IFAQ extends Document {
  question: {
    vi: string;
    en: string;
  };
  answer: {
    vi: string;
    en: string;
  };
  category: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: {
      vi: {
        type: String,
        required: [true, "Vietnamese question is required"],
        trim: true,
      },
      en: {
        type: String,
        required: [true, "English question is required"],
        trim: true,
      },
    },
    answer: {
      vi: {
        type: String,
        required: [true, "Vietnamese answer is required"],
      },
      en: {
        type: String,
        required: [true, "English answer is required"],
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
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
  { timestamps: true }
);

// Ensure indexes
FAQSchema.index({ category: 1, order: 1 });
FAQSchema.index({ isActive: 1 });

export default mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema);
