"use client";

import { useMemo, useState } from "react";
import type { LbEvent } from "@/lib/content";
import EventCard from "./EventCard";

type StatusFilter = "all" | "upcoming" | "completed";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

const selectCls =
  "rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-800 transition-colors duration-200 hover:border-saffron-500 focus:border-saffron-500 focus:outline-none";

export default function EventsDirectory({ events }: { events: LbEvent[] }) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");

  const cities = useMemo(
    () => [...new Set(events.map((e) => e.city))].sort(),
    [events],
  );
  const categories = useMemo(
    () => [...new Set(events.map((e) => e.category))].sort(),
    [events],
  );
  const hasSample = events.some((e) => e.sample);

  const filtered = useMemo(
    () =>
      events
        .filter(
          (e) =>
            (status === "all" || e.status === status) &&
            (city === "all" || e.city === city) &&
            (category === "all" || e.category === category),
        )
        .sort((a, b) => a.dateStart.localeCompare(b.dateStart)),
    [events, status, city, category],
  );

  return (
    <div>
      {/* Filter toolbar */}
      <div className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_10px_30px_-18px_rgb(15_23_42/0.12)] md:flex-row md:items-end md:justify-between">
        <div
          role="group"
          aria-label="Filter by status"
          className="flex flex-wrap gap-2"
        >
          {STATUS_TABS.map((tab) => {
            const active = status === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={active}
                onClick={() => setStatus(tab.value)}
                className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition duration-200 ${
                  active
                    ? "neo-border [--neo-bg:var(--color-saffron-100)] text-saffron-600 shadow-[0_6px_18px_-8px_rgb(139_92_246/0.45)]"
                    : "border border-line bg-white text-ink-600 hover:border-saffron-500 hover:text-ink-950"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="events-filter-city"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400"
            >
              City
            </label>
            <select
              id="events-filter-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={selectCls}
            >
              <option value="all">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="events-filter-category"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400"
            >
              Category
            </label>
            <select
              id="events-filter-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectCls}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Count + sample caption */}
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <p
          aria-live="polite"
          className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400"
        >
          {filtered.length} {filtered.length === 1 ? "program" : "programs"}
        </p>
        {hasSample && (
          <p className="text-xs text-ink-400">
            Illustrative calendar — events are managed via the CMS.
          </p>
        )}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="glass mt-6 flex flex-col items-center gap-4 rounded-2xl p-12 text-center">
          <span className="chip-mono">0 results</span>
          <p className="text-sm text-ink-600">
            No events match the current filters.
          </p>
        </div>
      )}
    </div>
  );
}
