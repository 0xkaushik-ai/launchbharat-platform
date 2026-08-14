import Link from "next/link";
import { Badge, Button, GlowCard } from "@/components/ui";
import type { LbEvent } from "@/lib/content";

/* ——— Date helpers (no date libraries; en-IN, UTC-stable) ——— */

const toUTC = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** Parts for the date plate: big day / small month + year. */
export function datePlateParts(event: LbEvent): {
  day: string;
  monthYear: string;
} {
  const start = toUTC(event.dateStart);
  const dayFmt = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    timeZone: "UTC",
  });
  const monthYearFmt = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  let day = dayFmt.format(start);
  if (event.dateEnd) {
    const end = toUTC(event.dateEnd);
    if (
      start.getUTCMonth() === end.getUTCMonth() &&
      start.getUTCFullYear() === end.getUTCFullYear()
    ) {
      day = `${dayFmt.format(start)}–${dayFmt.format(end)}`;
    }
  }
  return { day, monthYear: monthYearFmt.format(start) };
}

/** Full formatted date, or a range when dateEnd is present. */
export function formatEventDates(event: LbEvent): string {
  const fmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  if (!event.dateEnd) return fmt.format(toUTC(event.dateStart));
  return fmt.formatRange(toUTC(event.dateStart), toUTC(event.dateEnd));
}

/** Registration state shared by the card, directory and detail page. */
export function registrationStatus(event: LbEvent): {
  open: boolean;
  label: string;
} {
  const open = event.registrationOpen && event.status === "upcoming";
  const label = open
    ? "Registration open"
    : event.status === "completed"
      ? "Completed"
      : "Opens soon";
  return { open, label };
}

/* ——— Icons (24px grid, stroke 1.5) ——— */

function PinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 21s-7-5.6-7-11a7 7 0 1 1 14 0c0 5.4-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function BuildingIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 21h16" />
      <path d="M6 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16" />
      <path d="M15 9h3a1 1 0 0 1 1 1v11" />
      <path d="M9 8h2M9 12h2M9 16h2" />
    </svg>
  );
}

/* ——— Card ——— */

export default function EventCard({
  event,
  featured = false,
}: {
  event: LbEvent;
  featured?: boolean;
}) {
  const plate = datePlateParts(event);
  const reg = registrationStatus(event);

  return (
    <GlowCard className="card-hover h-full rounded-2xl border border-line bg-white">
      <article
        className={`flex h-full flex-col ${
          featured ? "corner-frame rounded-2xl p-8" : "p-6"
        }`}
      >
        {/* Top row: date plate + badges */}
        <div className="flex items-start justify-between gap-4">
          <p className="flex flex-col rounded-xl bg-gradient-to-br from-mist to-iris-100 px-3.5 py-3 leading-none">
            <span
              className={`font-mono font-bold tabular-nums tracking-tight text-ink-950 ${
                featured ? "text-3xl" : "text-2xl"
              }`}
            >
              {plate.day}
            </span>
            <span className="mt-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] whitespace-nowrap text-ink-600">
              {plate.monthYear}
            </span>
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <Badge tone="iris">{event.category}</Badge>
            <Badge tone={reg.open ? "green" : "neutral"}>{reg.label}</Badge>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`mt-6 font-display font-semibold text-ink-950 ${
            featured ? "text-xl" : "text-lg"
          }`}
        >
          <Link
            href={`/events/${event.slug}`}
            className="transition-colors duration-200 hover:text-iris-600"
          >
            {event.title}
          </Link>
        </h3>

        {/* Meta row */}
        <div className="mt-3 flex flex-col gap-1.5 text-sm text-ink-600">
          <p className="flex items-center gap-2">
            <PinIcon className="h-4 w-4 shrink-0 text-ink-400" />
            <span>
              {event.city}, {event.state}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <BuildingIcon className="h-4 w-4 shrink-0 text-ink-400" />
            <span>{event.venue}</span>
          </p>
        </div>

        {/* Summary */}
        <p className="mt-4 mb-5 text-sm leading-relaxed text-ink-600">
          {event.summary}
        </p>

        {/* Footer */}
        <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-line pt-5">
          {reg.open && (
            <Button
              size="sm"
              variant="primary"
              href={event.sample ? "/register" : `/events/${event.slug}/register`}
              ariaLabel={`Register for ${event.title}`}
            >
              Register
            </Button>
          )}
          <Button
            size="sm"
            variant="outline-dark"
            href={`/events/${event.slug}`}
            ariaLabel={`View event: ${event.title}`}
          >
            View event
          </Button>
        </div>
      </article>
    </GlowCard>
  );
}
