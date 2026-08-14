import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({ src: "./fonts/inter-var.woff2", variable: "--font-inter", weight: "100 900" });
const mono = localFont({ src: "./fonts/jetbrains-mono-var.woff2", variable: "--font-jbmono", weight: "100 800" });
const display = localFont({ src: "./fonts/space-grotesk-var.woff2", variable: "--font-grotesk", weight: "300 700" });

export const metadata: Metadata = {
  title: { default: "LaunchBharat Admin", template: "%s | LaunchBharat Admin" },
  description: "Operations console for LaunchBharat.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
