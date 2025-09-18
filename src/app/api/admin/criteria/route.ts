import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { JudgingCriteria } from "@/models/JudgingCriteria";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { z } from "zod";

const CriteriaSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  maxScore: z.number().int().positive(),
  weight: z.number().nonnegative(),
  round: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().nonnegative().optional(),
});

function requireAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const auth = requireAdmin(request);
    if (!auth)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const items = await JudgingCriteria.find().sort({
      round: 1,
      order: 1,
      name: 1,
    });
    return NextResponse.json({ items });
  } catch {
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
    const data = CriteriaSchema.parse(body);
    const created = await JudgingCriteria.create({
      ...data,
      isActive: data.isActive ?? true,
      order: data.order ?? 0,
    });
    return NextResponse.json({ item: created }, { status: 201 });
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
