"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatHistory } from "@/lib/mock-data";
import { CompanionOrb } from "@/components/companion-widget";
import { cn } from "@/lib/utils";

function formatPrepChip(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `T-${h}H ${String(m).padStart(2, "0")}M`;
}

export function ChatDrawer({
  open,
  onOpenChange,
  prepSeconds,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prepSeconds: number;
}) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!open) setDraft("");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 md:max-w-[480px]"
      >
        <Dialog.Title className="sr-only">Companion chat</Dialog.Title>
        <div className="flex h-full min-h-0 flex-col">
          <header className="relative flex h-14 shrink-0 items-center border-b border-border px-5">
            <div className="flex items-center gap-3 pr-10">
              <CompanionOrb size={36} />
              <div>
                <p className="text-[15px] font-semibold text-text-1">
                  Companion
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="status-dot"
                    data-state="ok"
                    data-live="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-green">
                    Connected · live
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 text-text-2 hover:text-text-1"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
              <span className="sr-only">Close</span>
            </Button>
          </header>

          <div className="flex items-center gap-3 border-b border-border bg-surface px-5 py-2.5">
            <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-text-3">
              Companion sees
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="rounded border border-border bg-surface-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-2">
                📍 GENTILLY
              </span>
              <span className="rounded border border-border bg-surface-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-2">
                ⛽ 37%
              </span>
              <span className="rounded border border-border bg-surface-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-2">
                🕐 {formatPrepChip(prepSeconds)}
              </span>
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-4 p-5">
              {chatHistory.map((msg, i) =>
                msg.role === "bot" ? (
                  <motion.div
                    key={`${msg.time}-bot-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-[85%]"
                  >
                    <div className="flex gap-2">
                      <CompanionOrb size={16} pulse={false} className="mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-amber">
                          Companion · {msg.time}
                        </p>
                        <p className="pt-1 text-[15px] leading-relaxed text-text-1">
                          {msg.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${msg.time}-user-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="ml-auto flex max-w-[80%] flex-col items-end"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-wider text-text-3">
                      You · {msg.time}
                    </p>
                    <div className="mt-1 rounded-2xl border border-border bg-surface px-4 py-2.5 text-[15px] leading-relaxed text-text-1">
                      {msg.body}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </ScrollArea>

          <div className="shrink-0 border-t border-border bg-surface p-4">
            <div className="flex gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask the companion…"
                rows={2}
                aria-label="Message to companion"
                className={cn(
                  "min-h-[52px] flex-1 resize-none rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-1",
                  "placeholder:text-text-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
                )}
              />
              <Button
                type="button"
                disabled={!draft.trim()}
                className="h-[52px] shrink-0 self-end bg-accent px-4 text-white hover:bg-accent/90 disabled:opacity-40"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
