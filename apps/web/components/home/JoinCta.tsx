import { getSite } from "@/lib/content";
import { Button, Container, Eyebrow, Reveal } from "@/components/ui";

/** Home — final CTA band. Light, centered, national. */
export default function JoinCta() {
  const site = getSite();
  const pillars = site.tagline
    .split(".")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section
      aria-labelledby="join-cta-heading"
      className="relative overflow-hidden bg-mist"
    >
      <div aria-hidden="true" className="aurora-wash pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="orb orb-pink animate-float-slower -right-10 top-0 opacity-60"
        style={{ width: 360, height: 360 }}
      />

      <div className="grid-texture relative py-24 md:py-36">
        <Container className="flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center gap-6">
            <Eyebrow>Join the movement</Eyebrow>
            <h2 id="join-cta-heading" className="display-lg max-w-4xl text-ink-950">
              Your idea.{" "}
              <span className="text-gradient-brand">India&apos;s stage</span>.
            </h2>
            <p className="lede max-w-2xl">
              One application is all it takes to enter a nationwide journey
              from campus to the national stage.
            </p>
          </Reveal>

          <Reveal
            delay={1}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button href="/register" variant="primary" size="lg">
              Register now
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Talk to the team
            </Button>
          </Reveal>

          <Reveal delay={2} className="mt-16 w-full">
            <ul
              aria-label="The LaunchBharat pathway"
              className="flex flex-wrap items-center justify-center gap-3"
            >
              {pillars.map((pillar) => (
                <li key={pillar} className="chip-mono">
                  {pillar}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
