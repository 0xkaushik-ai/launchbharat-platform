"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import type { LbEvent } from "@/lib/content";
import EventCard from "./EventCard";
import { createClient, isSupabaseConfigured } from "@/lib/supabase-browser";

type StatusFilter = "all" | "upcoming" | "completed";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

const selectCls =
  "rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-800 transition-colors duration-200 hover:border-iris-400 focus:border-iris-500 focus:outline-none";

type DatabaseEvent = {
  id: string; slug: string; title: string; city: string | null; state: string | null;
  venue: string; date_start: string; date_end: string | null; category: string;
  status: "upcoming" | "completed"; registration_open: boolean; summary: string;
  description: string; highlights: string[]; ticket_price_paise: number;
};

export default function EventsDirectory({ events: initialEvents }: { events: LbEvent[] }) {
  const [events, setEvents] = useState<LbEvent[]>(initialEvents);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isInitialMount = useRef(true);
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    [],
  );
  const PAGE_SIZE = 9;

  const fetchEvents = useCallback(async (pageNumber: number, reset: boolean) => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    let query = supabase
      .from("events")
      .select("*")
      .order("date_start", { ascending: true });

    if (status !== "all") query = query.eq("status", status);
    if (city !== "all") query = query.eq("city", city);
    if (category !== "all") query = query.eq("category", category);

    const from = (pageNumber - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    
    const { data } = await query.range(from, to);
    
    if (data) {
      const mapped = (data as DatabaseEvent[]).map((e) => ({
        id: e.id,
        slug: e.slug,
        managed: true,
        sample: false,
        title: e.title,
        city: e.city || e.venue,
        state: e.state || "",
        dateStart: e.date_start,
        dateEnd: e.date_end,
        venue: e.venue,
        category: e.category,
        status: e.status,
        registrationOpen: e.registration_open,
        ticketPricePaise: e.ticket_price_paise,
        summary: e.summary || "",
        description: e.description || "",
        highlights: e.highlights || [],
      }));
      
      if (reset) {
        // Also keep static sample events that match the filter
        const staticEvents = initialEvents.filter(e => e.sample);
        const filteredStatic = staticEvents.filter(
          (e) =>
            (status === "all" || e.status === status) &&
            (city === "all" || e.city === city) &&
            (category === "all" || e.category === category)
        );
        const combined = [...mapped, ...filteredStatic].sort((a, b) => {
          if (a.status === "upcoming" && b.status === "completed") return -1;
          if (a.status === "completed" && b.status === "upcoming") return 1;
          return a.dateStart.localeCompare(b.dateStart);
        });
        setEvents(combined);
      } else {
        setEvents(prev => [...prev, ...mapped]);
      }
      setHasMore(data.length === PAGE_SIZE);
    }
    setLoading(false);
  }, [category, city, initialEvents, status, supabase]);

  // Whenever filters change, reset pagination.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setPage(1);
    setHasMore(true);
    void fetchEvents(1, true);
  }, [fetchEvents]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    void fetchEvents(nextPage, false);
  };

  const cities = useMemo(
    () => [...new Set(initialEvents.map((e) => e.city))].sort(),
    [initialEvents],
  );
  const categories = useMemo(
    () => [...new Set(initialEvents.map((e) => e.category))].sort(),
    [initialEvents],
  );
  const hasSample = events.some((e) => e.sample);

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
                    ? "neo-border [--neo-bg:var(--color-iris-100)] text-iris-600 shadow-[0_6px_18px_-8px_rgb(139_92_246/0.45)]"
                    : "border border-line bg-white text-ink-600 hover:border-iris-400 hover:text-ink-950"
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
          {events.length} {events.length === 1 ? "program" : "programs"}
        </p>
        {hasSample && (
          <p className="text-xs text-ink-400">
            Illustrative calendar — events are managed via the CMS.
          </p>
        )}
      </div>

      {/* Results */}
      {events.length > 0 ? (
        <>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn-brand rounded-full px-6 py-2.5 text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load Next Events"}
              </button>
            </div>
          )}
        </>
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
