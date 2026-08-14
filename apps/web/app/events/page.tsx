import type { Metadata } from "next";
import { getEvents as getStaticEvents } from "@/lib/content";
import { Container, Eyebrow } from "@/components/ui";
import EventsDirectory from "@/components/events/EventsDirectory";
import { createClient } from "@/lib/supabase-server";

type DatabaseEvent = {
  id: string;
  slug: string;
  title: string;
  city: string | null;
  state: string | null;
  venue: string;
  date_start: string;
  date_end: string | null;
  category: string;
  status: "upcoming" | "completed";
  registration_open: boolean;
  summary: string;
  description: string;
  highlights: string[];
};

export const metadata: Metadata = {
  title: "Events",
  description:
    "The LaunchBharat national calendar — roadshows, bootcamps, pitch days and forums across India and online.",
};

export const revalidate = 0; // Don't cache since we pull from DB

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: dbEvents } = await supabase
    .from("events")
    .select("*")
    .order("date_start", { ascending: true })
    .limit(9);

  const staticEvents = getStaticEvents();

  // Map db events to the shape expected by EventsDirectory
  const mappedDbEvents = ((dbEvents || []) as DatabaseEvent[]).map((e) => ({
    id: e.id,
    slug: e.slug,
    sample: false,
    title: e.title,
    city: e.city || e.venue,
    state: e.state || "",
    dateStart: e.date_start,
    dateEnd: e.date_end,
    venue: e.venue,
    category: e.category,
    status: e.status,
    registrationOpen: e.registration_open,
    summary: e.summary || "",
    description: e.description || "",
    highlights: e.highlights || [],
  }));

  // Combine them, placing upcoming db events first
  const allEvents = [...mappedDbEvents, ...staticEvents].sort((a, b) => {
    // Upcoming first, then by date
    if (a.status === "upcoming" && b.status === "completed") return -1;
    if (a.status === "completed" && b.status === "upcoming") return 1;
    return new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime();
  });

  return (
    <>
      <section
        aria-labelledby="events-hero-heading"
        className="relative overflow-hidden bg-white py-20 md:py-24"
      >
        <div aria-hidden="true" className="hidden" />
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
          <EventsDirectory events={allEvents} />
        </Container>
      </section>
    </>
  );
}
