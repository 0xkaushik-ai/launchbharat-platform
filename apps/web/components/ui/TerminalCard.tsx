"use client";

import { useEffect, useRef, useState } from "react";

export interface TerminalLine {
  /** true = command line (gets the $ prompt), false = output line */
  prompt?: boolean;
  text: string;
  accent?: "saffron" | "green" | "default";
}

/**
 * Terminal window motif — types its lines when scrolled into view.
 * Static render (all lines visible) under prefers-reduced-motion.
 */
export default function TerminalCard({
  title = "launchbharat.sh",
  lines,
  className = "",
}: {
  title?: string;
  lines: TerminalLine[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(lines.length);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lines.length]);

  useEffect(() => {
    if (!started || shown >= lines.length) return;
    const t = setTimeout(
      () => setShown((s) => s + 1),
      lines[shown]?.prompt ? 520 : 260,
    );
    return () => clearTimeout(t);
  }, [started, shown, lines]);

  const accentCls = (a?: TerminalLine["accent"]) =>
    a === "saffron"
      ? "text-blue-800"
      : a === "green"
        ? "text-emerald-300"
        : "text-ink-600";

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-2xl border border-white/10 bg-white font-mono text-[12px] leading-relaxed shadow-[0_24px_60px_-24px_rgba(15,23,42,0.5)] sm:text-[13px] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-800/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-saffron-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </span>
        <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-slate-400">
          {title}
        </span>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        {lines.slice(0, shown).map((l, i) => (
          <p key={i} className={accentCls(l.accent)}>
            {l.prompt && (
              <span aria-hidden="true" className="mr-2 text-green-600">
                $
              </span>
            )}
            {l.text}
          </p>
        ))}
        {shown < lines.length && (
          <p aria-hidden="true" className="caret text-slate-500" />
        )}
      </div>
    </div>
  );
}
