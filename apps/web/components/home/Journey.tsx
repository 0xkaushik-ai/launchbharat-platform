import Link from "next/link";
import { Container, Reveal, SectionHeading } from "@/components/ui";
import { getJourney } from "@/lib/content";

export default function Journey() {
  const steps = getJourney();
  const lastIndex = steps.length - 1;

  return (
    <section
      aria-labelledby="journey-heading"
      className="section-pad relative overflow-hidden bg-mist"
    >
      <Container className="relative">
        <Reveal>
          <SectionHeading
            id="journey-heading"
            number="03"
            eyebrow="The LaunchBharat journey"
            title={
              <>
                Six stages. One{" "}
                <span className="text-gradient-brand">national stage</span>.
              </>
            }
            lede="A structured route from the first spark of an idea to the national stage — each stage designed to move participants forward."
          />
        </Reveal>

        <ol className="relative mt-16 grid grid-cols-1 gap-y-10 lg:grid-cols-6 lg:gap-x-5 lg:gap-y-0">
          {/* Mobile: vertical gradient rail through the nodes */}
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-4 top-4 w-px bg-gradient-to-b from-cyan-400 via-iris-400 to-orchid-400 lg:hidden"
          />
          {/* Desktop: horizontal gradient rail through the nodes */}
          <span
            aria-hidden="true"
            className="absolute left-[8.33%] right-[8.33%] top-4 hidden h-px bg-gradient-to-r from-cyan-400 via-iris-400 to-orchid-400 lg:block"
          />

          {steps.map((step, i) => {
            const isLast = i === lastIndex;
            return (
              <li key={step.id} className="relative pl-12 lg:pl-0">
                <Reveal
                  delay={(i % 3) as 0 | 1 | 2}
                  className="flex h-full flex-col lg:items-center"
                >
                  {/* Numbered node */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full font-mono text-[11px] font-semibold tabular-nums lg:static lg:mb-6 ${
                      isLast
                        ? "bg-gradient-to-br from-cyan-400 via-iris-400 to-orchid-400 text-ink-950 shadow-[0_10px_24px_-8px_rgba(234,124,12,0.65)]"
                        : "border border-line bg-white text-ink-400 shadow-sm"
                    }`}
                  >
                    {step.number}
                  </span>

                  <div
                    className={`card-hover flex h-full w-full flex-col rounded-2xl p-6 ${
                      isLast
                        ? "neo-border shadow-[0_16px_40px_-20px_rgba(234,124,12,0.35)]"
                        : "border border-line bg-white"
                    }`}
                  >
                    <h3 className="font-display text-lg font-semibold text-ink-950">
                      <span className="sr-only">Stage {step.number}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-800">
                      {step.text}
                    </p>
                    {isLast && (
                      <Link
                        href="/grand-finale"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-iris-600 transition hover:text-iris-600"
                      >
                        The Grand Finale
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
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
                      </Link>
                    )}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
