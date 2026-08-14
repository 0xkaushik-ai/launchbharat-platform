"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type Stats = { applications: number; pending: number; events: number; tickets: number };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ applications: 0, pending: 0, events: 0, tickets: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [applications, pending, events, tickets] = await Promise.all([
        supabase.from("applications").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("event_tickets").select("id", { count: "exact", head: true }),
      ]);
      setStats({ applications: applications.count || 0, pending: pending.count || 0, events: events.count || 0, tickets: tickets.count || 0 });
      setLoading(false);
    }
    void load();
  }, []);

  const cards = [
    ["Applications", stats.applications],
    ["Awaiting review", stats.pending],
    ["Events", stats.events],
    ["Tickets issued", stats.tickets],
  ];
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink-950">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-600">A live overview of LaunchBharat operations.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => <div key={label} className="surface p-5"><p className="font-mono text-[10px] uppercase tracking-[.17em] text-ink-400">{label}</p><p className="mt-3 font-display text-4xl font-bold">{loading ? "—" : value}</p></div>)}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/applications" className="surface p-6 transition hover:border-iris-300"><h2 className="font-display text-lg font-semibold">Review applications</h2><p className="mt-2 text-sm text-ink-600">Open the approval queue and record auditable decisions.</p></Link>
        <Link href="/events" className="surface p-6 transition hover:border-iris-300"><h2 className="font-display text-lg font-semibold">Manage events</h2><p className="mt-2 text-sm text-ink-600">Create, publish, and close programme events.</p></Link>
      </div>
    </div>
  );
}
