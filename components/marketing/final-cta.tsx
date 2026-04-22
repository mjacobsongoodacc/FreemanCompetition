import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="px-4 pb-28 pt-12 md:px-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="font-display text-[clamp(36px,8vw,48px)] font-bold text-text-1">
          Meet Shepherd.
        </h2>
        <Button asChild className="mt-10 h-14 w-full min-h-[56px] md:w-60">
          <Link href="/sign-in">Try the demo</Link>
        </Button>
        <p className="mt-24 font-mono text-[10px] uppercase tracking-wider text-text-3">
          Shepherd · Tulane AI Challenge 2026
        </p>
      </div>
    </section>
  );
}
