"use client";
import { useState } from "react";
import Feed from "@/components/Feed";
import { useHistory } from "@/lib/history";

export default function HistoryPage() {
  const all = useHistory();
  const [q, setQ] = useState("");
  // Search: every word must appear in the prompt, model or app name (any order, any case).
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const items = words.length ? all.filter((i) => { const hay = `${i.prompt} ${i.modelName} ${i.text ?? ""}`.toLowerCase(); return words.every((w) => hay.includes(w)); }) : all;
  const spent = items.reduce((s, i) => s + (i.usd ?? 0), 0);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-black uppercase">History</h1>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prompts, models…" aria-label="Search history"
          className="min-w-0 flex-1 rounded-xl bg-chip px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime sm:max-w-sm" />
        <p className="text-sm text-muted">{words.length ? `${items.length} of ${all.length}` : items.length} generations · ${spent.toFixed(2)} spent</p>
      </div>
      {words.length > 0 && !items.length ? <p className="text-sm text-muted">Nothing matches “{q}”.</p> : <Feed items={items} kind="video" />}
    </div>
  );
}
