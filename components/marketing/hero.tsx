"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

function HeroOrb() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="shepherd-reduce-pulse mx-auto rounded-full"
      style={{
        width: 200,
        height: 200,
        background:
          "radial-gradient(circle at 35% 30%, #f4e0c8, var(--amber-deep))",
        boxShadow:
          "0 0 0 2px color-mix(in oklab, var(--amber) 25%, transparent), 0 0 64px rgba(232, 167, 111, 0.35)",
      }}
      animate={
        reduce
          ? { opacity: 1 }
          : { scale: [1, 1.04, 1], opacity: [1, 0.92, 1] }
      }
      transition={
        reduce
          ? { duration: 0.1 }
          : { duration: 3, ease: "easeInOut", repeat: Infinity }
      }
      aria-hidden
    />
  );
}

export function MarketingHero() {
  return (
    <section className="relative min-h-[calc(100dvh-48px)] scroll-mt-24 px-4 pb-16 pt-24 md:px-6 lg:pt-28">
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.12] lg:block"
        style={{
          background:
            "radial-gradient(640px circle at 85% 35%, var(--amber), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          <div className="mb-2 flex justify-center lg:hidden">
            <HeroOrb />
          </div>
          <h1 className="font-display text-[clamp(32px,8vw,56px)] font-bold leading-tight text-text-1">
            When the plan breaks, Shepherd walks with you.
          </h1>
          <p className="mt-4 max-w-[40ch] font-body text-base leading-relaxed text-text-2">
            A personal disaster companion for the moments your plan doesn&apos;t
            survive contact with the storm.
          </p>
          <div className="mt-8 flex w-full max-w-full flex-col items-center gap-4 sm:max-w-none lg:items-start">
            <Button
              asChild
              className="h-12 w-full min-h-12 md:w-60"
              variant="default"
            >
              <a href="#streams">See how it works</a>
            </Button>
            <Link
              href="/sign-in"
              className="shepherd-link shepherd-focus font-body text-base text-amber"
            >
              Try the demo
            </Link>
          </div>
        </div>
        <div className="hidden justify-center lg:flex lg:order-2">
          <div className="relative">
            <div
              className="absolute left-1/2 top-1/2 -z-10 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12]"
              style={{
                background:
                  "radial-gradient(circle, var(--amber) 0%, transparent 70%)",
              }}
            />
            <div style={{ width: 320, height: 320 }}>
              <motion.div
                className="shepherd-reduce-pulse h-full w-full rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #f4e0c8, var(--amber-deep))",
                  boxShadow:
                    "0 0 0 2px color-mix(in oklab, var(--amber) 25%, transparent), 0 0 72px rgba(232, 167, 111, 0.4)",
                }}
                animate={{ scale: [1, 1.04, 1], opacity: [1, 0.92, 1] }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
