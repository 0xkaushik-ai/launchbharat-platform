import type { Metadata } from "next";
import { getMedia, getSite } from "@/lib/content";
import {
  Badge,
  Container,
  Eyebrow,
  Reveal,
  SectionHeading,
} from "@/components/ui";
import MediaArchive from "@/components/media/MediaArchive";

export const metadata: Metadata = {
  title: "Media Centre",
  description:
    "Press releases, announcements and resources from the LaunchBharat movement.",
};

function DocumentIcon({ className = "h-6 w-6" }: { className?: string }) {
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
      <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

export default function MediaPage() {
  const media = getMedia();
  const site = getSite();

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="media-hero-heading"
        className="relative overflow-hidden bg-white pb-20 pt-24 md:pb-24 md:pt-32"
      >
        <div aria-hidden="true" className="hidden" />
        <div aria-hidden="true" className="grid-texture absolute inset-0" />
        <div
          aria-hidden="true"
          className="hidden"
        />
        <div
          aria-hidden="true"
          className="hidden"
        />
        <Container className="relative">
          <Eyebrow>Newsroom</Eyebrow>
          <h1 id="media-hero-heading" className="display-xl mt-6 text-ink-950">
            Media <span className="text-saffron-600">centre</span>.
          </h1>
          <p className="lede mt-6 max-w-2xl">
            Press releases, announcements and resources from the movement.
          </p>
          <div aria-hidden="true" className="tricolor-rule mt-10 w-16" />
        </Container>
      </section>

      {/* Archive */}
      <section
        aria-labelledby="media-archive-heading"
        className="section-pad bg-white"
      >
        <Container>
          <Reveal>
            <SectionHeading
              id="media-archive-heading"
              number="01"
              eyebrow="The archive"
              title={
                <>
                  Releases &{" "}
                  <span className="text-green-700">announcements</span>.
                </>
              }
              lede="Every official statement from the movement, searchable in one place."
            />
          </Reveal>
          <Reveal delay={1} className="mt-12">
            <MediaArchive items={media.items} />
          </Reveal>
        </Container>
      </section>

      {/* Downloads & media kit */}
      <section
        aria-labelledby="media-downloads-heading"
        className="section-pad bg-mist"
      >
        <Container>
          <Reveal>
            <SectionHeading
              id="media-downloads-heading"
              number="02"
              eyebrow="Resources"
              title={
                <>
                  Downloads &{" "}
                  <span className="text-saffron-600">media kit</span>.
                </>
              }
              lede="Official assets and reference documents for journalists, institutions and partners."
            />
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr] lg:gap-16">
            <Reveal delay={1}>
              <ul className="grid gap-4 sm:grid-cols-2">
                {media.downloads.map((dl) => (
                  <li
                    key={dl.id}
                    className={`card-hover flex items-start gap-4 rounded-2xl border border-line bg-white p-6 ${
                      dl.available ? "" : "opacity-60"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 via-white/25 to-green-500/25 ${
                        dl.available ? "text-saffron-600" : "text-ink-400"
                      }`}
                    >
                      <DocumentIcon />
                    </span>
                    <span className="flex flex-col gap-2.5">
                      <span
                        className={`font-display text-sm font-semibold leading-snug ${
                          dl.available ? "text-ink-950" : "text-ink-600"
                        }`}
                      >
                        {dl.title}
                      </span>
                      <span className="flex flex-wrap gap-2">
                        <Badge tone={dl.available ? "iris" : "neutral"}>
                          {dl.format}
                        </Badge>
                        {!dl.available && (
                          <Badge tone="neutral">Coming soon</Badge>
                        )}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={2} as="aside" className="h-fit">
              <div
                aria-labelledby="media-enquiries-heading"
                className="glass corner-frame rounded-3xl p-8"
              >
                <h3
                  id="media-enquiries-heading"
                  className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-saffron-600"
                >
                  Media enquiries
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-800">
                  For interviews, statements, accreditation and background on
                  the movement, write to the national media desk.
                </p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="mt-5 inline-block text-sm font-semibold text-ink-950 underline decoration-iris-400 decoration-2 underline-offset-4 transition duration-200 hover:text-saffron-600"
                >
                  {site.contact.email}
                </a>
                <p className="mt-4 text-xs text-ink-600">
                  The media desk responds within two working days.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Forward-looking galleries band */}
      <section
        aria-labelledby="media-galleries-heading"
        className="border-t border-line bg-slate-50 py-12"
      >
        <Container className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
          <span
            aria-hidden="true"
            className="h-0.5 w-16 shrink-0 rounded-full bg-gradient-to-r from-green-500 via-white to-green-500"
          />
          <div>
            <h2
              id="media-galleries-heading"
              className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-saffron-600"
            >
              Photographs & video
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-800">
              Photographs and video from events publish here after the first
              programs run.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
