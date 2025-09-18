import mongoose, { Schema, Document } from "mongoose";

export interface IRound extends Document {
  round: number; // 1, 2, 3 ...
  name: string;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoundSchema = new Schema<IRound>(
  {
    round: { type: Number, required: true, min: 1, index: true, unique: true },
    name: { type: String, required: true, trim: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Round =
  mongoose.models.Round || mongoose.model<IRound>("Round", RoundSchema);
