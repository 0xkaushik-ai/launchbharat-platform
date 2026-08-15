/**
 * LaunchBharat content layer — the file-based CMS.
 * Every public section renders from these loaders so the internal team can
 * operate the site by editing `content/*.json` (or swapping this module for a
 * headless CMS client) without touching components. See CMS.md.
 */
import site from "@/content/site.json";
import branding from "@/content/branding.json";
import stats from "@/content/stats.json";
import journey from "@/content/journey.json";
import why from "@/content/why.json";
import who from "@/content/who.json";
import events from "@/content/events.json";
import locations from "@/content/locations.json";
import mentors from "@/content/mentors.json";
import partners from "@/content/partners.json";
import media from "@/content/media.json";
import stories from "@/content/stories.json";
import grandFinale from "@/content/grand-finale.json";
import faq from "@/content/faq.json";

/* ——— Types ——— */

export interface NavItem {
  label: string;
  href: string;
}

export interface Site {
  name: string;
  legalName: string;
  wordmark: { primary: string; secondary: string };
  tagline: string;
  taglineHi: string;
  eyebrow: string;
  headline: string;
  description: string;
  url: string;
  contact: { email: string; phone: string; address: string };
  social: { label: string; href: string }[];
  nav: NavItem[];
  utilityNav: NavItem[];
  announcement: { enabled: boolean; text: string; href: string };
}

export interface Association {
  id: string;
  organization: string;
  wording: string;
  attribution: string;
  logo: string | null;
  enabled: boolean;
  placements: string[];
  order: number;
  note: string;
}

export interface Branding {
  associations: Association[];
  genericSupportLine: { enabled: boolean; text: string };
}

export interface Stat {
  id: string;
  label: string;
  value: number | null;
  placeholder: string;
  suffix: string;
}

export interface JourneyStep {
  id: string;
  number: string;
  title: string;
  text: string;
}

export interface WhyItem {
  id: string;
  title: string;
  text: string;
  icon: "discover" | "empower" | "connect" | "mentor" | "invest" | "launch";
}

export interface WhoItem {
  id: string;
  title: string;
  text: string;
}

export type EventStatus = "upcoming" | "completed";

export interface LbEvent {
  id: string;
  slug: string;
  /** True only when this event is backed by Supabase ticketing. */
  managed?: boolean;
  sample: boolean;
  title: string;
  city: string;
  state: string;
  dateStart: string;
  dateEnd: string | null;
  venue: string;
  category: string;
  status: EventStatus;
  registrationOpen: boolean;
  /** Configured booking value in paise. Undefined for static sample events. */
  ticketPricePaise?: number;
  summary: string;
  description: string;
  highlights: string[];
}

export interface LbLocation {
  id: string;
  sample: boolean;
  city: string;
  state: string;
  lon: number;
  lat: number;
  status: "active" | "planned";
  venue: string | null;
  institutions: number | null;
  participants: number | null;
  ideas: number | null;
  partners: number | null;
  eventSlugs: string[];
}

export interface Mentor {
  id: string;
  announced: boolean;
  name: string;
  designation: string;
  organization: string;
  expertise: string[];
  photo: string | null;
}

export interface PartnerCategory {
  id: string;
  category: string;
  description: string;
  slots: number;
  partners: { name: string; logo: string | null; href: string | null }[];
}

export interface MediaItem {
  id: string;
  sample: boolean;
  type: "press-release" | "news" | "announcement" | "coverage";
  title: string;
  date: string;
  excerpt: string;
  body: string;
}

export interface MediaDownload {
  id: string;
  title: string;
  format: string;
  available: boolean;
}

export interface Media {
  items: MediaItem[];
  downloads: MediaDownload[];
}

export interface StoryStage {
  stage: string;
  quote: string;
  text: string;
}

export interface Story {
  id: string;
  persona: string;
  track: string;
  stages: StoryStage[];
}

export interface Award {
  title: string;
  text: string;
}

export interface GrandFinale {
  date: string;
  dateDisplay: string;
  dateConfirmed: boolean;
  venue: string;
  city: string;
  registrationOpen: boolean;
  tagline: string;
  description: string;
  tracks: string[];
  awards: Award[];
  speakersAnnounced: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

/* ——— Loaders ——— */

export const getSite = (): Site => site as Site;
export const getBranding = (): Branding => branding as Branding;
export const getStats = (): Stat[] => (stats as { items: Stat[] }).items;
export const getJourney = (): JourneyStep[] =>
  (journey as { steps: JourneyStep[] }).steps;
export const getWhy = (): WhyItem[] => (why as { items: WhyItem[] }).items;
export const getWho = (): WhoItem[] => (who as { items: WhoItem[] }).items;
export const getEvents = (): LbEvent[] =>
  (events as { items: LbEvent[] }).items;
export const getEventBySlug = (slug: string): LbEvent | undefined =>
  getEvents().find((e) => e.slug === slug);
export const getLocations = (): LbLocation[] =>
  (locations as { items: LbLocation[] }).items;
export const getMentors = (): Mentor[] =>
  (mentors as { items: Mentor[] }).items;
export const getPartners = (): PartnerCategory[] =>
  (partners as { categories: PartnerCategory[] }).categories;
export const getMedia = (): Media => media as Media;
export const getStories = (): Story[] =>
  (stories as { items: Story[] }).items;
export const getGrandFinale = (): GrandFinale => grandFinale as GrandFinale;
export const getFaq = (): FaqItem[] => (faq as { items: FaqItem[] }).items;

/** Associations that are approved + enabled for a given placement. */
export const getActiveAssociations = (placement: string): Association[] =>
  getBranding()
    .associations.filter(
      (a) => a.enabled && a.wording && a.placements.includes(placement),
    )
    .sort((a, b) => a.order - b.order);
