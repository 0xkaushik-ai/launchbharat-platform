"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated counter. When `value` is null (CMS placeholder), the placeholder
 * pattern (e.g. "XX,XXX") renders verbatim — never a fake number.
 */
export default function Counter({
  value,
  placeholder,
  suffix = "",
  duration = 650,
  className = "",
}: {
  value: number | null;
  placeholder: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value === null ? placeholder : "0");

  useEffect(() => {
    if (value === null) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value.toLocaleString("en-IN"));
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(eased * value).toLocaleString("en-IN"));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span
      ref={ref}
      className={`tabular-nums ${className}`}
      title={value === null ? "Placeholder — set via CMS" : undefined}
    >
      {display}
      {suffix}
    </span>
  );
}
