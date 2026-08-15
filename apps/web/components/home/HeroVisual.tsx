import Image from "next/image";
import IndiaDotMap from "@/components/india/IndiaDotMap";

/**
 * Leadership portrait framed by the existing LaunchBharat national-network
 * language. The label is deliberately factual and does not claim endorsement.
 */
export default function HeroVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`relative isolate mx-auto max-w-[34rem] ${className}`}>
      <div
        aria-hidden="true"
        className="absolute -left-[6%] top-[9%] -z-10 w-[60%] rotate-[-7deg] opacity-25 sm:-left-[10%] sm:w-[64%]"
      >
        <IndiaDotMap
          step={1.2}
          showOutline
          showDots
          dotClassName="fill-cyan-500/40"
          className="h-auto w-full opacity-20 drop-shadow-[0_16px_28px_rgba(124,58,237,0.14)] sm:opacity-30"
        />
      </div>

      <figure className="relative z-10 ml-auto w-[84%] sm:w-[78%]">
        <div className="hero-portrait-shell rounded-[2rem] p-2.5 sm:rounded-[2.5rem] sm:p-3">
          <div className="relative aspect-[0.88] overflow-hidden rounded-[1.5rem] bg-paper sm:aspect-[0.94] sm:rounded-[2rem]">
            <Image
              src="/pm-modi-shawl.png"
              alt="Shri Narendra Modi, Prime Minister of India"
              fill
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 55vw, 34vw"
              className="hero-portrait-image object-cover"
              priority
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-300 via-white to-orchid-300"
            />
            <blockquote
              lang="hi"
              className="absolute left-0 top-0 max-w-[88%] px-4 pt-4 font-devanagari text-xs font-medium leading-relaxed text-white [text-shadow:0_1px_12px_rgba(11,18,32,0.9)] sm:max-w-[78%] sm:px-5 sm:pt-5 sm:text-sm"
            >
              <p>“परीक्षा जीवन का अंत नहीं है। जीवन सिर्फ़ अकादमिक परीक्षाओं से कहीं बड़ा है।”</p>
            </blockquote>
          </div>
        </div>
        <figcaption className="px-3 pt-2.5 text-center sm:px-4 sm:pt-3">
          <span className="block font-display text-base font-semibold leading-tight tracking-tight text-ink-950 sm:text-lg">
            Shri Narendra Modi
          </span>
          <span className="mt-1 block font-mono text-[8px] font-medium uppercase tracking-[0.16em] text-ink-500 sm:text-[9px] sm:tracking-[0.2em]">
            Prime Minister of India
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
