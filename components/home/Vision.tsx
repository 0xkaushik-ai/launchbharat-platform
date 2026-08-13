import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui";

export default function Vision() {
  return (
    <section className="relative isolate overflow-hidden bg-white py-20 md:py-28">
      {/* Tricolor decorative background element */}
      <div
        aria-hidden="true"
        className="absolute -top-40 right-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-saffron-500 to-green-500 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <SectionHeading eyebrow="National Vision" title="Building the Future of Bharat" />
            <p className="mt-6 text-lg leading-relaxed text-ink-600">
              "Startups are the engines of exponential growth, manifesting the power of innovation. 
              The youth of India are creating a vibrant ecosystem that transforms ideas into impact, 
              empowering communities and solving global challenges."
            </p>
            <p className="mt-4 font-bold text-saffron-600">
              — Shri Narendra Modi, Hon'ble Prime Minister of India
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span className="tricolor-rule w-16" aria-hidden="true"></span>
              <span className="font-mono text-xs uppercase tracking-widest text-ink-400">
                A Nationwide Movement
              </span>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative inline-block rounded-2xl bg-white p-2 shadow-sm ring-1 ring-line glass-hover">
              <div className="relative overflow-hidden rounded-xl border border-line">
                <Image
                  src="/pm-modi.jpg"
                  alt="Hon'ble Prime Minister Shri Narendra Modi"
                  width={400}
                  height={500}
                  className="object-cover object-top w-full max-w-sm"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
