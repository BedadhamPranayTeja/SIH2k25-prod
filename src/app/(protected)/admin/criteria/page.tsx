"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Item {
  _id: string;
  key: string;
  name: string;
  maxScore: number;
  weight: number;
  round?: number;
  isActive: boolean;
  order: number;
}

export default function AdminCriteriaPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    key: "",
    name: "",
    maxScore: "10",
    weight: "1",
    round: "",
    order: "0",
  });

  const canCreate = useMemo(() => form.key && form.name, [form]);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/criteria");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function createItem() {
    if (!canCreate) return;
    const payload = {
      key: form.key,
      name: form.name,
      maxScore: Number(form.maxScore),
      weight: Number(form.weight),
      round: form.round ? Number(form.round) : undefined,
      order: Number(form.order),
      isActive: true,
    };
    const res = await fetch("/api/admin/criteria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setForm({ key: "", name: "", maxScore: "10", weight: "1", round: "", order: "0" });
      fetchItems();
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/criteria/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchItems();
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/admin/criteria/${id}`, { method: "DELETE" });
    if (res.ok) fetchItems();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Judging Criteria</h2>
        <p className="text-sm text-gray-600">Manage scoring criteria and weights</p>
      </div>

      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <Input placeholder="Key" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input type="number" placeholder="Max" value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: e.target.value })} />
          <Input type="number" step="0.1" placeholder="Weight" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          <Input type="number" placeholder="Round (opt)" value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} />
          <Input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
        </div>
        <div>
          <Button onClick={createItem} disabled={!canCreate}>Add</Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Key</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Max</th>
              <th className="text-left px-4 py-2">Weight</th>
              <th className="text-left px-4 py-2">Round</th>
              <th className="text-left px-4 py-2">Active</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-3" colSpan={7}>Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-4 py-3" colSpan={7}>No criteria</td></tr>
            ) : (
              items.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-2">{c.key}</td>
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.maxScore}</td>
                  <td className="px-4 py-2">{c.weight}</td>
                  <td className="px-4 py-2">{c.round ?? "—"}</td>
                  <td className="px-4 py-2">
                    <Button variant="outline" onClick={() => toggleActive(c._id, c.isActive)}>
                      {c.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button variant="outline" onClick={() => deleteItem(c._id)}>Delete</Button>
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


