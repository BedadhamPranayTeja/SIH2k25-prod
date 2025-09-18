import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ProblemStatement } from "@/models/ProblemStatement";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { z } from "zod";

const ProblemUpdateSchema = z
  .object({
    organization: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    category: z.enum(["Software", "Hardware"]).optional(),
    psNumber: z.string().min(1).optional(),
    theme: z.string().min(1).optional(),
    ideas: z.number().int().nonnegative().optional(),
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
    if (!auth) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = ProblemUpdateSchema.parse(body);
    const updated = await ProblemStatement.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ problem: updated });
  } catch (error) {
    console.error("Admin problems PATCH error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.issues },
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
    if (!auth) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const deleted = await ProblemStatement.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin problems DELETE error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
