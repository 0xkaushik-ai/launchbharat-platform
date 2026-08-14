import type { Metadata } from "next";
import { Container, Eyebrow, GlowCard, Reveal, SectionHeading } from "@/components/ui";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the LaunchBharat coordination team — participation, campus hosting, partnerships and media enquiries.",
  alternates: { canonical: "/contact" },
};

const audiences = [
  {
    id: "participants",
    title: "Participants & students",
    text: "Questions about applying, eligibility or your application status. Most answers are already on the FAQ page — check there first.",
    subject: "Participation enquiry — LaunchBharat",
    linkLabel: "Write about participating",
  },
  {
    id: "institutions",
    title: "Institutions & campuses",
    text: "Host a roadshow, bootcamp or regional program on your campus and plug your students into the national ecosystem.",
    subject: "Campus hosting enquiry — LaunchBharat",
    linkLabel: "Write about hosting",
  },
  {
    id: "partners",
    title: "Partners & investors",
    text: "Incubators, accelerators, funds and industry — partner with the movement or meet the national cohort.",
    subject: "Partnership enquiry — LaunchBharat",
    linkLabel: "Write about partnering",
  },
  {
    id: "media",
    title: "Media",
    text: "Press enquiries, interviews and accreditation. Releases and announcements are published on the Media page.",
    subject: "Media enquiry — LaunchBharat",
    linkLabel: "Write to the media desk",
  },
];

export default function ContactPage() {
  const site = getSite();
  const email = site.contact.email;

  return (
    <>
      {/* Page hero */}
      <section
        aria-labelledby="contact-hero-heading"
        className="relative overflow-hidden bg-slate-50 py-16 md:py-24"
      >
        <div aria-hidden="true" className="hidden" />
        <div
          aria-hidden="true"
          className="hidden"
        />
        <div
          aria-hidden="true"
          className="hidden"
        />
        <Container className="relative">
          <div className="flex max-w-3xl flex-col items-start gap-5">
            <Eyebrow>Contact</Eyebrow>
            <h1 id="contact-hero-heading" className="display-lg text-ink-950">
              Contact the{" "}
              <span className="text-saffron-600">movement</span>.
            </h1>
            <p className="lede">
              One team coordinates the movement nationally. Tell us who you are
              and we will route your message to the right desk.
            </p>
          </div>
        </Container>
      </section>

      {/* Audience blocks */}
      <section aria-labelledby="contact-audiences-heading" className="section-pad bg-white">
        <Container>
          <h2 id="contact-audiences-heading" className="sr-only">
            Who to write to
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {audiences.map((a, i) => (
              <Reveal
                key={a.id}
                delay={Math.min(i, 3) as 0 | 1 | 2 | 3}
                className="h-full"
              >
                <GlowCard className="card-hover flex h-full flex-col gap-4 rounded-3xl border border-line bg-white p-8">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[11px] tabular-nums tracking-widest text-ink-400"
                  >
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-ink-950">
                    {a.title}
                  </h3>
                  <p className="leading-relaxed text-ink-800">{a.text}</p>
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent(a.subject)}`}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-saffron-600 underline-offset-4 hover:underline"
                  >
                    {a.linkLabel}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-4 w-4"
                    >
                      <path
                        d="M5 12h14m0 0-6-6m6 6-6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Coordination office + expectations */}
      <section aria-labelledby="contact-office-heading" className="section-pad bg-mist">
        <Container>
          <div className="grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
            <Reveal className="glass rounded-3xl p-8">
              <SectionHeading
                id="contact-office-heading"
                eyebrow="Coordination office"
                size="md"
                title={
                  <>
                    Reach us{" "}
                    <span className="text-green-700">directly</span>.
                  </>
                }
              />
              <dl className="mt-6 space-y-5 text-ink-800">
                <div>
                  <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${email}`}
                      className="font-semibold text-saffron-600 underline-offset-4 hover:underline"
                    >
                      {email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Phone
                  </dt>
                  <dd className="mt-1">{site.contact.phone}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Address
                  </dt>
                  <dd className="mt-1">{site.contact.address}</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={1} className="glass rounded-3xl p-8">
              <h3 className="font-display text-lg font-semibold text-ink-950">
                What to expect
              </h3>
              <div className="mt-5 space-y-4 leading-relaxed text-ink-800">
                <p>
                  The coordination team reads every message. Participation and
                  hosting enquiries are typically answered within a few working
                  days; partnership and media enquiries are routed to the
                  relevant desk and may take slightly longer.
                </p>
                <p>
                  During application windows and event weeks, response times can
                  stretch — if your message is time-sensitive, say so in the
                  subject line.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
