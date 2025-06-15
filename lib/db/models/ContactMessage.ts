import mongoose, { Schema, type Document } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  message?: string;
  status: "new" | "read" | "replied";
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: false, // Make email optional
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    message: {
      type: String,
      required: false, // Make message optional
    },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
  },
  { timestamps: true }
);

// Ensure indexes
ContactMessageSchema.index({ email: 1 });
ContactMessageSchema.index({ status: 1 });
ContactMessageSchema.index({ createdAt: -1 });

export default mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
