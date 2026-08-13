import type { Metadata } from "next";
import Movement from "@/components/home/Movement";
import Journey from "@/components/home/Journey";
import WhyLaunchBharat from "@/components/home/WhyLaunchBharat";
import { Button, Container, Eyebrow, Reveal } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Movement",
  description:
    "LaunchBharat is more than an event — a nationwide movement that discovers promising students and ideas, develops them with mentors and ecosystem stakeholders, and creates pathways toward the national stage.",
};

export default function MovementPage() {
  return (
    <>
      {/* Page hero */}
      <section
        aria-labelledby="movement-hero-heading"
        className="relative overflow-hidden bg-white py-20 md:py-24"
      >
        <div aria-hidden="true" className="hidden" />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 460, height: 460, top: -160, right: -120 }}
        />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 380, height: 380, bottom: -200, left: -120 }}
        />
        <Container className="relative">
          <div className="flex max-w-3xl flex-col items-start gap-5">
            <Eyebrow>The Movement</Eyebrow>
            <h1 id="movement-hero-heading" className="display-lg text-ink-950">
              More than an event. A{" "}
              <span className="text-saffron-600">national movement</span>.
            </h1>
            <p className="lede">
              LaunchBharat brings India&apos;s startup ecosystem closer to the
              campus — discovering promising ideas, developing the people
              behind them and opening a route to the national stage.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip-mono">Est. 2026</span>
              <span className="chip-mono">12 cities // 1 stage</span>
            </div>
            <span aria-hidden="true" className="tricolor-rule mt-2 w-24" />
          </div>
        </Container>
      </section>

      <Movement />
      <Journey />
      <WhyLaunchBharat />

      {/* Closing CTA band */}
      <section
        aria-labelledby="movement-cta-heading"
        className="section-pad relative overflow-hidden bg-slate-50"
      >
        <div aria-hidden="true" className="hidden" />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 440, height: 440, top: -180, left: "12%" }}
        />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 400, height: 400, bottom: -200, right: "8%" }}
        />
        <Container className="relative">
          <Reveal className="flex flex-col items-center gap-8 text-center">
            <h2
              id="movement-cta-heading"
              className="display-md max-w-2xl text-ink-950"
            >
              If you have an idea, you have{" "}
              <span className="text-saffron-600">a place here</span>.
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/register" variant="primary" size="lg">
                Register now
              </Button>
              <Button href="/events" variant="secondary" size="lg">
                Explore events
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
