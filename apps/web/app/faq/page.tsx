import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Reveal } from "@/components/ui";
import { getFaq, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about participating in LaunchBharat — eligibility, cost, the journey to the Grand Finale, hosting on campus and how mentors and partners are selected.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const faq = getFaq();
  const site = getSite();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Page hero */}
      <section
        aria-labelledby="faq-hero-heading"
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
            <Eyebrow>Questions</Eyebrow>
            <h1 id="faq-hero-heading" className="display-lg text-ink-950">
              Frequently asked{" "}
              <span className="text-saffron-600">questions</span>.
            </h1>
            <p className="lede">
              Straight answers on participating, hosting and partnering — before
              you write to us.
            </p>
          </div>
        </Container>
      </section>

      {/* Accordion */}
      <section aria-labelledby="faq-list-heading" className="section-pad bg-white">
        <Container>
          <h2 id="faq-list-heading" className="sr-only">
            Questions and answers
          </h2>
          <Reveal className="mx-auto max-w-3xl">
            <div className="divide-y divide-line border-y border-line">
              {faq.map((item, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-semibold text-ink-950 transition-colors hover:text-saffron-600 [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-5 w-5 shrink-0 text-saffron-600 transition-transform duration-200 group-open:rotate-180"
                    >
                      <path
                        d="m6 9 6 6 6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <p className="max-w-prose pb-7 leading-relaxed text-ink-800">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
            <p className="mt-10 text-sm text-ink-800">
              Didn&apos;t find your answer? Write to the team at{" "}
              <a
                href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                  "Question — LaunchBharat",
                )}`}
                className="font-semibold text-saffron-600 underline-offset-4 hover:underline"
              >
                {site.contact.email}
              </a>{" "}
              or visit the{" "}
              <Link
                href="/contact"
                className="font-semibold text-saffron-600 underline-offset-4 hover:underline"
              >
                contact page
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
