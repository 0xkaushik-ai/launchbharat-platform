import type { Metadata } from "next";
import EcosystemOrbit from "@/components/home/EcosystemOrbit";
import Mentors from "@/components/home/Mentors";
import WhoShouldJoin from "@/components/home/WhoShouldJoin";
import { Button, Container, Eyebrow, Reveal } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ecosystem",
  description:
    "How LaunchBharat connects colleges, startups, incubators, mentors, investors and industry into one national chain from campus to capital.",
};

const CHAIN = [
  "Colleges",
  "Startups",
  "Incubators",
  "Mentors",
  "Investors",
  "Industry",
];

export default function EcosystemPage() {
  return (
    <>
      {/* Compact light hero */}
      <section
        aria-labelledby="ecosystem-hero-heading"
        className="relative overflow-hidden bg-white py-16 md:py-24"
      >
        <div aria-hidden="true" className="aurora-wash pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Eyebrow withRule>The Ecosystem</Eyebrow>
          <h1
            id="ecosystem-hero-heading"
            className="display-lg mt-5 max-w-4xl text-ink-950"
          >
            Campus to capital,{" "}
            <span className="text-gradient-brand">connected.</span>
          </h1>
          <p className="lede mt-5 max-w-2xl">
            Ideas begin on campus and scale through the ecosystem. Colleges
            surface talent, startups give it form, incubators and mentors
            sharpen it, and investors and industry carry it to market — one
            continuous chain, built to move.
          </p>

          {/* The chain — horizontal scrollable pill sequence */}
          <ol className="mt-10 flex items-center gap-3 overflow-x-auto whitespace-nowrap pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CHAIN.map((stage, i) => (
              <li key={stage} className="flex shrink-0 items-center gap-3">
                <span className="chip-mono px-3.5 py-1.5">{stage}</span>
                {i < CHAIN.length - 1 && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-iris-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      d="M4 12h16m0 0-5-5m5 5-5 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <EcosystemOrbit />
      <WhoShouldJoin />

      {/* Mentors anchor */}
      <section id="mentors" className="scroll-mt-24">
        <Mentors />
      </section>

      {/* Closing CTA band */}
      <section
        aria-labelledby="ecosystem-cta-heading"
        className="section-pad relative overflow-hidden bg-mist"
      >
        <Container className="relative text-center">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <div className="tricolor-rule w-20" aria-hidden="true" />
            <h2 id="ecosystem-cta-heading" className="display-md text-ink-950">
              Take your place in the{" "}
              <span className="text-gradient-brand">movement.</span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-ink-800">
              Register as a participant or partner with the platform — the
              chain from campus to capital is stronger with you in it.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Button href="/register" variant="primary">
                Register now
              </Button>
              <Button href="/partners" variant="secondary">
                Become a partner
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
