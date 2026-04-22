import type { Config } from "tailwindcss";

const safeAreaPlugin = ({
  addUtilities,
}: {
  addUtilities: (u: Record<string, Record<string, string>>) => void;
}) => {
  addUtilities({
    ".pb-safe": {
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    },
    ".pt-safe": {
      paddingTop: "env(safe-area-inset-top, 0px)",
    },
    ".mb-safe": {
      marginBottom: "env(safe-area-inset-bottom, 0px)",
    },
  });
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      colors: {
        bg: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface)",
          "2": "var(--surface-2)",
        },
        "sidebar-bg": "var(--sidebar-bg)",
        "sidebar-surface": "var(--sidebar-surface)",
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        text: {
          "1": "var(--text-1)",
          "2": "var(--text-2)",
          "3": "var(--text-3)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          deep: "var(--amber-deep)",
        },
        calm: {
          DEFAULT: "var(--calm)",
          dim: "var(--calm-dim)",
        },
        alert: "var(--alert)",
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "var(--font-display)",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "var(--font-display)",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      minHeight: {
        touch: "var(--touch-min)",
      },
      minWidth: {
        touch: "var(--touch-min)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), safeAreaPlugin],
};
export default config;
