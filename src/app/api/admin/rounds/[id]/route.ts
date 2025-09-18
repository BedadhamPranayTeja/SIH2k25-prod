import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Round } from "@/models/Round";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { z } from "zod";

const RoundUpdateSchema = z
  .object({
    name: z.string().min(1).optional(),
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

function requireAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return null;
  }
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
    const data = RoundUpdateSchema.parse(body);
    if (data.startAt && data.endAt && data.endAt <= data.startAt) {
      return NextResponse.json(
        { message: "endAt must be after startAt" },
        { status: 400 }
      );
    }
    const updated = await Round.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    );
    if (!updated)
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ round: updated });
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
    const deleted = await Round.findByIdAndDelete(params.id);
    if (!deleted)
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
