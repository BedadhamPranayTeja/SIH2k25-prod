import mongoose, { Schema, Document } from "mongoose";

export interface IJudgingCriteria extends Document {
  key: string; // unique stable key
  name: string; // display name
  maxScore: number; // e.g., 10
  weight: number; // e.g., 1.0 (sum of weights not enforced here)
  round?: number; // optional, if criteria specific to a round
  isActive: boolean;
  order: number; // for UI ordering
  createdAt: Date;
  updatedAt: Date;
}

const JudgingCriteriaSchema = new Schema<IJudgingCriteria>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    maxScore: { type: Number, required: true, min: 1 },
    weight: { type: Number, required: true, min: 0 },
    round: { type: Number },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

JudgingCriteriaSchema.index({ round: 1, order: 1 });
JudgingCriteriaSchema.index({ isActive: 1 });

export const JudgingCriteria =
  mongoose.models.JudgingCriteria ||
  mongoose.model<IJudgingCriteria>("JudgingCriteria", JudgingCriteriaSchema);


