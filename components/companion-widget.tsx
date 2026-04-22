"use client";

import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { companionPreview } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CompanionOrb({
  size = 32,
  className,
  pulse = true,
}: {
  size?: number;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <div
      className={cn(
        pulse && "companion-orb",
        "shrink-0 rounded-full",
        className
      )}
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 35% 30%, #F4BB85, #C78251)",
        boxShadow: pulse
          ? undefined
          : "0 0 0 1px color-mix(in oklab, var(--accent) 35%, transparent)",
      }}
    />
  );
}

export function CompanionWidget({
  onOpenChat,
}: {
  onOpenChat: () => void;
}) {
  return (
    <Card className="overflow-hidden border border-border border-t-2 border-t-accent p-0">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <CompanionOrb size={32} />
          <div>
            <p className="text-[15px] font-semibold text-text-1">Companion</p>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span
                className="status-dot"
                data-state="ok"
                data-live="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-green">
                Connected · monitoring
              </span>
            </div>
          </div>
        </div>

        <blockquote className="line-clamp-3 text-sm leading-snug text-text-2">
          &ldquo;{companionPreview}&rdquo;
        </blockquote>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-text-3">
            Synced 14s ago
          </p>
          <Button
            type="button"
            className="h-9 gap-2 bg-accent text-white hover:bg-accent/90"
            onClick={onOpenChat}
          >
            <MessageSquare className="h-4 w-4" strokeWidth={1.75} />
            Open chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
