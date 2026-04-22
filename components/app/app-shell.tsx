"use client";

import { useState } from "react";
import { BottomNav } from "@/components/app/bottom-nav";
import { SettingsModal } from "@/components/app/settings-modal";
import { SidebarDesktop } from "@/components/app/sidebar-desktop";
import { SidebarDrawer } from "@/components/app/sidebar-drawer";
import { ThreatBar } from "@/components/app/threat-bar";
import { TopBar } from "@/components/app/top-bar";
import { useStorm } from "@/lib/storm-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { stormActive } = useStorm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex min-h-dvh w-full bg-bg text-text-1">
      <SidebarDesktop onSettings={() => setSettingsOpen(true)} />
      <SidebarDrawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <SettingsModal
        opened={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          menuOpened={drawerOpen}
          onMenu={() => setDrawerOpen((o) => !o)}
          onSettings={() => setSettingsOpen(true)}
        />
        {stormActive ? (
          <div className="fixed left-0 right-0 top-14 z-[195] lg:hidden">
            <ThreatBar />
          </div>
        ) : null}
        <div
          className={`flex min-h-0 flex-1 flex-col ${
            stormActive ? "pt-[6rem] lg:pt-0" : "pt-14 lg:pt-0"
          }`}
        >
          {stormActive ? (
            <div className="hidden lg:block">
              <ThreatBar />
            </div>
          ) : null}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
            {children}
          </div>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
