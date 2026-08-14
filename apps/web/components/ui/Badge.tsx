import type { ReactNode } from "react";

type Tone = "saffron" | "green" | "blue" | "neutral" | "gold" | "iris";

const tones: Record<Tone, string> = {
  saffron: "bg-iris-100 text-iris-700 border-iris-400/25",
  green: "bg-green-100 text-green-700 border-green-600/25",
  blue: "bg-blue-100 text-blue-700 border-blue-600/25",
  neutral: "bg-mist text-ink-600 border-line",
  gold: "bg-gold-300/25 text-[#8a6a2f] border-gold-500/40",
  iris: "bg-iris-100 text-iris-600 border-iris-400/30",
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
