import type { Metadata } from "next";
import { Container, Eyebrow, Reveal } from "@/components/ui";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing use of the LaunchBharat platform and participation in the movement — including the principle that participants retain the intellectual property in their ideas.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const site = getSite();

  return (
    <>
      {/* Page hero */}
      <section
        aria-labelledby="terms-hero-heading"
        className="relative overflow-hidden bg-slate-50 py-16 md:py-20"
      >
        <Container className="relative">
          <div className="flex max-w-3xl flex-col items-start gap-5">
            <Eyebrow>Legal</Eyebrow>
            <h1 id="terms-hero-heading" className="display-lg text-ink-950">
              Terms of <span className="text-gradient-brand">use</span>.
            </h1>
          </div>
        </Container>
      </section>

      <section aria-label="Terms of use" className="section-pad bg-white">
        <Container>
          <Reveal className="max-w-prose">
            <p className="text-sm italic text-ink-400">
              Template for review by legal counsel prior to publication.
            </p>

            <div className="mt-10 space-y-12 leading-relaxed text-ink-800">
              <div>
                <h2 className="display-md text-ink-950">1. The platform</h2>
                <p className="mt-4">
                  These terms govern your use of the website operated by{" "}
                  {site.legalName} (&quot;LaunchBharat&quot;, &quot;we&quot;)
                  and your participation in the movement&apos;s programs. By
                  using the platform or applying to participate, you accept
                  these terms. If you use the platform on behalf of an
                  institution or organization, you confirm you are authorized
                  to do so.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">2. Registration &amp; accuracy</h2>
                <p className="mt-4">
                  Applications must be truthful. You are responsible for the
                  accuracy of the information you submit — including your
                  identity, institution and the description of your idea or
                  startup — and for keeping your contact details current.
                  Applications containing false or misleading information may
                  be declined or removed from the movement at any stage.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">3. Intellectual property</h2>
                <p className="mt-4">
                  <strong className="font-semibold text-ink-950">
                    Participants retain all intellectual property in their
                    ideas, submissions and ventures.
                  </strong>{" "}
                  Applying to or advancing through LaunchBharat transfers no
                  ownership to us or to any partner. By participating, you
                  grant LaunchBharat a limited, non-exclusive licence to review
                  your submission for evaluation and to reference your
                  participation (for example, your team name and a short
                  description) in movement communications — nothing more.
                  Evaluation panels and mentors are engaged on the
                  understanding that submissions are shared for assessment and
                  guidance only.
                </p>
                <p className="mt-4">
                  The LaunchBharat name, wordmark and platform content are the
                  property of {site.legalName} and may not be used without
                  permission.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">4. Acceptable use</h2>
                <p className="mt-4">You agree not to:</p>
                <ul className="mt-4 list-disc space-y-2 pl-6">
                  <li>
                    misrepresent yourself, your institution or your venture;
                  </li>
                  <li>
                    submit material that infringes another person&apos;s rights
                    or that you do not have the right to share;
                  </li>
                  <li>
                    interfere with the operation or security of the platform;
                    or
                  </li>
                  <li>
                    use the platform to harass, spam or solicit other
                    participants.
                  </li>
                </ul>
                <p className="mt-4">
                  We may suspend access or participation where these standards
                  are breached.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">5. Programs &amp; changes</h2>
                <p className="mt-4">
                  Event dates, venues, formats and progression criteria are
                  published on the platform and may change; the platform is the
                  authoritative source. Selection and advancement decisions are
                  made by the movement&apos;s evaluation panels and are final.
                  Where a program carries a participation fee, it is stated
                  clearly before you commit.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">6. Liability</h2>
                <p className="mt-4">
                  The platform is provided on an &quot;as is&quot; basis. To the
                  maximum extent permitted by law, {site.legalName} is not
                  liable for indirect or consequential loss arising from use of
                  the platform or participation in the movement, including
                  decisions made in reliance on program outcomes. Nothing in
                  these terms excludes liability that cannot be excluded under
                  Indian law.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">7. Governing law</h2>
                <p className="mt-4">
                  These terms are governed by the laws of India. Courts at New
                  Delhi have exclusive jurisdiction over disputes arising from
                  these terms or from participation in the movement.
                </p>
              </div>

              <div>
                <h2 className="display-md text-ink-950">8. Contact</h2>
                <p className="mt-4">
                  Questions about these terms should be sent to{" "}
                  <a
                    href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Terms — LaunchBharat")}`}
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
