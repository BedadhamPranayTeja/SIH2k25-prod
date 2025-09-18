import mongoose, { Schema, Document } from "mongoose";

interface TeamMember {
  name: string;
  email: string;
  rollNo: string;
}

export interface ITeam extends Document {
  teamCode: string;
  teamName: string;
  leader: TeamMember;
  members: TeamMember[];
  problemStatementId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<TeamMember>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rollNo: { type: String, required: true },
});

const TeamSchema = new Schema<ITeam>(
  {
    teamCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    leader: {
      type: TeamMemberSchema,
      required: true,
    },
    members: [TeamMemberSchema],
    problemStatementId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

TeamSchema.index({ teamCode: 1 });

export const Team =
  mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);
