"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type StreamPulseProps = {
  active: boolean;
  pulseKey: string | null;
  children: ReactNode;
  className?: string;
};

export function StreamPulse({
  active,
  pulseKey,
  children,
  className,
}: StreamPulseProps) {
  const reduce = useReducedMotion();

  if (!active || reduce || !pulseKey) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      key={pulseKey}
      className={className}
      animate={{
        boxShadow: [
          "0 0 0 0px color-mix(in oklab, var(--amber) 0%, transparent)",
          "0 0 0 3px color-mix(in oklab, var(--amber) 35%, transparent)",
          "0 0 0 0px color-mix(in oklab, var(--amber) 0%, transparent)",
        ],
      }}
      transition={{ duration: 1.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
