import type { ReactNode } from "react";

/**
 * Infinite ticker strip. Content is duplicated for a seamless loop;
 * pauses on hover, disabled under prefers-reduced-motion (CSS).
 */
export default function Marquee({
  items,
  separator = "✦",
  duration = "34s",
  className = "",
  itemClassName = "",
}: {
  items: ReactNode[];
  separator?: string;
  duration?: string;
  className?: string;
  itemClassName?: string;
}) {
  const row = (hidden: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <span key={i} className={`flex items-center ${itemClassName}`}>
          <span className="whitespace-nowrap">{item}</span>
          <span aria-hidden="true" className="mx-6 text-iris-600/70 md:mx-10">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className}`}>
      <div
        className="marquee-track"
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
