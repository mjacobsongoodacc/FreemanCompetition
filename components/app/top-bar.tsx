"use client";

import { Burger } from "@mantine/core";
import { Settings } from "lucide-react";
import { BrandOrb } from "@/components/app/brand-orb";

type TopBarProps = {
  onMenu: () => void;
  onSettings: () => void;
  menuOpened: boolean;
};

export function TopBar({ onMenu, onSettings, menuOpened }: TopBarProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-[200] flex h-14 items-center justify-between border-b border-border bg-sidebar-bg px-2 lg:hidden">
      <Burger
        opened={menuOpened}
        onClick={onMenu}
        size="sm"
        color="var(--text-2)"
        aria-label="Open menu"
        styles={{
          root: {
            width: 44,
            height: 44,
            minWidth: 44,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      />
      <div className="flex items-center gap-2">
        <BrandOrb size={12} pulse={false} />
        <span className="font-display text-base font-semibold text-text-1">
          Shepherd
        </span>
      </div>
      <button
        type="button"
        onClick={onSettings}
        className="shepherd-focus shepherd-active flex h-11 w-11 items-center justify-center rounded-md text-text-2 transition-colors [@media(hover:hover)]:hover:text-text-1"
        aria-label="Settings"
      >
        <Settings size={20} strokeWidth={1.75} />
      </button>
    </header>
  );
}
