"use client";

import { useEffect, useMemo, useState } from "react";
import { StatusIndicator } from "@/components/status-indicator";
import { ThreatBadge } from "@/components/threat-badge";
import { StormCard } from "@/components/storm-card";
import { ExposureCard } from "@/components/exposure-card";
import { StatusPanel } from "@/components/status-panel";
import { CompanionWidget } from "@/components/companion-widget";
import { AlertsFeed } from "@/components/alerts-feed";
import { ChatDrawer } from "@/components/chat-drawer";
import {
  exposure,
  landfallCountdownInitialSeconds,
  statusIndicators,
} from "@/lib/mock-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function BrandOrb() {
  return (
    <span
      className="shrink-0 rounded-full"
      style={{
        width: 9,
        height: 9,
        background: "radial-gradient(circle at 35% 30%, #F4BB85, #C78251)",
        boxShadow:
          "0 0 0 1px color-mix(in oklab, var(--accent) 35%, transparent), 0 0 6px 2px color-mix(in oklab, #f4bb85 45%, transparent)",
      }}
      aria-hidden
    />
  );
}

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [landfallSeconds, setLandfallSeconds] = useState<number>(
    landfallCountdownInitialSeconds
  );
  const [prepSeconds, setPrepSeconds] = useState<number>(
    exposure.prepTimeSeconds
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setLandfallSeconds((s) => Math.max(0, s - 1));
      setPrepSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const connectedSummary = useMemo(() => {
    const ok = statusIndicators.filter((i) => i.state === "ok").length;
    return { ok, total: statusIndicators.length };
  }, []);

  return (
    <div className="min-h-screen bg-bg pb-10 pt-14">
      <header className="fixed top-0 z-40 flex h-14 w-full items-center border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 sm:gap-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <BrandOrb />
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-base font-semibold text-text-1">
                Shepherd
              </span>
              <span
                className="hidden h-1 w-1 shrink-0 rounded-full bg-text-3 sm:block"
                aria-hidden
              />
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-text-3 sm:inline">
                Personal disaster companion
              </span>
            </div>
          </div>

          <div className="flex min-w-0 justify-center px-1 sm:px-2">
            <ThreatBadge landfallSeconds={landfallSeconds} />
          </div>

          <div className="flex justify-end">
            <div className="hidden items-center gap-4 md:flex">
              {statusIndicators.map((i) => (
                <StatusIndicator
                  key={i.label}
                  label={i.label}
                  state={i.state}
                  live={"live" in i ? i.live : undefined}
                />
              ))}
            </div>
            <div className="md:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-2 rounded-md border border-border-strong bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-2",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    )}
                  >
                    <span className="status-dot" data-state="ok" />
                    {connectedSummary.ok}/{connectedSummary.total} connected
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 border-border bg-surface p-4"
                >
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-text-3">
                    Systems
                  </p>
                  <div className="flex flex-col gap-3">
                    {statusIndicators.map((i) => (
                      <StatusIndicator
                        key={i.label}
                        label={i.label}
                        state={i.state}
                        live={"live" in i ? i.live : undefined}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <StormCard />
            <ExposureCard
              prepSeconds={prepSeconds}
              landfallSeconds={landfallSeconds}
            />
          </div>
          <div className="space-y-4 lg:col-span-5">
            <StatusPanel />
            <CompanionWidget onOpenChat={() => setDrawerOpen(true)} />
            <AlertsFeed />
          </div>
        </div>
      </main>

      <ChatDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        prepSeconds={prepSeconds}
      />
    </div>
  );
}
