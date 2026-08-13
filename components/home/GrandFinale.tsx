import { getGrandFinale } from "@/lib/content";
import { Button, Container, Reveal, SectionHeading } from "@/components/ui";
import Countdown from "@/components/Countdown";

/**
 * Abstract stage graphic — a wide horizon line with perspective beams
 * converging on a center stage point. Sky pastel beams with a single iris
 * accent beam. Decorative only.
 */
export function StageBeams({ className = "" }: { className?: string }) {
  const beamTargets = [-80, 90, 260, 430, 770, 940, 1110, 1280];
  return (
    <svg
      viewBox="0 0 1200 400"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
      className={className}
    >
      <g className="text-blue-800/40" stroke="currentColor" strokeWidth="1">
        {/* horizon */}
        <line x1="0" y1="320" x2="1200" y2="320" />
        {/* beams rising from the stage point */}
        {beamTargets.map((x) => (
          <line key={x} x1="600" y1="320" x2={x} y2="0" />
        ))}
        {/* perspective floor lines */}
        <line x1="90" y1="352" x2="1110" y2="352" className="text-blue-800/25" />
        <line x1="200" y1="384" x2="1000" y2="384" className="text-blue-800/15" />
      </g>
      {/* single iris accent beam + stage point */}
      <g className="text-saffron-600/60" stroke="currentColor" strokeWidth="1">
        <line x1="600" y1="320" x2="600" y2="0" />
      </g>
      {/* slow pulse on the center beam — cap + stage point */}
      <circle
        cx="600"
        cy="8"
        r="3"
        className="animate-pulse-dot origin-center fill-saffron-500/70 [transform-box:fill-box]"
      />
      <circle
        cx="600"
        cy="320"
        r="2.5"
        className="animate-pulse-dot origin-center fill-saffron-600/70 [transform-box:fill-box]"
      />
    </svg>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className={className}
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 2.75V6.5M16 2.75V6.5" />
    </svg>
  );
}

function VenueIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className={className}
    >
      <path d="M4 20.5h16M4.5 10h15M5 10 12 4.5 19 10M6.5 10v10.5M11 10v10.5M13 10v10.5M17.5 10v10.5" />
    </svg>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className={className}
    >
      <path d="M12 21.25S5.25 15.6 5.25 10.25a6.75 6.75 0 1 1 13.5 0c0 5.35-6.75 11-6.75 11Z" />
      <circle cx="12" cy="10.25" r="2.5" />
    </svg>
  );
}

/** Date / venue / city meta chips. Light glassy pills. */
export function FinaleMeta({ className = "" }: { className?: string }) {
  const gf = getGrandFinale();
  const items = [
    {
      label: gf.dateConfirmed
        ? gf.dateDisplay
        : `${gf.dateDisplay} (to be confirmed)`,
      icon: <CalendarIcon className="h-4 w-4 shrink-0 text-saffron-600/80" />,
    },
    {
      label: gf.venue,
      icon: <VenueIcon className="h-4 w-4 shrink-0 text-saffron-600/80" />,
    },
    {
      label: gf.city,
      icon: <PinIcon className="h-4 w-4 shrink-0 text-saffron-600/80" />,
    },
  ];
  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-2.5 ${className}`}
    >
      {items.map(({ label, icon }) => (
        <li
          key={label}
          className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 px-4 py-2 text-sm text-ink-800 backdrop-blur"
        >
          {icon}
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Home section 09 — the Grand Finale. The one section allowed a gold hint. */
export default function GrandFinale() {
  const gf = getGrandFinale();

  return (
    <section
      aria-labelledby="grand-finale-heading"
      className="relative overflow-hidden bg-slate-50"
    >
      {/* soft aurora backdrop + ambient orbs */}
      <div aria-hidden="true" className="hidden" />
      <div
        aria-hidden="true"
        className="hidden"
        style={{ width: 460, height: 460, top: -140, left: -160 }}
      />
      <div
        aria-hidden="true"
        className="hidden"
        style={{ width: 400, height: 400, bottom: -140, right: -120 }}
      />

      <div className="section-pad relative">
        <Container>
          <Reveal>
            <SectionHeading
              id="grand-finale-heading"
              number="09"
              eyebrow="The Grand Finale"
              title={
                <>
                  The Grand{" "}
                  <span className="text-green-700">Finale.</span>
                  <span className="display-md mt-4 block">
                    <span className="text-saffron-600">
                      From ideas to impact.
                    </span>
                  </span>
                </>
              }
              lede={gf.description}
              align="center"
              className="mx-auto"
            />
          </Reveal>

          {/* Countdown over the abstract stage graphic */}
          <div className="relative mx-auto mt-16 max-w-4xl">
            <StageBeams className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70" />
            <div className="relative">
              <Reveal delay={1}>
                <Countdown
                  target={gf.date}
                  confirmed={gf.dateConfirmed}
                  className="mx-auto max-w-2xl"
                />
              </Reveal>
              <Reveal delay={2}>
                <FinaleMeta className="mt-10" />
              </Reveal>
            </div>
          </div>

          {/* Tracks — chip pills */}
          <Reveal delay={2}>
            <ul
              aria-label="Finale tracks"
              className="mt-14 flex flex-wrap items-center justify-center gap-3"
            >
              {gf.tracks.map((track) => (
                <li key={track}>
                  <span className="chip-mono">{track}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Awards teaser */}
          <Reveal delay={2}>
            <div className="mx-auto mt-16 max-w-5xl">
              <p className="text-center font-mono text-[11px] uppercase tracking-[0.28em] text-ink-400">
                Honours of the national stage
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {gf.awards.map((award, i) => (
                  <div
                    key={award.title}
                    className="card-hover relative h-full overflow-hidden rounded-2xl border border-line bg-white p-6"
                  >
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
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {award.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={3}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
              <Button href="/grand-finale" variant="primary" size="lg">
                Enter the Grand Finale
              </Button>
              <Button href="/register" variant="secondary" size="lg">
                Register to compete
              </Button>
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
