import mongoose, { Schema, type Document } from "mongoose";

export interface IRepairOrder extends Document {
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deviceType: string;
  deviceBrand?: string;
  deviceModel?: string;
  serialNumber?: string;
  issueDescription: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  estimatedCost?: number;
  finalCost?: number;
  assignedTo?: mongoose.Types.ObjectId;
  internalNotes?: string[];
  createdAt: Date;
  updatedAt: Date;
  estimatedCompletionDate?: Date;
  completedAt?: Date;
  service: mongoose.Types.ObjectId;
}

const RepairOrderSchema = new Schema<IRepairOrder>(
  {
    trackingCode: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, "Please provide customer name"],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Please provide customer phone"],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    deviceType: {
      type: String,
      required: [true, "Please provide device type"],
      trim: true,
    },
    deviceBrand: {
      type: String,
      trim: true,
    },
    deviceModel: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    issueDescription: {
      type: String,
      required: [true, "Please provide issue description"],
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    estimatedCost: {
      type: Number,
    },
    finalCost: {
      type: Number,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    internalNotes: [
      {
        type: String,
      },
    ],
    estimatedCompletionDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.RepairOrder ||
  mongoose.model<IRepairOrder>("RepairOrder", RepairOrderSchema);
