"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type EventRow = { id: string; slug: string; title: string; category: string; venue: string; city: string | null; date_start: string; status: string; is_published: boolean; registration_open: boolean };
const empty = { title: "", category: "Orientation", venue: "", city: "", state: "", date_start: "", summary: "" };

export default function EventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => { const { data, error: loadError } = await createClient().from("events").select("*").order("date_start", { ascending: false }); setEvents((data as EventRow[]) || []); setError(loadError?.message || ""); }, []);
  useEffect(() => {
    let cancelled = false;
    void createClient().from("events").select("*").order("date_start", { ascending: false }).then(({ data, error: loadError }) => {
      if (cancelled) return;
      setEvents((data as EventRow[]) || []);
      setError(loadError?.message || "");
    });
    return () => { cancelled = true; };
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { error: saveError } = await createClient().from("events").insert({ ...form, slug, status: "upcoming", location: [form.venue, form.city].filter(Boolean).join(", "), description: form.summary, is_published: false, registration_open: false });
    if (saveError) setError(saveError.message); else { setForm(empty); setShowForm(false); await load(); }
  }

  async function toggle(row: EventRow, field: "is_published" | "registration_open") { const { error: saveError } = await createClient().from("events").update({ [field]: !row[field] }).eq("id", row.id); if (saveError) setError(saveError.message); else await load(); }
  const input = "mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-saffron-500";
  return <div><div className="flex items-center justify-between"><div><h1 className="font-display text-3xl font-bold">Events</h1><p className="mt-1 text-sm text-ink-600">Draft first, then explicitly publish and open registration.</p></div><button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-saffron-600 px-4 py-2.5 text-sm font-semibold text-white">{showForm ? "Cancel" : "Create event"}</button></div>
    {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {showForm && <form onSubmit={submit} className="mt-6 grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-2"><label className="text-sm">Title<input required className={input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label><label className="text-sm">Category<input required className={input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></label><label className="text-sm">Venue<input required className={input} value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} /></label><label className="text-sm">City<input className={input} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></label><label className="text-sm">State<input className={input} value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} /></label><label className="text-sm">Start date<input required type="date" className={input} value={form.date_start} onChange={e => setForm({ ...form, date_start: e.target.value })} /></label><label className="text-sm sm:col-span-2">Summary<textarea required className={input} rows={3} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} /></label><button className="rounded-lg bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white sm:col-span-2">Save as draft</button></form>}
    <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-line bg-slate-50 text-xs uppercase text-ink-400"><tr><th className="p-4">Event</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4">Controls</th></tr></thead><tbody className="divide-y divide-line">{events.map(row => <tr key={row.id}><td className="p-4"><p className="font-semibold">{row.title}</p><p className="text-xs text-ink-400">{row.venue}{row.city ? ` · ${row.city}` : ""}</p></td><td className="p-4">{new Date(`${row.date_start}T00:00:00`).toLocaleDateString("en-IN")}</td><td className="p-4 capitalize">{row.status}</td><td className="p-4"><div className="flex gap-2"><button onClick={() => toggle(row, "is_published")} className="rounded border border-line px-2.5 py-1.5">{row.is_published ? "Unpublish" : "Publish"}</button><button onClick={() => toggle(row, "registration_open")} className="rounded border border-line px-2.5 py-1.5">Registration: {row.registration_open ? "open" : "closed"}</button></div></td></tr>)}</tbody></table></div>
  </div>;
}
