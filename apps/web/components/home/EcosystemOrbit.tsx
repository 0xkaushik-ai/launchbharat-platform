"use client";

import { useState } from "react";
import { Container, Reveal, SectionHeading } from "@/components/ui";

/* ——— Node data ——— */

interface OrbitNode {
  id: string;
  label: string;
  /** Compact label for very small screens (optional). */
  shortLabel?: string;
  /** Angle on the orbit in degrees; 0 = top, clockwise. */
  angle: number;
  role: string;
}

const NODES: OrbitNode[] = [
  {
    id: "students",
    label: "Students",
    angle: 0,
    role: "Students discover entrepreneurship on campus — workshops, challenges and a first real audience for their ideas. Curiosity is the only prerequisite.",
  },
  {
    id: "colleges",
    label: "Colleges",
    angle: 45,
    role: "Colleges host the movement on campus, opening a direct channel between their classrooms and the national startup ecosystem.",
  },
  {
    id: "startups",
    label: "Startups",
    angle: 90,
    role: "Startups gain mentorship, national visibility and structured pathways to incubators, investors and industry pilots.",
  },
  {
    id: "incubators",
    label: "Incubators",
    angle: 135,
    role: "Incubators receive a curated pipeline of high-intent founders and carry the strongest ideas from prototype to venture.",
  },
  {
    id: "mentors",
    label: "Mentors",
    angle: 180,
    role: "Mentors bring operating experience to the next generation — honest, practical guidance at the moments it matters most.",
  },
  {
    id: "investors",
    label: "Investors",
    angle: 225,
    role: "Investors meet early, high-conviction founders sourced from every corner of India — before the rest of the market does.",
  },
  {
    id: "industry",
    label: "Industry",
    angle: 270,
    role: "Industry brings real problems, pilot programmes and partnerships that turn emerging innovation into deployed solutions.",
  },
  {
    id: "ecosystem-partners",
    label: "Ecosystem Partners",
    shortLabel: "Partners",
    angle: 315,
    role: "Institutions, communities and enablers extend the movement's reach — keeping every stakeholder in the chain connected.",
  },
];

const DEFAULT_ROLE =
  "The national platform connecting every stakeholder in the journey from idea to impact.";

/** Orbit radius in the 0–100 view space. */
const R = 38;

/** Position on the orbit; angle 0 = top, clockwise. */
function pos(angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: 50 + R * Math.cos(rad), y: 50 + R * Math.sin(rad) };
}

/* ——— Component ——— */

export default function EcosystemOrbit() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeId = hovered ?? selected;
  const active = NODES.find((n) => n.id === activeId) ?? null;

  return (
    <section
      aria-labelledby="ecosystem-orbit-heading"
      className="section-pad grid-texture relative overflow-hidden bg-slate-50"
    >
      {/* Ambient orb behind the orbit visual */}
      <div
        aria-hidden="true"
        className="hidden"
        style={{ width: 560, height: 560, top: "30%", left: "calc(50% - 280px)" }}
      />
      <Container className="relative">
        <SectionHeading
          id="ecosystem-orbit-heading"
          number="04"
          eyebrow="The Ecosystem"
          title={
            <>
              One movement.{" "}
              <span className="text-saffron-600">Every stakeholder.</span>
            </>
          }
          lede="Hover or tap any node to see its role in the movement."
          align="center"
          className="mx-auto"
        />

        <Reveal delay={1} className="mt-12 md:mt-16">
          <div className="relative mx-auto aspect-square w-full max-w-2xl">
            {/* Decorative orbit geometry */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
              focusable="false"
            >
              {/* Spokes: node → center */}
              {NODES.map((n) => {
                const p = pos(n.angle);
                const isActive = activeId === n.id;
                return (
                  <line
                    key={n.id}
                    x1="50"
                    y1="50"
                    x2={p.x}
                    y2={p.y}
                    className={
                      isActive ? "stroke-saffron-600" : "stroke-[#ea7c0c]/20"
                    }
                    strokeWidth={isActive ? 0.3 : 0.2}
                  />
                );
              })}
              {/* Orbit rings */}
              <circle
                cx="50"
                cy="50"
                r={R}
                fill="none"
                className="stroke-slate-200"
                strokeWidth="0.25"
              />
              <circle
                cx="50"
                cy="50"
                r={R - 16}
                fill="none"
                className="stroke-slate-200/60"
                strokeWidth="0.2"
              />
              {/* Faint sky outer orbit ring */}
              <circle
                cx="50"
                cy="50"
                r={R + 5}
                fill="none"
                className="stroke-blue-800/40"
                strokeWidth="0.15"
                strokeDasharray="0.6 1.6"
              />
              {/* Accent dots between nodes — alternating sky/orchid, staggered pulse */}
              {NODES.map((n, i) => {
                const p = pos(n.angle + 22.5);
                return (
                  <circle
                    key={`dot-${n.id}`}
                    cx={p.x}
                    cy={p.y}
                    r="0.6"
                    className={`animate-pulse-dot motion-reduce:animate-none ${
                      i % 2 === 0 ? "fill-blue-800" : "fill-green-600"
                    }`}
                    style={{ animationDelay: `${i * 0.35}s` }}
                  />
                );
              })}
            </svg>

            {/* Center plate */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="glass neo-border flex flex-col items-center gap-1.5 rounded-2xl px-5 py-4 shadow-[0_20px_50px_-22px_rgba(15,23,42,0.28)] sm:px-7 sm:py-5">
                <span className="font-display text-base font-bold leading-none tracking-tight sm:text-2xl">
                  <span className="text-ink-950">LAUNCH</span>
                  <span className="text-green-700">BHARAT</span>
                </span>
                <span className="hidden font-mono text-[8px] font-semibold uppercase tracking-[0.3em] text-ink-600 sm:block">
                  The National Platform
                </span>
              </div>
            </div>

            {/* Interactive nodes */}
            {NODES.map((n) => {
              const p = pos(n.angle);
              const isActive = activeId === n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  aria-pressed={selected === n.id}
                  onClick={() =>
                    setSelected((prev) => (prev === n.id ? null : n.id))
                  }
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(n.id)}
                  onBlur={() => setHovered(null)}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider backdrop-blur transition duration-200 ease-out sm:text-xs ${
                    isActive
                      ? "scale-[1.05] border-saffron-500 bg-white text-ink-950 shadow-[0_0_0_1px_rgba(234,124,12,0.25),0_12px_32px_-10px_rgba(234,124,12,0.45)]"
                      : "border-line bg-white/80 text-ink-800 hover:border-saffron-500 hover:text-saffron-600 hover:shadow-[0_10px_26px_-12px_rgba(234,124,12,0.4)]"
                  }`}
                >
                  {n.shortLabel ? (
                    <>
                      <span className="sm:hidden">{n.shortLabel}</span>
                      <span className="hidden sm:inline">{n.label}</span>
                    </>
                  ) : (
                    n.label
                  )}
                </button>
              );
            })}
          </div>

          {/* Role panel — single live region, fixed min-height to avoid layout shift */}
          <div
            aria-live="polite"
            className="glass corner-frame mx-auto mt-10 flex min-h-[10.5rem] max-w-xl flex-col items-center gap-3 rounded-2xl px-6 py-6 text-center sm:min-h-[9.5rem]"
          >
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em]">
              <span className="text-green-700">
                {active ? active.label : "LaunchBharat"}
              </span>
            </span>
            <p className="text-sm leading-relaxed text-ink-800 sm:text-base">
              {active ? active.role : DEFAULT_ROLE}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
