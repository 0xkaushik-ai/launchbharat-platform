import { Container, Reveal, SectionHeading } from "@/components/ui";
import { getActiveAssociations } from "@/lib/content";

const iconProps = {
  viewBox: "0 0 24 24",
  className: "h-6 w-6 text-green-600",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const PRINCIPLES = [
  {
    title: "Verified associations only",
    text: "Every association shown on this platform carries formally approved wording — nothing is implied, nothing is assumed.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l7 3v5c0 4.6-2.9 7.7-7 9.2C7.9 18.7 5 15.6 5 11V6l7-3z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Institutional relationships",
    text: "We work with institutions, incubators, investors and industry through named, accountable relationships.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 21h18" />
        <path d="M5 21v-11M9.5 21v-11M14.5 21v-11M19 21v-11" />
        <path d="M3 10l9-6 9 6H3z" />
      </svg>
    ),
  },
  {
    title: "Formal partner onboarding",
    text: "Partners complete a written agreement before any name or mark is published anywhere on the platform.",
    icon: (
      <svg {...iconProps}>
        <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4z" />
        <path d="M14 3v4h4" />
        <path d="m9.5 14 2 2 3.5-3.5" />
      </svg>
    ),
  },
  {
    title: "No fabricated credibility",
    text: "No stock logos, no invented endorsements, no unverifiable numbers — here or on any page of this platform.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8" />
        <path d="m6.8 6.8 10.4 10.4" />
      </svg>
    ),
  },
];

export default function Trust() {
  const associations = getActiveAssociations("trust");

  return (
    <section
      aria-labelledby="trust-heading"
      className="border-y border-line bg-white py-14"
    >
      <Container>
        <SectionHeading
          id="trust-heading"
          number="13"
          eyebrow="Trust"
          size="md"
          title={
            <>
              Built around the{" "}
              <span className="text-green-700">ecosystem</span>.
            </>
          }
          lede="LaunchBharat operates on verified relationships — associations appear here only once formally approved."
        />

        {associations.length > 0 ? (
          <Reveal delay={1}>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {associations.map((a) => (
                <li
                  key={a.id}
                  className="card-hover rounded-2xl border border-line bg-paper p-6"
                >
                  <p className="text-base font-semibold text-ink-950">
                    {a.wording}
                  </p>
                  {a.attribution && (
                    <p className="mt-2 text-sm text-ink-600">{a.attribution}</p>
                  )}
                  <p className="mt-4 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-400">
                    {a.organization}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : (
          <Reveal delay={1}>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PRINCIPLES.map((principle) => (
                <li
                  key={principle.title}
                  className="card-hover rounded-2xl border border-line bg-white p-6"
                >
                  {principle.icon}
                  <h3 className="mt-4 font-display text-base font-semibold text-ink-950">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {principle.text}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
