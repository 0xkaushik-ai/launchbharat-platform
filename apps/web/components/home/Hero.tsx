import { Button, Container } from "@/components/ui";
import { getSite } from "@/lib/content";
import HeroVisual from "./HeroVisual";

/**
 * Event-first national hero: a strong headline and registration path paired
 * with a leadership portrait and the LaunchBharat India-network motif. Copy
 * is CMS-driven and the h1 remains server-rendered for SEO.
 */

/** Gradient accent on the key word of the CMS headline. */
function AccentedHeadline({ text }: { text: string }) {
  const target = "entrepreneurs";
  const idx = text.toLowerCase().indexOf(target);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-gradient-brand">
        {text.slice(idx, idx + target.length)}
      </span>
      {text.slice(idx + target.length)}
    </>
  );
}

export default function Hero() {
  const site = getSite();
  const applicationsOpen = site.announcement.enabled;

  return (
    <section
      aria-labelledby="hero-heading"
      className="home-hero relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-transparent"
    >
      <div aria-hidden="true" className="grid-texture pointer-events-none absolute inset-0 -z-10 opacity-25" />

      <Container className="relative flex flex-1 items-center py-10 sm:py-12 md:py-14 lg:py-16">
        <div className="grid w-full -translate-y-2 gap-y-9 sm:-translate-y-3 lg:grid-cols-[minmax(0,1.04fr)_minmax(23rem,0.96fr)] lg:grid-rows-[auto_auto] lg:gap-x-12 lg:gap-y-6 xl:gap-x-20">
          {/* Headline */}
          <div className="relative z-10 flex max-w-2xl flex-col items-start lg:col-start-1 lg:row-start-1 lg:self-end">
            <div className="mb-6">
              {applicationsOpen && (
                <span className="hero-kicker inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white sm:px-5 sm:text-sm">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)]"
                  />
                  Applications open
                </span>
              )}
            </div>

            <h1 id="hero-heading" className="display-xl max-w-[12ch] text-ink-950">
              <AccentedHeadline text={site.headline} />
            </h1>
          </div>

          {/* National leadership portrait over the accurate India-network motif */}
          <div className="relative mx-auto w-full max-w-lg lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:-translate-y-8 lg:self-center xl:-translate-y-10">
            <HeroVisual className="w-full" />
          </div>

          {/* Supporting copy and actions */}
          <div className="relative z-10 flex max-w-2xl flex-col items-start lg:col-start-1 lg:row-start-2 lg:self-start">
            <p className="lede max-w-xl text-ink-600">{site.description}</p>

            <ul className="mt-7 flex w-full max-w-xl flex-wrap divide-x divide-ink-200/80 text-ink-950">
              {[
                ["2026", "Movement year"],
                ["12 cities", "National tour"],
                ["Grand finale", "One stage"],
              ].map(([value, label]) => (
                <li key={label} className="pr-4 first:pl-0 sm:px-5 sm:first:pl-0">
                  <p className="font-display text-base font-bold tracking-tight sm:text-lg">
                    {value}
                  </p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink-500 sm:text-[9px] sm:tracking-[0.16em]">
                    {label}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button href="/register" variant="primary" size="lg">
                Register now
              </Button>
              <Button href="/movement" variant="secondary" size="lg">
                Explore the movement
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-600">
              <span className="inline-flex items-center gap-2 font-medium text-ink-800">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                />
                Free to apply
              </span>
              <span aria-hidden="true" className="text-ink-400">•</span>
              <span>Open to ideas at every stage</span>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
}
