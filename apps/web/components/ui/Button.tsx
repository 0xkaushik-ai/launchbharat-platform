import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline-dark" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-saffron-600 text-white shadow-sm hover:bg-saffron-500 hover:-translate-y-0.5",
  secondary:
    "border border-line bg-white text-ink-950 hover:border-saffron-400 hover:text-saffron-600 hover:-translate-y-0.5 shadow-sm",
  "outline-dark":
    "border border-ink-400/40 bg-transparent text-ink-800 hover:border-saffron-400 hover:text-saffron-600 hover:-translate-y-0.5",
  ghost:
    "text-ink-600 hover:text-saffron-600 underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  href,
  type,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ariaLabel,
  children,
}: {
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${
    disabled ? "pointer-events-none opacity-50" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cls}
    >
      {children}
    </button>
  );
}
