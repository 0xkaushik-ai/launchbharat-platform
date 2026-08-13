import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyRegisterCta from "@/components/layout/StickyRegisterCta";
import { ScrollProgress } from "@/components/ui";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { getSite } from "@/lib/content";

const inter = localFont({
  src: "./fonts/inter-var.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const devanagari = localFont({
  src: "./fonts/noto-deva-var.woff2",
  variable: "--font-devanagari",
  weight: "100 900",
  display: "swap",
});

const jbmono = localFont({
  src: "./fonts/jetbrains-mono-var.woff2",
  variable: "--font-jbmono",
  weight: "100 800",
  display: "swap",
});

const grotesk = localFont({
  src: "./fonts/space-grotesk-var.woff2",
  variable: "--font-grotesk",
  weight: "300 700",
  display: "swap",
});

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — India's Next Generation of Entrepreneurs Starts Here`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "LaunchBharat",
    "startup movement India",
    "student entrepreneurs",
    "innovation",
    "startup ecosystem",
    "incubators",
    "mentors",
    "investors",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — India's Next Generation of Entrepreneurs Starts Here`,
    description: site.description,
    url: site.url,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — India's Next Generation of Entrepreneurs Starts Here`,
    description: site.description,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  slogan: site.tagline,
  description: site.description,
  email: site.contact.email,
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${devanagari.variable} ${jbmono.variable} ${grotesk.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-saffron-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy-950"
        >
          Skip to main content
        </a>
        <ScrollProgress />
        <Header
          nav={site.nav}
          utilityNav={site.utilityNav}
          announcement={site.announcement}
        />
        <main id="main">{children}</main>
        <Footer />
        <StickyRegisterCta />
        <ScrollToTop />
      </body>
    </html>
  );
}
