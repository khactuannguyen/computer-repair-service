import mongoose, { Schema, type Document } from "mongoose";
import { LocalizedStringSchema, type LocalizedString } from "./LocalizedString";

export interface IService extends Document {
  name: LocalizedString;
  description: LocalizedString;
  shortDescription?: LocalizedString;
  price: {
    from: number;
    to?: number;
  };
  estimatedTime: string;
  category: "macbook" | "laptop" | "data" | "other";
  icon: string;
  imageUrl?: string;
  features?: LocalizedString[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  warranty: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: LocalizedStringSchema,
      required: [true, "Service name is required"],
    },
    description: {
      type: LocalizedStringSchema,
      required: [true, "Service description is required"],
    },
    shortDescription: {
      type: LocalizedStringSchema,
    },
    price: {
      from: {
        type: Number,
        required: [true, "Starting price is required"],
        min: 0,
      },
      to: {
        type: Number,
        min: 0,
      },
    },
    estimatedTime: {
      type: String,
      required: [true, "Estimated time is required"],
    },
    category: {
      type: String,
      enum: ["macbook", "laptop", "data", "other"],
      required: [true, "Category is required"],
    },
    icon: {
      type: String,
      required: [true, "Icon is required"],
      default: "wrench",
    },
    imageUrl: {
      type: String,
    },
    features: [LocalizedStringSchema],
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
    warranty: {
      type: String,
      default: "3 tháng",
    },
  },
  { timestamps: true }
);

ServiceSchema.index({ category: 1, isActive: 1, order: 1 });
ServiceSchema.index({ isFeatured: 1, order: 1 });

export default mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);
