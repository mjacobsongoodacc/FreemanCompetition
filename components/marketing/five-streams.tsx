const STREAMS = [
  {
    n: "01",
    title: "Plan",
    body: "Your prep decisions",
  },
  {
    n: "02",
    title: "Resources",
    body: "Money, fuel, meds, dependents",
  },
  {
    n: "03",
    title: "Location",
    body: "Where you are right now",
  },
  {
    n: "04",
    title: "Disaster",
    body: "What the storm is doing",
  },
  {
    n: "05",
    title: "World",
    body: "Traffic, outages, open gas",
  },
] as const;

export function FiveStreams() {
  return (
    <section id="streams" className="scroll-mt-24 px-4 py-20 md:px-6 md:py-28">
      <h2 className="mb-10 text-center font-display text-[clamp(28px,6vw,40px)] font-semibold text-text-1">
        Five streams. One voice.
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {STREAMS.map((s) => (
          <article
            key={s.n}
            className="shepherd-card-hover rounded-lg border border-border bg-surface p-6 transition-transform"
          >
            <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-amber">
              {s.n}
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-text-1">
              {s.title}
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-text-2">
              {s.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
