import { user } from "@/lib/mock-data";

const FACTS = [
  { label: "Address", value: user.address },
  { label: "Vehicle", value: user.vehicle },
  { label: "Fuel", value: `${user.fuelPercent}%` },
  { label: "Cash", value: `$${user.cash}` },
  {
    label: "Dependents",
    value: `${user.dependents[0].name} · ${user.dependents[0].location}`,
  },
  { label: "Insurance", value: user.insuranceNotes },
] as const;

export function Dossier() {
  return (
    <section className="px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-[640px] rounded-lg border border-border bg-sidebar-surface p-6 md:p-8">
        <div className="text-center md:text-left">
          <h2 className="font-display text-2xl font-semibold text-text-1">
            Sarah Boudreaux
          </h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-text-2">
            {user.age} · Gentilly, 70122
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {FACTS.map((f) => (
            <div key={f.label}>
              <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-text-3">
                {f.label}
              </p>
              <p className="mt-1 font-body text-sm text-text-1">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-[640px] text-center font-mono text-[10px] uppercase tracking-wider text-text-3">
        A specific person so the product stays honest.
      </p>
    </section>
  );
}
