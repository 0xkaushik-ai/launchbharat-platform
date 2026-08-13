import type { Metadata } from "next";
import { Badge, Container, Eyebrow } from "@/components/ui";
import {
  getBranding,
  getEvents,
  getFaq,
  getGrandFinale,
  getJourney,
  getLocations,
  getMedia,
  getMentors,
  getPartners,
  getSite,
  getStats,
  getStories,
  getWho,
  getWhy,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "CMS Console",
  robots: { index: false, follow: false },
};

type ChipTone = "saffron" | "green" | "blue" | "neutral" | "gold";

interface ModuleCard {
  id: string;
  name: string;
  description: string;
  sources: string[];
  rows: { label: string; value: string }[];
  chips: { text: string; tone: ChipTone }[];
}

function buildModules(): ModuleCard[] {
  const site = getSite();
  const branding = getBranding();
  const stats = getStats();
  const events = getEvents();
  const grandFinale = getGrandFinale();
  const locations = getLocations();
  const mentors = getMentors();
  const partners = getPartners();
  const media = getMedia();
  const faq = getFaq();
  const journey = getJourney();
  const why = getWhy();
  const who = getWho();
  const stories = getStories();

  const sampleEvents = events.filter((e) => e.sample).length;
  const upcomingEvents = events.filter((e) => e.status === "upcoming").length;
  const statPlaceholders = stats.filter((s) => s.value === null).length;
  const sampleLocations = locations.filter((l) => l.sample).length;
  const announcedMentors = mentors.filter((m) => m.announced).length;
  const confirmedPartners = partners.reduce(
    (sum, c) => sum + c.partners.length,
    0,
  );
  const totalSlots = partners.reduce((sum, c) => sum + c.slots, 0);
  const sampleMedia = media.items.filter((m) => m.sample).length;
  const availableDownloads = media.downloads.filter(
    (d) => d.available,
  ).length;

  return [
    {
      id: "website",
      name: "Website",
      description:
        "Site settings, navigation, announcement bar, homepage sections, FAQ and stories.",
      sources: [
        "content/site.json",
        "content/journey.json",
        "content/why.json",
        "content/who.json",
        "content/stories.json",
        "content/faq.json",
      ],
      rows: [
        { label: "Navigation", value: `${site.nav.length} primary items` },
        {
          label: "Announcement bar",
          value: site.announcement.enabled ? "Enabled" : "Disabled",
        },
        {
          label: "Sections",
          value: `${journey.length} journey steps — ${why.length} pillars — ${who.length} audiences`,
        },
        { label: "FAQ", value: `${faq.length} questions` },
        {
          label: "Stories",
          value: `${stories.length} archetypes (aspirational, not testimonials)`,
        },
      ],
      chips: [
        {
          text: site.announcement.enabled
            ? "Announcement live"
            : "Announcement off",
          tone: site.announcement.enabled ? "green" : "neutral",
        },
        { text: "Stories: archetypes", tone: "blue" },
      ],
    },
    {
      id: "events",
      name: "Events",
      description:
        "The events directory, event detail pages and the Grand Finale.",
      sources: ["content/events.json", "content/grand-finale.json"],
      rows: [
        {
          label: "Events",
          value: `${events.length} items — ${upcomingEvents} upcoming`,
        },
        {
          label: "Grand Finale date",
          value: `${grandFinale.dateDisplay} — ${
            grandFinale.dateConfirmed ? "confirmed" : "NOT confirmed (tentative)"
          }`,
        },
        {
          label: "Grand Finale venue",
          value: `${grandFinale.venue}, ${grandFinale.city}`,
        },
        {
          label: "Speakers",
          value: grandFinale.speakersAnnounced ? "Announced" : "Not announced",
        },
      ],
      chips: [
        {
          text:
            sampleEvents === events.length
              ? `${events.length} items — all sample`
              : `${sampleEvents} of ${events.length} sample`,
          tone: sampleEvents > 0 ? "saffron" : "green",
        },
        {
          text: grandFinale.dateConfirmed ? "Date confirmed" : "Date tentative",
          tone: grandFinale.dateConfirmed ? "green" : "saffron",
        },
      ],
    },
    {
      id: "ecosystem",
      name: "Ecosystem",
      description:
        "The national network map, mentor wall and partner categories.",
      sources: [
        "content/locations.json",
        "content/mentors.json",
        "content/partners.json",
      ],
      rows: [
        {
          label: "Locations",
          value: `${locations.length} network nodes — ${sampleLocations} illustrative`,
        },
        {
          label: "Mentors",
          value: `${mentors.length} profiles — ${announcedMentors} announced`,
        },
        {
          label: "Partners",
          value: `${partners.length} categories — ${confirmedPartners} confirmed of ${totalSlots} slots`,
        },
      ],
      chips: [
        {
          text: `Mentors: ${announcedMentors} announced`,
          tone: announcedMentors > 0 ? "green" : "neutral",
        },
        {
          text: `Partners: ${confirmedPartners} confirmed`,
          tone: confirmedPartners > 0 ? "green" : "neutral",
        },
        ...(sampleLocations > 0
          ? [{ text: "Map: illustrative", tone: "saffron" as ChipTone }]
          : []),
      ],
    },
    {
      id: "media",
      name: "Media",
      description: "Press releases, announcements, coverage and the press kit.",
      sources: ["content/media.json"],
      rows: [
        {
          label: "Items",
          value: `${media.items.length} published — ${sampleMedia} sample`,
        },
        {
          label: "Downloads",
          value: `${media.downloads.length} listed — ${availableDownloads} available`,
        },
      ],
      chips: [
        {
          text:
            sampleMedia === media.items.length && media.items.length > 0
              ? "All items sample"
              : `${sampleMedia} sample items`,
          tone: sampleMedia > 0 ? "saffron" : "green",
        },
        {
          text:
            availableDownloads === 0
              ? "Press kit pending"
              : `${availableDownloads} downloads live`,
          tone: availableDownloads === 0 ? "neutral" : "green",
        },
      ],
    },
    {
      id: "branding",
      name: "Branding",
      description:
        "Official associations and the generic ecosystem support line. Associations go live only with formally approved wording and official assets.",
      sources: ["content/branding.json"],
      rows: [
        {
          label: "Associations",
          value: `${branding.associations.length} managed`,
        },
        ...branding.associations.map((a) => ({
          label: a.organization,
          value: a.enabled
            ? `ENABLED — "${a.wording}"`
            : "DISABLED (pending approval)",
        })),
        {
          label: "Generic support line",
          value: branding.genericSupportLine.enabled ? "Enabled" : "Disabled",
        },
      ],
      chips: branding.associations.map((a) => ({
        text: `${a.id} ${a.enabled ? "ENABLED" : "DISABLED"}`,
        tone: (a.enabled ? "green" : "saffron") as ChipTone,
      })),
    },
    {
      id: "registration",
      name: "Registration",
      description:
        "The application form and where submissions land. No applicant data is rendered on the public site.",
      sources: ["data/applications.json"],
      rows: [
        {
          label: "Storage",
          value: "Applications stored server-side in data/applications.json",
        },
        {
          label: "Access",
          value: "Filesystem access only — not exposed via any public route",
        },
        {
          label: "Export",
          value: "See CMS.md for export and database-migration guidance",
        },
      ],
      chips: [{ text: "Server-side store", tone: "blue" }],
    },
    {
      id: "analytics",
      name: "Analytics",
      description:
        "National impact metrics shown across the site. Values stay null — and render as placeholder patterns — until verified.",
      sources: ["content/stats.json"],
      rows: [
        {
          label: "Metrics",
          value: `${stats.length} metrics — ${statPlaceholders} placeholders awaiting verified values`,
        },
        ...stats.map((s) => ({
          label: s.label,
          value:
            s.value === null
              ? `placeholder "${s.placeholder}${s.suffix}"`
              : `${s.value}${s.suffix} (verified)`,
        })),
        {
          label: "Traffic analytics",
          value: "Integration point — see CMS.md",
        },
      ],
      chips: [
        {
          text:
            statPlaceholders > 0
              ? `${statPlaceholders} of ${stats.length} placeholders`
              : "All metrics verified",
          tone: statPlaceholders > 0 ? "saffron" : "green",
        },
      ],
    },
  ];
}

export default function AdminPage() {
  const modules = buildModules();

  return (
    <>
      {/* Console header */}
      <section
        aria-labelledby="admin-heading"
        className="grid-texture bg-white py-12 text-ink-950 md:py-16"
      >
        <Container>
          <div className="flex max-w-3xl flex-col items-start gap-4">
            <Eyebrow tone="dark" withRule>
              Internal
            </Eyebrow>
            <h1 id="admin-heading" className="display-md text-ink-950">
              CMS CONSOLE
            </h1>
            <p className="text-sm leading-relaxed text-ink-600">
              Internal console — content is managed through the file-based
              content model described in CMS.md. This page reflects the live
              content state.
            </p>
          </div>
        </Container>
      </section>

      {/* Module cards */}
      <section aria-label="Content modules" className="bg-paper py-12 md:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {modules.map((mod) => (
              <article
                key={mod.id}
                aria-labelledby={`module-${mod.id}`}
                className="flex flex-col border border-line bg-white"
              >
                <header className="border-b border-line px-6 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2
                      id={`module-${mod.id}`}
                      className="text-sm font-bold uppercase tracking-[0.22em] text-navy-900"
                    >
                      {mod.name}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {mod.chips.map((chip) => (
                        <Badge key={chip.text} tone={chip.tone}>
                          {chip.text}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {mod.description}
                  </p>
                </header>
                <dl className="flex-1 divide-y divide-line">
                  {mod.rows.map((row) => (
                    <div
                      key={`${mod.id}-${row.label}`}
                      className="grid gap-1 px-6 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                        {row.label}
                      </dt>
                      <dd className="text-sm text-ink-800">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <footer className="border-t border-line bg-paper px-6 py-3">
                  <p className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
                    <span className="font-semibold uppercase tracking-[0.14em]">
                      Source
                    </span>
                    {mod.sources.map((src) => (
                      <code
                        key={src}
                        className="border border-line bg-white px-1.5 py-0.5 font-mono text-[11px] text-ink-600"
                      >
                        {src}
                      </code>
                    ))}
                  </p>
                </footer>
              </article>
            ))}
          </div>
          <p className="mt-8 text-xs text-ink-400">
            Placeholder and sample data is flagged above so nothing ships as
            fabricated credibility. Operating procedures, policies and the full
            content model map are documented in CMS.md at the repository root.
          </p>
        </Container>
      </section>
    </>
  );
}
