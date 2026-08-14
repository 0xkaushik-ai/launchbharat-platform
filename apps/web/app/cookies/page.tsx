import type { Metadata } from "next";
import { Container, Eyebrow, Reveal } from "@/components/ui";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How the LaunchBharat platform uses cookies — a minimal, functional-only approach — and how to manage cookies in your browser.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  const site = getSite();

  return (
    <>
      {/* Page hero */}
      <section
        aria-labelledby="cookies-hero-heading"
        className="relative overflow-hidden bg-slate-50 py-16 md:py-20"
      >
        <Container className="relative">
          <div className="flex max-w-3xl flex-col items-start gap-5">
            <Eyebrow>Legal</Eyebrow>
            <h1 id="cookies-hero-heading" className="display-lg text-ink-950">
              <span className="text-gradient-brand">Cookie</span> policy.
            </h1>
          </div>
        </Container>
      </section>

      <section aria-label="Cookie policy" className="section-pad bg-white">
        <Container>
          <Reveal className="max-w-prose">
            <p className="text-sm italic text-ink-400">
              Template for review by legal counsel prior to publication.
            </p>

            <div className="mt-10 space-y-12 leading-relaxed text-ink-800">
              <div>
                <h2 className="display-md text-ink-950">1. What cookies are</h2>
                <p className="mt-4">
                  Cookies are small text files a website stores on your device
                  to remember information between visits. Related technologies
                  such as local storage work in a similar way; this policy
                  covers them all.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">2. Our approach</h2>
                <p className="mt-4">
                  The LaunchBharat platform takes a deliberately minimal
                  approach. We use only functional cookies that are strictly
                  necessary for the site to work — for example, remembering the
                  progress of a multi-step application. We do not use
                  advertising or cross-site tracking cookies, and we do not
                  sell or share browsing data.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">3. Analytics</h2>
                <p className="mt-4">
                  We may introduce privacy-respecting, aggregate analytics to
                  understand how the platform is used — for example, which
                  pages are most visited during an application window. If an
                  analytics service that uses cookies is adopted, this policy
                  will be updated to name it before it is enabled, and consent
                  will be sought where the law requires it.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">4. Managing cookies</h2>
                <p className="mt-4">
                  You can control and delete cookies through your browser
                  settings — most browsers let you block cookies entirely,
                  clear them on exit or manage them per site. Because we use
                  only functional cookies, blocking them may affect features
                  such as saved application progress, but the site&apos;s
                  content remains fully readable.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">5. Changes &amp; contact</h2>
                <p className="mt-4">
                  Any change to how the platform uses cookies will be reflected
                  on this page before it takes effect. Questions about this
                  policy should be sent to{" "}
                  <a
                    href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Cookies — LaunchBharat")}`}
                    className="font-semibold text-iris-600 underline-offset-4 hover:underline"
                  >
                    {site.contact.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
