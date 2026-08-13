import { Button, Container, Eyebrow } from "@/components/ui";
import { getActiveAssociations, getBranding, getSite } from "@/lib/content";
import HeroVisual from "./HeroVisual";

/**
 * Light, minimal hero: sentence-case national headline on a white canvas with
 * a soft aurora wash, beside the accurate animated India map. Copy is
 * CMS-driven (content/site.json) and the h1 is server-rendered for SEO.
 */

/** Gradient accent on the key word of the CMS headline. */
function AccentedHeadline({ text }: { text: string }) {
  const target = "entrepreneurs";
  const idx = text.toLowerCase().indexOf(target);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-saffron-600">
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
      className="relative isolate flex min-h-[85svh] flex-col overflow-hidden bg-white"
    >
      {/* Soft aurora wash + hairline grid */}
      <div aria-hidden="true" className="hidden" />
      <div aria-hidden="true" className="grid-texture absolute inset-0 -z-10 opacity-20" />

      {/* Ambient orbs */}
      <div
        aria-hidden="true"
        className="hidden"
        style={{ width: 520, height: 520 }}
      />
      <div
        aria-hidden="true"
        className="hidden"
        style={{ width: 540, height: 540 }}
      />

      <Container className="relative flex flex-1 items-center py-20 md:py-24">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-16">
          {/* Copy */}
          <div className="relative z-10 flex max-w-2xl flex-col items-start gap-6">
            <Eyebrow>{site.eyebrow}</Eyebrow>
            <h1 id="hero-heading" className="display-xl text-ink-950">
              <AccentedHeadline text={site.headline} />
            </h1>
            <p className="lede max-w-xl text-ink-600">{site.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <Button href="/register" variant="primary" size="lg">
                Register now
              </Button>
              <Button href="/movement" variant="secondary" size="lg">
                Explore the movement
              </Button>
            </div>

            {/* Micro-labels */}
            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <span className="chip-mono">Est. 2026</span>
              <span className="chip-mono">12 cities · 1 stage</span>
            </div>

            {/* Ecosystem support line (CMS-controlled; associations only when formally approved) */}
            {associations.length > 0 ? (
              <div className="mt-4 flex items-start gap-3">
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
              <div className="mt-4 flex items-start gap-3">
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

          {/* Accurate India map — the hero visual, shown proudly on all sizes */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <HeroVisual className="w-full" />
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
                  <span aria-hidden="true" className="text-saffron-500">
                    //
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
            <span className="h-6 w-px animate-pulse bg-gradient-to-b from-saffron-500/80 to-transparent" />
          </div>
        </Container>
      </div>

      {/* Breathing room the impact panel overlaps into */}
      <div aria-hidden="true" className="h-20 md:h-24" />
    </section>
  );
}
