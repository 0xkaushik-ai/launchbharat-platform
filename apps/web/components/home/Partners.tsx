import { Button, Container, Reveal, SectionHeading } from "@/components/ui";
import { getPartners, type PartnerCategory } from "@/lib/content";

/** Categories surfaced on the home page — the full framework lives at /partners. */
const HOME_CATEGORY_IDS = ["government", "institutions", "investors"];

/**
 * Open partner slots for a category: confirmed partners render as solid
 * plates; the remaining CMS slots render as labelled open frames.
 * Never a generated logo.
 */
function SlotStrip({ category }: { category: PartnerCategory }) {
  const openSlots = Math.max(category.slots - category.partners.length, 0);

  return (
    <ul
      aria-label={`${category.category} — partner slots`}
      className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6"
    >
      {category.partners.map((partner) => (
        <li
          key={partner.name}
          className="card-hover flex aspect-[3/2] items-center justify-center rounded-xl border border-line bg-white px-2"
        >
          <span className="text-center text-xs font-semibold text-ink-950">
            {partner.name}
          </span>
        </li>
      ))}
      {Array.from({ length: openSlots }).map((_, i) => (
        <li
          key={i}
          className="flex aspect-[3/2] items-center justify-center rounded-xl border border-dashed border-iris-400/50 bg-white/70"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-400">
            Partner slot
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Partners() {
  const categories = getPartners().filter((c) =>
    HOME_CATEGORY_IDS.includes(c.id),
  );

  return (
    <section
      aria-labelledby="partners-heading"
      className="section-pad relative overflow-hidden bg-paper"
    >
      <Container className="relative">
        <SectionHeading
          id="partners-heading"
          number="11"
          eyebrow="Ecosystem partners"
          title={
            <>
              The <span className="text-gradient-brand">ecosystem</span> behind
              the movement.
            </>
          }
          lede="Government initiatives, institutions, incubators, accelerators, investors, industry and strategic partners — seven categories, one national framework."
        />

        <Reveal delay={1}>
          <div className="mt-12 border-y border-line">
            {categories.map((category, i) => (
              <div
                key={category.id}
                className="grid gap-6 border-b border-line py-8 last:border-b-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
              >
                <div>
                  <div className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs font-medium tabular-nums tracking-widest text-ink-400"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-ink-950">
                      {category.category}
                    </h3>
                  </div>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-600">
                    {category.description}
                  </p>
                </div>
                <SlotStrip category={category} />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={2}
          className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-xl text-sm text-ink-600">
            Partners appear here only after formal confirmation — every mark on
            this platform is verified. Four further categories are detailed on
            the partners page.
          </p>
          <Button href="/partners" variant="outline-dark" className="shrink-0">
            Partner with the movement
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
