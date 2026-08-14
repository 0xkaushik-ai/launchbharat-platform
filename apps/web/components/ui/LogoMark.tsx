import Image from "next/image";
import site from "@/content/site.json";

const sizes = {
  sm: { className: "h-9 sm:h-10", width: 218, height: 100 },
  md: { className: "h-11 sm:h-12", width: 261, height: 120 },
  lg: { className: "h-14 sm:h-16", width: 348, height: 160 },
  xl: { className: "h-16 sm:h-[4.5rem] lg:h-20", width: 436, height: 200 },
} as const;

export default function LogoMark({
  size = "md",
  className = "",
}: {
  variant?: "dark" | "light";
  size?: keyof typeof sizes;
  withTagline?: boolean;
  className?: string;
}) {
  const spec = sizes[size];

  return (
    <div className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.jpg"
        alt={site.name}
        width={spec.width}
        height={spec.height}
        className={`brand-logo-image w-auto ${spec.className} object-contain object-left`}
        priority
      />
    </div>
  );
}
