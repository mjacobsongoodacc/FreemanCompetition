import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { alerts } from "@/lib/mock-data";

const barColors = {
  red: "bg-red",
  amber: "bg-amber",
  blue: "bg-blue",
} as const;

export function AlertsFeed() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-2">
          Live alerts
        </p>
        <p className="font-mono text-[9px] uppercase tracking-wider text-text-3">
          NWS · GOHSEP · ENTERGY
        </p>
      </div>
      <ScrollArea className="max-h-[320px]">
        <CardContent className="p-0">
          {alerts.map((a) => (
            <div
              key={`${a.time}-${a.agency}`}
              className="flex gap-3 border-b border-border px-5 py-3 last:border-b-0"
            >
              <div
                className={`mt-1 w-[3px] shrink-0 rounded-sm ${barColors[a.severity]}`}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-3">
                    {a.time}
                  </span>
                  <Badge variant="outline" className="font-mono text-[9px]">
                    {a.agency}
                  </Badge>
                </div>
                <p className="text-[13px] leading-snug text-text-1">{a.headline}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
