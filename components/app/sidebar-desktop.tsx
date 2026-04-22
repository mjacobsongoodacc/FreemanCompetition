"use client";

import { Divider } from "@mantine/core";
import { Settings } from "lucide-react";

type SidebarDesktopProps = {
  onSettings: () => void;
};

export function SidebarDesktop({ onSettings }: SidebarDesktopProps) {
  return (
    <aside className="hidden w-[72px] shrink-0 flex-col justify-between bg-sidebar-bg py-6 lg:flex">
      <div className="flex flex-col items-center gap-2 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber">
          <span className="font-body text-sm font-semibold text-white">SB</span>
        </div>
        <p className="text-center font-mono text-[10px] font-medium uppercase leading-tight text-text-2">
          Sarah
        </p>
        <p className="text-center font-mono text-[10px] font-medium uppercase leading-tight text-text-2">
          Gentilly
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Divider w={40} color="var(--border)" />
        <button
          type="button"
          onClick={onSettings}
          className="shepherd-focus shepherd-active flex h-11 w-11 items-center justify-center rounded-md text-text-2 [@media(hover:hover)]:hover:text-text-1"
          aria-label="Settings"
        >
          <Settings size={20} strokeWidth={1.75} />
        </button>
      </div>
    </aside>
  );
}
