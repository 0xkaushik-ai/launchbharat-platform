import type { ReactNode } from "react";

/** Modern pill label with a gradient dot: ● THE MOVEMENT */
export default function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  /** kept for API compatibility — single light design */
  tone?: "light" | "dark";
  withRule?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-600 backdrop-blur sm:text-[11px] ${className}`}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-saffron-500 to-green-500 shadow-[0_0_8px_rgba(234,124,12,0.55)]"
      />
      <span>{children}</span>
    </p>
  );
}
