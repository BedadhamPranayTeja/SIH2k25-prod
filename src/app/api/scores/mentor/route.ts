import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Score } from "@/models/Score";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { z } from "zod";

const MentorScoreSchema = z.object({
  teamCode: z.string().min(1),
  round: z.number().int().positive(),
  criteria: z.object({
    innovation: z.number().min(0).max(10),
    feasibility: z.number().min(0).max(10),
    technical: z.number().min(0).max(10),
    presentation: z.number().min(0).max(10),
  }),
  comments: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    const payload = token ? verifyToken(token) : null;
    if (!payload || !["mentor", "admin"].includes(payload.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = MentorScoreSchema.parse(body);
    const total =
      data.criteria.innovation +
      data.criteria.feasibility +
      data.criteria.technical +
      data.criteria.presentation;

    const existing = await Score.findOne({
      teamCode: data.teamCode,
      round: data.round,
    });

    if (!existing) {
      const created = await Score.create({
        teamCode: data.teamCode,
        round: data.round,
        mentorScores: [
          {
            mentorId: payload.userId,
            criteria: data.criteria,
            comments: data.comments,
            total,
          },
        ],
      });
      return NextResponse.json({ score: created }, { status: 201 });
    }

    // Upsert mentor entry by mentorId
    const updated = await Score.findOneAndUpdate(
      { _id: existing._id, "mentorScores.mentorId": payload.userId },
      {
        $set: {
          "mentorScores.$.criteria": data.criteria,
          "mentorScores.$.comments": data.comments,
          "mentorScores.$.total": total,
        },
      },
      { new: true }
    );

    if (updated) {
      return NextResponse.json({ score: updated });
    }

    existing.mentorScores.push({
      mentorId: payload.userId,
      criteria: data.criteria,
      comments: data.comments,
      total,
    });
    await existing.save();
    return NextResponse.json({ score: existing });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: e.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


