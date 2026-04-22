"use client";

import { Activity, MessageCircle } from "lucide-react";
import { useStorm } from "@/lib/storm-context";

export function BottomNav() {
  const { activeTab, setActiveTab, stormActive } = useStorm();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[190] flex min-h-16 border-t border-border bg-bg pb-[env(safe-area-inset-bottom,0px)] lg:left-[72px]">
      <button
        type="button"
        onClick={() => setActiveTab("companion")}
        className="shepherd-focus shepherd-active relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-text-2 transition-colors [@media(hover:hover)]:hover:text-text-1"
        aria-current={activeTab === "companion" ? "page" : undefined}
      >
        <span className="relative inline-flex">
          <MessageCircle
            size={20}
            strokeWidth={1.75}
            className={
              activeTab === "companion" ? "text-amber" : "text-text-2"
            }
          />
          <span
            className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full"
            style={{
              background: stormActive ? "var(--amber)" : "var(--calm)",
            }}
            aria-hidden
          />
        </span>
        <span
          className={`font-mono text-[10px] font-medium uppercase tracking-wide ${
            activeTab === "companion" ? "text-text-1" : "text-text-2"
          }`}
        >
          Companion
        </span>
        {activeTab === "companion" ? (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber" />
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("monitor")}
        className="shepherd-focus shepherd-active relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-text-2 transition-colors [@media(hover:hover)]:hover:text-text-1"
        aria-current={activeTab === "monitor" ? "page" : undefined}
      >
        <Activity
          size={20}
          strokeWidth={1.75}
          className={activeTab === "monitor" ? "text-amber" : "text-text-2"}
        />
        <span
          className={`font-mono text-[10px] font-medium uppercase tracking-wide ${
            activeTab === "monitor" ? "text-text-1" : "text-text-2"
          }`}
        >
          Monitor
        </span>
        {activeTab === "monitor" ? (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber" />
        ) : null}
      </button>
    </nav>
  );
}
