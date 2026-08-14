"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type Status = "pending" | "in_review" | "approved" | "rejected";
type Application = {
  id: string; application_no: string; full_name: string; email: string; mobile: string;
  state: string; city: string; college: string; course: string | null; graduation_year: string | null;
  idea_title: string; stage: string; category: string; description: string; participant_role: string;
  linkedin_url: string | null; website_url: string | null; pitch_deck_url: string | null;
  additional_info: string | null; status: Status; review_notes: string | null; created_at: string;
};

const filters: Array<"all" | Status> = ["all", "pending", "in_review", "approved", "rejected"];

export default function ApplicationsPage() {
  const [rows, setRows] = useState<Application[]>([]);
  const [filter, setFilter] = useState<"all" | Status>("pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const supabase = createClient();
    let query = supabase.from("applications").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data, error: loadError } = await query;
    setError(loadError?.message || "");
    setRows((data as Application[]) || []);
  }, [filter]);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    let query = supabase.from("applications").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    void query.then(({ data, error: loadError }) => {
      if (cancelled) return;
      setError(loadError?.message || "");
      setRows((data as Application[]) || []);
    });
    return () => { cancelled = true; };
  }, [filter]);

  async function review(id: string, decision: Exclude<Status, "pending">) {
    const notes = window.prompt("Optional internal review note:") || null;
    setBusy(id);
    setError("");
    const { error: reviewError } = await createClient().rpc("review_application", { application_id: id, decision, notes });
    if (reviewError) setError(reviewError.message); else await load();
    setBusy(null);
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Applications</h1>
      <p className="mt-1 text-sm text-ink-600">Review submissions through the transactional, audited workflow.</p>
      <div className="mt-6 flex flex-wrap gap-2">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-sm capitalize ${filter === item ? "bg-saffron-600 text-white" : "border border-line bg-white text-ink-600"}`}>{item.replace("_", " ")}</button>)}</div>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-5 space-y-3">
        {rows.length === 0 && <div className="rounded-xl border border-dashed border-line bg-white p-12 text-center text-sm text-ink-400">No applications in this queue.</div>}
        {rows.map((row) => <article key={row.id} className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
          <button onClick={() => setExpanded(expanded === row.id ? null : row.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-slate-50"><div className="min-w-0"><h2 className="truncate font-semibold">{row.full_name} · {row.idea_title}</h2><p className="mt-1 truncate text-xs text-ink-400">{row.application_no} · {row.email} · {new Date(row.created_at).toLocaleDateString("en-IN")}</p></div><StatusBadge status={row.status} /></button>
          {expanded === row.id && <div className="border-t border-line bg-slate-50 p-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Detail label="Mobile" value={row.mobile} /><Detail label="Location" value={`${row.city}, ${row.state}`} /><Detail label="Institution" value={[row.college, row.course, row.graduation_year].filter(Boolean).join(" · ")} /><Detail label="Stage / category" value={`${row.stage} · ${row.category}`} /><Detail label="Participating as" value={row.participant_role} /></div>
            <div className="mt-5"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-ink-400">Idea description</p><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink-800">{row.description}</p></div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-blue-800">{row.linkedin_url && <a href={row.linkedin_url} target="_blank" rel="noreferrer">LinkedIn ↗</a>}{row.website_url && <a href={row.website_url} target="_blank" rel="noreferrer">Website ↗</a>}{row.pitch_deck_url && <a href={row.pitch_deck_url} target="_blank" rel="noreferrer">Pitch deck ↗</a>}</div>
            {row.status !== "approved" && row.status !== "rejected" && <div className="mt-5 flex gap-3 border-t border-line pt-4"><button disabled={busy === row.id} onClick={() => review(row.id, "approved")} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve</button><button disabled={busy === row.id} onClick={() => review(row.id, "rejected")} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Reject</button><button disabled={busy === row.id} onClick={() => review(row.id, "in_review")} className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">Mark in review</button></div>}
          </div>}
        </article>)}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) { return <div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-ink-400">{label}</p><p className="mt-1 text-sm text-ink-800">{value || "—"}</p></div>; }
function StatusBadge({ status }: { status: Status }) { const color = status === "approved" ? "bg-green-100 text-green-700" : status === "rejected" ? "bg-red-100 text-red-700" : "bg-saffron-100 text-saffron-700"; return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${color}`}>{status.replace("_", " ")}</span>; }
