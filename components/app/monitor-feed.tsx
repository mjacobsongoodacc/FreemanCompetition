"use client";

import { useMemo } from "react";
import { ScrollArea } from "@mantine/core";
import { StreamPulse } from "@/components/app/stream-pulse";
import { alerts, type AlertSeverity } from "@/lib/mock-data";
import { useCurrentStreams } from "@/lib/hooks/use-current-streams";
import { useStorm } from "@/lib/storm-context";

function barColor(s: AlertSeverity) {
  if (s === "red") return "var(--alert)";
  if (s === "amber") return "var(--amber)";
  return "var(--calm)";
}

const severityRank: Record<AlertSeverity, number> = {
  red: 0,
  amber: 1,
  blue: 2,
};

function normSeverity(s: string): AlertSeverity {
  if (s === "red" || s === "amber" || s === "blue") return s;
  return "amber";
}

export function MonitorFeed({ useScrollArea }: { useScrollArea: boolean }) {
  const { stormActive } = useStorm();
  const { streams, latestTurnId } = useCurrentStreams(stormActive);

  const rows = useMemo(() => {
    const w = streams.world;
    if (w?.items?.length) {
      const items = [...w.items].sort(
        (a, b) =>
          severityRank[normSeverity(a.severity)] -
          severityRank[normSeverity(b.severity)]
      );
      return items.map((it, i) => ({
        key: `${it.type}-${i}-${it.text.slice(0, 48)}`,
        time: "—",
        agency: it.type.toUpperCase(),
        headline: it.text,
        severity: normSeverity(it.severity),
      }));
    }
    return alerts.map((a) => ({
      key: `${a.time}-${a.headline}`,
      time: a.time,
      agency: a.agency,
      headline: a.headline,
      severity: a.severity,
    }));
  }, [streams.world]);

  const inner = (
    <div className="divide-y divide-border">
      {rows.map((a) => (
        <div key={a.key} className="flex gap-3 p-4">
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

  const pulsed = (
    <StreamPulse
      active={streams.world?.updated_this_turn ?? false}
      pulseKey={latestTurnId}
      className={useScrollArea ? "min-h-0" : undefined}
    >
      {inner}
    </StreamPulse>
  );

  if (useScrollArea) {
    return (
      <ScrollArea h="100%" type="auto" offsetScrollbars scrollbarSize={6}>
        {pulsed}
      </ScrollArea>
    );
  }

  return pulsed;
}
