"use client";

import dynamic from "next/dynamic";

const VariantSignal = dynamic(
  () => import("@/components/designs/variant-signal"),
  { ssr: false },
);

export default function Home() {
  return (
    <div style={{ width: "100vw", minHeight: "100dvh", background: "#0a0d10" }}>
      <VariantSignal />
    </div>
  );
}
