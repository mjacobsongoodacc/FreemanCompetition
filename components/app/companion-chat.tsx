"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandOrb } from "@/components/app/brand-orb";
import { CalmOrb } from "@/components/app/calm-orb";
import { Button } from "@/components/ui/button";
import { user, storm } from "@/lib/mock-data";
import { useStorm } from "@/lib/storm-context";
import { useTurnsForSession } from "@/lib/hooks/use-turns";
import { supabase, DEMO_SESSION_ID } from "@/lib/supabase";
import type { Turn } from "@/lib/db-types";

type Msg = {
  id: string;
  role: "user" | "bot";
  time: string;
  body: string;
  isThinking?: boolean;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

function turnsToMessages(turns: Turn[]): Msg[] {
  const out: Msg[] = [];
  for (const t of turns) {
    out.push({
      id: `u-${t.id}`,
      role: "user",
      time: formatTime(t.created_at),
      body: t.user_message,
    });
    const payload = t.response_payload as
      | { companion?: { reply?: string; display_time?: string } }
      | null;
    const reply = payload?.companion?.reply;
    if (
      t.status === "responded" &&
      typeof reply === "string" &&
      reply.length > 0
    ) {
      out.push({
        id: `b-${t.id}`,
        role: "bot",
        time:
          payload?.companion?.display_time ||
          formatTime(t.responded_at ?? t.created_at),
        body: reply,
      });
    } else {
      out.push({
        id: `t-${t.id}`,
        role: "bot",
        time: "",
        body: "",
        isThinking: true,
      });
    }
  }
  return out;
}

function formatPrepChip(seconds: number) {
  if (seconds <= 0) return { label: "Evac window closed", alert: true as const };
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return { label: `T-${h}H ${m}M`, alert: false as const };
}

function ThinkingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse" />
      <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse [animation-delay:300ms]" />
    </span>
  );
}

export function CompanionChat() {
  const { stormActive, setStormActive, prepSeconds } = useStorm();
  const reduce = useReducedMotion();
  const { turns, loading, error } = useTurnsForSession(DEMO_SESSION_ID, stormActive);
  const [input, setInput] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(
    () => (stormActive ? turnsToMessages(turns) : []),
    [stormActive, turns]
  );

  useEffect(() => {
    if (!listRef.current || !stormActive) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, stormActive]);

  const prepChip = useMemo(() => formatPrepChip(prepSeconds), [prepSeconds]);

  const chips: { key: string; text: string; alert?: boolean }[] = useMemo(
    () => [
      { key: "loc", text: `📍 Gentilly` },
      { key: "fuel", text: `⛽ ${user.fuelPercent}%` },
      { key: "cash", text: `💵 $${user.cash}` },
      {
        key: "time",
        text: `🕐 ${prepChip.label}`,
        alert: prepChip.alert,
      },
      { key: "storm", text: `🌀 Ida Cat ${storm.category}` },
    ],
    [prepChip]
  );

  const send = async () => {
    const text = input.trim();
    if (!text || !stormActive) return;
    setInput("");
    setSendError(null);
    const { error: insertError } = await supabase.from("turns").insert({
      session_id: DEMO_SESSION_ID,
      user_message: text,
      status: "pending",
    });
    if (insertError) {
      console.error("Failed to insert turn:", insertError);
      setSendError("Could not send. Try again.");
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AnimatePresence mode="wait">
        {!stormActive ? (
          <motion.div
            key="calm"
            className="flex flex-1 flex-col items-center justify-center px-4 py-10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.6 }}
          >
            <div className="flex flex-col items-center text-center">
              <h2 className="font-display text-[clamp(24px,6vw,32px)] font-semibold text-text-1">
                No NHC events reported.
              </h2>
              <div className="mt-8">
                <CalmOrb />
              </div>
              <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-wide text-text-2">
                All clear. I&apos;ll be here if anything changes.
              </p>
              <Button
                variant="outline"
                className="mt-12 h-12 w-full max-w-[320px] md:w-60"
                type="button"
                onClick={() => setStormActive(true)}
              >
                Enter storm simulation
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="storm"
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0.1 : 0.4 }}
          >
            <header className="flex h-14 shrink-0 items-center border-b border-border px-4">
              <BrandOrb size={24} pulse />
              <span className="ml-3 font-display text-lg font-semibold text-text-1">
                Companion
              </span>
              <span className="ml-3 h-2 w-2 rounded-full bg-calm" aria-hidden />
              <span className="ml-2 font-mono text-[10px] font-medium uppercase text-calm">
                Live
              </span>
            </header>
            <div className="flex h-12 shrink-0 items-center border-b border-border px-4">
              <div className="chips-scroll flex gap-2 overflow-x-auto py-2">
                {chips.map((c) => (
                  <span
                    key={c.key}
                    className="whitespace-nowrap rounded border border-border bg-surface-2 px-3 py-1.5 font-mono text-[11px] font-medium uppercase text-text-2"
                    style={
                      c.alert
                        ? {
                            color: "var(--alert)",
                            borderColor: "var(--alert)",
                          }
                        : undefined
                    }
                  >
                    {c.text}
                  </span>
                ))}
              </div>
            </div>
            <div
              ref={listRef}
              className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-4"
            >
              <div className="mx-auto flex max-w-[680px] flex-col gap-5 md:gap-6">
                {loading && turns.length === 0 ? (
                  <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-text-2">
                    Connecting…
                  </p>
                ) : null}
                {messages.map((m) =>
                  m.role === "bot" ? (
                    <motion.div
                      key={m.id}
                      className="flex gap-3"
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <BrandOrb size={16} pulse={false} />
                      <div className="min-w-0 max-w-full">
                        <p className="font-mono text-[10px] font-medium uppercase text-amber">
                          {m.isThinking
                            ? "Companion"
                            : `Companion · ${m.time}`}
                        </p>
                        {m.isThinking ? (
                          <p className="mt-2 font-body text-[15px] leading-[1.55] text-text-1">
                            {reduce ? (
                              <span className="text-amber">…</span>
                            ) : (
                              <ThinkingDots />
                            )}
                          </p>
                        ) : (
                          <p className="mt-2 font-body text-[15px] leading-[1.55] text-text-1">
                            {m.body}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={m.id}
                      className="flex justify-end"
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="max-w-[85%]">
                        <p className="text-right font-mono text-[10px] font-medium uppercase text-text-3">
                          You · {m.time}
                        </p>
                        <div className="mt-2 rounded-2xl border border-border bg-surface px-4 py-2.5">
                          <p className="font-body text-[15px] leading-[1.55] text-text-1">
                            {m.body}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>
            <div
              className="shrink-0 border-t border-border bg-bg px-3 py-3"
              style={{
                paddingBottom:
                  "max(12px, env(safe-area-inset-bottom, 0px))",
              }}
            >
              <div className="mx-auto flex w-full max-w-[680px] flex-col gap-2">
                {error ? (
                  <p
                    className="font-mono text-[11px] leading-snug"
                    style={{ color: "var(--alert)" }}
                  >
                    Connection issue. Messages may not send. Refresh if this
                    persists.
                  </p>
                ) : null}
                {sendError ? (
                  <p
                    className="font-mono text-[11px] leading-snug"
                    style={{ color: "var(--alert)" }}
                  >
                    {sendError}
                  </p>
                ) : null}
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (sendError) setSendError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void send();
                      }
                    }}
                    placeholder="Ask the companion…"
                    rows={1}
                    className="shepherd-focus min-h-12 w-full resize-none rounded-lg border border-border bg-bg px-3 py-3 font-body text-base text-text-1 placeholder:text-text-3 md:min-h-14 md:flex-1"
                  />
                  <Button
                    className="h-12 w-full shrink-0 md:h-14 md:w-auto md:px-5"
                    type="button"
                    disabled={!input.trim()}
                    onClick={() => void send()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
