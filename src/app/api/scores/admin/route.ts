import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Score } from "@/models/Score";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { z } from "zod";

const AdminScoreSchema = z.object({
  teamCode: z.string().min(1),
  round: z.number().int().positive(),
  total: z.number().min(0),
  finalComment: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = AdminScoreSchema.parse(body);

    const existing = await Score.findOne({
      teamCode: data.teamCode,
      round: data.round,
    });
    if (!existing) {
      const created = await Score.create({
        teamCode: data.teamCode,
        round: data.round,
        mentorScores: [],
        adminScore: { total: data.total, finalComment: data.finalComment },
      });
      return NextResponse.json({ score: created }, { status: 201 });
    }

    existing.adminScore = {
      ...(existing.adminScore || {}),
      total: data.total,
      finalComment: data.finalComment,
    } as any;
    await existing.save();
    return NextResponse.json({ score: existing });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: e.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
