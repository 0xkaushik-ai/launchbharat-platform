import Hero from "@/components/home/Hero";
import Vision from "@/components/home/Vision";
import ImpactStats from "@/components/home/ImpactStats";
import Movement from "@/components/home/Movement";
import Journey from "@/components/home/Journey";
import EcosystemOrbit from "@/components/home/EcosystemOrbit";
import NationMapSection from "@/components/home/NationMapSection";
import WhyLaunchBharat from "@/components/home/WhyLaunchBharat";
import WhoShouldJoin from "@/components/home/WhoShouldJoin";
import EventsPreview from "@/components/home/EventsPreview";
import GrandFinale from "@/components/home/GrandFinale";
import Mentors from "@/components/home/Mentors";
import Partners from "@/components/home/Partners";
import Stories from "@/components/home/Stories";
import Trust from "@/components/home/Trust";
import JoinCta from "@/components/home/JoinCta";
import { getSite } from "@/lib/content";

const site = getSite();

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description: site.description,
  inLanguage: "en-IN",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Hero />
      <Vision />
      <ImpactStats />
      <Movement />
      <Journey />
      <EcosystemOrbit />
      <NationMapSection />
      <WhyLaunchBharat />
      <WhoShouldJoin />
      <EventsPreview />
      <GrandFinale />
      <Mentors />
      <Partners />
      <Stories />
      <Trust />
      <JoinCta />
    </>
  );
}
