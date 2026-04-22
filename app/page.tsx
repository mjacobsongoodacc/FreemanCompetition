import { BrandMark } from "@/components/marketing/brand-mark";
import { CalmUntil } from "@/components/marketing/calm-until";
import { Dossier } from "@/components/marketing/dossier";
import { FinalCta } from "@/components/marketing/final-cta";
import { FiveStreams } from "@/components/marketing/five-streams";
import { MarketingHero } from "@/components/marketing/hero";
import { NotAPlanner } from "@/components/marketing/not-a-planner";

export default function Home() {
  return (
    <div className="min-h-dvh bg-bg">
      <BrandMark />
      <MarketingHero />
      <NotAPlanner />
      <FiveStreams />
      <CalmUntil />
      <Dossier />
      <FinalCta />
    </div>
  );
}
