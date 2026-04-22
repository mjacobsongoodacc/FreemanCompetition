"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandOrb } from "@/components/app/brand-orb";
import { CalmOrb } from "@/components/app/calm-orb";
import { Button } from "@/components/ui/button";
import { chatHistory, scriptedReplies, storm, user } from "@/lib/mock-data";
import { useStorm } from "@/lib/storm-context";

type Msg = {
  id: string;
  role: "user" | "bot";
  time: string;
  body: string;
};

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

function formatPrepChip(seconds: number) {
  if (seconds <= 0) return { label: "Evac window closed", alert: true as const };
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return { label: `T-${h}H ${m}M`, alert: false as const };
}

export function CompanionChat() {
  const { stormActive, setStormActive, prepSeconds } = useStorm();
  const reduce = useReducedMotion();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const replyIndex = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stormActive) {
      setMessages([]);
      return;
    }
    const initial: Msg[] = chatHistory.map((m, i) => ({
      id: `seed-${i}`,
      role: m.role,
      time: m.time,
      body: m.body,
    }));
    setMessages(initial);
    replyIndex.current = 0;
  }, [stormActive]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

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

  const send = () => {
    const t = input.trim();
    if (!t || !stormActive) return;
    const userMsg: Msg = {
      id: `u-${Date.now()}`,
      role: "user",
      time: nowTime(),
      body: t,
    };
    setInput("");
    setMessages((m) => [...m, userMsg]);
    window.setTimeout(() => {
      const idx = Math.min(replyIndex.current, scriptedReplies.length - 1);
      const script = scriptedReplies[idx];
      if (replyIndex.current < scriptedReplies.length - 1) {
        replyIndex.current += 1;
      }
      const botMsg: Msg = {
        id: `b-${Date.now()}`,
        role: "bot",
        time: nowTime(),
        body: script,
      };
      setMessages((m) => [...m, botMsg]);
    }, 800);
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
                {messages.map((m, i) =>
                  m.role === "bot" ? (
                    <motion.div
                      key={m.id}
                      className="flex gap-3"
                      initial={
                        m.id.startsWith("seed")
                          ? reduce
                            ? false
                            : { opacity: 0, y: 12 }
                          : false
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        m.id.startsWith("seed")
                          ? reduce
                            ? { duration: 0.1 }
                            : {
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                                delay: i * 0.08,
                              }
                          : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                      }
                    >
                      <BrandOrb size={16} pulse={false} />
                      <div className="min-w-0 max-w-full">
                        <p className="font-mono text-[10px] font-medium uppercase text-amber">
                          Companion · {m.time}
                        </p>
                        <p className="mt-2 font-body text-[15px] leading-[1.55] text-text-1">
                          {m.body}
                        </p>
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
              <div className="mx-auto flex max-w-[680px] flex-col gap-2 md:flex-row md:items-end md:gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
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
                  onClick={send}
                >
                  Send
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
