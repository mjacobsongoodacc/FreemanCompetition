"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useStorm } from "@/lib/storm-context";

function formatHms(total: number) {
  const s = Math.max(0, total);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

export function ThreatBar() {
  const { stormActive, landfallSeconds } = useStorm();
  const reduce = useReducedMotion();

  if (!stormActive) return null;

  const label =
    landfallSeconds === 0
      ? "Landfall now — shelter in place"
      : `IDA · CAT 4 · ${formatHms(landfallSeconds)}`;

  return (
    <div
      className="flex h-10 w-full items-center justify-center border-b px-3"
      style={{
        background: "color-mix(in oklab, var(--alert) 12%, transparent)",
        borderColor: "color-mix(in oklab, var(--alert) 55%, transparent)",
      }}
    >
      <div className="flex items-center gap-2">
        <motion.span
          className="shepherd-reduce-pulse h-2 w-2 rounded-full bg-alert"
          animate={reduce ? {} : { opacity: [1, 0.45, 1] }}
          transition={
            reduce
              ? undefined
              : { duration: 2, ease: "easeInOut", repeat: Infinity }
          }
          aria-hidden
        />
        <p className="text-center font-mono text-xs font-medium uppercase tracking-wide text-text-1">
          {label}
        </p>
      </div>
    </div>
  );
}
