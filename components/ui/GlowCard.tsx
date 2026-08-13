"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";

/**
 * Pointer-tracked spotlight card: a saffron glow follows the cursor.
 * Purely decorative — degrades to a plain panel without hover/motion.
 */
export default function GlowCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`spotlight ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
