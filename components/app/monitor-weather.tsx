"use client";

import { storm } from "@/lib/mock-data";
import { useStorm } from "@/lib/storm-context";

function formatHms(total: number) {
  const s = Math.max(0, total);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

const CELLS = [
  { label: "Position", value: "27.8°N 88.2°W" },
  { label: "Max winds", value: `${storm.maxWinds} MPH` },
  { label: "Gusts", value: `${storm.gusts} MPH` },
  { label: "Pressure", value: `${storm.pressure} MB` },
  { label: "Movement", value: storm.movement },
  { label: "Landfall", value: storm.landfallETA },
] as const;

export function MonitorWeather() {
  const { landfallSeconds } = useStorm();
  const done = landfallSeconds === 0;

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-text-1">
          Ida · Advisory {storm.advisoryNumber}
        </h2>
        <span className="font-mono text-[10px] font-medium uppercase text-text-3">
          {storm.advisoryTime}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
        {CELLS.map((c) => (
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
          className={`font-mono text-[11px] font-medium uppercase ${
            done ? "text-alert" : "text-amber"
          }`}
        >
          {done
            ? "Landfall now — shelter in place"
            : `Landfall in ${formatHms(landfallSeconds)}`}
        </p>
      </div>
    </section>
  );
}
