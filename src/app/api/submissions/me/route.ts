import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const teamCode = request.headers.get("x-team-code");
    if (!teamCode) {
      return NextResponse.json(
        { message: "No team associated with user" },
        { status: 404 }
      );
    }

    const submissions = await Submission.find({ teamCode }).sort({
      round: 1,
      createdAt: -1,
    });

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
