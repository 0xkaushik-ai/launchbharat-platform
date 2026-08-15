import Link from "next/link";
import {
  Button,
  Container,
  GlowCard,
  Reveal,
  SectionHeading,
} from "@/components/ui";
import { getWho } from "@/lib/content";

/** Ids that route to registration; everyone else routes to partnership contact. */
const REGISTER_IDS = new Set([
  "students",
  "student-founders",
  "innovators",
  "startups",
]);

function hrefFor(id: string): string {
  return REGISTER_IDS.has(id) ? "/register" : "/contact";
}

export default function WhoShouldJoin() {
  const who = getWho();

  return (
    <section
      aria-labelledby="who-should-join-heading"
      className="section-pad bg-white"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="who-should-join-heading"
            number="02"
            eyebrow="Choose your path"
            title={
              <>
                A national platform for every{" "}
                <span className="text-gradient-brand">kind of builder</span>.
              </>
            }
            lede="Whether you are starting with a question, building a company, or helping others move forward, there is a clear way to take part."
          />
        </Reveal>

        {/* Mobile swipe hint */}
        <p aria-hidden="true" className="chip-mono mt-8 lg:hidden">
          Swipe
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              d="M4 12h16m0 0-6-6m6 6-6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>

        <Reveal delay={1}>
          <ul className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-12 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
            {who.map((item, i) => (
              <li
                key={item.id}
                className="flex min-w-[78%] snap-start sm:min-w-[45%] lg:min-w-0"
              >
                <GlowCard className="card-hover flex w-full flex-col rounded-2xl border border-line bg-white p-6">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs font-medium tabular-nums tracking-widest text-ink-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-3 text-lg font-semibold text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-800">
                    {item.text}
                  </p>
                  <div className="mt-6 flex flex-1 items-end border-t border-line pt-4">
                    <Link
                      href={hrefFor(item.id)}
                      className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-600 transition-colors hover:text-iris-600"
                    >
                      How you take part
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <path
                          d="M4 12h16m0 0-6-6m6 6-6 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </div>
                </GlowCard>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={2} className="mt-12 flex justify-center">
          <Button href="/register" variant="outline-dark">
            Find your path
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
