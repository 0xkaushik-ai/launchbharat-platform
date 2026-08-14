import { Button, Container, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="relative flex min-h-[80vh] items-center overflow-hidden bg-slate-50 py-24"
    >
      <span
        aria-hidden="true"
        className="text-outline pointer-events-none absolute top-1/2 right-[2%] -translate-y-1/2 font-display text-[clamp(11rem,30vw,24rem)] leading-none font-bold select-none"
      >
        404
      </span>
      <Container className="relative">
        <div className="flex max-w-3xl flex-col items-start gap-6">
          <Eyebrow>Error 404</Eyebrow>
          <h1 id="not-found-heading" className="display-xl text-ink-950">
            Off the <span className="text-gradient-brand">map</span>.
          </h1>
          <p className="lede">
            This page isn&apos;t part of the movement yet.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Button href="/" variant="primary" size="lg">
              Back to home
            </Button>
            <Button href="/events" variant="secondary" size="lg">
              Explore events
            </Button>
          </div>
          <span aria-hidden="true" className="tricolor-rule mt-6 w-24" />
        </div>
      </Container>
    </section>
  );
}
