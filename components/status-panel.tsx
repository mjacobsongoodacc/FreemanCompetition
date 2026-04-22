import { Car, Fuel, HeartPulse, Shield, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { user } from "@/lib/mock-data";

export function StatusPanel() {
  const dep = user.dependents[0];

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-2">
          Your status
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="status-dot"
            data-state="ok"
            data-live="true"
          />
          <span className="font-mono text-[10px] uppercase tracking-wider text-green">
            Live
          </span>
        </div>
      </div>
      <CardContent className="p-0 px-5">
        <div className="flex flex-col">
          <div className="border-b border-border py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-text-3" strokeWidth={1.75} />
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-2">
                  Fuel
                </span>
              </div>
              <span className="font-mono text-sm text-amber">
                {user.fuelPercent}%
              </span>
            </div>
            <div className="pt-2">
              <Progress value={user.fuelPercent} className="h-1.5" />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-border py-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-text-3" strokeWidth={1.75} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-2">
                Cash
              </span>
            </div>
            <span className="font-mono text-sm text-text-1">
              ${user.cash}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-border py-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-text-3" strokeWidth={1.75} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-2">
                Mom · {dep.location.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-right">
              <span className="text-sm text-text-2">{dep.status}</span>
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-green"
                style={{
                  boxShadow:
                    "0 0 0 2px color-mix(in oklab, var(--green) 25%, transparent)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-border py-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-text-3" strokeWidth={1.75} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-2">
                Insurance
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-red">
                NO FLOOD COVERAGE
              </span>
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-red"
                style={{
                  boxShadow:
                    "0 0 0 2px color-mix(in oklab, var(--red) 25%, transparent)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-text-3" strokeWidth={1.75} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-2">
                2014 Civic
              </span>
            </div>
            <span className="font-mono text-sm text-text-1">
              130 MI RANGE
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
