import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Score } from "@/models/Score";
import { Team } from "@/models/Team";
import { Submission } from "@/models/Submission";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all teams with their scores and submission counts
    const teams = await Team.find({}).lean();

    const leaderboardData = await Promise.all(
      teams.map(async (team) => {
        const scores = await Score.find({ teamCode: team.teamCode }).lean();
        const submissions = await Submission.countDocuments({
          teamCode: team.teamCode,
        });

        const averageScore =
          scores.length > 0
            ? scores.reduce((sum, score) => sum + score.averageScore, 0) /
              scores.length
            : 0;

        return {
          teamCode: team.teamCode,
          teamName: team.teamName,
          averageScore,
          submissions,
        };
      })
    );

    // Sort by average score (descending) and add ranks
    const sortedLeaderboard = leaderboardData
      .sort((a, b) => b.averageScore - a.averageScore)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return NextResponse.json(
      { leaderboard: sortedLeaderboard },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
