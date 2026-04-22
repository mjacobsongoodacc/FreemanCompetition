"use client";

import { useMemo } from "react";
import { useTurnsForSession } from "@/lib/hooks/use-turns";
import { DEMO_SESSION_ID } from "@/lib/supabase";
import type { Turn } from "@/lib/db-types";

export type PlanStream = {
  headline: string;
  items: { id: string; text: string; status: "pending" | "doing" | "done" }[];
  updated_this_turn: boolean;
};

export type ResourcesStream = {
  headline: string;
  budget: { total: number; allocated: number; remaining: number };
  items: { label: string; amount: number }[];
  updated_this_turn: boolean;
};

export type LocationStream = {
  current: { address: string; zip: string };
  target: { address: string; lodging?: string };
  route_summary: string;
  updated_this_turn: boolean;
};

export type DisasterStream = {
  storm_name: string;
  category: number;
  position?: { lat: number; lng: number };
  max_winds_mph: number;
  gusts_mph: number;
  pressure_mb: number;
  landfall_eta: string;
  advisory_number: number;
  delta: string;
  updated_this_turn: boolean;
};

export type WorldItem = {
  type: string;
  severity: "red" | "amber" | "blue";
  text: string;
  detour_via?: { lat: number; lng: number };
};

export type WorldStream = {
  items: WorldItem[];
  updated_this_turn: boolean;
};

export type Streams = {
  plan: PlanStream | null;
  resources: ResourcesStream | null;
  location: LocationStream | null;
  disaster: DisasterStream | null;
  world: WorldStream | null;
};

export type Meta = {
  primary_stream?: string;
  urgency?: "low" | "medium" | "high";
  show_alert_banner?: boolean;
};

export type UseCurrentStreamsResult = {
  streams: Streams;
  meta: Meta | null;
  loading: boolean;
  error: string | null;
  latestTurnId: string | null;
};

const EMPTY_STREAMS: Streams = {
  plan: null,
  resources: null,
  location: null,
  disaster: null,
  world: null,
};

const STREAM_KEYS = [
  "plan",
  "resources",
  "location",
  "disaster",
  "world",
] as const;

function extractStreams(turn: Turn): Partial<Streams> {
  const payload = turn.response_payload as {
    streams?: Partial<Streams>;
  } | null;
  if (!payload || typeof payload !== "object") return {};
  if (!payload.streams || typeof payload.streams !== "object") return {};
  return payload.streams;
}

function extractMetaFromTurn(turn: Turn): Meta | null {
  const payload = turn.response_payload as { meta?: Meta } | null;
  if (!payload || typeof payload !== "object") return null;
  const m = payload.meta;
  if (!m || typeof m !== "object") return null;
  return m as Meta;
}

type StreamBag = Record<(typeof STREAM_KEYS)[number], Streams[keyof Streams] | null>;

function setMergedStream(
  bag: StreamBag,
  key: (typeof STREAM_KEYS)[number],
  value: Streams[keyof Streams]
) {
  bag[key] = value;
}

export function useCurrentStreams(enabled: boolean): UseCurrentStreamsResult {
  const { turns, loading, error } = useTurnsForSession(DEMO_SESSION_ID, enabled);

  const { streams, latestTurnId, meta } = useMemo(() => {
    const bag: StreamBag = { ...EMPTY_STREAMS };
    let newest: Turn | null = null;

    for (const turn of turns) {
      if (turn.status !== "responded") continue;
      const parts = extractStreams(turn);
      for (const key of STREAM_KEYS) {
        const incoming = parts[key];
        if (incoming && typeof incoming === "object") {
          const prev = bag[key];
          const prevRec =
            prev && typeof prev === "object"
              ? (prev as Record<string, unknown>)
              : {};
          setMergedStream(bag, key, {
            ...prevRec,
            ...(incoming as Record<string, unknown>),
          } as Streams[keyof Streams]);
        }
      }
      newest = turn;
    }

    let metaOut: Meta | null = null;
    if (newest) {
      metaOut = extractMetaFromTurn(newest);
      const fresh = extractStreams(newest);
      for (const key of STREAM_KEYS) {
        const cur = bag[key];
        if (!cur) continue;
        const inNewest = fresh[key];
        if (inNewest && typeof inNewest === "object") {
          const u = (inNewest as { updated_this_turn?: boolean })
            .updated_this_turn;
          setMergedStream(bag, key, {
            ...(cur as Record<string, unknown>),
            updated_this_turn: !!u,
          } as Streams[keyof Streams]);
        } else {
          setMergedStream(bag, key, {
            ...(cur as Record<string, unknown>),
            updated_this_turn: false,
          } as Streams[keyof Streams]);
        }
      }
    }

    const state = bag as Streams;
    return {
      streams: state,
      latestTurnId: newest?.id ?? null,
      meta: metaOut,
    };
  }, [turns]);

  return { streams, meta, loading, error, latestTurnId };
}
