import Link from "next/link";
import { Container, LogoMark } from "@/components/ui";
import { getSite, getActiveAssociations, getBranding } from "@/lib/content";

const columns = [
  {
    heading: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "The Movement", href: "/movement" },
      { label: "Events", href: "/events" },
      { label: "National Tour", href: "/tour" },
      { label: "Grand Finale", href: "/grand-finale" },
    ],
  },
  {
    heading: "Ecosystem",
    links: [
      { label: "Partners", href: "/partners" },
      { label: "Mentors", href: "/ecosystem#mentors" },
      { label: "Investors", href: "/partners#investors" },
      { label: "Institutions", href: "/partners#institutions" },
    ],
  },
  {
    heading: "Information",
    links: [
      { label: "Media", href: "/media" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];

export default function Footer() {
  const site = getSite();
  const associations = getActiveAssociations("footer");
  const support = getBranding().genericSupportLine;

  return (
    <footer className="relative overflow-hidden border-t border-line bg-paper text-ink-600">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-400 via-iris-400 to-orchid-400 opacity-80"
      />
      <Container className="relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <LogoMark variant="light" size="lg" withTagline />
            <p className="mt-6 text-sm leading-relaxed">{site.description}</p>
            <p className="mt-6 text-sm">
              <a
                href={`mailto:${site.contact.email}`}
                className="text-ink-800 underline-offset-4 transition hover:text-iris-600 hover:underline"
              >
                {site.contact.email}
              </a>
            </p>
            <ul className="mt-4 flex gap-5">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-medium uppercase tracking-[0.16em] transition hover:text-iris-600"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={`Footer — ${col.heading}`}>
              <h2 className="eyebrow text-ink-950">{col.heading}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm transition hover:text-iris-600"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Approved associations only — managed via CMS (content/branding.json) */}
        {(associations.length > 0 || support.enabled) && (
          <div className="mt-14 border-t border-line pt-8">
            {associations.map((a) => (
              <p key={a.id} className="text-sm text-ink-800">
                {a.wording}
                {a.attribution && (
                  <span className="text-ink-400"> — {a.attribution}</span>
                )}
              </p>
            ))}
            {associations.length === 0 && support.enabled && (
              <p className="text-sm">{support.text}</p>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="font-devanagari text-ink-400">{site.taglineHi}</p>
            <div className="tricolor-rule w-16" aria-hidden="true" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
