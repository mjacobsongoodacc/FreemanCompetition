"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  exposure,
  user,
  landfallCountdownInitialSeconds,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const INITIAL_LANDFALL = landfallCountdownInitialSeconds;

function formatPrepHrsMin(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}H ${String(m).padStart(2, "0")}M`;
}

export function ExposureCard({
  prepSeconds,
  landfallSeconds,
}: {
  prepSeconds: number;
  landfallSeconds: number;
}) {
  const [flashPrep, setFlashPrep] = useState(false);

  useEffect(() => {
    setFlashPrep(true);
    const t = window.setTimeout(() => setFlashPrep(false), 150);
    return () => window.clearTimeout(t);
  }, [prepSeconds]);

  const evacPct =
    landfallSeconds > 0
      ? Math.min(100, Math.max(0, (prepSeconds / landfallSeconds) * 100))
      : 0;
  const progressPct =
    INITIAL_LANDFALL > 0
      ? Math.min(
          100,
          Math.max(0, ((INITIAL_LANDFALL - landfallSeconds) / INITIAL_LANDFALL) * 100)
        )
      : 0;

  return (
    <Card className="overflow-hidden border-l-2 border-l-red p-0">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-red">
          Your exposure
        </p>
        <Badge variant="red" className="shrink-0">
          Zone {exposure.evacZone} · Mandatory evac
        </Badge>
      </div>
      <CardContent className="space-y-4 p-5 pt-4">
        <p className="text-sm text-text-2">{user.address}</p>
        <div className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-3">
              Surge at address
            </p>
            <p className="pt-1 font-mono text-[28px] leading-none text-red">
              {exposure.surge}
            </p>
            <p className="pt-2 font-mono text-[10px] uppercase tracking-wider text-text-3">
              Above ground
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-3">
              Sustained winds
            </p>
            <p className="pt-1 font-mono text-[28px] leading-none text-amber">
              {exposure.wind}
            </p>
            <p className="pt-2 font-mono text-[10px] uppercase tracking-wider text-text-3">
              Expected 06:00 Sun
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-3">
              Time to prepare
            </p>
            <p
              className={cn(
                "pt-1 font-mono text-[28px] leading-none text-text-1 uppercase",
                flashPrep && "value-flash"
              )}
            >
              {formatPrepHrsMin(prepSeconds)}
            </p>
            <p className="pt-2 font-mono text-[10px] uppercase tracking-wider text-text-3">
              Until evac cutoff
            </p>
          </div>
        </div>

        <div className="pt-2">
          <div
            className="relative h-1 w-full rounded-sm"
            style={{
              background:
                "linear-gradient(90deg, var(--green) 0%, var(--amber) 52%, var(--red) 100%)",
            }}
          >
            <div
              className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-text-1/90"
              style={{ left: "0%" }}
              aria-hidden
            />
            <div
              className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-text-1/70"
              style={{ left: `${evacPct}%` }}
              aria-hidden
            />
            <div
              className="absolute top-1/2 right-0 h-3 w-px -translate-y-1/2 bg-text-1/70"
              aria-hidden
            />
            <div
              className="absolute -top-1.5 h-2 w-2 -translate-x-1/2 rotate-45 border border-accent bg-bg"
              style={{ left: `${progressPct}%` }}
              aria-hidden
            />
          </div>
          <div className="relative mt-2 h-4 font-mono text-[9px] uppercase tracking-wider text-text-3">
            <span className="absolute left-0 top-0">Now</span>
            <span
              className="absolute top-0 -translate-x-1/2 text-center"
              style={{ left: `${evacPct}%` }}
            >
              Evac cutoff
            </span>
            <span className="absolute right-0 top-0 text-right">Landfall</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
