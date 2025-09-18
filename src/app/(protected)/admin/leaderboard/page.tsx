"use client";

import { useEffect, useState } from "react";

interface Row {
  teamCode: string;
  round: number;
  averageScore: number;
  adminTotal?: number;
}

export default function AdminLeaderboardPage() {
  const [round, setRound] = useState<number | "all">("all");
  const [rows, setRows] = useState<Row[]>([]);

  async function fetchBoard() {
    const res = await fetch("/api/leaderboard");
    if (res.ok) {
      const data = await res.json();
      const items = (data.leaderboard || []) as any[];
      const mapped: Row[] = items.map((i) => ({
        teamCode: i.teamCode,
        round: i.round,
        averageScore: i.averageScore,
        adminTotal: i.adminScore?.total,
      }));
      setRows(mapped);
    }
  }

  useEffect(() => {
    fetchBoard();
  }, []);

  const filtered = rows.filter((r) =>
    round === "all" ? true : r.round === round
  );
  const sorted = [...filtered].sort(
    (a, b) =>
      (b.adminTotal ?? b.averageScore) - (a.adminTotal ?? a.averageScore)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Leaderboard</h2>
          <p className="text-sm text-gray-600">
            Sorted by Admin Total if present, else average mentor score
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Round</label>
          <select
            className="border rounded-md px-3 py-2"
            value={String(round)}
            onChange={(e) =>
              setRound(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
          >
            <option value="all">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Team</th>
              <th className="text-left px-4 py-2">Round</th>
              <th className="text-left px-4 py-2">Avg Mentor</th>
              <th className="text-left px-4 py-2">Admin Final</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td className="px-4 py-3" colSpan={4}>
                  No data
                </td>
              </tr>
            ) : (
              sorted.map((r) => (
                <tr key={`${r.teamCode}-${r.round}`} className="border-t">
                  <td className="px-4 py-2">{r.teamCode}</td>
                  <td className="px-4 py-2">{r.round}</td>
                  <td className="px-4 py-2">{r.averageScore.toFixed(2)}</td>
                  <td className="px-4 py-2">{r.adminTotal ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
