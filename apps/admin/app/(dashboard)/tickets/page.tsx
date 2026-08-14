"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type Ticket = { id: string; ticket_code: string; status: string; created_at: string; events: { title: string } | null; event_registrations: { full_name: string; email: string } | null };

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { async function load() { const { data, error: loadError } = await createClient().from("event_tickets").select("id,ticket_code,status,created_at,events(title),event_registrations(full_name,email)").order("created_at", { ascending: false }); setTickets((data as unknown as Ticket[]) || []); setError(loadError?.message || ""); } void load(); }, []);
  return <div><h1 className="font-display text-3xl font-bold">Tickets</h1><p className="mt-1 text-sm text-ink-600">Issued event tickets and check-in status.</p>{error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-b border-line bg-slate-50 text-xs uppercase text-ink-400"><tr><th className="p-4">Attendee</th><th className="p-4">Event</th><th className="p-4">Ticket</th><th className="p-4">Status</th><th className="p-4">Issued</th></tr></thead><tbody className="divide-y divide-line">{tickets.map(t => <tr key={t.id}><td className="p-4"><p className="font-medium">{t.event_registrations?.full_name || "—"}</p><p className="text-xs text-ink-400">{t.event_registrations?.email}</p></td><td className="p-4">{t.events?.title || "—"}</td><td className="p-4 font-mono text-xs">{t.ticket_code}</td><td className="p-4 capitalize">{t.status.replace("_", " ")}</td><td className="p-4">{new Date(t.created_at).toLocaleDateString("en-IN")}</td></tr>)}</tbody></table>{tickets.length === 0 && <p className="p-12 text-center text-sm text-ink-400">No tickets have been issued.</p>}</div></div>;
}
