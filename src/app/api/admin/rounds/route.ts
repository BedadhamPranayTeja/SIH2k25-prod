import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Round } from "@/models/Round";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { z } from "zod";

const RoundSchema = z.object({
  round: z.number().int().positive(),
  name: z.string().min(1),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  isActive: z.boolean().optional(),
});

function requireAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return null;
  }
  return payload;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const auth = requireAdmin(request);
    if (!auth)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const rounds = await Round.find().sort({ round: 1 });
    return NextResponse.json({ rounds });
  } catch (e) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const auth = requireAdmin(request);
    if (!auth)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const body = await request.json();
    const data = RoundSchema.parse(body);
    if (data.endAt <= data.startAt) {
      return NextResponse.json(
        { message: "endAt must be after startAt" },
        { status: 400 }
      );
    }
    const created = await Round.create({
      ...data,
      isActive: data.isActive ?? true,
    });
    return NextResponse.json({ round: created }, { status: 201 });
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
