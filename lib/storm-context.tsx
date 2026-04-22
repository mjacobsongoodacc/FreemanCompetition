"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { notifications } from "@mantine/notifications";
import {
  landfallCountdownInitialSeconds,
  exposure,
} from "@/lib/mock-data";
import { supabase, DEMO_SESSION_ID } from "@/lib/supabase";

const STORAGE_KEY = "shepherd_storm";

type Tab = "companion" | "monitor";

type StormContextValue = {
  stormActive: boolean;
  setStormActive: (v: boolean) => void;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  resetDemo: () => void;
  landfallSeconds: number;
  prepSeconds: number;
};

const StormContext = createContext<StormContextValue | null>(null);

function readStoredStorm(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    return raw === "true";
  } catch {
    return null;
  }
}

function writeStoredStorm(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
  } catch {
    throw new Error("STORAGE_UNAVAILABLE");
  }
}

export function StormProvider({ children }: { children: React.ReactNode }) {
  const storageWarned = useRef(false);
  const [storageOk, setStorageOk] = useState(true);
  const [stormActive, setStormActiveState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTabState] = useState<Tab>("monitor");
  const [landfallSeconds, setLandfallSeconds] = useState<number>(
    landfallCountdownInitialSeconds
  );
  const [prepSeconds, setPrepSeconds] = useState<number>(
    exposure.prepTimeSeconds
  );

  useEffect(() => {
    const stored = readStoredStorm();
    if (stored !== null) {
      setStormActiveState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      writeStoredStorm(stormActive);
    } catch {
      if (!storageWarned.current) {
        storageWarned.current = true;
        setStorageOk(false);
        notifications.show({
          color: "yellow",
          title: "Session storage",
          message:
            "Storage unavailable — session will end when you close this tab.",
          autoClose: 4000,
        });
      }
    }
  }, [stormActive, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setActiveTabState(stormActive ? "companion" : "monitor");
  }, [stormActive, hydrated]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLandfallSeconds((s) => Math.max(0, s - 1));
      setPrepSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const setStormActive = useCallback((v: boolean) => {
    setStormActiveState(v);
    if (!storageOk) {
      /* session-only: no persist */
    }
  }, [storageOk]);

  const setActiveTab = useCallback((t: Tab) => {
    setActiveTabState(t);
  }, []);

  const resetDemo = useCallback(() => {
    void (async () => {
      const { error } = await supabase
        .from("turns")
        .delete()
        .eq("session_id", DEMO_SESSION_ID);
      if (error) {
        console.error("Failed to clear demo turns:", error);
        notifications.show({
          color: "red",
          title: "Could not reset chat",
          message:
            "Demo messages could not be cleared. Check your connection and try again.",
        });
        return;
      }
      setStormActiveState(false);
      setLandfallSeconds(landfallCountdownInitialSeconds);
      setPrepSeconds(exposure.prepTimeSeconds);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      window.location.href = "/app";
    })();
  }, []);

  const value = useMemo<StormContextValue>(
    () => ({
      stormActive,
      setStormActive,
      activeTab,
      setActiveTab,
      resetDemo,
      landfallSeconds,
      prepSeconds,
    }),
    [
      stormActive,
      setStormActive,
      activeTab,
      setActiveTab,
      resetDemo,
      landfallSeconds,
      prepSeconds,
    ]
  );

  return (
    <StormContext.Provider value={value}>{children}</StormContext.Provider>
  );
}

export function useStorm() {
  const ctx = useContext(StormContext);
  if (!ctx) {
    throw new Error("useStorm must be used within StormProvider");
  }
  return ctx;
}
