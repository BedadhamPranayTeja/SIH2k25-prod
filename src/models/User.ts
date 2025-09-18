import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  rollNo?: string;
  role: "team_lead" | "team_member" | "mentor" | "admin";
  teamCode?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    rollNo: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["team_lead", "team_member", "mentor", "admin"],
      required: true,
    },
    teamCode: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ teamCode: 1 });

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
