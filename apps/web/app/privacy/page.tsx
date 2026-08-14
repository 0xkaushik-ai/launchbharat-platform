import type { Metadata } from "next";
import { Container, Eyebrow, Reveal } from "@/components/ui";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How LaunchBharat collects, uses, stores and protects personal data — and the rights applicants and participants have over their information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const site = getSite();

  return (
    <>
      {/* Page hero */}
      <section
        aria-labelledby="privacy-hero-heading"
        className="relative overflow-hidden bg-slate-50 py-16 md:py-20"
      >
        <Container className="relative">
          <div className="flex max-w-3xl flex-col items-start gap-5">
            <Eyebrow>Legal</Eyebrow>
            <h1 id="privacy-hero-heading" className="display-lg text-ink-950">
              <span className="text-gradient-brand">Privacy</span> policy.
            </h1>
          </div>
        </Container>
      </section>

      <section aria-label="Privacy policy" className="section-pad bg-white">
        <Container>
          <Reveal className="max-w-prose">
            <p className="text-sm italic text-ink-400">
              Template for review by legal counsel prior to publication.
            </p>

            <div className="mt-10 space-y-12 leading-relaxed text-ink-800">
              <div>
                <h2 className="display-md text-ink-950">1. What this policy covers</h2>
                <p className="mt-4">
                  This policy describes how {site.legalName} (&quot;LaunchBharat&quot;,
                  &quot;we&quot;) collects, uses, stores and shares personal data
                  through {site.url.replace("https://", "")} and through the
                  movement&apos;s programs. It applies to applicants,
                  participants, institutional contacts, partners and visitors to
                  the website.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">2. Data we collect</h2>
                <p className="mt-4">
                  We collect only what the movement needs to operate:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6">
                  <li>
                    <strong className="font-semibold text-ink-950">
                      Registration and application data
                    </strong>{" "}
                    — the information the application form gathers, including
                    your name, email address, phone number, city and state,
                    institution or organization, the track you apply under, and
                    the description and stage of your idea or startup.
                  </li>
                  <li>
                    <strong className="font-semibold text-ink-950">
                      Correspondence
                    </strong>{" "}
                    — messages you send to the coordination team by email or
                    through published contact channels.
                  </li>
                  <li>
                    <strong className="font-semibold text-ink-950">
                      Event participation data
                    </strong>{" "}
                    — attendance and progression records for programs you take
                    part in.
                  </li>
                  <li>
                    <strong className="font-semibold text-ink-950">
                      Technical data
                    </strong>{" "}
                    — limited, aggregate usage information as described in the
                    Cookie Policy.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="display-md text-ink-950">3. Why we use it</h2>
                <p className="mt-4">We process personal data to:</p>
                <ul className="mt-4 list-disc space-y-2 pl-6">
                  <li>review and manage applications to the movement;</li>
                  <li>
                    operate programs — scheduling, communication, mentor
                    matching and progression toward regional and national
                    stages;
                  </li>
                  <li>
                    send updates about your application and about programs
                    relevant to you;
                  </li>
                  <li>maintain the security and integrity of the platform; and</li>
                  <li>meet legal obligations that apply to us.</li>
                </ul>
              </div>

              <div>
                <h2 className="display-md text-ink-950">4. Where it is stored</h2>
                <p className="mt-4">
                  Application data submitted through the website is stored on
                  the movement&apos;s own infrastructure with access restricted
                  to the coordination team. Reasonable technical and
                  organizational measures are applied to protect it against
                  unauthorized access, alteration or loss.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">5. Who we share it with</h2>
                <p className="mt-4">
                  Personal data is{" "}
                  <strong className="font-semibold text-ink-950">
                    never sold
                  </strong>
                  . It is shared with ecosystem partners — such as host
                  institutions, incubators, mentors or investors — only with
                  your consent and only to the extent needed for your
                  participation, for example when your team advances to a
                  program a partner operates. Service providers who process
                  data on our behalf are bound by confidentiality and act only
                  on our instructions. We may disclose data where the law
                  requires it.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">6. How long we keep it</h2>
                <p className="mt-4">
                  Application and participation records are retained for the
                  duration of the movement cycle you take part in and for a
                  reasonable period afterwards for record-keeping, after which
                  they are deleted or anonymized. You may request earlier
                  deletion at any time, subject to legal retention requirements.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">7. Your rights</h2>
                <p className="mt-4">
                  Subject to applicable Indian law, including the Digital
                  Personal Data Protection Act, 2023, you may:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6">
                  <li>request access to the personal data we hold about you;</li>
                  <li>request correction of inaccurate or incomplete data;</li>
                  <li>request deletion of your data;</li>
                  <li>withdraw consent you have previously given; and</li>
                  <li>raise a grievance about how your data is handled.</li>
                </ul>
                <p className="mt-4">
                  Requests are honored within a reasonable time and free of
                  charge.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">8. Contact</h2>
                <p className="mt-4">
                  Questions, requests and grievances relating to this policy
                  should be sent to{" "}
                  <a
                    href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Privacy — LaunchBharat")}`}
                    className="font-semibold text-iris-600 underline-offset-4 hover:underline"
                  >
                    {site.contact.email}
                  </a>{" "}
                  or by post to {site.contact.address}.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
