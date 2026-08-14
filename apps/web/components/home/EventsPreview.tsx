import { getEvents } from "@/lib/content";
import { Button, Container, Reveal, SectionHeading } from "@/components/ui";
import EventCard from "@/components/events/EventCard";

export default function EventsPreview() {
  const upcoming = getEvents()
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => a.dateStart.localeCompare(b.dateStart))
    .slice(0, 3);
  const hasSample = upcoming.some((e) => e.sample);

  return (
    <section
      aria-labelledby="events-preview-heading"
      className="section-pad relative overflow-hidden bg-paper"
    >
      <Container className="relative">
        <SectionHeading
          id="events-preview-heading"
          number="08"
          eyebrow="Events"
          title={
            <>
              Where the movement{" "}
              <span className="text-gradient-brand">meets you.</span>
            </>
          }
          lede="Roadshows, bootcamps, pitch days and forums — the national calendar travels city to city, and online."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((event, i) => (
            <Reveal
              key={event.id}
              delay={Math.min(i, 3) as 0 | 1 | 2 | 3}
              className="h-full"
            >
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>

        {hasSample && (
          <p className="mt-6 text-xs text-ink-400">
            Illustrative calendar — events are managed via the CMS.
          </p>
        )}

        <Reveal className="mt-12 flex justify-center">
          <Button variant="outline-dark" href="/events">
            View the full calendar
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
