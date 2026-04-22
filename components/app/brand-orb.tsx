"use client";

import { motion, useReducedMotion } from "framer-motion";

type BrandOrbProps = {
  size?: number;
  className?: string;
  pulse?: boolean;
};

export function BrandOrb({ size = 12, className, pulse = true }: BrandOrbProps) {
  const reduce = useReducedMotion();

  const core = (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        display: "block",
        background:
          "radial-gradient(circle at 35% 30%, #f4e0c8, var(--amber-deep))",
        boxShadow:
          "0 0 0 1px color-mix(in oklab, var(--amber) 35%, transparent), 0 0 8px 2px color-mix(in oklab, var(--amber) 40%, transparent)",
      }}
      aria-hidden
    />
  );

  if (!pulse || reduce) {
    return core;
  }

  return (
    <motion.span
      className={`shepherd-reduce-pulse inline-flex ${className ?? ""}`}
      animate={{ scale: [1, 1.04, 1], opacity: [1, 0.92, 1] }}
      transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
    >
      {core}
    </motion.span>
  );
}
