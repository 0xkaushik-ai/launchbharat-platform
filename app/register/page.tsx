import type { Metadata } from "next";
import { getFaq, getJourney } from "@/lib/content";
import { Eyebrow } from "@/components/ui";
import RegistrationForm from "@/components/register/RegistrationForm";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Apply to join LaunchBharat — a nationwide startup and innovation movement. Free to apply, open to students, innovators and early-stage startups at any stage.",
};

const REASSURANCES = [
  "Free to apply — joining the movement costs nothing.",
  "Any stage is welcome. An idea, or even curiosity, is enough.",
  "Every application receives a reference ID and a response.",
];

export default function RegisterPage() {
  const journey = getJourney();
  const faqs = getFaq().slice(0, 2);

  return (
    <div className="bg-white lg:grid lg:grid-cols-12">
      {/* Left rail — light lilac, sticky on large screens */}
      <section
        aria-labelledby="register-hero-heading"
        className="relative overflow-hidden bg-slate-50 lg:col-span-5"
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

        <div className="relative h-full px-5 py-14 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
          <div className="mx-auto flex max-w-xl flex-col items-start lg:sticky lg:top-24 lg:mx-0">
            <Eyebrow>Registration</Eyebrow>
            <h1
              id="register-hero-heading"
              className="display-lg mt-5 text-ink-950"
            >
              Join the <span className="text-saffron-600">movement</span>.
            </h1>
            <p className="lede mt-5">
              One application places you inside a nationwide journey — from
              discovering your idea to standing on India&apos;s national stage.
            </p>
            <span aria-hidden="true" className="tricolor-rule mt-6 w-20" />

            {/* The journey, in miniature */}
            <div className="mt-10 w-full">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-600">
                The journey ahead
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {journey.map((stage) => (
                  <li
                    key={stage.id}
                    className="flex items-center gap-3 text-sm font-medium text-ink-800"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-saffron-600 font-mono text-[10px] font-bold tabular-nums text-white"
                    >
                      {stage.number}
                    </span>
                    {stage.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reassurance */}
            <ul className="mt-10 w-full space-y-3 border-t border-line pt-8">
              {REASSURANCES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-ink-800"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                  >
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {/* Two FAQ entries — hidden on small screens for a condensed hero */}
            <div className="mt-10 hidden w-full border-t border-line pt-8 lg:block">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-600">
                Before you apply
              </h2>
              <dl className="mt-4 space-y-6">
                {faqs.map((faq) => (
                  <div key={faq.q}>
                    <dt className="text-sm font-semibold text-ink-950">
                      {faq.q}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      {faq.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Right — the application */}
      <section
        aria-label="Registration form"
        className="bg-white lg:col-span-7"
      >
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
