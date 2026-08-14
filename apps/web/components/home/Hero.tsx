import { Button, Container } from "@/components/ui";
import { getActiveAssociations, getBranding, getSite } from "@/lib/content";
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
  const associations = getActiveAssociations("hero");
  const generic = getBranding().genericSupportLine;
  const taglineWords = site.tagline
    .split(".")
    .map((w) => w.trim())
    .filter(Boolean);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[88svh] flex-col overflow-hidden bg-white"
    >
      <div aria-hidden="true" className="aurora-wash pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="grid-texture pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <div
        aria-hidden="true"
        className="orb orb-sky animate-float-slow -left-24 -top-16 opacity-80"
        style={{ width: 420, height: 420 }}
      />
      <div
        aria-hidden="true"
        className="orb orb-iris animate-float-slower -right-16 top-24 opacity-70"
        style={{ width: 380, height: 380 }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[56%] bg-gradient-to-b from-cyan-400/[0.06] to-transparent"
      />

      <Container className="relative flex flex-1 items-center py-14 sm:py-16 md:py-20">
        <div className="grid w-full gap-y-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(25rem,0.94fr)] lg:grid-rows-[auto_auto] lg:gap-x-10 lg:gap-y-5 xl:gap-x-16">
          {/* Headline */}
          <div className="relative z-10 flex max-w-2xl flex-col items-start lg:col-start-1 lg:row-start-1 lg:self-end">
            <div className="hero-kicker mb-6 inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white sm:px-5 sm:text-sm">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)]"
              />
              <span>{site.eyebrow}</span>
            </div>

            <h1 id="hero-heading" className="display-xl max-w-[12ch] text-ink-950">
              <AccentedHeadline text={site.headline} />
            </h1>
          </div>

          {/* National leadership portrait over the accurate India-network motif */}
          <div className="relative mx-auto w-full max-w-lg lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center">
            <HeroVisual className="w-full" />
          </div>

          {/* Supporting copy and actions */}
          <div className="relative z-10 flex max-w-2xl flex-col items-start lg:col-start-1 lg:row-start-2 lg:self-start">
            <p className="lede max-w-xl text-ink-600">{site.description}</p>

            <div className="mt-7 grid w-full max-w-xl grid-cols-3 gap-2.5 sm:gap-3">
              {[
                ["2026", "Movement year"],
                ["12 cities", "National tour"],
                ["1 stage", "Grand finale"],
              ].map(([value, label]) => (
                <div key={label} className="hero-fact rounded-2xl px-3 py-3.5 sm:px-4 sm:py-4">
                  <p className="font-display text-base font-bold tracking-tight text-ink-950 sm:text-lg">
                    {value}
                  </p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink-500 sm:text-[9px] sm:tracking-[0.16em]">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Button href="/register" variant="primary" size="lg">
                Register now
              </Button>
              <Button href="/movement" variant="secondary" size="lg">
                Explore the movement
              </Button>
            </div>

            {/* Ecosystem support line (CMS-controlled; associations only when formally approved) */}
            {associations.length > 0 ? (
              <div className="mt-7 flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="tricolor-rule mt-2 w-10 shrink-0"
                />
                <div className="flex flex-col gap-2">
                  {associations.map((a) => (
                    <p
                      key={a.id}
                      className="flex items-center gap-3 text-sm leading-relaxed text-ink-600"
                    >
                      {a.logo && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={a.logo}
                          alt={`${a.organization} logo`}
                          className="h-6 w-auto"
                        />
                      )}
                      <span>{a.wording}</span>
                    </p>
                  ))}
                </div>
              </div>
            ) : generic.enabled ? (
              <div className="mt-7 flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="tricolor-rule mt-2 w-10 shrink-0"
                />
                <p className="max-w-md text-sm leading-relaxed text-ink-600">
                  {generic.text}
                </p>
              </div>
            ) : null}
          </div>

        </div>
      </Container>

      {/* Fold edge: tagline strip + scroll cue */}
      <div className="relative border-t border-line bg-slate-50/60 backdrop-blur-sm">
        <Container className="flex items-center justify-between gap-6 py-5">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 sm:text-[11px]">
            {taglineWords.map((word, i) => (
              <span key={word} className="flex items-center gap-x-4">
                {i > 0 && (
                  <span aria-hidden="true" className="text-iris-400">
                    {"//"}
                  </span>
                )}
                <span className="text-ink-950">{word}</span>
              </span>
            ))}
          </p>
          <div aria-hidden="true" className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-400">
              Scroll
            </span>
            <span className="h-6 w-px animate-pulse bg-gradient-to-b from-iris-400/80 to-transparent" />
          </div>
        </Container>
      </div>

      {/* Breathing room the impact panel overlaps into */}
      <div aria-hidden="true" className="h-16 md:h-20" />
    </section>
  );
}
