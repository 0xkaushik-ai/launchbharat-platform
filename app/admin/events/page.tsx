"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface EventRow {
  id: string;
  slug: string;
  title: string;
  city: string;
  state: string;
  venue: string;
  location: string;
  date_start: string;
  date_end: string | null;
  category: string;
  status: string;
  registration_open: boolean;
  summary: string;
  description: string;
  highlights: string[];
  max_capacity: number | null;
  created_at: string;
}

const CATEGORIES = [
  "Orientation",
  "Bootcamp",
  "Pitch Day",
  "Roadshow",
  "Workshop",
  "Hackathon",
  "Forum",
  "Conference",
  "Networking",
  "Other",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EventManagementPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  // Form state
  const [form, setForm] = useState({
    title: "",
    city: "",
    state: "",
    venue: "",
    location: "",
    date_start: "",
    date_end: "",
    category: "Orientation",
    status: "upcoming",
    registration_open: true,
    summary: "",
    description: "",
    highlights: [""],
    max_capacity: "",
  });

  async function fetchEvents() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("date_start", { ascending: false });
    setEvents((data as EventRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  function updateField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addHighlight() {
    setForm((prev) => ({ ...prev, highlights: [...prev.highlights, ""] }));
  }

  function updateHighlight(index: number, value: string) {
    setForm((prev) => {
      const highlights = [...prev.highlights];
      highlights[index] = value;
      return { ...prev, highlights };
    });
  }

  function removeHighlight(index: number) {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const slug = slugify(form.title);
    const { error } = await supabase.from("events").insert({
      slug,
      title: form.title,
      city: form.city,
      state: form.state,
      venue: form.venue,
      location: form.location || `${form.venue}, ${form.city}`,
      date_start: form.date_start,
      date_end: form.date_end || null,
      category: form.category,
      status: form.status,
      registration_open: form.registration_open,
      summary: form.summary,
      description: form.description,
      highlights: form.highlights.filter((h) => h.trim()),
      max_capacity: form.max_capacity ? parseInt(form.max_capacity) : null,
    });

    if (error) {
      alert("Error creating event: " + error.message);
    } else {
      setForm({
        title: "",
        city: "",
        state: "",
        venue: "",
        location: "",
        date_start: "",
        date_end: "",
        category: "Orientation",
        status: "upcoming",
        registration_open: true,
        summary: "",
        description: "",
        highlights: [""],
        max_capacity: "",
      });
      setShowForm(false);
      fetchEvents();
    }
    setSaving(false);
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink-950 transition placeholder:text-ink-400 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-950">
            Event Management
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            Create and manage events
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-saffron-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-saffron-700"
        >
          {showForm ? "Cancel" : "+ Create Event"}
        </button>
      </div>

      {/* Create event form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink-950 mb-5">
            Create New Event
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className={inputCls}
                  placeholder="National Orientation — Online"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                  Date Start *
                </label>
                <input
                  type="date"
                  required
                  value={form.date_start}
                  onChange={(e) => updateField("date_start", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                  Date End
                </label>
                <input
                  type="date"
                  value={form.date_end}
                  onChange={(e) => updateField("date_end", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                  Venue *
                </label>
                <input
                  type="text"
                  required
                  value={form.venue}
                  onChange={(e) => updateField("venue", e.target.value)}
                  className={inputCls}
                  placeholder="Live online session"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className={inputCls}
                  placeholder="Online, Pan-India"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className={inputCls}
                  placeholder="Online"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                  State
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className={inputCls}
                  placeholder="Pan-India"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                  Max Capacity
                </label>
                <input
                  type="number"
                  value={form.max_capacity}
                  onChange={(e) => updateField("max_capacity", e.target.value)}
                  className={inputCls}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className={inputCls}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="reg_open"
                  checked={form.registration_open}
                  onChange={(e) =>
                    updateField("registration_open", e.target.checked)
                  }
                  className="h-4 w-4 accent-saffron-600"
                />
                <label htmlFor="reg_open" className="text-sm text-ink-800">
                  Registration Open
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                Summary
              </label>
              <textarea
                value={form.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                rows={2}
                className={inputCls}
                placeholder="Brief one-line summary of the event"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                className={inputCls}
                placeholder="Detailed event description"
              />
            </div>

            {/* Programme / Highlights */}
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                Programme / Highlights
              </label>
              <div className="space-y-2">
                {form.highlights.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => updateHighlight(i, e.target.value)}
                      className={inputCls}
                      placeholder={`Programme item ${i + 1}`}
                    />
                    {form.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight(i)}
                        className="shrink-0 rounded-lg border border-line px-3 text-red-500 hover:bg-red-50 transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addHighlight}
                className="mt-2 text-sm font-medium text-saffron-600 hover:text-saffron-700"
              >
                + Add programme item
              </button>
            </div>

            <div className="flex gap-3 border-t border-line pt-5">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-saffron-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-saffron-700 disabled:opacity-50"
              >
                {saving ? "Creating…" : "Create Event"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-line px-6 py-2.5 text-sm font-medium text-ink-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events list */}
      {loading ? (
        <div className="py-20 text-center text-sm text-ink-400">Loading…</div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-line bg-white py-20 text-center">
          <p className="text-sm text-ink-400">No events created yet</p>
          <p className="mt-1 text-xs text-ink-400">
            Click &quot;Create Event&quot; to add your first event
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-line bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex rounded-full bg-saffron-100 px-2.5 py-0.5 text-xs font-medium text-saffron-700">
                      {event.category}
                    </span>
                    {event.registration_open && (
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Registration Open
                      </span>
                    )}
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        event.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink-950">
                    {event.title}
                  </h3>
                  <p className="text-sm text-ink-600 mt-1">
                    {event.city && event.state
                      ? `${event.city}, ${event.state}`
                      : event.venue}{" "}
                    ·{" "}
                    {new Date(event.date_start).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-2xl font-bold text-ink-950">
                    {new Date(event.date_start).getDate()}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-saffron-600">
                    {new Date(event.date_start).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {event.summary && (
                <p className="mt-3 text-sm text-ink-600 leading-relaxed">
                  {event.summary}
                </p>
              )}
              {event.highlights && event.highlights.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-600"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
