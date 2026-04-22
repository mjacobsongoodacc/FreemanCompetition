"use client";

import { ScrollArea } from "@mantine/core";
import { alerts, type AlertSeverity } from "@/lib/mock-data";

function barColor(s: AlertSeverity) {
  if (s === "red") return "var(--alert)";
  if (s === "amber") return "var(--amber)";
  return "#3b82f6";
}

export function MonitorFeed({ useScrollArea }: { useScrollArea: boolean }) {
  const inner = (
    <div className="divide-y divide-border">
      {alerts.map((a) => (
        <div key={`${a.time}-${a.headline}`} className="flex gap-3 p-4">
          <div
            className="mt-0.5 w-[3px] shrink-0 rounded-full"
            style={{ background: barColor(a.severity) }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-end gap-2 sm:justify-between">
              <span className="font-mono text-[10px] font-medium uppercase text-text-3">
                {a.time}
              </span>
              <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase text-text-2">
                {a.agency}
              </span>
            </div>
            <p className="mt-2 font-body text-[13px] leading-snug text-text-1">
              {a.headline}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  if (useScrollArea) {
    return (
      <ScrollArea h="100%" type="auto" offsetScrollbars scrollbarSize={6}>
        {inner}
      </ScrollArea>
    );
  }

  return inner;
}
