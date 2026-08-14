import type { CSSProperties } from "react";
import { Container, Counter, Reveal } from "@/components/ui";
import { getStats } from "@/lib/content";

/**
 * National impact strip — a floating frosted-glass panel with a gradient
 * hairline border that overlaps the hero bottom. Values come from the CMS
 * (content/stats.json); null values render their placeholder pattern,
 * never invented numbers.
 */
export default function ImpactStats() {
  const stats = getStats();

  return (
    <section
      aria-labelledby="impact-heading"
      className="relative z-10 -mt-16 md:-mt-20"
    >
      <h2 id="impact-heading" className="sr-only">
        National impact
      </h2>
      <Container>
        <div
          className="glass neo-border rounded-3xl px-6 py-10 sm:px-10 md:px-14 md:py-12"
          style={{ "--neo-bg": "rgba(255,255,255,0.84)" } as CSSProperties}
        >
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5 md:gap-x-0 md:divide-x md:divide-line">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.id}
                delay={Math.min(i, 3) as 0 | 1 | 2 | 3}
                className={`flex flex-col gap-2 md:px-6 md:first:pl-0 md:last:pr-0 ${
                  i === stats.length - 1 && stats.length % 2 === 1
                    ? "col-span-2 md:col-span-1"
                    : ""
                }`}
              >
                <dt className="order-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ink-600">
                  {stat.label}
                </dt>
                <dd className="order-1">
                  <Counter
                    value={stat.value}
                    placeholder={stat.placeholder}
                    suffix={stat.suffix}
                    className="font-mono text-4xl font-bold text-ink-950 md:text-5xl"
                  />
                </dd>
              </Reveal>
            ))}
          </dl>
          <p className="mt-10 border-t border-line pt-4 text-xs text-ink-400">
            Movement metrics are published as they are verified.
          </p>
        </div>
      </Container>
    </section>
  );
}
