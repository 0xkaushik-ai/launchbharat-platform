import type { ReactNode } from "react";
import { Container, GlowCard, Reveal, SectionHeading } from "@/components/ui";
import { getWhy, type WhyItem } from "@/lib/content";

const iconProps = {
  viewBox: "0 0 24 24",
  className: "h-6 w-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/* Six distinct line icons on a 24px grid. */
const ICONS: Record<WhyItem["icon"], ReactNode> = {
  discover: (
    // Magnifier with a spark
    <svg {...iconProps}>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m14.8 14.8 5.2 5.2" />
      <path d="M18.5 3.5v3" />
      <path d="M17 5h3" />
    </svg>
  ),
  empower: (
    // Rising figure, arms raised
    <svg {...iconProps}>
      <circle cx="12" cy="5.5" r="2.5" />
      <path d="M12 8.5V15" />
      <path d="M12 11 7.5 7.5" />
      <path d="m12 11 4.5-3.5" />
      <path d="m12 15-3.5 5.5" />
      <path d="m12 15 3.5 5.5" />
    </svg>
  ),
  connect: (
    // Linked network nodes
    <svg {...iconProps}>
      <circle cx="5.5" cy="6" r="2.25" />
      <circle cx="18.5" cy="8" r="2.25" />
      <circle cx="10" cy="18.5" r="2.25" />
      <path d="m7.7 6.3 8.6 1.4" />
      <path d="m6.3 8.1 2.9 8.3" />
      <path d="m17.1 9.8-5.7 6.9" />
    </svg>
  ),
  mentor: (
    // Compass — guidance
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z" />
    </svg>
  ),
  invest: (
    // Growth arrow
    <svg {...iconProps}>
      <path d="M3.5 18.5 9 13l3.5 3.5L20 9" />
      <path d="M15.5 9H20v4.5" />
    </svg>
  ),
  launch: (
    // Upward trajectory
    <svg {...iconProps}>
      <path d="M4 20c7-1.5 12.4-7.6 14.5-15" />
      <path d="M14.3 5.7 18.5 5l-.7 4.2" />
    </svg>
  ),
};

export default function WhyLaunchBharat() {
  const items = getWhy();

  return (
    <section aria-labelledby="why-heading" className="section-pad bg-white">
      <Container>
        <Reveal>
          <SectionHeading
            id="why-heading"
            number="06"
            eyebrow="Why LaunchBharat"
            title={
              <>
                Built to{" "}
                <span className="text-gradient-brand">open doors</span>.
              </>
            }
            lede="Six commitments define what the movement offers every participant — from first discovery to the national stage."
          />
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              as="li"
              delay={(i % 3) as 0 | 1 | 2}
              className="h-full"
            >
              <GlowCard className="card-hover h-full rounded-2xl border border-line bg-white">
                <article className="relative flex h-full flex-col p-8">
                  <span
                    aria-hidden="true"
                    className="absolute right-6 top-6 font-mono text-xs tracking-[0.2em] text-ink-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-orchid-400 text-iris-600"
                  >
                    {ICONS[item.icon]}
                  </span>
                  <h3 className="mt-7 font-display text-lg font-semibold text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-800">
                    {item.text}
                  </p>
                </article>
              </GlowCard>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
