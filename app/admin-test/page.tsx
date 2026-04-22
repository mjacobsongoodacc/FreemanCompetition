"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { supabase, DEMO_SESSION_ID } from "@/lib/supabase";
import type { Turn, TurnStatus } from "@/lib/db-types";
import type { Json } from "@/types/supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

function isTurnStatus(s: string): s is TurnStatus {
  return s === "pending" || s === "in_boodlebox" || s === "responded";
}

function sortTurnsNewestFirst(rows: Turn[]): Turn[] {
  return [...rows].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function applyRealtimePayload(
  prev: Turn[],
  payload: RealtimePostgresChangesPayload<Record<string, unknown>>
): Turn[] {
  if (payload.eventType === "DELETE" && payload.old) {
    const id = (payload.old as { id: string }).id;
    return prev.filter((t) => t.id !== id);
  }
  if (payload.new) {
    const row = payload.new as Turn;
    if (row.session_id !== DEMO_SESSION_ID) {
      return prev;
    }
    return sortTurnsNewestFirst(upsertById(prev, row));
  }
  return prev;
}

function upsertById(list: Turn[], row: Turn): Turn[] {
  const without = list.filter((t) => t.id !== row.id);
  return [row, ...without];
}

export default function AdminTestPage() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageDraft, setMessageDraft] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [insertError, setInsertError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [responseJsonDraft, setResponseJsonDraft] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const selectedTurn = selectedId
    ? turns.find((t) => t.id === selectedId) ?? null
    : null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("turns")
        .select("*")
        .eq("session_id", DEMO_SESSION_ID)
        .order("created_at", { ascending: false });
      if (cancelled) {
        return;
      }
      if (error) {
        console.error(error);
        setLoadError(error.message);
        setLoading(false);
        return;
      }
      setTurns((data as Turn[] | null) ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const ch = supabase
      .channel("admin-test")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "turns",
          filter: `session_id=eq.${DEMO_SESSION_ID}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE" && payload.old) {
            const id = (payload.old as { id: string }).id;
            if (id === selectedIdRef.current) {
              setSelectedId(null);
              setResponseJsonDraft("");
            }
          }
          setTurns((prev) => applyRealtimePayload(prev, payload));
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, []);

  const onSend = useCallback(async () => {
    setInsertError(null);
    const text = messageDraft.trim();
    if (!text) {
      return;
    }
    const { error } = await supabase.from("turns").insert({
      session_id: DEMO_SESSION_ID,
      user_message: text,
      status: "pending",
    });
    if (error) {
      console.error(error);
      setInsertError(error.message);
      return;
    }
    setMessageDraft("");
  }, [messageDraft]);

  const onValidateAndSend = useCallback(async () => {
    setParseError(null);
    setUpdateError(null);
    if (!selectedId) {
      return;
    }
    let parsed: Json;
    try {
      parsed = JSON.parse(responseJsonDraft) as Json;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setParseError(message);
      return;
    }
    const { data, error } = await supabase
      .from("turns")
      .update({
        response_payload: parsed,
        status: "responded",
        responded_at: new Date().toISOString(),
      })
      .eq("id", selectedId)
      .select("id")
      .maybeSingle();
    if (error) {
      console.error(error);
      setUpdateError(error.message);
      return;
    }
    if (!data) {
      setUpdateError("No row updated (id not found or RLS).");
      return;
    }
    setResponseJsonDraft("");
    setSelectedId(null);
  }, [responseJsonDraft, selectedId]);

  const pageShell: CSSProperties = {
    minHeight: "100vh",
    padding: 12,
    background: "#ffffff",
    color: "#0a0a0a",
    fontFamily: "system-ui, sans-serif",
    colorScheme: "light",
  };

  const panel: CSSProperties = {
    border: "1px solid #ccc",
    padding: 8,
    background: "#ffffff",
    color: "#0a0a0a",
    minWidth: 0,
  };

  const field: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#0a0a0a",
    border: "1px solid #999",
  };

  const btn: CSSProperties = {
    padding: "6px 12px",
    background: "#f0f0f0",
    color: "#0a0a0a",
    border: "1px solid #888",
    cursor: "pointer",
  };

  return (
    <div style={pageShell}>
      <header
        style={{
          borderBottom: "1px solid #ccc",
          paddingBottom: 8,
          marginBottom: 12,
          color: "#0a0a0a",
        }}
      >
        Admin Test (dev only) · Session: {DEMO_SESSION_ID}
      </header>

      <div
        className="flex flex-col gap-3 lg:flex-row lg:items-stretch"
        style={{ alignItems: "stretch" as const }}
      >
        <section className="flex-1" style={panel}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 14, fontWeight: 700 }}>A — Insert</h2>
          <textarea
            value={messageDraft}
            onChange={(e) => setMessageDraft(e.target.value)}
            rows={5}
            style={field}
            placeholder="User message…"
          />
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={() => void onSend()} style={btn}>
              Send
            </button>
          </div>
          {insertError ? (
            <p style={{ color: "red", marginTop: 6, fontSize: 12 }}>{insertError}</p>
          ) : null}
        </section>

        <section className="flex-1" style={panel}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 14, fontWeight: 700 }}>B — Live list</h2>
          {loadError ? (
            <p style={{ color: "red", fontSize: 12 }}>{loadError}</p>
          ) : null}
          {loading ? (
            <p>Loading turns…</p>
          ) : loadError ? null : turns.length === 0 ? (
            <p>No turns yet. Insert one from the left.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: 480, overflow: "auto" }}>
              {turns.map((t) => {
                const statusLabel = isTurnStatus(t.status) ? t.status : t.status;
                return (
                  <li
                    key={t.id}
                    role="button"
                    onClick={() => {
                      setSelectedId(t.id);
                    }}
                    style={{
                      border:
                        t.id === selectedId ? "2px solid #333" : "1px solid #ccc",
                      padding: 6,
                      marginBottom: 6,
                      cursor: "pointer",
                      background: t.id === selectedId ? "#e8f0ff" : "#fafafa",
                      color: "#0a0a0a",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#333" }}>{t.created_at}</div>
                    <div style={{ margin: "4px 0" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 6px",
                          background: "#e0e0e0",
                          color: "#0a0a0a",
                          fontSize: 11,
                          textTransform: "lowercase" as const,
                        }}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <div style={{ fontSize: 14 }}>{t.user_message}</div>
                    {t.response_payload != null ? (
                      <details style={{ marginTop: 6, fontSize: 12, color: "#0a0a0a" }}>
                        <summary>response_payload</summary>
                        <pre
                          style={{
                            margin: 6,
                            whiteSpace: "pre-wrap",
                            color: "#0a0a0a",
                            background: "#f5f5f5",
                            padding: 8,
                            border: "1px solid #ddd",
                          }}
                        >
                          {JSON.stringify(t.response_payload, null, 2)}
                        </pre>
                      </details>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="flex-1" style={panel}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 14, fontWeight: 700 }}>C — Respond</h2>
          <p style={{ fontSize: 12, color: "#333" }}>
            Selected: {selectedTurn ? String(selectedTurn.id) : "none"}{" "}
            {selectedTurn && isTurnStatus(selectedTurn.status) ? `(${selectedTurn.status})` : null}
          </p>
          <textarea
            value={responseJsonDraft}
            onChange={(e) => setResponseJsonDraft(e.target.value)}
            rows={8}
            style={field}
            placeholder='Valid JSON, e.g. { "a": 1 }'
          />
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={() => void onValidateAndSend()} style={btn}>
              Validate + Send
            </button>
          </div>
          {parseError ? (
            <p style={{ color: "red", marginTop: 6, fontSize: 12 }}>{parseError}</p>
          ) : null}
          {updateError ? (
            <p style={{ color: "red", marginTop: 6, fontSize: 12 }}>{updateError}</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
