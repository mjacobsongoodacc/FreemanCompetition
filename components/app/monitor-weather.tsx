"use client";

import { useMemo } from "react";
import { StreamPulse } from "@/components/app/stream-pulse";
import { storm } from "@/lib/mock-data";
import { useCurrentStreams } from "@/lib/hooks/use-current-streams";
import { useStorm } from "@/lib/storm-context";

function formatHms(total: number) {
  const s = Math.max(0, total);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

export function MonitorWeather() {
  const { landfallSeconds, stormActive } = useStorm();
  const { streams, latestTurnId } = useCurrentStreams(stormActive);
  const done = landfallSeconds === 0;
  const d = streams.disaster;

  const cells = useMemo(
    () =>
      [
        {
          label: "Position" as const,
          value: `${storm.position.lat}°N ${Math.abs(storm.position.lng)}°W`,
        },
        {
          label: "Max winds" as const,
          value: `${d?.max_winds_mph ?? storm.maxWinds} MPH`,
        },
        {
          label: "Gusts" as const,
          value: `${d?.gusts_mph ?? storm.gusts} MPH`,
        },
        {
          label: "Pressure" as const,
          value: `${d?.pressure_mb ?? storm.pressure} MB`,
        },
        { label: "Movement" as const, value: storm.movement },
        {
          label: "Landfall" as const,
          value: d?.landfall_eta ?? storm.landfallETA,
        },
      ] as const,
    [d]
  );

  const titleStorm = d?.storm_name ?? storm.name;
  const titleAdvisory = d?.advisory_number ?? storm.advisoryNumber;
  const deltaText = d?.delta?.trim() ?? "";

  return (
    <StreamPulse
      active={streams.disaster?.updated_this_turn ?? false}
      pulseKey={latestTurnId}
    >
      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-text-1">
            {titleStorm} · Advisory {titleAdvisory}
          </h2>
          <span className="font-mono text-[10px] font-medium uppercase text-text-3">
            {storm.advisoryTime}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          {cells.map((c) => (
            <div key={c.label}>
              <p className="font-mono text-[10px] font-medium uppercase text-text-3">
                {c.label}
              </p>
              <p className="mt-1 font-mono text-[clamp(16px,4vw,18px)] text-text-1">
                {c.value}
              </p>
            </div>
          ))}
        </div>
        <div
          className="mt-4 flex h-8 items-center justify-center rounded border px-2"
          style={{
            background: done
              ? "color-mix(in oklab, var(--alert) 18%, transparent)"
              : "color-mix(in oklab, var(--amber) 10%, transparent)",
            borderColor: done
              ? "color-mix(in oklab, var(--alert) 40%, transparent)"
              : "color-mix(in oklab, var(--amber) 35%, transparent)",
          }}
        >
          <p
            className={
              deltaText
                ? `font-mono text-[11px] font-medium ${
                    done ? "text-alert" : "text-amber"
                  }`
                : `font-mono text-[11px] font-medium uppercase ${
                    done ? "text-alert" : "text-amber"
                  }`
            }
          >
            {deltaText
              ? deltaText
              : done
                ? "Landfall now — shelter in place"
                : `Landfall in ${formatHms(landfallSeconds)}`}
          </p>
        </div>
      </section>
    </StreamPulse>
  );
}
