import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Container,
  Eyebrow,
  GlowCard,
  Reveal,
  SectionHeading,
} from "@/components/ui";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "What LaunchBharat is, how the movement works and who is behind it — a nationwide startup and innovation movement for India's next generation of entrepreneurs.",
  alternates: { canonical: "/about" },
};

const involvementLinks = [
  {
    href: "/register",
    title: "Join the movement",
    text: "Apply as a student, founder, innovator or early-stage startup.",
  },
  {
    href: "/partners",
    title: "Partner with us",
    text: "Institutions, incubators, investors and industry — bring the ecosystem to campus.",
  },
  {
    href: "/contact",
    title: "Talk to the team",
    text: "Questions, hosting, media or anything else — write to the coordination team.",
  },
];

export default function AboutPage() {
  const site = getSite();

  return (
    <>
      {/* Page hero */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative overflow-hidden bg-slate-50 py-20 md:py-28"
      >
        <div aria-hidden="true" className="hidden" />
        <div
          aria-hidden="true"
          className="hidden"
        />
        <div
          aria-hidden="true"
          className="hidden"
        />
        <Container className="relative">
          <div className="flex max-w-3xl flex-col items-start gap-5">
            <Eyebrow>About</Eyebrow>
            <h1 id="about-hero-heading" className="display-lg text-ink-950">
              A movement for India&apos;s{" "}
              <span className="text-saffron-600">next founders</span>.
            </h1>
            <p className="lede">{site.description}</p>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section aria-labelledby="about-mission-heading" className="section-pad bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <Reveal>
              <SectionHeading
                id="about-mission-heading"
                number="01"
                eyebrow="Mission"
                size="md"
                title={
                  <>
                    Bring the{" "}
                    <span className="text-green-700">ecosystem</span> to the
                    campus.
                  </>
                }
              />
            </Reveal>
            <Reveal delay={1} className="max-w-prose space-y-5 leading-relaxed text-ink-800">
              <p>
                India does not lack talent, ideas or ambition. What it lacks —
                especially outside a handful of metros — is proximity: to
                mentors who have built before, to institutions that can
                incubate, to investors who back early conviction, and to
                industry that can turn a prototype into a product.
              </p>
              <p>
                LaunchBharat exists to close that distance. The movement
                connects students, ideas, institutions, mentors, investors and
                industry into one national pathway, so that a promising idea in
                any city has the same route forward as one born next door to an
                incubator.
              </p>
              <p>
                {site.tagline} Four words, one promise: discover the people
                with ideas, empower them to develop those ideas, connect them
                to the ecosystem, and launch the strongest onto a national
                stage.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Pull quote */}
      <section aria-label="Brand statement" className="bg-mist py-16 md:py-20">
        <Container>
          <Reveal
            as="figure"
            className="glass mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-3xl p-8 md:p-12"
          >
            <span aria-hidden="true" className="tricolor-rule w-20" />
            <blockquote className="display-md text-ink-950">
              {site.headline}
            </blockquote>
          </Reveal>
        </Container>
      </section>

      {/* What it is / what it is not */}
      <section aria-labelledby="about-what-heading" className="section-pad bg-white">
        <Container>
          <Reveal>
            <SectionHeading
              id="about-what-heading"
              number="02"
              eyebrow="Definition"
              size="md"
              title={
                <>
                  What LaunchBharat{" "}
                  <span className="text-saffron-600">is</span> — and what it
                  is not.
                </>
              }
            />
          </Reveal>
          <div className="mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
            <Reveal delay={1}>
              <GlowCard className="neo-border card-hover h-full rounded-3xl bg-white p-8">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-green-600">
                  What it is
                </h3>
                <ul className="mt-5 space-y-4 text-ink-800">
                  <li className="leading-relaxed">
                    <strong className="font-semibold text-ink-950">
                      A nationwide movement.
                    </strong>{" "}
                    Campus roadshows, bootcamps, regional pitch days and a
                    national Grand Finale — one connected journey across India.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="font-semibold text-ink-950">
                      An ecosystem, working together.
                    </strong>{" "}
                    Institutions, mentors, incubators, investors and industry
                    aligned around the same participants.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="font-semibold text-ink-950">
                      Built at national scale.
                    </strong>{" "}
                    Designed to reach metros, tier-2 and tier-3 cities alike — the
                    stage judges the idea, not the pincode.
                  </li>
                </ul>
              </GlowCard>
            </Reveal>
            <Reveal delay={2}>
              <GlowCard className="card-hover h-full rounded-3xl border border-line bg-white p-8">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
                  What it is not
                </h3>
                <ul className="mt-5 space-y-4 text-ink-800">
                  <li className="leading-relaxed">
                    <strong className="font-semibold text-ink-950">
                      Not a single event.
                    </strong>{" "}
                    The Grand Finale is the culmination, not the whole. The work
                    happens across months, on campuses, in every region.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="font-semibold text-ink-950">
                      Not a college fest.
                    </strong>{" "}
                    There are no gimmicks and no manufactured hype — participants
                    get structure, mentorship and honest evaluation.
                  </li>
                  <li className="leading-relaxed">
                    <strong className="font-semibold text-ink-950">
                      Not fabricated credibility.
                    </strong>{" "}
                    Every partner, mentor and association on this platform is
                    verified before it appears. Nothing here is invented.
                  </li>
                </ul>
              </GlowCard>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section aria-labelledby="about-how-heading" className="section-pad bg-mist">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <Reveal>
              <SectionHeading
                id="about-how-heading"
                number="03"
                eyebrow="How it works"
                size="md"
                title={
                  <>
                    One journey,{" "}
                    <span className="text-saffron-600">six stages</span>.
                  </>
                }
              />
            </Reveal>
            <Reveal delay={1} className="max-w-prose">
              <div className="space-y-5 leading-relaxed text-ink-800">
                <p>
                  The movement follows a deliberate arc: discover promising ideas
                  on campuses and in communities, develop them through structured
                  programs and honest feedback, connect participants with mentors
                  and ecosystem leaders, validate ideas against industry reality,
                  scale the strongest toward incubators and investors, and launch
                  them on the national stage.
                </p>
                <p>
                  Participants advance through campus and regional programs; the
                  strongest ideas are invited to the Grand Finale. Every stage is
                  open to people at the very beginning — an idea, or even
                  curiosity, is enough to start.
                </p>
              </div>
              <div className="mt-8">
                <Button href="/movement" variant="secondary">
                  Explore the movement
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Who is behind it */}
      <section aria-labelledby="about-who-heading" className="section-pad bg-white">
        <Container>
          <Reveal className="max-w-prose">
            <SectionHeading
              id="about-who-heading"
              number="04"
              eyebrow="The team"
              size="md"
              title={
                <>
                  Who is <span className="text-green-700">behind it</span>.
                </>
              }
            />
            <div className="mt-6 space-y-5 leading-relaxed text-ink-800">
              <p>
                LaunchBharat is an initiative operated by the LaunchBharat team
                together with collaborators from across India&apos;s startup
                ecosystem — campuses, incubators, mentors, investors and
                industry.
              </p>
              <p>
                The movement is built on a simple standard: every association,
                partner and mentor named on this platform reflects a verified,
                formal relationship. As institutional partnerships are
                confirmed, they are announced here and on the{" "}
                <Link
                  href="/partners"
                  className="font-semibold text-saffron-600 underline-offset-4 hover:underline"
                >
                  Partners
                </Link>{" "}
                page — never before.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Get involved */}
      <section
        aria-labelledby="about-involved-heading"
        className="section-pad relative overflow-hidden bg-slate-50"
      >
        <div aria-hidden="true" className="hidden" />
        <div
          aria-hidden="true"
          className="hidden"
        />
        <Container className="relative">
          <Reveal>
            <SectionHeading
              id="about-involved-heading"
              number="05"
              eyebrow="Get involved"
              size="md"
              title={
                <>
                  The movement needs{" "}
                  <span className="text-saffron-600">every role</span>.
                </>
              }
            />
          </Reveal>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {involvementLinks.map((item, i) => (
              <Reveal
                as="li"
                key={item.href}
                delay={Math.min(i + 1, 3) as 1 | 2 | 3}
                className="h-full"
              >
                <GlowCard className="glass glass-hover h-full rounded-3xl">
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col gap-3 rounded-3xl p-8"
                  >
                    <span
                      aria-hidden="true"
                      className="font-mono text-[11px] tabular-nums tracking-widest text-ink-400"
                    >
                      0{i + 1}
                    </span>
                    <span className="flex items-center justify-between gap-4">
                      <span className="font-display text-lg font-semibold text-ink-950">
                        {item.title}
                      </span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="h-5 w-5 shrink-0 text-saffron-600 transition group-hover:translate-x-1"
                      >
                        <path
                          d="M5 12h14m0 0-6-6m6 6-6 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed text-ink-800">
                      {item.text}
                    </span>
                  </Link>
                </GlowCard>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
