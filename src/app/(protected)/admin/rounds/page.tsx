"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Round {
  _id: string;
  round: number;
  name: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
}

export default function AdminRoundsPage() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    round: "",
    name: "",
    startAt: "",
    endAt: "",
  });

  const canCreate = useMemo(() => {
    return form.round && form.name && form.startAt && form.endAt;
  }, [form]);

  async function fetchRounds() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rounds");
      if (res.ok) {
        const data = await res.json();
        setRounds(data.rounds || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRounds();
  }, []);

  async function createRound() {
    if (!canCreate) return;
    const payload = {
      round: Number(form.round),
      name: form.name,
      startAt: form.startAt,
      endAt: form.endAt,
      isActive: true,
    };
    const res = await fetch("/api/admin/rounds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setForm({ round: "", name: "", startAt: "", endAt: "" });
      fetchRounds();
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/rounds/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchRounds();
  }

  async function deleteRound(id: string) {
    const res = await fetch(`/api/admin/rounds/${id}`, { method: "DELETE" });
    if (res.ok) fetchRounds();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Rounds</h2>
        <p className="text-sm text-gray-600">Configure submission windows</p>
      </div>

      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Round #" value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} />
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input type="datetime-local" placeholder="Start" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
          <Input type="datetime-local" placeholder="End" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
        </div>
        <div>
          <Button onClick={createRound} disabled={!canCreate}>Create</Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Start</th>
              <th className="text-left px-4 py-2">End</th>
              <th className="text-left px-4 py-2">Active</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-3" colSpan={6}>Loading…</td></tr>
            ) : rounds.length === 0 ? (
              <tr><td className="px-4 py-3" colSpan={6}>No rounds</td></tr>
            ) : (
              rounds.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-2">{r.round}</td>
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{new Date(r.startAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(r.endAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <Button variant="outline" onClick={() => toggleActive(r._id, r.isActive)}>
                      {r.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button variant="outline" onClick={() => deleteRound(r._id)}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


