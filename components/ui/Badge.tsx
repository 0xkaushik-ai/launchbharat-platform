import type { ReactNode } from "react";

type Tone = "saffron" | "green" | "blue" | "neutral" | "gold" | "iris";

const tones: Record<Tone, string> = {
  saffron: "bg-saffron-100 text-saffron-700 border-saffron-500/25",
  green: "bg-green-100 text-green-700 border-green-600/25",
  blue: "bg-blue-100 text-blue-700 border-blue-600/25",
  neutral: "bg-mist text-ink-600 border-line",
  gold: "bg-gold-300/25 text-[#8a6a2f] border-gold-500/40",
  iris: "bg-saffron-500 text-saffron-600 border-saffron-500/30",
};

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
