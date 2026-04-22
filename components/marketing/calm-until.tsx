"use client";

import { CalmOrb } from "@/components/app/calm-orb";
import { BrandOrb } from "@/components/app/brand-orb";
import { chatHistory } from "@/lib/mock-data";

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-border-strong bg-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      style={{ aspectRatio: "9 / 19" }}
    >
      <div className="h-full w-full origin-top scale-[0.92]">{children}</div>
    </div>
  );
}

function MockCalm() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-bg px-3 py-6">
      <CalmOrb size="80px" />
      <p className="text-center font-display text-sm font-semibold text-text-1">
        No NHC events reported.
      </p>
    </div>
  );
}

function MockChat() {
  const items = chatHistory.slice(0, 2);
  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="flex h-11 items-center gap-2 border-b border-border px-3">
        <BrandOrb size={14} pulse={false} />
        <span className="font-display text-sm font-semibold text-text-1">
          Companion
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden p-3">
        {items.map((m, i) =>
          m.role === "bot" ? (
            <div key={i} className="flex gap-2">
              <BrandOrb size={12} pulse={false} />
              <div className="min-w-0">
                <p className="font-mono text-[8px] uppercase text-amber">
                  Companion · {m.time}
                </p>
                <p className="mt-1 font-body text-[11px] leading-snug text-text-1">
                  {m.body.slice(0, 120)}
                  {m.body.length > 120 ? "…" : ""}
                </p>
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="max-w-[90%] rounded-xl border border-border bg-surface px-2 py-1.5">
                <p className="text-right font-mono text-[8px] uppercase text-text-3">
                  You · {m.time}
                </p>
                <p className="mt-1 text-right font-body text-[11px] text-text-1">
                  {m.body}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export function CalmUntil() {
  return (
    <section className="px-4 py-20 md:px-6 md:py-28">
      <h2 className="mx-auto mb-12 max-w-3xl text-center font-display text-[clamp(28px,6vw,40px)] font-semibold text-text-1">
        Calm until it can&apos;t be.
      </h2>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-6">
        <PhoneFrame>
          <MockCalm />
        </PhoneFrame>
        <PhoneFrame>
          <MockChat />
        </PhoneFrame>
      </div>
    </section>
  );
}
