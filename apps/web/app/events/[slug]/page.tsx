import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug, getEvents } from "@/lib/content";
import { Badge, Button, Container } from "@/components/ui";
import {
  datePlateParts,
  formatEventDates,
  registrationStatus,
} from "@/components/events/EventCard";
import { createClient } from "@/lib/supabase-server";

export function generateStaticParams() {
  return getEvents().map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  
  if (!event) {
    const supabase = await createClient();
    const { data: dbEvent } = await supabase
      .from("events")
      .select("title, summary")
      .eq("slug", slug)
      .single();
    if (dbEvent) {
      return { title: dbEvent.title, description: dbEvent.summary || "" };
    }
    return { title: "Event not found" };
  }
  
  return { title: event.title, description: event.summary };
}

function TickIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 h-5 w-5 shrink-0 text-saffron-600"
    >
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let event = getEventBySlug(slug);
  let isManagedEvent = false;
  
  // Fallback to database if not in static content
  if (!event) {
    const supabase = await createClient();
    const { data: dbEvent } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();
      
    if (dbEvent) {
      isManagedEvent = true;
      event = {
        id: dbEvent.id,
        slug: dbEvent.slug,
        sample: false,
        title: dbEvent.title,
        city: dbEvent.city || dbEvent.venue,
        state: dbEvent.state || "",
        dateStart: dbEvent.date_start,
        dateEnd: dbEvent.date_end,
        venue: dbEvent.venue,
        category: dbEvent.category,
        status: dbEvent.status,
        registrationOpen: dbEvent.registration_open,
        summary: dbEvent.summary || "",
        description: dbEvent.description || "",
        highlights: dbEvent.highlights || [],
      };
    }
  }

  if (!event) notFound();

  const reg = registrationStatus(event);
  const plate = datePlateParts(event);
  const dates = formatEventDates(event);
  const paragraphs = event.description
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.dateStart,
    ...(event.dateEnd ? { endDate: event.dateEnd } : {}),
    description: event.description,
    organizer: {
      "@type": "Organization",
      name: "LaunchBharat",
      url: "https://launchbharat.in",
    },
    location:
      event.city === "Online"
        ? {
            "@type": "VirtualLocation",
            url: "https://launchbharat.in",
          }
        : {
            "@type": "Place",
            name: event.venue,
            address: {
              "@type": "PostalAddress",
              addressLocality: event.city,
              addressRegion: event.state,
              addressCountry: "IN",
            },
          },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero strip */}
      <section
        aria-labelledby="event-detail-heading"
        className="relative overflow-hidden bg-slate-50 py-16 md:py-20"
      >
        <div aria-hidden="true" className="hidden" />
        <div
          aria-hidden="true"
          className="hidden"
          style={{ width: 420, height: 420, top: -160, right: -120 }}
        />
        <Container className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="iris">{event.category}</Badge>
            <Badge tone={reg.open ? "green" : "neutral"}>{reg.label}</Badge>
          </div>
          <h1
            id="event-detail-heading"
            className="display-lg mt-6 max-w-4xl text-ink-950"
          >
            {event.title}
          </h1>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-600">
            <span className="font-semibold text-ink-950">
              {event.city}, {event.state}
            </span>
            <span aria-hidden="true" className="h-px w-6 bg-ink-400/50" />
            <span>{dates}</span>
            <span aria-hidden="true" className="h-px w-6 bg-ink-400/50" />
            <span>{event.venue}</span>
          </p>
          {event.sample && (
            <p className="mt-5 text-xs text-ink-400">
              Illustrative event — managed via the CMS.
            </p>
          )}
        </Container>
      </section>

      {/* Body */}
      <section aria-label="Event details" className="section-pad bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20">
            <div>
              <h2 className="display-md text-ink-950">
                About the <span className="text-green-700">event.</span>
              </h2>
              <div className="mt-6 flex flex-col gap-5">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-ink-800">
                    {p}
                  </p>
                ))}
              </div>

              {event.highlights.length > 0 && (
                <div className="mt-12">
                  <h2 className="display-md text-ink-950">Programme.</h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {event.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3">
                        <TickIcon />
                        <span className="text-sm font-medium text-ink-800">
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Aside */}
            <aside aria-label="Event summary">
              <div className="lg:sticky lg:top-24">
                <div className="glass corner-frame rounded-3xl p-7">
                  <p className="flex flex-col leading-none">
                    <span className="font-mono text-4xl font-bold tabular-nums tracking-tight text-ink-950">
                      {plate.day}
                    </span>
                    <span className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-saffron-600">
                      {plate.monthYear}
                    </span>
                  </p>

                  <dl className="mt-7 flex flex-col gap-5 border-t border-line pt-6 text-sm">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                        Date
                      </dt>
                      <dd className="mt-1 font-medium text-ink-800">{dates}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                        Venue
                      </dt>
                      <dd className="mt-1 font-medium text-ink-800">
                        {event.venue}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                        Location
                      </dt>
                      <dd className="mt-1 font-medium text-ink-800">
                        {event.city}, {event.state}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                        Registration
                      </dt>
                      <dd className="mt-2">
                        <Badge tone={reg.open ? "green" : "neutral"}>
                          {reg.label}
                        </Badge>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-7 border-t border-line pt-6">
                    {reg.open ? (
                      <Button
                        href={isManagedEvent ? `/events/${event.slug}/register` : "/register"}
                        variant="primary"
                        size="md"
                        className="w-full"
                        ariaLabel={`Register for ${event.title}`}
                      >
                        Register
                      </Button>
                    ) : (
                      <p className="text-sm text-ink-600">
                        {event.status === "completed"
                          ? "This event has concluded."
                          : "Registration opens soon."}
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href="/events"
                  className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-600 transition-colors duration-200 hover:text-saffron-600"
                >
                  <ArrowLeftIcon />
                  All events
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
