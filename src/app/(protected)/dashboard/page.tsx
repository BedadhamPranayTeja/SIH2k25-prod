"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getTimeRemaining, formatDate } from "@/lib/utils";
import {
  Clock,
  Users,
  FileText,
  Trophy,
  Upload,
  CheckCircle,
} from "lucide-react";

interface TeamInfo {
  teamCode: string;
  teamName: string;
  leader: {
    name: string;
    email: string;
    rollNo: string;
  };
  members: Array<{
    name: string;
    email: string;
    rollNo: string;
  }>;
  problemStatementId?: string;
}

interface Submission {
  id: string;
  round: number;
  fields: {
    title: string;
    description: string;
    repoUrl?: string;
    liveUrl?: string;
    presentationUrl?: string;
  };
  status: "draft" | "submitted" | "reviewed";
  createdAt: string;
  updatedAt: string;
}

interface LeaderboardEntry {
  rank: number;
  teamCode: string;
  teamName: string;
  averageScore: number;
  submissions: number;
}

const HACKATHON_START =
  process.env.NEXT_PUBLIC_HACKATHON_START || "2025-09-19T09:00:00.000Z";
const HACKATHON_END =
  process.env.NEXT_PUBLIC_HACKATHON_END || "2025-09-20T17:00:00.000Z";

export default function DashboardPage() {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemaining(HACKATHON_END)
  );
  const [currentRound, setCurrentRound] = useState(1);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    title: "",
    description: "",
    repoUrl: "",
    liveUrl: "",
    presentationUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTeamInfo();
    fetchSubmissions();
    fetchLeaderboard();

    // Update timer every second
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(HACKATHON_END));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchTeamInfo = async () => {
    try {
      const response = await fetch("/api/teams/me");
      if (response.ok) {
        const data = await response.json();
        setTeamInfo(data.team);
      }
    } catch (error) {
      console.error("Error fetching team info:", error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/submissions/me");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          round: currentRound,
          fields: submissionData,
        }),
      });

      if (response.ok) {
        alert("Submission successful!");
        setIsSubmissionModalOpen(false);
        setSubmissionData({
          title: "",
          description: "",
          repoUrl: "",
          liveUrl: "",
          presentationUrl: "",
        });
        fetchSubmissions();
      } else {
        const error = await response.json();
        alert(error.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentSubmission = () => {
    return submissions.find((sub) => sub.round === currentRound);
  };

  const getTeamRank = () => {
    if (!teamInfo) return null;
    const teamEntry = leaderboard.find(
      (entry) => entry.teamCode === teamInfo.teamCode
    );
    return teamEntry?.rank || null;
  };

  const currentSubmission = getCurrentSubmission();
  const teamRank = getTeamRank();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Time Remaining
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {timeRemaining.isExpired
                  ? "00:00:00"
                  : `${timeRemaining.hours}:${String(
                      timeRemaining.minutes
                    ).padStart(2, "0")}:${String(
                      timeRemaining.seconds
                    ).padStart(2, "0")}`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamInfo ? teamInfo.members.length + 1 : 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Submissions</p>
              <p className="text-2xl font-bold text-gray-900">
                {submissions.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Current Rank</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamRank ? `#${teamRank}` : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Round & Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Round {currentRound} Progress</CardTitle>
              <CardDescription>
                Track your progress through the current round
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">
                    {currentSubmission ? "100%" : "0%"}
                  </span>
                </div>
                <Progress
                  value={currentSubmission ? 100 : 0}
                  className="w-full"
                />

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        teamInfo?.problemStatementId
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium">Problem Selected</p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        currentSubmission
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium">Submitted</p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        currentSubmission?.status === "reviewed"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Trophy className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium">Reviewed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submission Form/Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Round {currentRound} Submission</CardTitle>
                  <CardDescription>
                    Submit your solution for evaluation
                  </CardDescription>
                </div>
                {currentSubmission && (
                  <Badge
                    variant={
                      currentSubmission.status === "submitted"
                        ? "default"
                        : currentSubmission.status === "reviewed"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {currentSubmission.status}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentSubmission ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {currentSubmission.fields.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentSubmission.fields.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentSubmission.fields.repoUrl && (
                      <a
                        href={currentSubmission.fields.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        🔗 Repository
                      </a>
                    )}
                    {currentSubmission.fields.liveUrl && (
                      <a
                        href={currentSubmission.fields.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        🌐 Live Demo
                      </a>
                    )}
                    {currentSubmission.fields.presentationUrl && (
                      <a
                        href={currentSubmission.fields.presentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        📊 Presentation
                      </a>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Submitted:{" "}
                    {formatDate(new Date(currentSubmission.createdAt))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Submission Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Upload your solution for Round {currentRound}
                  </p>
                  <Button onClick={() => setIsSubmissionModalOpen(true)}>
                    Create Submission
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Team Information */}
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent>
              {teamInfo ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {teamInfo.teamName}
                    </h4>
                    <p className="text-sm text-gray-600">{teamInfo.teamCode}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                      Team Leader
                    </h5>
                    <div className="text-sm text-gray-600">
                      <p>{teamInfo.leader.name}</p>
                      <p>{teamInfo.leader.email}</p>
                      <p>{teamInfo.leader.rollNo}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                      Members ({teamInfo.members.length})
                    </h5>
                    <div className="space-y-2">
                      {teamInfo.members.map((member, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <p>{member.name}</p>
                          <p className="text-xs">
                            {member.email} • {member.rollNo}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="spinner mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading team info...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mini Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Current Leaderboard</CardTitle>
              <CardDescription>Top 5 teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry.teamCode}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      entry.teamCode === teamInfo?.teamCode
                        ? "bg-indigo-50 border border-indigo-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : index === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {entry.rank}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {entry.teamName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {entry.teamCode}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {entry.averageScore.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.submissions} subs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submission Modal */}
      {isSubmissionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Submit Solution - Round {currentRound}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSubmissionModalOpen(false)}
                >
                  ×
                </Button>
              </div>

              <form onSubmit={handleSubmission} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title *
                  </label>
                  <Input
                    value={submissionData.title}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter your project title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description *
                  </label>
                  <textarea
                    value={submissionData.description}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your solution and approach"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repository URL
                  </label>
                  <Input
                    type="url"
                    value={submissionData.repoUrl}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        repoUrl: e.target.value,
                      }))
                    }
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Live Demo URL
                  </label>
                  <Input
                    type="url"
                    value={submissionData.liveUrl}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        liveUrl: e.target.value,
                      }))
                    }
                    placeholder="https://your-demo.vercel.app"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Presentation URL
                  </label>
                  <Input
                    type="url"
                    value={submissionData.presentationUrl}
                    onChange={(e) =>
                      setSubmissionData((prev) => ({
                        ...prev,
                        presentationUrl: e.target.value,
                      }))
                    }
                    placeholder="https://docs.google.com/presentation/..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSubmissionModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div
                          className="spinner mr-2"
                          style={{ width: "16px", height: "16px" }}
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit Solution"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
