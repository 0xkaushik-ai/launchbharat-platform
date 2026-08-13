import { indiaDots, INDIA_VIEW, INDIA_PATHS } from "@/lib/india";
import type { ReactNode } from "react";

/**
 * Accurate India map (real national boundary geometry, simplified for the web).
 * Renders a gradient-stroked outline with a soft brand-tint fill, plus an
 * optional dot-matrix interior. Compose overlays (markers, connection lines)
 * via `children` — same viewBox space as lib/india project().
 */
export default function IndiaDotMap({
  step = 1.1,
  dotRadius = 0.38,
  dotClassName = "fill-blue-800/30",
  showDots = true,
  showOutline = true,
  outlineWidth = 0.32,
  className = "",
  title,
  children,
}: {
  step?: number;
  dotRadius?: number;
  dotClassName?: string;
  showDots?: boolean;
  showOutline?: boolean;
  outlineWidth?: number;
  className?: string;
  /** Accessible title; omit for purely decorative use (aria-hidden applied). */
  title?: string;
  children?: ReactNode;
}) {
  const dots = showDots ? indiaDots(step) : [];
  return (
    <svg
      viewBox={`0 0 ${INDIA_VIEW.w} ${INDIA_VIEW.h}`}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id="lb-india-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
        <linearGradient id="lb-india-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#ede9fe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fae8ff" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {showOutline &&
        INDIA_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="url(#lb-india-fill)"
            stroke="url(#lb-india-stroke)"
            strokeWidth={outlineWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      {showDots && (
        <g>
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={dotRadius}
              className={dotClassName}
            />
          ))}
        </g>
      )}
      {children}
    </svg>
  );
}
