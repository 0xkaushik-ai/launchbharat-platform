import type { CSSProperties } from "react";
import {
  Button,
  Container,
  Reveal,
  SectionHeading,
  TerminalCard,
} from "@/components/ui";
import IndiaDotMap from "@/components/india/IndiaDotMap";
import { cityXY } from "@/lib/india";

const MEANS = [
  "Discovery that reaches beyond the metros — every campus is a starting line.",
  "Structured development and honest feedback for every serious idea.",
  "Direct access to mentors, founders and ecosystem stakeholders.",
  "A defined pathway from a first campus pitch to the national stage.",
];

/** The 12 tour stops plotted on the map — Chandigarh stands in for the Punjab stop. */
const TOUR_MAP_CITIES = [
  "Chandigarh",
  "Delhi NCR",
  "Jaipur",
  "Ahmedabad",
  "Pune",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Indore",
  "Kanpur",
  "Kolkata",
  "Guwahati",
];

const MARKER_FILLS = ["fill-blue-800", "fill-saffron-600", "fill-green-600"];
const HALO_FILLS = [
  "fill-blue-800/25",
  "fill-saffron-500/25",
  "fill-green-600/25",
];

function ArrowBullet() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-4 w-4 shrink-0 text-iris-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 12h14" />
      <path d="m13 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  );
}

export default function Movement() {
  const stops = TOUR_MAP_CITIES.flatMap((name) => {
    const p = cityXY(name);
    return p ? [{ name, ...p }] : [];
  });
  let routeLength = 0;
  for (let i = 1; i < stops.length; i++) {
    routeLength += Math.hypot(
      stops[i].x - stops[i - 1].x,
      stops[i].y - stops[i - 1].y,
    );
  }
  routeLength = Math.ceil(routeLength);

  return (
    <section
      aria-labelledby="movement-heading"
      className="section-pad relative overflow-hidden bg-white"
    >
      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Editorial copy */}
          <Reveal className="flex flex-col gap-8">
            <SectionHeading
              id="movement-heading"
              number="02"
              eyebrow="The Movement"
              title={
                <>
                  More than an{" "}
                  <span className="text-gradient-brand">event</span>.
                </>
              }
              lede="It is a movement designed to bring India's startup ecosystem closer to the campus."
            />

            <div className="space-y-5 text-base leading-relaxed text-ink-800">
              <p>
                LaunchBharat exists to find promising students and early ideas
                wherever they are — and to take them seriously. Across campuses
                and cities, the movement discovers young innovators, gives their
                thinking structure, and provides real opportunities to develop
                an idea into something that stands on its own.
              </p>
              <p>
                Around every participant, it assembles a working ecosystem:
                mentors who have founded and scaled before, institutions that
                open their doors, and industry and investment stakeholders who
                engage with ideas on their merit.
              </p>
              <p>
                And it gives all of that a direction — a set of pathways that
                lead from a first pitch on campus toward the national stage.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-950">
                What that means
              </h3>
              <ul className="mt-5 space-y-3.5">
                {MEANS.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <ArrowBullet />
                    <span className="text-sm leading-relaxed text-ink-800">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Button href="/movement" variant="outline-dark">
                Inside the movement
              </Button>
            </div>
          </Reveal>

          {/* Map panel with the terminal card tucked beneath it */}
          <Reveal delay={1} className="relative">

            <div className="glass corner-frame relative rounded-3xl p-6 pt-14 sm:p-10 sm:pt-16">
              <span
                aria-hidden="true"
                className="chip-mono absolute right-5 top-5"
              >
                12 cities // 1 stage
              </span>
              <IndiaDotMap
                step={1.1}
                dotClassName="fill-blue-800/30"
                className="mx-auto h-auto w-full max-w-md"
              >
                <polyline
                  points={stops.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  strokeWidth={0.24}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray={routeLength}
                  className="animate-dash-draw stroke-saffron-600/25"
                  style={{ "--dash-length": routeLength } as CSSProperties}
                />
                {stops.map((stop, i) => (
                  <g key={stop.name}>
                    <circle
                      cx={stop.x}
                      cy={stop.y}
                      r={1.3}
                      className={`animate-pulse-dot ${HALO_FILLS[i % 3]}`}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "center",
                      }}
                    />
                    <circle
                      cx={stop.x}
                      cy={stop.y}
                      r={0.5}
                      className={MARKER_FILLS[i % 3]}
                    />
                  </g>
                ))}
              </IndiaDotMap>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                <p className="font-display text-sm font-semibold text-ink-950">
                  One nation. One movement.
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-600">
                  National tour · 12 cities
                </p>
              </div>
            </div>

            <TerminalCard
              className="relative z-10 mx-auto -mt-10 w-[92%] max-w-sm sm:-mt-12 lg:mx-0 lg:ml-auto lg:mr-6"
              title="launchbharat.sh"
              lines={[
                { prompt: true, text: 'launchbharat init --idea "yours"' },
                { text: "→ scanning 12 tour cities…", accent: "saffron" },
                { text: "→ matching mentors + incubators…" },
                {
                  text: "✓ pathway created — see you on the national stage",
                  accent: "green",
                },
              ]}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
