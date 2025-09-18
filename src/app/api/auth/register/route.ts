import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Team } from "@/models/Team";
import { hashPassword } from "@/lib/auth";
import { generateTeamCode } from "@/lib/utils";
import { RegisterSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);

    // Check if email already exists
    const existingUser = await User.findOne({
      email: validatedData.leadEmail.toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Check for duplicate member emails
    const allEmails = [
      validatedData.leadEmail.toLowerCase(),
      ...validatedData.members.map((m) => m.email.toLowerCase()),
    ];
    const uniqueEmails = new Set(allEmails);
    if (uniqueEmails.size !== allEmails.length) {
      return NextResponse.json(
        { message: "Duplicate email addresses found" },
        { status: 400 }
      );
    }

    // Generate unique team code
    let teamCode = generateTeamCode();
    while (await Team.findOne({ teamCode })) {
      teamCode = generateTeamCode();
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.leadPassword);

    // Create team leader user
    const teamLeader = new User({
      name: validatedData.leadName,
      email: validatedData.leadEmail.toLowerCase(),
      rollNo: validatedData.leadRollNo,
      role: "team_lead",
      teamCode,
      password: hashedPassword,
    });

    // Create team member users
    const teamMembers = await Promise.all(
      validatedData.members.map(async (member) => {
        // Generate a temporary password for members (they can reset it later)
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedTempPassword = await hashPassword(tempPassword);

        return new User({
          name: member.name,
          email: member.email.toLowerCase(),
          rollNo: member.rollNo,
          role: "team_member",
          teamCode,
          password: hashedTempPassword,
        });
      })
    );

    // Create team document
    const team = new Team({
      teamCode,
      teamName: validatedData.teamName,
      leader: {
        name: validatedData.leadName,
        email: validatedData.leadEmail.toLowerCase(),
        rollNo: validatedData.leadRollNo,
      },
      members: validatedData.members.map((member) => ({
        name: member.name,
        email: member.email.toLowerCase(),
        rollNo: member.rollNo,
      })),
    });

    // Save all documents
    await teamLeader.save();
    await Promise.all(teamMembers.map((member) => member.save()));
    await team.save();

    return NextResponse.json(
      {
        message: "Team registered successfully",
        teamCode,
        teamName: validatedData.teamName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        { message: "Team code or email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
