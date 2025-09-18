"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MentorScoresPage() {
  const [teamCode, setTeamCode] = useState("");
  const [round, setRound] = useState(1);
  const [criteria, setCriteria] = useState({
    innovation: 0,
    feasibility: 0,
    technical: 0,
    presentation: 0,
  });
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function submitScore() {
    setStatus(null);
    const res = await fetch("/api/scores/mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamCode, round, criteria, comments }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus(data.message || "Failed to submit score");
      return;
    }
    setStatus("Saved");
  }

  useEffect(() => {
    setStatus(null);
  }, [teamCode, round, criteria, comments]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Mentor Scoring</h2>
        <p className="text-sm text-gray-600">
          Enter scores for assigned teams.
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Team Code"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Round"
            value={round}
            onChange={(e) => setRound(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(criteria).map((k) => (
            <div key={k} className="space-y-1">
              <label className="text-sm text-gray-700 capitalize">{k}</label>
              <Input
                type="number"
                min={0}
                max={10}
                value={(criteria as any)[k]}
                onChange={(e) =>
                  setCriteria({ ...criteria, [k]: Number(e.target.value) })
                }
              />
            </div>
          ))}
        </div>

        <div>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            placeholder="Comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={submitScore} disabled={!teamCode || !comments}>
            Save
          </Button>
          {status && <span className="text-sm text-gray-600">{status}</span>}
        </div>
      </div>
    </div>
  );
}
