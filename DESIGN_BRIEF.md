# LaunchBharat — Design Brief v3 ("Light Futuristic")  ← CURRENT

> v3 SUPERSEDES v1 (institutional) and v2 (dark cybercon). The site is now
> **LIGHT, MINIMAL and FUTURISTIC**: white/off-white canvas, light-blue → pinkish-purple
> gradient accents, soft frosted glass, huge whitespace, Space Grotesk display type,
> sentence-case headlines. Think modern product-grade design (Linear/Stripe-level polish)
> applied to a national movement. You are ALLOWED to change section layouts — improve them.

Brand line: **"India's next generation of entrepreneurs starts here."**
Tagline: **Discover. Empower. Connect. Launch.**
Still NOT: college fest, hackathon, dark theme, heavy borders, cramped layouts, emojis, fake credibility.

## Stack
Next.js 16 App Router, TS, Tailwind v4 (tokens in `app/globals.css`), React 19. Server components by default. **No new deps. No emoji.** Icons: inline SVG 24px, stroke currentColor 1.5, aria-hidden.

## Color system (LIGHT)
- Canvas: `bg-white`, alternates `bg-paper #f8fafc`, `bg-mist #f3f6fd`, `bg-lilac #faf8ff`. **NO dark section backgrounds** (`bg-navy-*` is reserved for the TerminalCard code-card and tiny contrast details only).
- Text: `text-ink-950 #0b1220` headings, `text-ink-800 #384359` body, `text-ink-600 #64748b` dim, `text-ink-400` faint.
- Brand accents: sky/light-blue (`sky-400/500`, `cyan-400/500 #7dd3fc/#38bdf8`, `blue-500/600`) + pinkish purple (`iris-400/500/600 = violet`, `orchid-300/400/500 = pink-purple`). Gradient always flows sky → iris → orchid.
- Status: `green-600/500` (open/live), soft tints for badges (auto via Badge tones incl. new `iris`).
- National identity: saffron/green appear ONLY as micro-accents (small `.tricolor-rule` bar, one per page max). No saffron CTAs anymore.
- Borders: `border-line #e5eaf4`. Shadows: soft, blurred, slate-tinted (see `.card-hover`, `.glass`).

## Typography
- Display: `.display-xl/lg/md` — **Space Grotesk, sentence case** (no more ALL-CAPS headlines). Write headlines like: "India's next generation of entrepreneurs starts here." / "More than an event." / "From campus to the nation."
  **REWRITE any ALL-CAPS copy in your files to sentence case.** Keep them short and confident.
- Gradient accent: wrap 1-2 key words per major heading in `.text-gradient-brand` (sky→iris→orchid, animated) or `.text-gradient-iris`. Never whole headings, never body text.
- `.lede` intro paragraphs. Mono (`font-mono`) only for micro-labels: chips, indices (`01`), stat digits, code card.
- `<Eyebrow>` renders a modern pill with gradient dot — pass short labels ("The Movement").
- `.text-outline` = huge watermark word (slate 8% stroke) — optional, one per page.

## Surfaces & effects
- `.glass` frosted white panel (use for cards over tinted/aurora sections); on plain white sections prefer clean `bg-white border border-line rounded-2xl/3xl` cards + `.card-hover`.
- `.glass-hover` lift + violet glow; `<GlowCard>` pointer spotlight (violet); `.spotlight-cyan` variant.
- `.aurora-wash` — soft sky/pink/violet radial wash layer (absolute inset-0) for hero/CTA sections; combine with 1-2 `.orb orb-sky|orb-iris|orb-pink` + `animate-float-slow/slower`.
- `.grid-texture` subtle slate hairline grid (has radial mask built in); `.neo-border` gradient hairline border; `.corner-frame` rounded gradient corners (featured panels); `.chip-mono` pill chips; `<Marquee>` ticker (separator now violet).
- Rounding: generous — `rounded-2xl`/`rounded-3xl` cards, `rounded-full` pills/buttons.
- Buttons (shared): primary = sky→violet→pink gradient pill + sheen; secondary = white glass pill; outline-dark = subtle outline pill; ghost = text. **Button labels sentence case** ("Register now").

## THE MAP (upgraded — use it proudly)
`<IndiaDotMap>` now renders the **geographically accurate India boundary** (real GeoJSON-derived paths, incl. Andaman & Lakshadweep) with a sky→violet→pink gradient outline and soft gradient fill, plus optional interior dot-matrix.
```tsx
<IndiaDotMap step={1.1} dotClassName="fill-sky-400/30" showDots showOutline className="w-full h-auto">
  {/* overlays in the same viewBox space via project(lon,lat) from @/lib/india */}
</IndiaDotMap>
```
`INDIA_VIEW` is now `{w:100,h:111.93}`. Markers: gradient/violet glow dots with `animate-pulse-dot` halos; connection lines thin `stroke-[#8b5cf6]/25` or sky; selected = ring + stronger glow. Make map sections feel ALIVE: pulsing city halos, draw-in lines (`animate-dash-draw` + `--dash-length`), hover/selection glow.

## Motion & interactivity
`Reveal` entrances everywhere; counters; marquee; pulse halos; line draw-ins; hover lift+glow on all cards; gradient animates subtly (`.text-gradient-brand`). Respect `prefers-reduced-motion` (CSS handles utilities; JS must check). Subtle > flashy — this design is CALM; whitespace and precision carry it.

## Content layer — unchanged rules
Loaders in `@/lib/content`. locations.json = REAL 12-city national tour (venue null → "Venue to be announced"). Honest-placeholder rules stand: `XX+` stat patterns, one subtle "Illustrative — managed via the CMS" caption where sample data shows, "To be announced" mentors, empty partner slots, no fabricated logos/stats/backing.

## Accessibility (non-negotiable)
Labelled sections, keyboard operability, visible focus (violet), body contrast ≥ 4.5:1 (ink-800 on white ✓; never gradient/pastel body text), decorative SVG aria-hidden, reduced motion.

## Hard rules
- Edit ONLY files assigned to you. Never touch: app/globals.css, app/layout.tsx, app/page.tsx, components/ui/*, components/layout/*, lib/*, content/*.json, package.json.
- Sentence-case headlines and buttons everywhere (rewrite existing ALL-CAPS strings).
- Typecheck: export PATH="$HOME/.local/node/bin:$PATH"; cd /Users/tanishqupmanu/launchbharat && npx tsc --noEmit (ignore other agents' files).
- No images exist — typography, color, SVG only.
