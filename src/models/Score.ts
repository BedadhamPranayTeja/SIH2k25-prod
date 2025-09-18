import mongoose, { Schema, Document } from "mongoose";

export interface IScore extends Document {
  teamCode: string;
  round: number;
  mentorScores: Array<{
    mentorId: string;
    criteria: {
      innovation: number;
      feasibility: number;
      technical: number;
      presentation: number;
    };
    comments: string;
    total: number;
  }>;
  adminScore?: {
    criteria: {
      innovation: number;
      feasibility: number;
      technical: number;
      presentation: number;
    };
    finalComment: string;
    total: number;
  };
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const CriteriaSchema = new Schema({
  innovation: { type: Number, required: true, min: 0, max: 10 },
  feasibility: { type: Number, required: true, min: 0, max: 10 },
  technical: { type: Number, required: true, min: 0, max: 10 },
  presentation: { type: Number, required: true, min: 0, max: 10 },
});

const ScoreSchema = new Schema<IScore>(
  {
    teamCode: {
      type: String,
      required: true,
      trim: true,
    },
    round: {
      type: Number,
      required: true,
    },
    mentorScores: [
      {
        mentorId: { type: String, required: true },
        criteria: { type: CriteriaSchema, required: true },
        comments: { type: String, required: true },
        total: { type: Number, required: true },
      },
    ],
    adminScore: {
      criteria: { type: CriteriaSchema },
      finalComment: { type: String },
      total: { type: Number },
    },
    averageScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ScoreSchema.index({ teamCode: 1, round: 1 });

// Calculate average score before saving
ScoreSchema.pre("save", function (next) {
  if (this.mentorScores.length > 0) {
    const total = this.mentorScores.reduce(
      (sum, score) => sum + score.total,
      0
    );
    this.averageScore = total / this.mentorScores.length;
  }
  next();
});

export const Score =
  mongoose.models.Score || mongoose.model<IScore>("Score", ScoreSchema);
