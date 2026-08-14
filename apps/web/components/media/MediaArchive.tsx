"use client";

import { useMemo, useState } from "react";
import type { MediaItem } from "@/lib/content";
import { Badge } from "@/components/ui";

type TypeFilter = "all" | MediaItem["type"];
type SortOrder = "newest" | "oldest";

const TYPE_TABS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "press-release", label: "Press releases" },
  { value: "news", label: "News" },
  { value: "announcement", label: "Announcements" },
  { value: "coverage", label: "Coverage" },
];

const TYPE_BADGE: Record<
  MediaItem["type"],
  { tone: "blue" | "neutral" | "iris" | "green"; label: string }
> = {
  "press-release": { tone: "blue", label: "Press release" },
  news: { tone: "neutral", label: "News" },
  announcement: { tone: "iris", label: "Announcement" },
  coverage: { tone: "green", label: "Coverage" },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MediaArchive({ items }: { items: MediaItem[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<SortOrder>("newest");

  const hasSample = items.some((item) => item.sample);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter(
        (item) =>
          (type === "all" || item.type === type) &&
          (q === "" ||
            item.title.toLowerCase().includes(q) ||
            item.excerpt.toLowerCase().includes(q)),
      )
      .sort((a, b) =>
        sort === "newest"
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date),
      );
  }, [items, query, type, sort]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex w-full max-w-sm flex-col gap-2">
          <label
            htmlFor="media-archive-search"
            className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400"
          >
            Search the archive
          </label>
          <input
            id="media-archive-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title or keyword"
            className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-800 transition duration-200 placeholder:text-ink-400 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/30"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by type"
          className="flex flex-wrap gap-2"
        >
          {TYPE_TABS.map((tab) => {
            const active = type === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={active}
                onClick={() => setType(tab.value)}
                className={`rounded-full border px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition duration-200 ${
                  active
                    ? "border-saffron-500 bg-saffron-500 text-saffron-600"
                    : "border-line bg-white text-ink-600 hover:border-saffron-500 hover:text-saffron-600"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="media-archive-sort"
            className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400"
          >
            Sort
          </label>
          <select
            id="media-archive-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink-800 transition duration-200 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/30"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Count + sample caption */}
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
        <p
          aria-live="polite"
          className="font-mono text-xs uppercase tracking-[0.18em] tabular-nums text-ink-400"
        >
          {filtered.length} {filtered.length === 1 ? "release" : "releases"}
        </p>
        {hasSample && (
          <p className="text-xs text-ink-400">
            Illustrative archive — releases are managed via the CMS.
          </p>
        )}
      </div>

      {/* Archive list */}
      {filtered.length > 0 ? (
        <ul className="mt-6 border-t border-line">
          {filtered.map((item) => {
            const badge = TYPE_BADGE[item.type];
            return (
              <li
                key={item.id}
                className="group/row -mx-4 grid gap-4 border-b border-line px-4 py-6 transition duration-200 hover:bg-paper md:grid-cols-[10rem_1fr] md:gap-10"
              >
                <div className="flex flex-row items-center gap-3 md:flex-col md:items-start">
                  <time
                    dateTime={item.date}
                    className="font-mono text-xs tabular-nums tracking-wide text-ink-400"
                  >
                    {formatDate(item.date)}
                  </time>
                  <Badge tone={badge.tone}>{badge.label}</Badge>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink-950 transition duration-200 group-hover/row:text-saffron-600">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-600">
                    {item.excerpt}
                  </p>
                  <details className="group/details mt-4">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron-600 transition duration-200 hover:text-saffron-600 [&::-webkit-details-marker]:hidden">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-200 group-open/details:rotate-180"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                      Read full release
                    </summary>
                    <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-800">
                      {item.body}
                    </p>
                  </details>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="glass mt-6 rounded-3xl p-12 text-center">
          <p className="text-sm text-ink-600">
            No releases match your search. Adjust the keyword or filters.
          </p>
        </div>
      )}
    </div>
  );
}
