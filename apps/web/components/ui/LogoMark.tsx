import Image from "next/image";
import site from "@/content/site.json";

export default function LogoMark({
  size = "md",
  className = "",
}: {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
  className?: string;
}) {
  const heightClass = size === "sm" ? "h-7" : size === "md" ? "h-10" : "h-12";

  return (
    <div className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.jpg"
        alt={site.name}
        width={300}
        height={100}
        className={`w-auto ${heightClass} object-contain`}
        priority
      />
    </div>
  );
}
