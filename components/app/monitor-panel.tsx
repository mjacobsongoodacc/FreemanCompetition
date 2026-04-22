"use client";

import { useMediaQuery } from "@mantine/hooks";
import { CalmOrb } from "@/components/app/calm-orb";
import { MonitorFeed } from "@/components/app/monitor-feed";
import { MonitorMap } from "@/components/app/monitor-map";
import { MonitorWeather } from "@/components/app/monitor-weather";
import { useStorm } from "@/lib/storm-context";

export function MonitorPanel() {
  const { stormActive } = useStorm();
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isMobileMap = useMediaQuery("(max-width: 767px)") ?? true;

  if (!stormActive) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12">
        <CalmOrb size="80px" />
        <p className="text-center font-display text-2xl font-semibold text-text-1">
          No active tropical systems.
        </p>
        <p className="text-center font-mono text-[11px] font-medium uppercase text-text-3">
          Last sync: just now · NHC Atlantic basin feed
        </p>
      </div>
    );
  }

  if (isLg) {
    return (
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6 p-6">
        <div className="col-span-7 flex min-h-0 flex-col">
          <MonitorMap isMobile={isMobileMap} />
        </div>
        <div className="col-span-5 flex min-h-0 flex-col gap-6">
          <section className="flex min-h-0 flex-1 basis-0 flex-col overflow-hidden rounded-lg border border-border bg-surface">
            <div className="flex shrink-0 items-baseline justify-between gap-2 border-b border-border px-4 py-3">
              <h2 className="font-display text-lg font-semibold text-text-1">
                Live feed
              </h2>
              <span className="text-right font-mono text-[10px] font-medium uppercase text-text-3">
                NWS · GOHSEP · ENTERGY
              </span>
            </div>
            <div className="min-h-0 flex-1">
              <MonitorFeed useScrollArea />
            </div>
          </section>
          <div className="flex min-h-0 flex-1 basis-0 flex-col overflow-y-auto">
            <MonitorWeather />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-6">
      <MonitorMap isMobile={isMobileMap} />
      <section className="rounded-lg border border-border bg-surface">
        <div className="flex items-baseline justify-between gap-2 border-b border-border px-4 py-3">
          <h2 className="font-display text-lg font-semibold text-text-1">
            Live feed
          </h2>
          <span className="text-right font-mono text-[10px] font-medium uppercase text-text-3">
            NWS · GOHSEP · ENTERGY
          </span>
        </div>
        <MonitorFeed useScrollArea={false} />
      </section>
      <MonitorWeather />
    </div>
  );
}
