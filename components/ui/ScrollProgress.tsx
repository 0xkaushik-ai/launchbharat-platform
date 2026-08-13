"use client";

import { useEffect, useState } from "react";

/** Thin brand-gradient progress bar across the top of the viewport. */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-saffron-500 via-white to-green-500 shadow-[0_0_12px_rgba(234,124,12,0.5)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
