import { getEvents, getLocations } from "@/lib/content";
import { project } from "@/lib/india";
import { Container, Reveal, SectionHeading } from "@/components/ui";
import NationMap, { type NationCity } from "./NationMap";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function parseIso(iso: string): { d: number; m: number; y: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { d, m, y };
}

/** Deterministic, locale-free display date, e.g. "12 Sep 2026" / "26–27 Sep 2026". */
function formatEventDate(start: string, end: string | null): string {
  const s = parseIso(start);
  if (!end) return `${s.d} ${MONTHS[s.m - 1]} ${s.y}`;
  const e = parseIso(end);
  if (s.y === e.y && s.m === e.m)
    return `${s.d}–${e.d} ${MONTHS[s.m - 1]} ${s.y}`;
  if (s.y === e.y)
    return `${s.d} ${MONTHS[s.m - 1]} – ${e.d} ${MONTHS[e.m - 1]} ${s.y}`;
  return `${s.d} ${MONTHS[s.m - 1]} ${s.y} – ${e.d} ${MONTHS[e.m - 1]} ${e.y}`;
}

export default function NationMapSection() {
  const locations = getLocations();
  const events = getEvents();

  const cities: NationCity[] = locations.map((loc) => {
    const { x, y } = project(loc.lon, loc.lat);
    return {
      id: loc.id,
      city: loc.city,
      state: loc.state,
      status: loc.status,
      x,
      y,
      venue: loc.venue,
      institutions: loc.institutions,
      participants: loc.participants,
      ideas: loc.ideas,
      partners: loc.partners,
      events: loc.eventSlugs
        .map((slug) => events.find((e) => e.slug === slug))
        .filter((e): e is NonNullable<typeof e> => e !== undefined)
        .map((e) => ({
          slug: e.slug,
          title: e.title,
          dateDisplay: formatEventDate(e.dateStart, e.dateEnd),
        })),
    };
  });

  const activeCount = cities.filter((c) => c.status === "active").length;
  const plannedCount = cities.length - activeCount;

  return (
    <section
      aria-labelledby="nation-map-heading"
      className="section-pad grid-texture relative overflow-hidden bg-white"
    >
      {/* Soft aurora behind the map side */}
      <div
        aria-hidden="true"
        className="hidden"
      />
      <div
        aria-hidden="true"
        className="hidden"
        style={{ width: 420, height: 420, top: "-6rem", left: "-10rem" }}
      />
      <div
        aria-hidden="true"
        className="hidden"
        style={{ width: 380, height: 380, bottom: "-9rem", left: "24%" }}
      />
      <Container className="relative">
        <SectionHeading
          id="nation-map-heading"
          number="05"
          eyebrow="The national tour"
          title={
            <>
              From campus to the{" "}
              <span className="text-saffron-600">nation.</span>
            </>
          }
          lede="Ideas can begin anywhere. Opportunity shouldn't."
        />

        <Reveal className="mt-12 md:mt-16">
          <NationMap cities={cities} />
        </Reveal>

        <Reveal
          delay={1}
          className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-ink-600">
            <span className="font-semibold text-ink-950">
              {cities.length} {cities.length === 1 ? "city" : "cities"}
            </span>{" "}
            on the national tour
            {plannedCount > 0 && (
              <>
                {" "}
                — {activeCount} active{" "}
                {activeCount === 1 ? "chapter" : "chapters"}, {plannedCount}{" "}
                planned
              </>
            )}
            .
          </p>
          <span className="chip-mono">
            {cities.length} cities // 1 stage
          </span>
        </Reveal>
      </Container>
    </section>
  );
}
