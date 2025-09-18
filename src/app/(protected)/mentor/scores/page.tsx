"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MentorScoresPage() {
  const [teamCode, setTeamCode] = useState("");
  const [round, setRound] = useState(1);
  const [criteriaDefs, setCriteriaDefs] = useState<
    Array<{ key: string; name: string; maxScore: number; weight: number }>
  >([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function submitScore() {
    setStatus(null);
    const res = await fetch("/api/scores/mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamCode, round, criteria: scores, comments }),
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
  }, [teamCode, round, scores, comments]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/criteria");
      if (res.ok) {
        const data = await res.json();
        const defs = (data.items || []).filter((c: any) => c.isActive);
        setCriteriaDefs(defs);
        const init: Record<string, number> = {};
        defs.forEach((c: any) => (init[c.key] = 0));
        setScores(init);
      }
    })();
  }, []);

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
          {criteriaDefs.map((c) => (
            <div key={c.key} className="space-y-1">
              <label className="text-sm text-gray-700">
                {c.name} (0–{c.maxScore})
              </label>
              <Input
                type="number"
                min={0}
                max={c.maxScore}
                value={Number(scores[c.key] ?? 0)}
                onChange={(e) =>
                  setScores({ ...scores, [c.key]: Number(e.target.value) })
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
