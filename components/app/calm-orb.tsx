"use client";

import { motion, useReducedMotion } from "framer-motion";

type CalmOrbProps = {
  className?: string;
  size?: string;
};

export function CalmOrb({
  className,
  size = "clamp(160px, 40vw, 320px)",
}: CalmOrbProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`shepherd-reduce-pulse rounded-full ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 40% 35%, color-mix(in oklab, var(--calm) 85%, white), var(--calm-dim))",
        boxShadow:
          "0 0 80px color-mix(in oklab, var(--calm) 35%, transparent)",
      }}
      animate={
        reduce
          ? { opacity: 1 }
          : { scale: [1, 1.03, 1], opacity: [1, 0.88, 1] }
      }
      transition={
        reduce
          ? { duration: 0.1 }
          : { duration: 4, ease: "easeInOut", repeat: Infinity }
      }
      aria-hidden
    />
  );
}
