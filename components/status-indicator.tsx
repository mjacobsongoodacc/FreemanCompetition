import { cn } from "@/lib/utils";

export type StatusState = "ok" | "warn" | "alert" | "off";

export function StatusIndicator({
  label,
  state,
  live,
  className,
}: {
  label: string;
  state: StatusState;
  live?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className="status-dot"
        data-state={state}
        data-live={live ? "true" : undefined}
      />
      <span className="font-mono text-[11px] uppercase tracking-wider text-text-2">
        {label}
      </span>
    </div>
  );
}
