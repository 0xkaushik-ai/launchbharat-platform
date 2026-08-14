import type { Metadata } from "next";
import { getGrandFinale } from "@/lib/content";
import {
  Button,
  Container,
  Eyebrow,
  GlowCard,
  Reveal,
  SectionHeading,
} from "@/components/ui";
import Countdown from "@/components/Countdown";
import { FinaleMeta, StageBeams } from "@/components/home/GrandFinale";

export const metadata: Metadata = {
  title: "Grand Finale",
  description:
    "The culmination of the LaunchBharat movement — India's most promising founders, mentors, investors and institutions on one national stage.",
};

/* ——— The Stage: confident copy per CMS track, with a safe fallback ——— */

const TRACK_COPY: Record<string, string> = {
  "National finals":
    "The strongest teams from regional pitch days compete live before a national jury. One champion is decided in the open, on merit alone.",
  "Founder & investor summit":
    "Founders, operators and investors share one room for a day of direct, unhurried conversation. Capital meets conviction without the noise.",
  "Ecosystem exhibition":
    "Institutions, incubators and student ventures exhibit side by side on the national floor. A working snapshot of India's emerging innovation economy.",
  "Awards & recognition":
    "The movement's highest honours are conferred on the finale stage. Recognition that stays with founders, campuses and partners long after the lights dim.",
};

const TRACK_FALLBACK =
  "A dedicated arena within the finale programme. Full details are published through official channels ahead of the event.";

const JURY_ROLES = [
  "Founder",
  "Investor",
  "Academic",
  "Policymaker",
  "Operator",
  "Industry Leader",
];

const ROAD_STEPS = [
  {
    title: "Advance from regional pitch days",
    text: "Compete at LaunchBharat events in your city or on your campus. The strongest teams from every region move forward.",
  },
  {
    title: "Make the national shortlist",
    text: "Regional winners are measured against a single national bar. The shortlist is announced through official channels.",
  },
  {
    title: "Take the finale stage",
    text: "Shortlisted teams pitch live before the national jury, with the movement's highest honours decided on the spot.",
  },
];

/** Subtle abstract mark for to-be-announced jury plates. */
function JuryMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      strokeWidth={1.5}
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="24"
        cy="24"
        r="11"
        stroke="currentColor"
        className="text-ink-400"
      />
      <path
        d="M24 5a19 19 0 0 1 19 19"
        stroke="currentColor"
        className="text-saffron-600"
      />
      <path
        d="M24 43A19 19 0 0 1 5 24"
        stroke="currentColor"
        className="text-blue-800"
      />
    </svg>
  );
}

export default function GrandFinalePage() {
  const gf = getGrandFinale();

  return (
    <>
      {/* ——— Hero ——— */}
      <section
        aria-labelledby="gf-hero-title"
        className="relative overflow-hidden bg-white"
      >
        {/* soft aurora backdrop + ambient orbs + watermark */}
        <div aria-hidden="true" className="hidden" />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 480, height: 480, top: -160, left: -160 }}
        />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 420, height: 420, bottom: -160, right: -140 }}
        />
        <span
          aria-hidden="true"
          className="text-outline font-display pointer-events-none absolute left-1/2 top-14 -translate-x-1/2 select-none font-bold leading-none whitespace-nowrap"
          style={{ fontSize: "clamp(5.5rem, 17vw, 16rem)", letterSpacing: "-0.02em" }}
        >
          Finale
        </span>
        <div className="grid-texture relative">
          <Container className="pb-24 pt-24 md:pb-32 md:pt-36">
            <div className="relative">
              <StageBeams className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[135%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-50" />
              <Reveal className="relative flex flex-col items-center gap-6 text-center">
                <Eyebrow>The national stage</Eyebrow>
                <h1 id="gf-hero-title" className="display-xl text-ink-950">
                  The Grand{" "}
                  <span className="text-green-700">Finale.</span>
                </h1>
                <p className="display-md">
                  <span className="text-saffron-600">
                    From ideas to impact.
                  </span>
                </p>
                <p className="lede max-w-2xl">{gf.description}</p>
                <Countdown
                  target={gf.date}
                  confirmed={gf.dateConfirmed}
                  className="mt-8 w-full max-w-2xl"
                />
                <FinaleMeta className="mt-6" />
                <p className="chip-mono mt-2">
                  12 cities // one national stage
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                  <Button href="/register" variant="primary" size="lg">
                    Register to compete
                  </Button>
                  <Button href="/partners" variant="secondary" size="lg">
                    Partner with the finale
                  </Button>
                </div>
              </Reveal>
            </div>
          </Container>
        </div>
      </section>

      {/* ——— The stage ——— */}
      <section
        aria-labelledby="gf-stage-heading"
        className="section-pad bg-mist"
      >
        <Container>
          <Reveal>
            <SectionHeading
              id="gf-stage-heading"
              eyebrow="The stage"
              title={
                <>
                  Four arenas.{" "}
                  <span className="text-saffron-600">One stage.</span>
                </>
              }
              lede="The finale runs on four tracks — competition, capital, exhibition and recognition — each built to a national standard."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {gf.tracks.map((track, i) => (
              <Reveal
                key={track}
                delay={Math.min(i, 3) as 0 | 1 | 2 | 3}
                className="h-full"
              >
                <GlowCard className="h-full">
                  <article className="glass glass-hover h-full rounded-3xl p-8">
                    <div className="flex items-baseline gap-4">
                      <span
                        aria-hidden="true"
                        className="font-mono text-sm font-medium tabular-nums tracking-widest text-ink-400"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-ink-950">
                        {track}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ink-800">
                      {TRACK_COPY[track] ?? TRACK_FALLBACK}
                    </p>
                  </article>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ——— Awards ——— */}
      <section
        aria-labelledby="gf-awards-heading"
        className="section-pad bg-white"
      >
        <Container>
          <Reveal>
            <SectionHeading
              id="gf-awards-heading"
              eyebrow="Awards"
              title={
                <>
                  Honours of the{" "}
                  <span className="text-green-700">national stage.</span>
                </>
              }
              lede="Conferred once a year, in the open, before the entire movement."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gf.awards.map((award, i) => (
              <Reveal key={award.title} delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
                <div className="card-hover relative h-full overflow-hidden rounded-2xl border border-line bg-white p-8">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gold-500/40"
                  />
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs font-medium tabular-nums tracking-widest text-ink-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-3 text-base font-semibold text-ink-950">
                    {award.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">
                    {award.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-xs text-ink-400">
            Award categories are managed via the CMS and finalised ahead of the
            finale.
          </p>
        </Container>
      </section>

      {/* ——— Speakers & jury ——— */}
      <section
        aria-labelledby="gf-jury-heading"
        className="section-pad bg-slate-50"
      >
        <Container>
          <Reveal>
            <SectionHeading
              id="gf-jury-heading"
              eyebrow="Speakers & jury"
              title={
                <>
                  The national{" "}
                  <span className="text-saffron-600">jury.</span>
                </>
              }
              lede="Founders, investors, academics and industry leaders from across the ecosystem judge the finale and take the stage."
              align="center"
              className="mx-auto"
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
            {JURY_ROLES.map((role, i) => (
              <Reveal key={role} delay={Math.min(i % 4, 3) as 0 | 1 | 2 | 3}>
                <div className="glass glass-hover flex h-full flex-col items-center gap-4 rounded-2xl px-4 py-10 text-center">
                  <JuryMark className="h-11 w-11" />
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-ink-950">
                    {role}
                  </p>
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-600">
                    <span
                      aria-hidden="true"
                      className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-saffron-500"
                    />
                    To be announced
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-10 text-center text-sm text-ink-600">
              The national jury and speaker lineup is announced closer to the
              finale.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ——— The road here ——— */}
      <section
        aria-labelledby="gf-road-heading"
        className="section-pad bg-paper"
      >
        <Container>
          <Reveal>
            <SectionHeading
              id="gf-road-heading"
              eyebrow="The road here"
              title={
                <>
                  Earn your place{" "}
                  <span className="text-green-700">on the stage.</span>
                </>
              }
              lede="There are no wildcard entries. Every finalist advances through the movement."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {ROAD_STEPS.map((step, i) => (
              <Reveal
                key={step.title}
                delay={Math.min(i, 3) as 0 | 1 | 2 | 3}
                className="h-full"
              >
                <article className="card-hover h-full rounded-2xl border border-line bg-white p-8">
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm font-medium tabular-nums tracking-widest text-ink-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-3 text-lg font-semibold tracking-tight text-ink-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-800">
                    {step.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={1}>
            <div className="mt-14 flex flex-wrap items-center gap-4">
              <Button href="/events" variant="outline-dark" size="md">
                See regional events
              </Button>
              <Button href="/register" variant="primary" size="md">
                Register now
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ——— Closing CTA ——— */}
      <section
        aria-labelledby="gf-cta-heading"
        className="relative overflow-hidden bg-mist"
      >
        <div aria-hidden="true" className="hidden" />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 440, height: 440, top: -150, left: -130 }}
        />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 380, height: 380, bottom: -130, right: -110 }}
        />
        <div className="section-pad relative">
          <Container>
            <Reveal className="flex flex-col items-center gap-8 text-center">
              <span aria-hidden="true" className="tricolor-rule w-20" />
              <h2
                id="gf-cta-heading"
                className="display-lg max-w-4xl text-ink-950"
              >
                One national stage.{" "}
                <span className="text-saffron-600">
                  One founding cohort.
                </span>
              </h2>
              <Button href="/register" variant="primary" size="lg">
                Register to compete
              </Button>
            </Reveal>
          </Container>
        </div>
      </section>
    </>
  );
}
