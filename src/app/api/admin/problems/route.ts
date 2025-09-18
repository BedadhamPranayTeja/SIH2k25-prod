import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ProblemStatement } from "@/models/ProblemStatement";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { z } from "zod";

const ProblemCreateSchema = z.object({
  sNo: z.number().int().positive(),
  organization: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(["Software", "Hardware"]),
  psNumber: z.string().min(1),
  theme: z.string().min(1),
  ideas: z.number().int().nonnegative().optional(),
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
    if (!auth) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const problems = await ProblemStatement.find().sort({ sNo: 1 });
    return NextResponse.json({ problems });
  } catch (error) {
    console.error("Admin problems GET error:", error);
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
    if (!auth) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = ProblemCreateSchema.parse(body);
    const created = await ProblemStatement.create({
      ...data,
      ideas: data.ideas ?? 0,
      isActive: data.isActive ?? true,
    });
    return NextResponse.json({ problem: created }, { status: 201 });
  } catch (error) {
    console.error("Admin problems POST error:", error);
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
