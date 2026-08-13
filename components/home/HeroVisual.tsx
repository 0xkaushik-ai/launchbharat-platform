"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import IndiaDotMap from "@/components/india/IndiaDotMap";
import { CITIES, project } from "@/lib/india";

/**
 * Animated national-network visual for the hero: the accurate India map with
 * glowing gradient city nodes, draw-in connection lines and a labelled
 * journey chain from campus to industry. Purely decorative (svg is
 * aria-hidden); the floating chip is a quiet non-interactive label.
 */

function cityPoint(name: string): { x: number; y: number } {
  const city = CITIES.find((c) => c.name === name);
  return city ? project(city.lon, city.lat) : { x: 0, y: 0 };
}

const NODE_NAMES = [
  "Delhi NCR",
  "Jaipur",
  "Ahmedabad",
  "Mumbai",
  "Hyderabad",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Guwahati",
  "Kochi",
] as const;

const NODES = NODE_NAMES.map((name, i) => ({
  name,
  ...cityPoint(name),
  delay: 0.4 + i * 0.35,
}));

const LINK_PAIRS: [string, string][] = [
  ["Delhi NCR", "Jaipur"],
  ["Jaipur", "Ahmedabad"],
  ["Ahmedabad", "Mumbai"],
  ["Mumbai", "Bengaluru"],
  ["Bengaluru", "Chennai"],
  ["Bengaluru", "Hyderabad"],
  ["Hyderabad", "Kolkata"],
  ["Kolkata", "Guwahati"],
  ["Delhi NCR", "Kolkata"],
  ["Chennai", "Kochi"],
];

const LINKS = LINK_PAIRS.map(([a, b], i) => {
  const p1 = cityPoint(a);
  const p2 = cityPoint(b);
  const len = Math.round(Math.hypot(p2.x - p1.x, p2.y - p1.y) * 100) / 100;
  return { id: `${a}-${b}`, p1, p2, len, delay: 0.35 + i * 0.16 };
});

/* Journey chain along the prominent Delhi → Bengaluru line. */
const JOURNEY_A = cityPoint("Delhi NCR");
const JOURNEY_B = cityPoint("Bengaluru");
const JOURNEY_LEN =
  Math.round(
    Math.hypot(JOURNEY_B.x - JOURNEY_A.x, JOURNEY_B.y - JOURNEY_A.y) * 100,
  ) / 100;

const JOURNEY_STAGES = [
  "Campus",
  "Idea",
  "Startup",
  "Mentor",
  "Investor",
  "Industry",
];

const WAYPOINTS = JOURNEY_STAGES.map((label, i) => {
  const t = 0.14 + (i * 0.76) / (JOURNEY_STAGES.length - 1);
  return {
    label,
    x: Math.round((JOURNEY_A.x + (JOURNEY_B.x - JOURNEY_A.x) * t) * 100) / 100,
    y: Math.round((JOURNEY_A.y + (JOURNEY_B.y - JOURNEY_A.y) * t) * 100) / 100,
    delayMs: 1500 + i * 240,
  };
});

export default function HeroVisual({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Gentle "zoom out" as the visitor scrolls away from the hero. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const progress = Math.min(
        Math.max(window.scrollY / Math.max(window.innerHeight, 1), 0),
        1,
      );
      el.style.transform = `scale(${1 - progress * 0.06}) translateY(${
        progress * 18
      }px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative will-change-transform ${className}`}>
      {/* Floating tour chip pinned over the map corner */}
      <span className="glass absolute right-0 top-[10%] z-10 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink-600">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-saffron-500 to-green-500 shadow-[0_0_8px_rgba(234,124,12,0.55)]"
        />
        12-city national tour
      </span>

      <IndiaDotMap
        step={1.15}
        showOutline
        showDots
        dotClassName="fill-blue-800/25"
        className="h-auto w-full"
      >
        {/* Connection web — thin violet draw-in lines */}
        <g>
          {LINKS.map((l) => (
            <line
              key={l.id}
              x1={l.p1.x}
              y1={l.p1.y}
              x2={l.p2.x}
              y2={l.p2.y}
              className="animate-dash-draw stroke-[#ea7c0c]/25"
              strokeWidth={0.22}
              strokeLinecap="round"
              strokeDasharray={l.len}
              strokeDashoffset={l.len}
              style={
                {
                  "--dash-length": l.len,
                  animationDelay: `${l.delay}s`,
                } as CSSProperties
              }
            />
          ))}
          {/* Prominent journey line: Delhi → Bengaluru */}
          <line
            x1={JOURNEY_A.x}
            y1={JOURNEY_A.y}
            x2={JOURNEY_B.x}
            y2={JOURNEY_B.y}
            className="animate-dash-draw stroke-[#0ea5e9]/40"
            strokeWidth={0.3}
            strokeLinecap="round"
            strokeDasharray={JOURNEY_LEN}
            strokeDashoffset={JOURNEY_LEN}
            style={
              {
                "--dash-length": JOURNEY_LEN,
                animationDelay: "0.15s",
              } as CSSProperties
            }
          />
        </g>

        {/* Journey chain waypoints: campus → industry */}
        <g>
          {WAYPOINTS.map((w) => (
            <g
              key={w.label}
              className={`transition-opacity duration-700 ease-out ${
                mounted ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${w.delayMs}ms` }}
            >
              <line
                x1={w.x - 0.9}
                y1={w.y}
                x2={w.x - 1.7}
                y2={w.y}
                className="stroke-ink-400"
                strokeWidth={0.12}
              />
              <circle cx={w.x} cy={w.y} r={0.5} className="fill-saffron-500" />
              <text
                x={w.x - 2.3}
                y={w.y + 0.78}
                textAnchor="end"
                fontSize={2.2}
                letterSpacing={0.22}
                fontWeight={600}
                fill="#64748b"
              >
                {w.label}
              </text>
            </g>
          ))}
        </g>

        {/* City nodes — gradient glow markers */}
        <g>
          {NODES.map((n) => (
            <g key={n.name}>
              <circle
                cx={n.x}
                cy={n.y}
                r={2.7}
                className="animate-pulse-dot fill-[#ea7c0c]/20"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  animationDelay: `${n.delay}s`,
                }}
              />
              <circle cx={n.x} cy={n.y} r={1.5} className="fill-[#0ea5e9]/15" />
              <circle cx={n.x} cy={n.y} r={0.8} className="fill-[#0ea5e9]" />
              <circle cx={n.x} cy={n.y} r={0.3} className="fill-white" />
            </g>
          ))}
        </g>
      </IndiaDotMap>
    </div>
  );
}
