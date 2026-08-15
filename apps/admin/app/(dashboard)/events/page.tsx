"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type EventRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  venue: string;
  city: string | null;
  date_start: string;
  status: string;
  is_published: boolean;
  registration_open: boolean;
  max_capacity: number | null;
  ticket_price_paise: number;
};

const empty = {
  title: "",
  category: "Orientation",
  venue: "",
  city: "",
  state: "",
  date_start: "",
  summary: "",
  ticketPriceRupees: "0",
  maxCapacity: "",
};

function formatMoney(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function parseCommercials(price: string, capacity: string) {
  const priceNumber = Number(price);
  const capacityNumber = capacity.trim() ? Number(capacity) : null;
  if (!Number.isFinite(priceNumber) || priceNumber < 0) {
    throw new Error("Ticket price must be zero or more.");
  }
  if (
    capacityNumber !== null &&
    (!Number.isInteger(capacityNumber) || capacityNumber <= 0)
  ) {
    throw new Error("Capacity must be a positive whole number.");
  }
  return {
    ticket_price_paise: Math.round(priceNumber * 100),
    max_capacity: capacityNumber,
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [commercials, setCommercials] = useState({ price: "0", capacity: "" });

  const load = useCallback(async () => {
    const { data, error: loadError } = await createClient()
      .from("events")
      .select("*")
      .order("date_start", { ascending: false });
    setEvents((data as EventRow[]) || []);
    setError(loadError?.message || "");
  }, []);

  useEffect(() => {
    let cancelled = false;
    void createClient()
      .from("events")
      .select("*")
      .order("date_start", { ascending: false })
      .then(({ data, error: loadError }) => {
        if (cancelled) return;
        setEvents((data as EventRow[]) || []);
        setError(loadError?.message || "");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    let pricing;
    try {
      pricing = parseCommercials(form.ticketPriceRupees, form.maxCapacity);
    } catch (validationError) {
      setError(validationError instanceof Error ? validationError.message : "Check the price and capacity.");
      return;
    }

    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSaving(true);
    const { error: saveError } = await createClient().from("events").insert({
      title: form.title.trim(),
      slug,
      category: form.category.trim(),
      venue: form.venue.trim(),
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      date_start: form.date_start,
      summary: form.summary.trim(),
      description: form.summary.trim(),
      location: [form.venue.trim(), form.city.trim()].filter(Boolean).join(", "),
      status: "upcoming",
      is_published: false,
      registration_open: false,
      ...pricing,
    });
    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }
    setForm(empty);
    setShowForm(false);
    await load();
  }

  async function toggle(
    row: EventRow,
    field: "is_published" | "registration_open",
  ) {
    setError("");
    const { error: saveError } = await createClient()
      .from("events")
      .update({ [field]: !row[field] })
      .eq("id", row.id);
    if (saveError) setError(saveError.message);
    else await load();
  }

  function editCommercials(row: EventRow) {
    setEditingId(row.id);
    setCommercials({
      price: String(row.ticket_price_paise / 100),
      capacity: row.max_capacity ? String(row.max_capacity) : "",
    });
    setError("");
  }

  async function saveCommercials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) return;

    let values;
    try {
      values = parseCommercials(commercials.price, commercials.capacity);
    } catch (validationError) {
      setError(validationError instanceof Error ? validationError.message : "Check the price and capacity.");
      return;
    }

    setSaving(true);
    const { error: saveError } = await createClient()
      .from("events")
      .update(values)
      .eq("id", editingId);
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setEditingId(null);
    await load();
  }

  const input =
    "mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-iris-500";

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Events</h1>
          <p className="mt-1 text-sm text-ink-600">
            Set capacity and price, save a draft, then explicitly publish and open registration.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-brand rounded-full px-4 py-2.5 text-sm font-semibold"
        >
          {showForm ? "Cancel" : "Create event"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-6 grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-2">
          <label className="text-sm">Title<input required className={input} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label className="text-sm">Category<input required className={input} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
          <label className="text-sm">Venue<input required className={input} value={form.venue} onChange={(event) => setForm({ ...form, venue: event.target.value })} /></label>
          <label className="text-sm">City<input className={input} value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label>
          <label className="text-sm">State<input className={input} value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} /></label>
          <label className="text-sm">Start date<input required type="date" className={input} value={form.date_start} onChange={(event) => setForm({ ...form, date_start: event.target.value })} /></label>
          <label className="text-sm">
            Ticket price (₹)
            <input required type="number" min="0" step="0.01" className={input} value={form.ticketPriceRupees} onChange={(event) => setForm({ ...form, ticketPriceRupees: event.target.value })} />
            <span className="mt-1 block text-xs text-ink-400">Use 0 for a free event.</span>
          </label>
          <label className="text-sm">
            Maximum tickets
            <input type="number" min="1" step="1" placeholder="Unlimited" className={input} value={form.maxCapacity} onChange={(event) => setForm({ ...form, maxCapacity: event.target.value })} />
            <span className="mt-1 block text-xs text-ink-400">Leave blank for no capacity limit.</span>
          </label>
          <label className="text-sm sm:col-span-2">Summary<textarea required className={input} rows={3} value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></label>
          <button disabled={saving} className="rounded-lg bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2">
            {saving ? "Saving…" : "Save as draft"}
          </button>
        </form>
      )}

      {editingId && (
        <form onSubmit={saveCommercials} className="mt-6 rounded-xl border border-iris-300 bg-iris-100/40 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold">Edit ticket setup</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">Changes apply to future bookings. Tickets already issued keep their original price.</p>
            </div>
            <label className="text-sm lg:w-48">Ticket price (₹)<input required type="number" min="0" step="0.01" className={input} value={commercials.price} onChange={(event) => setCommercials({ ...commercials, price: event.target.value })} /></label>
            <label className="text-sm lg:w-48">Maximum tickets<input type="number" min="1" step="1" placeholder="Unlimited" className={input} value={commercials.capacity} onChange={(event) => setCommercials({ ...commercials, capacity: event.target.value })} /></label>
            <div className="flex gap-2">
              <button disabled={saving} className="rounded-lg bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
              <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold">Cancel</button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-line bg-slate-50 text-xs uppercase text-ink-400">
            <tr><th className="p-4">Event</th><th className="p-4">Date</th><th className="p-4">Ticket setup</th><th className="p-4">Status</th><th className="p-4">Controls</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {events.map((row) => (
              <tr key={row.id}>
                <td className="p-4"><p className="font-semibold">{row.title}</p><p className="text-xs text-ink-400">{row.venue}{row.city ? ` · ${row.city}` : ""}</p></td>
                <td className="p-4">{new Date(`${row.date_start}T00:00:00`).toLocaleDateString("en-IN")}</td>
                <td className="p-4"><p className="font-semibold">{row.ticket_price_paise > 0 ? formatMoney(row.ticket_price_paise) : "Free"}</p><p className="text-xs text-ink-400">{row.max_capacity ? `${row.max_capacity} tickets maximum` : "Unlimited capacity"}</p></td>
                <td className="p-4 capitalize">{row.status}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => void toggle(row, "is_published")} className="rounded border border-line px-2.5 py-1.5">{row.is_published ? "Unpublish" : "Publish"}</button>
                    <button onClick={() => void toggle(row, "registration_open")} className="rounded border border-line px-2.5 py-1.5">Registration: {row.registration_open ? "open" : "closed"}</button>
                    <button onClick={() => editCommercials(row)} className="rounded border border-iris-300 px-2.5 py-1.5 text-iris-600">Price & capacity</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <p className="p-10 text-center text-sm text-ink-400">No events created yet.</p>}
      </div>
    </div>
  );
}
