"use client";

import { useEffect, useState } from "react";

interface Parts {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const UNITS: { key: keyof Parts; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

/** Remaining time to `target`, clamped at zero once the date has passed. */
function partsFor(target: string): Parts {
  const remaining = Math.max(0, new Date(target).getTime() - Date.now());
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    days: pad(Math.floor(remaining / 86_400_000)),
    hours: pad(Math.floor((remaining % 86_400_000) / 3_600_000)),
    minutes: pad(Math.floor((remaining % 3_600_000) / 60_000)),
    seconds: pad(Math.floor((remaining % 60_000) / 1_000)),
  };
}

/**
 * SSR-safe countdown to the Grand Finale. Renders "--" plates on the server
 * and until mounted, then ticks once per second on the client.
 */
export default function Countdown({
  target,
  confirmed,
  className = "",
}: {
  /** ISO date string of the finale. */
  target: string;
  /** When false, a "target date" disclaimer renders under the plates. */
  confirmed: boolean;
  className?: string;
}) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(partsFor(target));
    const id = window.setInterval(() => setParts(partsFor(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  // Deterministic on server and client — safe against hydration mismatch.
  const monthYear = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(target));

  return (
    <div role="timer" aria-live="off" className={className}>
      <span className="sr-only">
        Grand Finale scheduled for {monthYear}.
      </span>
      <div aria-hidden="true" className="grid grid-cols-4 gap-2 sm:gap-4">
        {UNITS.map(({ key, label }) => (
          <div
            key={key}
            className="glass neo-border relative flex flex-col items-center gap-2 rounded-2xl px-2 py-5 sm:px-6 sm:py-6"
          >
            <span className="font-mono text-4xl font-bold tabular-nums text-ink-950 md:text-5xl">
              {parts ? parts[key] : "--"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-400">
              {label}
            </span>
          </div>
        ))}
      </div>
      {!confirmed && (
        <p className="mt-3 text-center text-xs text-ink-400">
          Target date — the final date is announced through official channels.
        </p>
      )}
    </div>
  );
}
