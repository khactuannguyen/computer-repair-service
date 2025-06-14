import mongoose, { Schema, type Document } from "mongoose"

export interface IBooking extends Document {
  name: string
  email: string
  phone: string
  deviceType: string
  serviceId: string
  problemDescription: string
  preferredDate: Date
  preferredTime: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    deviceType: {
      type: String,
      required: [true, "Device type is required"],
    },
    serviceId: {
      type: String,
      required: [true, "Service is required"],
    },
    problemDescription: {
      type: String,
      required: [true, "Problem description is required"],
    },
    preferredDate: {
      type: Date,
      required: [true, "Preferred date is required"],
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
)

// Ensure indexes
BookingSchema.index({ email: 1 })
BookingSchema.index({ preferredDate: 1 })
BookingSchema.index({ status: 1 })

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema)
