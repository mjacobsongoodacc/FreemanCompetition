import { createTheme, type MantineColorsTuple } from "@mantine/core";

const amber: MantineColorsTuple = [
  "#e8f8f0",
  "#d0f0e0",
  "#a8e5c8",
  "#7dd6a8",
  "#5cc896",
  "#3fb579",
  "#329666",
  "#2d8559",
  "#1f5c3f",
  "#123a28",
];

const calm: MantineColorsTuple = [
  "#faf7f0",
  "#f5efe0",
  "#efe6d4",
  "#e9ddc8",
  "#e6d7b8",
  "#d4c6a5",
  "#c9b896",
  "#a89672",
  "#7d6e52",
  "#4a4032",
];

const dark: MantineColorsTuple = [
  "#e8ecef",
  "#d1d8e0",
  "#b3bcc8",
  "#8f99a8",
  "#6f7a8a",
  "#5a6570",
  "#3d4654",
  "#2a343f",
  "#10151b",
  "#0a0d10",
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
