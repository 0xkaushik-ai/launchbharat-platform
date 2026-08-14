import type { Metadata } from "next";
import { Container, Eyebrow, Reveal, SectionHeading } from "@/components/ui";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "LaunchBharat's accessibility commitment — WCAG 2.1 AA target, what is implemented, known limitations, language support and how to send feedback.",
  alternates: { canonical: "/accessibility" },
};

const implemented = [
  {
    title: "Keyboard navigation",
    text: "Every interaction — menus, filters, accordions, forms and map controls — is operable with a keyboard alone.",
  },
  {
    title: "Visible focus states",
    text: "A consistent, high-visibility focus outline follows keyboard users across the entire site.",
  },
  {
    title: "Color contrast",
    text: "Text is set against its background at a contrast ratio of at least 4.5:1, on light and dark surfaces alike.",
  },
  {
    title: "Reduced-motion support",
    text: "Scroll reveals, counters and animations respect the prefers-reduced-motion system setting and settle instantly.",
  },
  {
    title: "Semantic structure",
    text: "Landmarks, labelled sections and a logical heading order let assistive technology map every page.",
  },
  {
    title: "Screen-reader labelling",
    text: "Controls carry accessible names; decorative graphics are hidden from the accessibility tree.",
  },
  {
    title: "Scalable text",
    text: "The layout is built in relative units and remains usable when text is enlarged up to 200 percent.",
  },
];

export default function AccessibilityPage() {
  const site = getSite();

  return (
    <>
      {/* Page hero */}
      <section
        aria-labelledby="a11y-hero-heading"
        className="relative overflow-hidden bg-slate-50 py-16 md:py-24"
      >
        <Container className="relative">
          <div className="flex max-w-3xl flex-col items-start gap-5">
            <Eyebrow>Accessibility</Eyebrow>
            <h1 id="a11y-hero-heading" className="display-lg text-ink-950">
              Accessibility for{" "}
              <span className="text-gradient-brand">everyone</span>.
            </h1>
            <p className="lede">
              A movement for all of India has to be usable by all of India.
            </p>
          </div>
        </Container>
      </section>

      {/* Commitment */}
      <section aria-labelledby="a11y-commitment-heading" className="section-pad bg-white">
        <Container>
          <Reveal className="max-w-prose">
            <SectionHeading
              id="a11y-commitment-heading"
              number="01"
              eyebrow="Commitment"
              size="md"
              title={
                <>
                  Our <span className="text-gradient-brand">commitment</span>.
                </>
              }
            />
            <div className="mt-6 space-y-5 leading-relaxed text-ink-800">
              <p>
                LaunchBharat is committed to making this platform accessible to
                the widest possible audience, regardless of ability or
                technology. We target conformance with the{" "}
                <strong className="font-semibold text-ink-950">
                  Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
                </strong>
                , and treat accessibility as a design constraint, not an
                afterthought.
              </p>
              <p>
                Accessibility work is continuous. Each release is reviewed
                against the guidelines, and issues reported by users are
                prioritized alongside functional defects.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* What is implemented */}
      <section aria-labelledby="a11y-implemented-heading" className="section-pad bg-mist">
        <Container>
          <Reveal>
            <SectionHeading
              id="a11y-implemented-heading"
              number="02"
              eyebrow="In place today"
              size="md"
              title={
                <>
                  What is{" "}
                  <span className="text-gradient-brand">implemented</span>.
                </>
              }
            />
          </Reveal>
          <ul className="mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {implemented.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={Math.min(i % 3, 3) as 0 | 1 | 2 | 3}
                className="card-hover h-full rounded-2xl border border-line bg-white p-6"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] tabular-nums tracking-widest text-ink-400"
                >
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-base font-semibold text-ink-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-800">
                  {item.text}
                </p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Language support */}
      <section id="language" aria-labelledby="a11y-language-heading" className="section-pad bg-white">
        <Container>
          <Reveal className="max-w-prose">
            <SectionHeading
              id="a11y-language-heading"
              number="03"
              eyebrow="Language"
              size="md"
              title={
                <>
                  Language <span className="text-gradient-brand">support</span>.
                </>
              }
            />
            <div className="mt-6 space-y-5 leading-relaxed text-ink-800">
              <p>
                The platform is currently available in English. A Hindi
                (हिन्दी) interface is planned as the movement scales, and the
                design system is already built to carry Devanagari type.
              </p>
              <p lang="hi" className="font-devanagari text-xl text-ink-950">
                {site.taglineHi}
              </p>
              <p>
                Event-level materials in regional languages are prepared
                together with host institutions where programs run.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Known limitations + feedback */}
      <section aria-labelledby="a11y-feedback-heading" className="section-pad bg-slate-50">
        <Container>
          <Reveal className="glass max-w-prose rounded-3xl p-8 md:p-10">
            <SectionHeading
              id="a11y-feedback-heading"
              number="04"
              eyebrow="Feedback"
              size="md"
              title={
                <>
                  Known limitations &amp;{" "}
                  <span className="text-gradient-brand">feedback</span>.
                </>
              }
            />
            <div className="mt-6 space-y-5 leading-relaxed text-ink-800">
              <p>
                Some content has known limitations we are working through: the
                stylized India network visual is decorative and its underlying
                data is presented in text elsewhere on the page; downloadable
                media assets published in future may not all be available in
                accessible formats immediately.
              </p>
              <p>
                If you encounter a barrier anywhere on this platform, we want
                to know. Describe what you were trying to do, the page you were
                on and the assistive technology or browser you use — we will
                respond and prioritize a fix.
              </p>
              <p>
                <a
                  href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Accessibility")}`}
                  className="font-semibold text-iris-600 underline-offset-4 hover:underline"
                >
                  Report an accessibility issue
                </a>
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
