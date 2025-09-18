"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Problem {
	required?: never;
	_id: string;
	sNo: number;
	organization: string;
	title: string;
	description: string;
	category: "Software" | "Hardware";
	psNumber: string;
	theme: string;
	ideas: number;
	isActive: boolean;
}

export default function AdminProblemsPage() {
	const [problems, setProblems] = useState<Problem[]>([]);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		sNo: "",
		organization: "",
		title: "",
		description: "",
		category: "Software" as "Software" | "Hardware",
		psNumber: "",
		theme: "",
	});
	const canCreate = useMemo(() => {
		return (
			form.sNo !== "" &&
			form.organization &&
			form.title &&
			form.description &&
			form.psNumber &&
			form.theme
		);
	}, [form]);

	async function fetchProblems() {
		setLoading(true);
		try {
			const res = await fetch("/api/admin/problems");
			if (res.ok) {
				const data = await res.json();
				setProblems(data.problems || []);
			}
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchProblems();
	}, []);

	async function createProblem() {
		if (!canCreate) return;
		const payload = {
			sNo: Number(form.sNo),
			organization: form.organization,
			title: form.title,
			description: form.description,
			category: form.category,
			psNumber: form.psNumber,
			theme: form.theme,
		};
		const res = await fetch("/api/admin/problems", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (res.ok) {
			setForm({ sNo: "", organization: "", title: "", description: "", category: "Software", psNumber: "", theme: "" });
			fetchProblems();
		}
	}

	async function deleteProblem(id: string) {
		const res = await fetch(`/api/admin/problems/${id}`, { method: "DELETE" });
		if (res.ok) fetchProblems();
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl font-semibold">Problems</h2>
				<p className="text-sm text-gray-600">Manage problem statements</p>
			</div>

			<div className="bg-white border rounded-lg p-4 space-y-3">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<Input placeholder="S.No" value={form.sNo} onChange={(e) => setForm({ ...form, sNo: e.target.value })} />
					<Input placeholder="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
					<Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
					<Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
					<select
						className="border rounded-md px-3 py-2"
						value={form.category}
						onChange={(e) => setForm({ ...form, category: e.target.value as any })}
					>
						<option value="Software">Software</option>
						<option value="Hardware">Hardware</option>
					</select>
					<Input placeholder="PS Number" value={form.psNumber} onChange={(e) => setForm({ ...form, psNumber: e.target.value })} />
					<Input placeholder="Theme" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} />
				</div>
				<div>
					<Button onClick={createProblem} disabled={!canCreate}>Create</Button>
				</div>
			</div>

			<div className="bg-white border rounded-lg overflow-x-auto">
				<table className="min-w-full">
					<thead className="bg-gray-100">
						<tr>
							<th className="text-left px-4 py-2">S.No</th>
							<th className="text-left px-4 py-2">Organization</th>
							<th className="text-left px-4 py-2">Title</th>
							<th className="text-left px-4 py-2">Category</th>
							<th className="text-left px-4 py-2">PS#</th>
							<th className="text-left px-4 py-2">Theme</th>
							<th className="px-4 py-2" />
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr><td className="px-4 py-3" colSpan={7}>Loading…</td></tr>
						) : problems.length === 0 ? (
							<tr><td className="px-4 py-3" colSpan={7}>No problems</td></tr>
						) : (
							problems.map((p) => (
								<tr key={p._id} className="border-t">
									<td className="px-4 py-2">{p.sNo}</td>
									<td className="px-4 py-2">{p.organization}</td>
									<td className="px-4 py-2">{p.title}</td>
									<td className="px-4 py-2">{p.category}</td>
									<td className="px-4 py-2">{p.psNumber}</td>
									<td className="px-4 py-2">{p.theme}</td>
									<td className="px-4 py-2 text-right">
										<Button variant="outline" onClick={() => deleteProblem(p._id)}>Delete</Button>
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
