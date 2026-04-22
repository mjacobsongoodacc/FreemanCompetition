import Link from "next/link";
import { BrandOrb } from "@/components/app/brand-orb";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="shepherd-focus fixed left-4 top-4 z-50 flex items-center gap-2 rounded-md md:left-6 md:top-6"
      aria-label="Shepherd home"
    >
      <BrandOrb size={12} pulse={false} />
      <span className="font-display text-lg font-semibold text-text-1 md:text-[18px]">
        Shepherd
      </span>
    </Link>
  );
}
