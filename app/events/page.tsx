import type { Metadata } from "next";
import { getEvents } from "@/lib/content";
import { Container, Eyebrow } from "@/components/ui";
import EventsDirectory from "@/components/events/EventsDirectory";

export const metadata: Metadata = {
  title: "Events",
  description:
    "The LaunchBharat national calendar — roadshows, bootcamps, pitch days and forums across India and online.",
};

export default function EventsPage() {
  const events = getEvents();

  return (
    <>
      <section
        aria-labelledby="events-hero-heading"
        className="relative overflow-hidden bg-white py-20 md:py-24"
      >
        <div aria-hidden="true" className="hidden" />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 460, height: 460, top: -180, right: -140 }}
        />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 360, height: 360, bottom: -220, left: -120 }}
        />
        <Container className="relative">
          <Eyebrow>Events</Eyebrow>
          <h1 id="events-hero-heading" className="display-lg mt-5 text-ink-950">
            The national{" "}
            <span className="text-saffron-600">calendar.</span>
          </h1>
          <p className="lede mt-5 max-w-2xl">
            Roadshows, bootcamps, pitch days and forums — the movement as it
            travels across India.
          </p>
          <div aria-hidden="true" className="tricolor-rule mt-8 w-20" />
        </Container>
      </section>

      <section aria-label="Events directory" className="section-pad bg-white">
        <Container>
          <EventsDirectory events={events} />
        </Container>
      </section>
    </>
  );
}
