import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";

export default function SectionHeading({
  id,
  number,
  eyebrow,
  title,
  lede,
  tone = "light",
  align = "left",
  size = "lg",
  className = "",
}: {
  /** id applied to the h2 for aria-labelledby wiring */
  id?: string;
  number?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  /** kept for API compatibility — single light design */
  tone?: "light" | "dark";
  align?: "left" | "center";
  size?: "lg" | "xl" | "md";
  className?: string;
}) {
  const alignCls =
    align === "center" ? "text-center items-center" : "text-left items-start";
  const displayCls =
    size === "xl" ? "display-xl" : size === "md" ? "display-md" : "display-lg";

  return (
    <div className={`flex max-w-3xl flex-col gap-5 ${alignCls} ${className}`}>
      {(eyebrow || number) && (
        <div className="flex items-center gap-3">
          {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
          {number && (
            <span
              aria-hidden="true"
              className="font-mono text-[11px] font-medium tabular-nums tracking-widest text-ink-400"
            >
              / {number}
            </span>
          )}
        </div>
      )}
      <h2 id={id} className={`${displayCls} text-ink-950`}>
        {title}
      </h2>
      {lede && <p className="lede">{lede}</p>}
    </div>
  );
}
