"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminFinalScoresPage() {
  const [teamCode, setTeamCode] = useState("");
  const [round, setRound] = useState(1);
  const [total, setTotal] = useState(0);
  const [finalComment, setFinalComment] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function submitFinal() {
    setStatus(null);
    const res = await fetch("/api/scores/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamCode, round, total, finalComment }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus(data.message || "Failed to save");
      return;
    }
    setStatus("Saved");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Admin Final Scores</h2>
        <p className="text-sm text-gray-600">Finalize scores per team and round</p>
      </div>
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Team Code" value={teamCode} onChange={(e) => setTeamCode(e.target.value)} />
          <Input type="number" placeholder="Round" value={round} onChange={(e) => setRound(Number(e.target.value))} />
          <Input type="number" placeholder="Final Total" value={total} onChange={(e) => setTotal(Number(e.target.value))} />
        </div>
        <div>
          <textarea className="w-full border rounded-md px-3 py-2" placeholder="Final Comment" value={finalComment} onChange={(e) => setFinalComment(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={submitFinal} disabled={!teamCode}>Save</Button>
          {status && <span className="text-sm text-gray-600">{status}</span>}
        </div>
      </div>
    </div>
  );
}


