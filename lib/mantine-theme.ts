import { createTheme, type MantineColorsTuple } from "@mantine/core";

const amber: MantineColorsTuple = [
  "#FAF0E3",
  "#F5E8D4",
  "#EFDCC0",
  "#E8CFAC",
  "#E8C49A",
  "#E8A76F",
  "#D99862",
  "#C78251",
  "#8F5C3A",
  "#5A3A22",
];

const calm: MantineColorsTuple = [
  "#E9F5F0",
  "#D8EDE5",
  "#C5E4D8",
  "#A8D4C4",
  "#8FCFB3",
  "#6FB59A",
  "#5A9E86",
  "#4E8A76",
  "#3D6B5C",
  "#2D4F42",
];

const dark: MantineColorsTuple = [
  "#F1EDE3",
  "#D4D0C8",
  "#A8B5C2",
  "#7D8896",
  "#64758A",
  "#475569",
  "#334155",
  "#243041",
  "#162231",
  "#0e1821",
];

export const shepherdTheme = createTheme({
  primaryColor: "amber",
  colors: {
    amber,
    calm,
    dark,
  },
  fontFamily:
    "var(--font-display), system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  fontFamilyMonospace:
    "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  headings: {
    fontFamily:
      "var(--font-display), system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  defaultRadius: "md",
  cursorType: "pointer",
});
