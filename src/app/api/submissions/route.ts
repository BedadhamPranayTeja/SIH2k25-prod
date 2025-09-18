import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Submission } from "@/models/Submission";
import { SubmissionSchema } from "@/lib/validation";
import { Round } from "@/models/Round";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const teamCode = request.headers.get("x-team-code");
    const userRole = request.headers.get("x-user-role");

    if (!teamCode || userRole !== "team_lead") {
      return NextResponse.json(
        { message: "Only team leaders can submit solutions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { round, fields } = body;

    // Validate submission data
    const validatedFields = SubmissionSchema.parse(fields);

    // Enforce active round window
    const roundDoc = await Round.findOne({ round, isActive: true });
    if (!roundDoc) {
      return NextResponse.json(
        { message: "Round not active" },
        { status: 400 }
      );
    }
    const now = new Date();
    if (now < roundDoc.startAt || now > roundDoc.endAt) {
      return NextResponse.json(
        { message: "Submission window closed" },
        { status: 400 }
      );
    }

    // Check if submission already exists for this round
    const existingSubmission = await Submission.findOne({ teamCode, round });
    if (existingSubmission) {
      return NextResponse.json(
        { message: "Submission already exists for this round" },
        { status: 400 }
      );
    }

    const submission = new Submission({
      teamCode,
      round,
      fields: validatedFields,
      status: "submitted",
    });

    await submission.save();

    return NextResponse.json(
      {
        message: "Submission created successfully",
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create submission error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
