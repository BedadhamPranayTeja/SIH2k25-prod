import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { JudgingCriteria } from "@/models/JudgingCriteria";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { z } from "zod";

const CriteriaUpdateSchema = z
  .object({
    name: z.string().min(1).optional(),
    maxScore: z.number().int().positive().optional(),
    weight: z.number().nonnegative().optional(),
    round: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
    order: z.number().int().nonnegative().optional(),
  })
  .strict();

function requireAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const auth = requireAdmin(request);
    if (!auth)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const body = await request.json();
    const data = CriteriaUpdateSchema.parse(body);
    const updated = await JudgingCriteria.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    );
    if (!updated)
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ item: updated });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const auth = requireAdmin(request);
    if (!auth)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const deleted = await JudgingCriteria.findByIdAndDelete(params.id);
    if (!deleted)
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
