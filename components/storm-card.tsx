import { Card, CardContent } from "@/components/ui/card";
import { storm } from "@/lib/mock-data";
import { HurricaneCone } from "@/components/hurricane-cone";

const stats = [
  { label: "Position", value: `27.8°N 88.2°W` },
  { label: "Max winds", value: `${storm.maxWinds} MPH` },
  { label: "Gusts", value: `${storm.gusts} MPH` },
  { label: "Pressure", value: `${storm.pressure} MB` },
  {
    label: "Movement",
    value: storm.movement.replace("mph", "MPH").toUpperCase(),
  },
  { label: "Landfall", value: "SUN 08:00 CDT" },
] as const;

export function StormCard() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-2">
          Tropical system · {storm.name.toUpperCase()}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-3">
          Advisory {storm.advisoryNumber} · {storm.advisoryTime}
        </p>
      </div>
      <CardContent className="p-5">
        <div className="aspect-[16/10] w-full">
          <HurricaneCone />
        </div>
        <div className="grid grid-cols-3 gap-x-6 gap-y-4 pt-5">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-3">
                {s.label}
              </p>
              <p className="pt-1 font-mono text-[18px] text-text-1">{s.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
