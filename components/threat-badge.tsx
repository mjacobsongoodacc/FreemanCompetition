"use client";

import { useEffect, useState } from "react";
import { storm } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function formatLandfallCountdown(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function ThreatBadge({
  landfallSeconds,
  className,
}: {
  landfallSeconds: number;
  className?: string;
}) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 150);
    return () => window.clearTimeout(t);
  }, [landfallSeconds]);

  return (
    <div
      className={cn(
        "flex max-w-[100vw] items-center gap-2 rounded-md border border-red/30 bg-red/10 px-4 py-1.5 md:max-w-none",
        className
      )}
    >
      <span
        className="threat-pulse-dot h-2 w-2 shrink-0 rounded-full bg-red"
        style={{
          boxShadow:
            "0 0 0 2px color-mix(in oklab, var(--red) 25%, transparent), 0 0 8px 1px color-mix(in oklab, var(--red) 45%, transparent)",
        }}
      />
      <p
        className={cn(
          "truncate font-mono text-[11px] uppercase leading-tight tracking-wide text-text-1 sm:text-[12px] md:whitespace-normal",
          flash && "value-flash"
        )}
      >
        <span className="hidden sm:inline">
          Hurricane {storm.name.toUpperCase()} · Cat {storm.category} · Landfall
          in {formatLandfallCountdown(landfallSeconds)}
        </span>
        <span className="sm:hidden">
          {storm.name.toUpperCase()} · CAT {storm.category} ·{" "}
          {formatLandfallCountdown(landfallSeconds)}
        </span>
      </p>
    </div>
  );
}
