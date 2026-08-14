"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import IndiaDotMap from "@/components/india/IndiaDotMap";

/**
 * Leadership portrait framed by the existing LaunchBharat national-network
 * language. The label is deliberately factual and does not claim endorsement.
 */
export default function HeroVisual({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

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
      el.style.transform = `scale(${1 - progress * 0.045}) translateY(${progress * 16}px)`;
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
    <div
      ref={wrapRef}
      className={`relative isolate mx-auto min-h-[28rem] max-w-[34rem] will-change-transform sm:min-h-[34rem] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-20 h-[84%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-400/35 via-iris-400/25 to-orchid-400/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -left-[8%] top-[7%] -z-10 w-[63%] rotate-[-7deg] opacity-30 sm:-left-[13%] sm:w-[68%]"
      >
        <IndiaDotMap
          step={1.2}
          showOutline
          showDots
          dotClassName="fill-cyan-500/40"
          className="h-auto w-full drop-shadow-[0_16px_28px_rgba(124,58,237,0.18)]"
        />
      </div>

      <span className="glass absolute left-0 top-[16%] z-20 inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-ink-600 shadow-lg sm:text-[10px] sm:tracking-[0.18em]">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-gradient-to-br from-cyan-400 to-iris-500 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
        />
        India · innovation · impact
      </span>

      <div className="hero-portrait-shell absolute right-0 top-0 z-10 w-[82%] rounded-[2rem] p-2.5 sm:w-[78%] sm:rounded-[2.5rem] sm:p-3">
        <div className="relative aspect-[0.94] overflow-hidden rounded-[1.5rem] bg-paper sm:rounded-[2rem]">
          <Image
            src="/pm-modi.jpg"
            alt="Shri Narendra Modi, Prime Minister of India"
            fill
            sizes="(max-width: 640px) 82vw, (max-width: 1024px) 55vw, 34vw"
            className="object-cover object-top"
            priority
            unoptimized
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(11,16,32,0.12)_62%,rgba(11,16,32,0.9)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-300 via-white to-orchid-300"
          />

          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <p className="font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-cyan-200 sm:text-[10px]">
              Prime Minister of India
            </p>
            <p className="mt-1.5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Shri Narendra Modi
            </p>
          </div>
        </div>
      </div>

      <div className="hero-vision-card absolute bottom-[2%] left-[2%] z-20 w-[72%] rounded-2xl px-4 py-4 sm:bottom-[5%] sm:w-[68%] sm:px-5 sm:py-5">
        <p className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-iris-600">
          A national movement
        </p>
        <p className="mt-2 font-display text-base font-semibold leading-snug text-ink-950 sm:text-lg">
          Ideas from every campus. Impact across Bharat.
        </p>
        <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-ink-600 sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
          Applications are open
        </div>
      </div>

      <span className="glass absolute bottom-[18%] right-[-1%] z-20 hidden items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-ink-600 shadow-lg sm:inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-orchid-400 shadow-[0_0_8px_rgba(232,121,249,0.7)]" />
        12-city national tour
      </span>
    </div>
  );
}
