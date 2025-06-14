import mongoose, { Schema, type Document } from "mongoose"

export interface ICustomer extends Document {
  name: string
  email: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Customer email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Customer phone is required"],
      trim: true,
    },
  },
  { timestamps: true },
)

// Ensure indexes
CustomerSchema.index({ email: 1 })
CustomerSchema.index({ phone: 1 })

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema)
