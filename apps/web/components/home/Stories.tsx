import {
  Badge,
  Container,
  GlowCard,
  Reveal,
  SectionHeading,
} from "@/components/ui";
import { getStories, type Story } from "@/lib/content";

function StoryArc({ story }: { story: Story }) {
  return (
    <GlowCard className="glass glass-hover h-full rounded-3xl">
      <article className="flex h-full flex-col p-8">
        <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-iris-600">
          {story.persona}
        </h3>
        <div className="mt-3">
          <Badge tone="iris">{story.track}</Badge>
        </div>

        {/* Vertical arc rail — gradient line connecting gradient stage dots */}
        <ol className="relative mt-8 flex flex-1 flex-col gap-8">
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-[3.5px] top-3 w-px bg-gradient-to-b from-cyan-400 via-iris-400 to-orchid-400"
          />
          {story.stages.map((stage) => (
            <li key={stage.stage} className="relative pl-7">
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-cyan-400 to-orchid-400 shadow-[0_0_8px_rgba(234,124,12,0.45)]"
              />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink-400">
                {stage.stage}
              </p>
              <p className="mt-2 font-display text-xl font-semibold leading-snug text-ink-950">
                &ldquo;{stage.quote}&rdquo;
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {stage.text}
              </p>
            </li>
          ))}
        </ol>
      </article>
    </GlowCard>
  );
}

export default function Stories() {
  const stories = getStories();

  return (
    <section
      aria-labelledby="stories-heading"
      className="section-pad relative overflow-hidden bg-slate-50"
    >

      <Container className="relative">
        <SectionHeading
          id="stories-heading"
          number="12"
          eyebrow="Stories"
          title={
            <>
              The ideas that could shape{" "}
              <span className="text-gradient-brand">tomorrow</span>.
            </>
          }
          lede="The journeys this movement is built to create."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {stories.map((story, i) => (
            <Reveal
              key={story.id}
              delay={Math.min(i + 1, 3) as 1 | 2 | 3}
              className="h-full"
            >
              <StoryArc story={story} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={3}>
          <p className="mt-8 text-xs text-ink-600">
            Journey archetypes — real participant stories publish here as the
            founding cohort advances.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
