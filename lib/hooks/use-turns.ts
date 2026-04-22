"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Turn } from "@/lib/db-types";

type UseTurnsResult = {
  turns: Turn[];
  loading: boolean;
  error: string | null;
};

export function useTurnsForSession(
  sessionId: string,
  enabled = true
): UseTurnsResult {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setTurns([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      const { data, error: loadError } = await supabase
        .from("turns")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (cancelled) return;
      if (loadError) {
        setError(loadError.message);
        setLoading(false);
        return;
      }
      setTurns(data ?? []);
      setLoading(false);
    })();

    const channelTopic =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

    const channel = supabase
      .channel(`turns-${sessionId}-${channelTopic}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "turns",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setTurns((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as Turn;
              if (prev.some((t) => t.id === row.id)) return prev;
              return [...prev, row].sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              );
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as Turn;
              return prev.map((t) => (t.id === row.id ? row : t));
            }
            if (payload.eventType === "DELETE") {
              const oldRow = payload.old as { id: string };
              return prev.filter((t) => t.id !== oldRow.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [sessionId, enabled]);

  return { turns, loading, error };
}
