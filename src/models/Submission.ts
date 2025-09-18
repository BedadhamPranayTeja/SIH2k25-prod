import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  teamCode: string;
  round: number;
  fields: {
    title: string;
    description: string;
    repoUrl?: string;
    liveUrl?: string;
    presentationUrl?: string;
    fileId?: string; // GridFS file ID
  };
  status: "draft" | "submitted" | "reviewed";
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    teamCode: {
      type: String,
      required: true,
      trim: true,
    },
    round: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },
    fields: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      repoUrl: { type: String },
      liveUrl: { type: String },
      presentationUrl: { type: String },
      fileId: { type: String }, // GridFS file ID
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "reviewed"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

SubmissionSchema.index({ teamCode: 1, round: 1 });

export const Submission =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);
