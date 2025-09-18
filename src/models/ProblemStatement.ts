import mongoose, { Schema, Document } from "mongoose";

export interface IProblemStatement extends Document {
  sNo: number;
  organization: string;
  title: string;
  description: string;
  category: "Software" | "Hardware";
  psNumber: string;
  theme: string;
  ideas: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProblemStatementSchema = new Schema<IProblemStatement>(
  {
    sNo: {
      type: Number,
      required: true,
      unique: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Software", "Hardware"],
      required: true,
    },
    psNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    theme: {
      type: String,
      required: true,
      trim: true,
    },
    ideas: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ProblemStatementSchema.index({ title: 1 });
ProblemStatementSchema.index({ theme: 1 });
ProblemStatementSchema.index({ category: 1 });

export const ProblemStatement =
  mongoose.models.ProblemStatement ||
  mongoose.model<IProblemStatement>("ProblemStatement", ProblemStatementSchema);
