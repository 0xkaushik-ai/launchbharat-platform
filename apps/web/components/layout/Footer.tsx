import Link from "next/link";
import { Container } from "@/components/ui";
import { getActiveAssociations, getBranding, getSite } from "@/lib/content";

const exploreLinks = [
  { label: "About", href: "/about" },
  { label: "The movement", href: "/movement" },
  { label: "Events", href: "/events" },
  { label: "National tour", href: "/tour" },
  { label: "Grand finale", href: "/grand-finale" },
];

const legalLinks = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

export default function Footer() {
  const site = getSite();
  const associations = getActiveAssociations("footer");
  const support = getBranding().genericSupportLine;

  return (
    <footer className="editorial-footer relative isolate overflow-hidden bg-[#f7f6f2] text-ink-800">
      <div aria-hidden="true" className="footer-contour absolute inset-0 -z-10" />

      <Container className="relative pt-16 sm:pt-20 lg:pt-28">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[0.85fr_0.85fr_1.3fr] lg:gap-20">
          <nav aria-label="Footer — Explore">
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
              Explore
            </h2>
            <ul className="mt-5 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="editorial-footer-link text-base font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer — Connect">
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
              Connect
            </h2>
            <ul className="mt-5 space-y-2.5">
              {site.social.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-footer-link text-base font-medium"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-contact-heading" className="max-w-sm">
            <h2 id="footer-contact-heading" className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
              Contact
            </h2>
            <a href={`mailto:${site.contact.email}`} className="editorial-footer-link mt-5 inline-block text-lg font-medium">
              Reach out
            </a>
            <address className="mt-8 not-italic text-base leading-relaxed text-ink-800">
              {site.contact.address}
              <br />
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="editorial-footer-link mt-3 inline-block">
                {site.contact.phone}
              </a>
              <br />
              <a href={`mailto:${site.contact.email}`} className="editorial-footer-link mt-1 inline-block">
                {site.contact.email}
              </a>
            </address>
          </section>
        </div>

        {(associations.length > 0 || support.enabled) && (
          <div className="mt-14 max-w-2xl border-t border-ink-950/10 pt-5 text-sm leading-relaxed text-ink-600">
            {associations.map((association) => (
              <p key={association.id}>
                {association.wording}
                {association.attribution && <span className="text-ink-500"> — {association.attribution}</span>}
              </p>
            ))}
            {associations.length === 0 && support.enabled && <p>{support.text}</p>}
          </div>
        )}

        <div aria-hidden="true" className="footer-wordmark mt-16 select-none sm:mt-20 lg:mt-24">
          LaunchBharat
        </div>

        <div className="flex flex-col gap-4 border-t border-ink-950/10 py-6 text-xs text-ink-600 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Footer — Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="editorial-footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p>© {new Date().getFullYear()} {site.legalName}</p>
        </div>
      </Container>
    </footer>
  );
}
