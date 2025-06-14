import mongoose, { Schema, type Document } from "mongoose"

export interface IService extends Document {
  name: string
  description: string
  price: number
  estimatedTime: string
  category: "macbook" | "laptop" | "data" | "other"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: 0,
    },
    estimatedTime: {
      type: String,
      required: [true, "Estimated time is required"],
    },
    category: {
      type: String,
      enum: ["macbook", "laptop", "data", "other"],
      default: "laptop",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

// Ensure indexes
ServiceSchema.index({ category: 1, isActive: 1 })

export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema)
