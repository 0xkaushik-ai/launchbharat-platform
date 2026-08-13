# LaunchBharat — Content Operations Handbook (CMS.md)

This site runs on a **file-based content model**. Every public section renders
from typed loaders in `lib/content.ts`, which read the JSON files in
`content/`. Editing a JSON file and redeploying **is** the CMS. Components
never contain copy that belongs to content — which means the internal team can
operate the entire site without touching a line of TypeScript.

A read-only overview of the live content state (item counts, sample flags,
pending approvals) is available at [`/admin`](./app/admin/page.tsx) — the CMS
Console. It is excluded from search engines via `robots.ts` and page-level
`noindex`.

**The one rule that governs everything:** nothing on this platform presents
fabricated credibility. Placeholder data is always flagged (`sample: true`,
`value: null`, `announced: false`, `enabled: false`) and the UI renders it as
such — placeholder patterns, "to be announced" cards, illustrative captions.
Turning a placeholder into a fact is an editorial act that requires
verification first.

---

## 1. Content model map

| File | CMS module | Key fields | Controls |
| --- | --- | --- | --- |
| `content/site.json` | Website → Site settings | `name`, `legalName`, `tagline`, `taglineHi`, `headline`, `description`, `url`, `contact{email,phone,address}`, `social[]`, `nav[]`, `utilityNav[]`, `announcement{enabled,text,href}` | Global identity, SEO metadata base, header/footer navigation, announcement bar, contact page details, mailto targets sitewide |
| `content/branding.json` | Branding → Official associations | `associations[]` (`id`, `organization`, `wording`, `attribution`, `logo`, `enabled`, `placements[]`, `order`, `note`), `genericSupportLine{enabled,text}` | Which official associations (e.g. Startup India) appear, where, in what order, with what exact wording. See §4 — this file has the strictest rules on the site |
| `content/stats.json` | Analytics → National impact metrics | `items[]` (`id`, `label`, `value`, `placeholder`, `suffix`) | The impact counters. `value: null` renders the `placeholder` pattern (e.g. `XX+`) — never an invented number |
| `content/journey.json` | Website → Sections → Journey | `steps[]` (`number`, `title`, `text`) | The six-stage movement journey (home + movement page) |
| `content/why.json` | Website → Sections → Why LaunchBharat | `items[]` (`title`, `text`, `icon`) | The pillar grid. `icon` must be one of: `discover`, `empower`, `connect`, `mentor`, `invest`, `launch` |
| `content/who.json` | Website → Sections → Who should join | `items[]` (`title`, `text`) | Audience cards (students, founders, colleges, investors, …) |
| `content/events.json` | Events | `items[]` (`slug`, `sample`, `title`, `city`, `state`, `dateStart`, `dateEnd`, `venue`, `category`, `status`, `registrationOpen`, `summary`, `description`, `highlights[]`) | The events directory, each `/events/[slug]` detail page, sitemap entries |
| `content/locations.json` | Ecosystem → Locations | `items[]` (`city`, `state`, `lon`, `lat`, `status`, `sample`, count fields, `eventSlugs[]`) | Nodes on the India network map. Counts stay `null` until verified |
| `content/mentors.json` | Ecosystem → Mentors | `items[]` (`announced`, `name`, `designation`, `organization`, `expertise[]`, `photo`) | The mentor wall. `announced: false` renders an archetype card, never a name |
| `content/partners.json` | Ecosystem → Partners | `categories[]` (`category`, `description`, `slots`, `partners[]{name,logo,href}`) | The partner wall. Empty categories render as labelled open slots |
| `content/media.json` | Media | `items[]` (`type`, `sample`, `title`, `date`, `excerpt`, `body`), `downloads[]` (`title`, `format`, `available`) | Press releases / announcements / news, and the press-kit download list |
| `content/stories.json` | Website → Stories | `items[]` (`persona`, `track`, `stages[]{stage,quote,text}`) | Aspirational journey archetypes — **not** testimonials (see §8) |
| `content/grand-finale.json` | Events → Grand Finale | `date`, `dateDisplay`, `dateConfirmed`, `venue`, `city`, `registrationOpen`, `tagline`, `description`, `tracks[]`, `awards[]`, `speakersAnnounced` | The Grand Finale page and countdown |
| `content/faq.json` | Website → FAQ | `items[]` (`q`, `a`) | The FAQ page accordion and its FAQPage structured data |

Every file carries a `_cms` key with an inline reminder of its rules. Loaders
(`getSite()`, `getEvents()`, `getBranding()`, …) are defined in
`lib/content.ts`; each returns a typed shape that components rely on. Keep
field names and types exactly as they are — the TypeScript build will fail on
malformed content, which is a feature.

---

## 2. Editorial ground rules

1. **Verified-only.** No partner, mentor name, government backing, statistic
   or media coverage appears unless it is real and formally confirmed.
2. **Placeholders are visible as placeholders.** `sample: true` items trigger
   an "Illustrative — managed via the CMS" caption in the relevant section.
   Do not remove the flags to make sample data look real — replace the data.
3. **Tone.** Confident institutional English. Uppercase display headlines. No
   exclamation-mark stacking, no emojis, no hype adjectives.
4. **Dates** use ISO format (`YYYY-MM-DD`) in data; the UI formats them.
5. After any edit: run `npx tsc --noEmit`, preview locally, then deploy.

---

## 3. How-to guides

### 3.1 Add or edit an event

1. Open `content/events.json`.
2. Copy an existing item. Set a unique `id` (`ev-###`) and a unique,
   URL-safe `slug` (lowercase, hyphens — this becomes `/events/<slug>`).
3. Fill `title`, `city`, `state`, `dateStart` (and `dateEnd` for multi-day
   events, else `null`), `venue`, `category` (Roadshow / Bootcamp / Pitch Day /
   Forum / Orientation), `summary` (one sentence), `description`
   (one paragraph), `highlights` (3–5 short items).
4. Set `status`: `"upcoming"` or `"completed"`, and `registrationOpen`.
5. **Set `sample: false` only for a real, confirmed event.** While any
   `sample: true` item exists, the directory shows the illustrative caption.
6. To edit or cancel: edit the item in place, or delete the object from
   `items[]`. The detail page and sitemap entry follow automatically.

Before public launch, replace or remove all six seeded sample events.

### 3.2 Confirm the Grand Finale date

1. Open `content/grand-finale.json`.
2. Set `date` to the exact ISO datetime with IST offset, e.g.
   `"2026-12-19T10:00:00+05:30"` — the countdown runs off this.
3. Set `dateDisplay` to the human form, e.g. `"19 December 2026"`.
4. Set `dateConfirmed: true`. Until then the UI presents the date as
   tentative — do not set it to `true` "for now".
5. Update `venue` and `city` when locked; set `speakersAnnounced: true` only
   when named speakers are approved for publication.

### 3.3 Enable the Startup India association (or any official association)

**Do not enable this until the association is formally approved in writing.**
This is the highest-risk content on the site: claiming government association
without authorization is a legal and reputational failure, not a typo.

1. Obtain formal written approval, including the **exact approved wording**
   (e.g. "In Association with Startup India" — whatever is actually approved,
   verbatim) and the **official logo asset supplied by the organization**.
2. Place the supplied asset under `public/` (e.g.
   `public/branding/startup-india.svg`). Never recreate, trace, recolor or
   download an unofficial copy of a logo or emblem.
3. In `content/branding.json`, on the `startup-india` entry:
   - `wording`: the exact approved phrase — no paraphrasing;
   - `attribution`: the approving organization/office if required;
   - `logo`: the public path of the official asset;
   - `placements`: where it may appear (`hero`, `footer`, `trust`) — only the
     placements the approval covers;
   - `enabled: true` — last, after everything above is in place.
4. Keep the written approval on file. If approval lapses or wording changes,
   update or disable the entry the same day.

The loader `getActiveAssociations(placement)` only surfaces associations that
are `enabled`, have non-empty `wording`, and include the placement — so a
half-filled entry can never leak onto the site.

### 3.4 Add a partner (verified-only)

1. Confirm the partnership formally (signed MoU or written confirmation).
2. Obtain the partner's official logo file; place it at
   `public/partners/<name>.svg`.
3. In `content/partners.json`, add to the right category's `partners[]`:
   `{ "name": "...", "logo": "/partners/<name>.svg", "href": "https://..." }`.
4. Never pre-announce, never add "in conversation" partners, never generate a
   logo. Empty categories intentionally render as labelled open slots — that
   honesty is part of the brand.

### 3.5 Add or announce a mentor (verified-only)

1. Mentors start as archetype cards (`announced: false`) — these show role and
   expertise, never a name.
2. When a mentor formally confirms and approves their listing: set
   `announced: true`, fill `name`, `designation`, `organization`,
   `expertise[]`, and set `photo` to an uploaded path under `public/`
   (with the mentor's consent for the photo).
3. If a mentor withdraws, set `announced: false` back (or delete the item).

### 3.6 Update impact stats

Values in `content/stats.json` stay `null` until the number is **verified**
(counted from registrations, signed institutions, etc. — not estimated). While
`value` is `null` the UI renders the `placeholder` pattern (`XX+`) so nothing
reads as a real metric. When verified, set `value` to the number; `suffix`
(usually `+`) is appended. Update these on a defined cadence (e.g. after each
regional wave), not opportunistically.

### 3.7 Stories policy

`content/stories.json` currently holds **aspirational journey archetypes** —
they describe paths the movement is built to create, and the section is
captioned accordingly. They are not testimonials and must never be presented
as real participants. When real stories exist:

1. Get the participant's written approval of the exact quote and description.
2. Replace the archetype items with the real stories.
3. Update the section caption in the stories component so it no longer
   describes the content as archetypes.

### 3.8 Publish a media release

1. Add an item to `content/media.json → items[]` with `type` one of
   `press-release`, `announcement`, `news`, `coverage`; set `date`, `title`,
   `excerpt` (one sentence) and `body`.
2. Set `sample: false` for real items — the page footnote about illustrative
   content disappears once no sample items remain.
3. For `coverage`, only link/describe coverage that actually ran.
4. Press-kit files: when a real PDF exists, place it under `public/` and set
   the corresponding `downloads[]` item to `available: true` (wire its link in
   the media components when the first real asset ships).

---

## 4. Associations: the ADD / EDIT / REORDER / HIDE / ACTIVATE / DEACTIVATE / DELETE model

Each entry in `content/branding.json → associations[]` is independently
manageable:

| Operation | How |
| --- | --- |
| **ADD** | Append a new object with a unique `id`, `enabled: false`, empty `wording`. It stays invisible until formally approved and activated (§3.3) |
| **EDIT** | Change `wording` / `attribution` / `logo` only to match the current written approval |
| **REORDER** | Set the integer `order`; lower renders first wherever multiple associations share a placement |
| **HIDE (per placement)** | Remove a placement string from `placements[]` — e.g. drop `"hero"` to keep it in the footer only |
| **ACTIVATE** | `enabled: true` — only with approved wording + official asset in place |
| **DEACTIVATE** | `enabled: false` — removes it sitewide instantly; use this the moment an approval is in doubt |
| **DELETE** | Remove the object entirely once the relationship is formally ended |

The `note` field is internal documentation — keep it updated with approval
status and dates. It never renders publicly.

`genericSupportLine` is the safe, always-available alternative: a truthful
ecosystem sentence with no named organizations. Keep it enabled while no
associations are active.

---

## 5. Registrations

Applications submitted through `/register` land **server-side** in
`data/applications.json` — an append-only JSON store on the server filesystem.
Nothing from it is rendered on the public site, and `/admin` and `/api` are
disallowed in `robots.ts`.

Operational guidance:

- **Access:** treat `data/applications.json` as personal data under the
  Privacy Policy — coordination-team access only; never commit it to a public
  repository; include it in backups.
- **Export:** for triage, a small script can convert it to CSV (e.g. a Node
  one-liner mapping `applications.json` fields to columns) — keep exports in
  access-controlled storage and delete working copies.
- **Scale:** the JSON store is right for the founding window, not forever.
  When volume or team-access needs grow, move to a database (Postgres, or a
  managed form/CRM backend). The registration API route is the single write
  path, so swapping its storage layer does not touch the UI.

---

## 6. Route map

| Route | Purpose |
| --- | --- |
| `/` | Home — hero, movement, journey, stats, map, events preview, grand finale, ecosystem, stories |
| `/about` | Mission, what the movement is / is not, how it works, team, get involved |
| `/movement` | The movement in depth — journey and pillars |
| `/events` | Events directory (filterable) |
| `/events/[slug]` | Event detail — one page per item in `events.json` |
| `/ecosystem` | Network map, mentors, ecosystem roles |
| `/grand-finale` | The national stage — date, tracks, awards |
| `/partners` | Partner categories and open slots |
| `/media` | Press releases, announcements, press kit |
| `/register` | Application form (writes to `data/applications.json`) |
| `/contact` | Audience-routed contact desks |
| `/faq` | FAQ accordion (+ FAQPage structured data) |
| `/accessibility` | Accessibility statement + language support (`#language`) |
| `/privacy`, `/terms`, `/cookies` | Legal templates — counsel review required before publication |
| `/admin` | Internal read-only CMS console (noindex) |
| `/sitemap.xml`, `/robots.txt` | Generated from `app/sitemap.ts` / `app/robots.ts` |
| `/opengraph-image` | Generated social-share image (`app/opengraph-image.tsx`) |

Adding a static route? Add it to `app/sitemap.ts` as well.

---

## 7. Graduating to a headless CMS

The content layer was designed so this migration is mechanical:

1. **Keep the types.** The interfaces in `lib/content.ts` (`Site`, `LbEvent`,
   `PartnerCategory`, …) are the contract. Model the CMS collections to match
   them field-for-field.
2. **Replace the loaders, not the components.** Reimplement `getSite()`,
   `getEvents()`, etc. to fetch from the CMS client and return the **same
   types**. Components import from `@/lib/content` and never know the
   difference.
3. **Preserve the honesty flags.** `sample`, `announced`, `enabled`,
   `dateConfirmed` and nullable stat values must exist in the CMS schema —
   they drive the placeholder-vs-real rendering that keeps the site truthful.
4. **Port the workflows.** Encode §3/§4 as CMS roles and publish gates (e.g.
   only an admin can flip `associations.enabled`).
5. Static generation keeps working: pages read the loaders at build time; add
   revalidation or webhooks per your hosting setup.

Until then: edit JSON, typecheck, preview, deploy. The whole site is content-
operable from one folder.
