import type { Metadata } from "next";
import Link from "next/link";
import {
  Container,
  SectionHeading,
  Button,
  Reveal,
  Badge,
  Eyebrow,
  Marquee,
  GlowCard,
} from "@/components/ui";
import NationMap, { type NationCity } from "@/components/home/NationMap";
import { getEvents, getLocations } from "@/lib/content";
import { project } from "@/lib/india";

export const metadata: Metadata = {
  title: "National Tour",
  description:
    "The LaunchBharat national tour — 12 cities, one movement. Map, venues and programs for every tour stop across India.",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

function formatEventDate(start: string, end: string | null): string {
  const [sy, sm, sd] = start.split("-").map(Number);
  if (!end) return `${sd} ${MONTHS[sm - 1]} ${sy}`;
  const [ey, em, ed] = end.split("-").map(Number);
  if (sy === ey && sm === em) return `${sd}–${ed} ${MONTHS[sm - 1]} ${sy}`;
  if (sy === ey) return `${sd} ${MONTHS[sm - 1]} – ${ed} ${MONTHS[em - 1]} ${sy}`;
  return `${sd} ${MONTHS[sm - 1]} ${sy} – ${ed} ${MONTHS[em - 1]} ${ey}`;
}

export default function TourPage() {
  const locations = getLocations();
  const events = getEvents();

  const cities: NationCity[] = locations.map((loc) => {
    const { x, y } = project(loc.lon, loc.lat);
    return {
      id: loc.id,
      city: loc.city,
      state: loc.state,
      status: loc.status,
      venue: loc.venue,
      x,
      y,
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

  return (
    <>
      {/* ——— Hero ——— */}
      <section
        aria-labelledby="tour-heading"
        className="relative overflow-hidden bg-white py-20 md:py-28"
      >
        <div aria-hidden="true" className="aurora-wash pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="grid-texture pointer-events-none absolute inset-0 opacity-50" />
        <Container className="relative">
          <Eyebrow>The national tour</Eyebrow>
          <h1 id="tour-heading" className="display-xl mt-5 text-ink-950">
            <span className="text-gradient-brand">{cities.length} cities.</span>
            <br />
            One movement.
          </h1>
          <p className="lede mt-6 max-w-2xl">
            The LaunchBharat tour takes the startup ecosystem to the campus —
            roadshows, bootcamps and pitch days rolling across India before the
            national Grand Finale.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="chip-mono">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
              />
              Status: rolling out
            </span>
            <span className="chip-mono">{cities.length} cities // 1 stage</span>
            <span className="chip-mono">Venues announced via CMS</span>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/register" variant="primary" size="lg">
              Register now
            </Button>
            <Button href="/events" variant="secondary" size="lg">
              View the calendar
            </Button>
          </div>
        </Container>
      </section>

      {/* ——— City marquee ——— */}
      <div className="border-y border-line bg-paper py-4">
        <Marquee
          items={locations.map((l) => l.city.toUpperCase())}
          itemClassName="font-mono text-sm tracking-[0.22em] text-ink-400"
          duration="40s"
        />
      </div>

      {/* ——— Interactive map ——— */}
      <section
        aria-labelledby="tour-map-heading"
        className="section-pad relative overflow-hidden bg-white"
      >
        <div aria-hidden="true" className="grid-texture absolute inset-0" />
        <Container className="relative">
          <SectionHeading
            id="tour-map-heading"
            number="01"
            eyebrow="Live map"
            title={
              <>
                Where the movement{" "}
                <span className="text-gradient-brand">lands.</span>
              </>
            }
            lede="Select a city to see its programs, venue and ecosystem footprint."
          />
          <Reveal className="mt-12">
            <NationMap cities={cities} />
          </Reveal>
        </Container>
      </section>

      {/* ——— Venue directory ——— */}
      <section
        aria-labelledby="tour-venues-heading"
        className="section-pad relative overflow-hidden bg-mist"
      >
        <Container>
          <SectionHeading
            id="tour-venues-heading"
            number="02"
            eyebrow="Tour stops & venues"
            title={
              <>
                Every stop.{" "}
                <span className="text-gradient-brand">Every venue.</span>
              </>
            }
            lede="Host venues are confirmed with partner institutions city by city — each stop publishes here the moment it locks."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc, i) => {
              const cityEvents = loc.eventSlugs
                .map((slug) => events.find((e) => e.slug === slug))
                .filter((e): e is NonNullable<typeof e> => e !== undefined);
              return (
                <Reveal key={loc.id} delay={(i % 3) as 0 | 1 | 2}>
                  <GlowCard className="glass glass-hover h-full rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        aria-hidden="true"
                        className="font-mono text-xs tabular-nums text-ink-400"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Badge tone={loc.status === "active" ? "green" : "blue"}>
                        {loc.status === "active" ? "Tour stop" : "Planned"}
                      </Badge>
                    </div>
                    <h3 className="font-display mt-3 text-xl font-semibold tracking-tight text-ink-950">
                      {loc.city}
                    </h3>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
                      {loc.state}
                    </p>
                    <div className="mt-4 flex items-start gap-2.5 border-t border-line pt-4">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-iris-600"
                      >
                        <path
                          d="M12 21s-7-5.1-7-11a7 7 0 1 1 14 0c0 5.9-7 11-7 11Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <p className="text-sm text-ink-800">
                        {loc.venue ?? (
                          <span className="text-ink-600">
                            Venue to be announced
                          </span>
                        )}
                      </p>
                    </div>
                    {cityEvents.length > 0 ? (
                      <ul className="mt-4 space-y-2">
                        {cityEvents.map((e) => (
                          <li key={e.slug}>
                            <Link
                              href={`/events/${e.slug}`}
                              className="group flex items-baseline justify-between gap-3 text-sm"
                            >
                              <span className="text-ink-800 underline-offset-4 transition group-hover:text-iris-600 group-hover:underline">
                                {e.title}
                              </span>
                              <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-400">
                                {formatEventDate(e.dateStart, e.dateEnd)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-sm text-ink-600">
                        Programs for this stop are being scheduled.
                      </p>
                    )}
                  </GlowCard>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-8 text-xs text-ink-600">
            Venues and dates are confirmed with host institutions and managed
            via the CMS — check back as stops lock in.
          </p>
        </Container>
      </section>

      {/* ——— CTA ——— */}
      <section
        aria-labelledby="tour-cta-heading"
        className="relative overflow-hidden bg-slate-50 py-20 text-center md:py-28"
      >
        <Container className="relative">
          <h2 id="tour-cta-heading" className="display-lg text-ink-950">
            The tour is coming{" "}
            <span className="text-gradient-brand">to you.</span>
          </h2>
          <p className="lede mx-auto mt-4 max-w-xl">
            Register once — we&apos;ll route your application to your nearest tour
            stop.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/register" variant="primary" size="lg">
              Register now
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Host a stop on your campus
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
