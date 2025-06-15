import mongoose, { Schema, Document } from "mongoose";
import { LocalizedStringSchema, ILocalizedString } from "./LocalizedString";

export interface ICategory extends Document {
  name: ILocalizedString;
  description?: ILocalizedString;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedStringSchema },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ order: 1 });

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
