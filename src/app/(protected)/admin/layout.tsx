"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const nav = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/problems", label: "Problems" },
    { href: "/admin/rounds", label: "Rounds" },
    { href: "/admin/criteria", label: "Criteria" },
    { href: "/admin/scores", label: "Final Scores" },
    { href: "/admin/leaderboard", label: "Leaderboard" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-semibold">Admin</h1>
          <nav className="flex items-center gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "text-sm px-3 py-1.5 rounded-md " +
                  (pathname === item.href
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100")
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
