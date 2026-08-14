import type { ReactNode } from "react";

/** Modern pill label with a brand-gradient dot. */
export default function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  withRule?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`inline-flex items-center gap-2.5 rounded-full border border-line bg-white/75 px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-600 shadow-[0_1px_2px_rgb(15_23_42/0.04)] backdrop-blur sm:text-[11px] ${className}`}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 via-iris-500 to-orchid-400 shadow-[0_0_8px_rgba(139,92,246,0.55)]"
      />
      <span>{children}</span>
    </p>
  );
}
