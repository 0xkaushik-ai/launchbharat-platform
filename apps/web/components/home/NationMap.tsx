"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import IndiaDotMap from "@/components/india/IndiaDotMap";
import { INDIA_VIEW } from "@/lib/india";
import { Badge, GlowCard } from "@/components/ui";

export interface NationCityEvent {
  slug: string;
  title: string;
  dateDisplay: string;
}

export interface NationCity {
  id: string;
  city: string;
  state: string;
  status: "active" | "planned";
  /** Pre-projected map coordinates (lib/india view space). */
  x: number;
  y: number;
  venue: string | null;
  institutions: number | null;
  participants: number | null;
  ideas: number | null;
  partners: number | null;
  events: NationCityEvent[];
}

/** Curated national-tour route (city ids, in tour order). */
const TOUR_CHAIN: string[] = [
  "delhi-ncr",
  "punjab",
  "jaipur",
  "ahmedabad",
  "indore",
  "pune",
  "bengaluru",
  "chennai",
  "hyderabad",
  "kolkata",
  "guwahati",
  "kanpur",
];

/** A few long sky cross-links — just enough to feel connected, not a mesh. */
const CROSS_LINKS: [string, string][] = [
  ["delhi-ncr", "bengaluru"],
  ["ahmedabad", "kolkata"],
  ["punjab", "hyderabad"],
];

interface MapLink {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Fallback route if the curated ids ever drift from the CMS: greedy nearest-neighbour. */
function nearestNeighbourOrder(cities: NationCity[]): NationCity[] {
  if (cities.length === 0) return [];
  const remaining = [...cities];
  const path: NationCity[] = [remaining.shift()!];
  while (remaining.length > 0) {
    const last = path[path.length - 1];
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dx = remaining[i].x - last.x;
      const dy = remaining[i].y - last.y;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    path.push(remaining.splice(bestIdx, 1)[0]);
  }
  return path;
}

function buildLinks(cities: NationCity[]): {
  /** Single elegant tour-chain path + its length (for the dash draw-in). */
  chainD: string;
  chainLength: number;
  cross: MapLink[];
} {
  const byId = new Map(cities.map((c) => [c.id, c]));

  const curated = TOUR_CHAIN.map((id) => byId.get(id)).filter(
    (c): c is NationCity => c !== undefined,
  );
  const ordered =
    curated.length >= 2 ? curated : nearestNeighbourOrder(cities);

  let chainD = "";
  let chainLength = 0;
  if (ordered.length >= 2) {
    chainD = `M ${ordered[0].x} ${ordered[0].y}`;
    for (let i = 1; i < ordered.length; i++) {
      chainD += ` L ${ordered[i].x} ${ordered[i].y}`;
      chainLength += Math.hypot(
        ordered[i].x - ordered[i - 1].x,
        ordered[i].y - ordered[i - 1].y,
      );
    }
  }

  const cross: MapLink[] = [];
  for (const [aId, bId] of CROSS_LINKS) {
    const a = byId.get(aId);
    const b = byId.get(bId);
    if (a && b)
      cross.push({
        key: `cross-${a.id}-${b.id}`,
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y,
      });
  }

  return { chainD, chainLength, cross };
}

export default function NationMap({ cities }: { cities: NationCity[] }) {
  const firstActive = cities.find((c) => c.status === "active") ?? cities[0];
  const [selectedId, setSelectedId] = useState<string>(
    firstActive ? firstActive.id : "",
  );
  const [routePulse, setRoutePulse] = useState<{ key: number; d: string } | null>(null);
  const selected = cities.find((c) => c.id === selectedId) ?? firstActive;

  if (!selected) return null;

  const { chainD, chainLength, cross } = buildLinks(cities);
  const hasPlanned = cities.some((c) => c.status === "planned");
  const labelOnLeft = selected.x > INDIA_VIEW.w * 0.62;

  const selectCity = (next: NationCity) => {
    if (next.id === selected.id) return;
    setRoutePulse((current) => ({
      key: (current?.key ?? 0) + 1,
      d: `M ${selected.x} ${selected.y} L ${next.x} ${next.y}`,
    }));
    setSelectedId(next.id);
  };

  const statRows: { label: string; value: number | null }[] = [
    { label: "Institutions", value: selected.institutions },
    { label: "Participants", value: selected.participants },
    { label: "Ideas", value: selected.ideas },
    { label: "Ecosystem partners", value: selected.partners },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
      {/* ——— Map + selector (left, 3/5) ——— */}
      <div className="lg:col-span-3">
        <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-[34rem]">
          <IndiaDotMap
            step={1.1}
            dotClassName="fill-blue-800/20"
            showOutline
            className="relative h-auto w-full"
          >
            {/* Long sky cross-links */}
            <g>
              {cross.map((l) => (
                <line
                  key={l.key}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  className="stroke-blue-800/25"
                  strokeWidth={0.16}
                  strokeDasharray="0.9 1.3"
                />
              ))}
            </g>
            {/* The tour chain — one elegant route, drawn in */}
            {chainD && (
              <>
                <path
                  d={chainD}
                  fill="none"
                  className="animate-dash-draw stroke-[#ea7c0c]/30"
                  strokeWidth={0.24}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={chainLength}
                  style={{ "--dash-length": chainLength } as CSSProperties}
                />
              </>
            )}
            {/* A one-time connection is drawn only when a new city is selected. */}
            {routePulse && (
              <path
                key={routePulse.key}
                d={routePulse.d}
                fill="none"
                pathLength={100}
                className="tour-route-pulse stroke-cyan-400"
                strokeWidth={0.72}
                strokeLinecap="round"
              />
            )}
            {/* City markers (clickable bonus — buttons below are the accessible path) */}
            {cities.map((c, i) => {
              const isSelected = c.id === selected.id;
              return (
                <g
                  key={c.id}
                  onClick={() => selectCity(c)}
                  className="cursor-pointer"
                >
                  {/* generous invisible hit area */}
                  <circle cx={c.x} cy={c.y} r={2.8} className="fill-transparent" />
                  {/* pulsing violet halo */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={1.7}
                    className="animate-pulse-dot fill-saffron-500/25"
                    style={{
                      animationDelay: `${(i % 6) * 0.45}s`,
                      transformBox: "fill-box",
                      transformOrigin: "center",
                    }}
                  />
                  {isSelected && (
                    <>
                      {/* soft sky glow + rings */}
                      <circle cx={c.x} cy={c.y} r={2.3} className="fill-blue-800/15" />
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={1.7}
                        className="fill-none stroke-blue-800/50"
                        strokeWidth={0.2}
                      />
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={1.3}
                        className="fill-none stroke-white"
                        strokeWidth={0.24}
                      />
                    </>
                  )}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isSelected ? 0.95 : 0.75}
                    className={
                      isSelected
                        ? "fill-blue-800"
                        : c.status === "active"
                          ? "fill-saffron-600"
                          : "fill-saffron-400"
                    }
                  />
                </g>
              );
            })}
            {/* Selected-city label */}
            <text
              x={selected.x + (labelOnLeft ? -2.6 : 2.6)}
              y={selected.y - 1.5}
              textAnchor={labelOnLeft ? "end" : "start"}
              fontSize={2.4}
              fill="#0b1220"
              stroke="#ffffff"
              strokeWidth={0.55}
              paintOrder="stroke"
              strokeLinejoin="round"
              className="pointer-events-none font-display font-semibold select-none"
              aria-hidden="true"
            >
              {selected.city}
            </text>
          </IndiaDotMap>
        </div>

        {/* City selector — the accessible path */}
        <div
          role="group"
          aria-label="Select a city in the LaunchBharat network"
          className="mt-8"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0">
            {cities.map((c, i) => {
              const isSelected = c.id === selected.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => selectCity(c)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10px] font-medium tracking-[0.14em] whitespace-nowrap uppercase backdrop-blur transition duration-200 ${
                    isSelected
                      ? "border-iris-400 bg-white text-iris-600 shadow-[0_0_24px_-6px_rgba(234,124,12,0.6)]"
                      : "border-line bg-white/70 text-ink-600 hover:border-iris-400 hover:text-ink-950"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={isSelected ? "text-iris-600" : "text-ink-400"}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend + honest caption */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="inline-flex items-center gap-2 text-xs text-ink-600">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-iris-500 shadow-[0_0_8px_rgba(234,124,12,0.5)]"
            />
            Tour stop
          </span>
          {hasPlanned && (
            <span className="inline-flex items-center gap-2 text-xs text-ink-600">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-iris-500"
              />
              Planned
            </span>
          )}
          <span className="inline-flex items-center gap-2 text-xs text-ink-600">
            <span aria-hidden="true" className="h-px w-5 bg-iris-500/70" />
            Tour route
          </span>
        </div>
        <p className="mt-2 text-xs text-ink-400">
          Venues and verified city stats are published via the CMS as each
          stop is confirmed.
        </p>
      </div>

      {/* ——— Detail panel (right, 2/5) ——— */}
      <div className="lg:col-span-2 lg:self-start">
        <GlowCard className="glass rounded-3xl">
          <div aria-live="polite" className="corner-frame rounded-3xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="display-md text-ink-950">{selected.city}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-400">
                  {selected.state}
                </p>
              </div>
              <Badge tone={selected.status === "active" ? "green" : "iris"}>
                {selected.status === "active" ? "Tour stop" : "Planned"}
              </Badge>
            </div>

            {/* Venue */}
            <p className="mt-4 flex items-start gap-2 text-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-iris-600"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {selected.venue ? (
                <span className="text-ink-800">{selected.venue}</span>
              ) : (
                <span className="text-ink-600">Venue to be announced</span>
              )}
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-3">
              {statRows.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-line bg-white/70 p-4"
                >
                  <dt className="text-[10px] font-semibold tracking-[0.18em] uppercase text-ink-400">
                    {s.label}
                  </dt>
                  <dd className="mt-2">
                    {s.value === null ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="text-xl font-semibold text-ink-400"
                        >
                          —
                        </span>
                        <span className="mt-1 block text-[10px] uppercase tracking-widest text-ink-400">
                          Published as verified
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-semibold tabular-nums text-ink-950">
                        {s.value.toLocaleString("en-IN")}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-ink-400">
                Linked programs
              </p>
              {selected.events.length > 0 ? (
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {selected.events.map((ev) => (
                    <li key={ev.slug}>
                      <Link
                        href={`/events/${ev.slug}`}
                        className="group flex items-center justify-between gap-4 py-3.5"
                      >
                        <span>
                          <span className="block text-sm font-semibold text-ink-950 transition group-hover:text-iris-600">
                            {ev.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-ink-600">
                            {ev.dateDisplay}
                          </span>
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-ink-400 transition group-hover:translate-x-1 group-hover:text-iris-600"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-600">
                  Programs for this city are being scheduled.
                </p>
              )}
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
