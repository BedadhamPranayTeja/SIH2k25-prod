import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { ProblemStatement } from "@/models/ProblemStatement";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const problemStatements = await ProblemStatement.find({ isActive: true })
      .sort({ sNo: 1 })
      .select("-__v");

    return NextResponse.json({ problemStatements }, { status: 200 });
  } catch (error) {
    console.error("Get problem statements error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
