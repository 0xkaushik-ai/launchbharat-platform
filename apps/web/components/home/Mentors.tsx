import {
  Badge,
  Container,
  GlowCard,
  Reveal,
  SectionHeading,
} from "@/components/ui";
import { getMentors, type Mentor } from "@/lib/content";

/**
 * Abstract archetype mark for un-announced mentor plates:
 * thin gradient arcs with node dots — the network a mentor plugs into.
 */
function ArchetypeMark() {
  return (
    <svg
      viewBox="0 0 96 96"
      className="absolute inset-0 h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      {/* faint inner arc */}
      <path
        d="M24 88 A64 64 0 0 1 88 24"
        stroke="currentColor"
        strokeWidth={1}
        className="text-blue-800/30"
      />
      {/* primary iris arc */}
      <path
        d="M8 88 A80 80 0 0 1 88 8"
        stroke="currentColor"
        strokeWidth={1}
        className="text-iris-600/40"
      />
      {/* node dots along the arc */}
      <g className="text-iris-600/50" fill="currentColor">
        <circle cx="8" cy="88" r="1.6" />
        <circle cx="31.4" cy="31.4" r="1.6" />
        <circle cx="88" cy="8" r="1.6" />
      </g>
      {/* subtle sky network nodes */}
      <g className="text-blue-800/40" fill="currentColor">
        <circle cx="14.1" cy="57.4" r="1.3" />
        <circle cx="57.4" cy="14.1" r="1.3" />
        <circle cx="42.7" cy="42.7" r="1.1" />
      </g>
    </svg>
  );
}

function MentorPlate({ mentor, index }: { mentor: Mentor; index: number }) {
  return (
    <GlowCard className="card-hover h-full rounded-2xl border border-line bg-white">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl p-3">
        {/* Avatar area — archetype treatment until the profile is confirmed */}
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-iris-400 to-orchid-400">
          <ArchetypeMark />
          <span
            aria-hidden="true"
            className="absolute left-4 top-3 font-mono text-xs font-medium tabular-nums tracking-widest text-ink-400"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="relative px-4 text-center font-display text-lg font-semibold text-iris-600">
            {mentor.designation}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-3 pt-5">
          <h3 className="font-display text-base font-semibold text-ink-950">
            {mentor.announced ? mentor.name : mentor.designation}
          </h3>
          <p className="mt-1 text-sm text-ink-600">{mentor.organization}</p>

          {mentor.expertise.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Expertise">
              {mentor.expertise.slice(0, 2).map((skill) => (
                <li key={skill}>
                  <Badge tone="neutral">{skill}</Badge>
                </li>
              ))}
            </ul>
          )}

          {!mentor.announced && (
            <p className="mt-5 flex flex-1 items-end border-t border-line pt-4">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-400">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-iris-500 animate-pulse-dot"
                />
                To be announced
              </span>
            </p>
          )}
        </div>
      </article>
    </GlowCard>
  );
}

export default function Mentors() {
  const mentors = getMentors();

  return (
    <section
      aria-labelledby="mentors-heading"
      className="section-pad relative overflow-hidden bg-white"
    >
      <Container className="relative">
        <SectionHeading
          id="mentors-heading"
          number="10"
          eyebrow="Mentors & leaders"
          title={
            <>
              Learn from those who{" "}
              <span className="text-gradient-brand">built</span> before you.
            </>
          }
          lede="Direct access to founders, investors, industry leaders and academics — the people who have taken ideas from a first sketch to a working company, mentoring every stage of the journey."
        />

        <Reveal delay={1}>
          <p className="mt-6 text-sm text-ink-600">
            The founding mentor cohort is being onboarded — profiles publish
            here as they are confirmed.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mentors.map((mentor, i) => (
            <Reveal
              key={mentor.id}
              as="li"
              delay={(i % 4) as 0 | 1 | 2 | 3}
              className="h-full"
            >
              <MentorPlate mentor={mentor} index={i} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
