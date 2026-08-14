import type { Metadata } from "next";
import { Button, Container, Eyebrow, Reveal } from "@/components/ui";
import { getPartners, type PartnerCategory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "The partner framework behind LaunchBharat — government initiatives, institutions, incubators, accelerators, investors, industry and strategic partners, formalized before publication.",
};

/** What each partner category does inside the movement. */
const CATEGORY_ROLES: Record<string, string> = {
  government:
    "Government partners lend policy alignment and public-ecosystem reach, carrying the movement into every state.",
  institutions:
    "Institutional partners host roadshows and bootcamps on campus and open the platform to their students.",
  incubators:
    "Incubation partners receive advancing teams into structured programs once the movement surfaces them.",
  accelerators:
    "Acceleration partners fast-track the strongest ideas toward capital readiness beyond the Grand Finale.",
  investors:
    "Investor partners get first access to a vetted national pipeline of student and grassroots ventures.",
  industry:
    "Industry partners set real problem statements and adopt the solutions the national cohort builds.",
  strategic:
    "Strategic partners amplify the movement — media reach, community networks and knowledge infrastructure.",
};

/**
 * Slot plates for a category: confirmed partners render as solid plates;
 * remaining CMS slots render as labelled open frames. Never a generated logo.
 */
function SlotGrid({ category }: { category: PartnerCategory }) {
  const openSlots = Math.max(category.slots - category.partners.length, 0);

  return (
    <ul
      aria-label={`${category.category} — partner slots`}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3"
    >
      {category.partners.map((partner) => (
        <li
          key={partner.name}
          className="card-hover flex aspect-[3/2] items-center justify-center rounded-xl border border-line bg-white px-3"
        >
          <span className="text-center text-sm font-semibold text-ink-950">
            {partner.name}
          </span>
        </li>
      ))}
      {Array.from({ length: openSlots }).map((_, i) => (
        <li
          key={i}
          className="flex aspect-[3/2] items-center justify-center rounded-xl border border-dashed border-iris-400/50 bg-white/70"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
            Partner slot
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function PartnersPage() {
  const categories = getPartners();

  return (
    <>
      {/* Light hero with aurora wash */}
      <section
        aria-labelledby="partners-hero-heading"
        className="relative overflow-hidden bg-white py-16 md:py-24"
      >
        <div aria-hidden="true" className="aurora-wash pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Eyebrow>Partners</Eyebrow>
          <h1
            id="partners-hero-heading"
            className="display-lg mt-5 max-w-4xl text-ink-950"
          >
            The <span className="text-gradient-brand">ecosystem</span> behind
            the movement.
          </h1>
          <p className="lede mt-5 max-w-2xl">
            Seven partner categories — government, institutions, incubators,
            accelerators, investors, industry and strategic partners —
            connected into one national pipeline from campus to capital.
          </p>

          <nav aria-label="Partner categories" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`#${category.id}`}
                    className="inline-block rounded-full border border-line bg-white/70 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-600 backdrop-blur transition-colors hover:border-iris-400 hover:text-iris-600"
                  >
                    {category.category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-8 text-sm text-ink-600">
            Partners appear here only after formal confirmation — every mark on
            this platform is verified.
          </p>
        </Container>
      </section>

      {/* Category framework */}
      {categories.map((category, i) => (
        <section
          key={category.id}
          id={category.id}
          aria-labelledby={`${category.id}-heading`}
          className={`scroll-mt-24 border-t border-line py-16 md:py-20 ${
            i % 2 === 1 ? "bg-paper" : "bg-white"
          }`}
        >
          <Container>
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
                <div>
                  <p
                    aria-hidden="true"
                    className="font-mono text-xs font-medium tabular-nums tracking-widest text-ink-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2
                    id={`${category.id}-heading`}
                    className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-950"
                  >
                    {category.category}
                  </h2>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-ink-800">
                    {category.description}
                  </p>
                  {CATEGORY_ROLES[category.id] && (
                    <p className="mt-5 max-w-md border-l-2 border-iris-400/60 pl-4 text-sm leading-relaxed text-ink-600">
                      {CATEGORY_ROLES[category.id]}
                    </p>
                  )}
                  <p className="chip-mono mt-6">
                    {Math.max(category.slots - category.partners.length, 0)}{" "}
                    partner slots open
                  </p>
                </div>
                <SlotGrid category={category} />
              </div>
            </Reveal>
          </Container>
        </section>
      ))}

      {/* Become a partner band */}
      <section
        aria-labelledby="become-partner-heading"
        className="section-pad relative overflow-hidden border-t border-line bg-mist"
      >

        <Container className="relative text-center">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <div className="tricolor-rule w-20" aria-hidden="true" />
            <h2 id="become-partner-heading" className="display-md text-ink-950">
              Become a <span className="text-gradient-brand">partner</span>.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-ink-800">
              Whether you run an incubator, an investment fund, a company or a
              campus — there is a defined place for you in the framework. Tell
              us where you fit and we take it from there.
            </p>
            <Button href="/contact" variant="primary">
              Start the conversation
            </Button>
            <p className="text-xs text-ink-600">
              All partnerships are formalized through a written agreement
              before any name or mark is published on this platform.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
