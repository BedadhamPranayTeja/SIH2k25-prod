import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Team } from "@/models/Team";

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

    const team = await Team.findOne({ teamCode });
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ team }, { status: 200 });
  } catch (error) {
    console.error("Get team error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
