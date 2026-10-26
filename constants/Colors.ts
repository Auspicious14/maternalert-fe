// ─────────────────────────────────────────────────────────────────────────────
// MaternAlert brand colours.
// This file is IDENTICAL in maternalert-web (src/constants/Colors.ts) and
// maternalert-fe (constants/Colors.ts). Change both together.
// Contrast: every text/background pair used here passes WCAG AA (4.5:1).
// ─────────────────────────────────────────────────────────────────────────────
export const Colors = {
  // Brand
  primary: "#0E7C5A", // Guardian Green — buttons, links, brand. White text on it.
  primaryDark: "#0A5C43", // pressed / hover, green text on mint
  primaryLight: "#E3F2EC", // Mint — calm backgrounds, routine status
  coral: "#F2545B", // the dot in the logo — shapes and icons only, never text
  ink: "#0F241C", // main text
  cream: "#FBF7F2", // page background
  accent: "#B45309", // amber — MONITOR status
  emergency: "#C7333B", // emergency red — alerts, emergency button
  setupBlue: "#0E7C5A", // legacy name, now brand green

  // Dark mode
  darkBg: "#0B1A14",
  cardDark: "#13261E",

  // Status
  routine: "#0E7C5A",
  urgent: "#B45309",
  critical: "#C7333B",

  // Error states
  errorText: "#991B1B",
  errorBg: "#FEF2F2",
  errorBorder: "#FEE2E2",
  errorTextDark: "#FCA5A5",
  errorBgDark: "rgba(199, 51, 59, 0.12)",
  errorBorderDark: "rgba(199, 51, 59, 0.25)",

  // Text
  text: "#0F241C",
  textLight: "#5B6B64",
  textOnDark: "#FFFFFF",
  textHeader: "#FFFFFF",

  // Surfaces
  background: "#FBF7F2",
  white: "#FFFFFF",
  border: "#E6E1D9",
  borderDark: "#2A3B34",

  // Gradients (kept for existing components; prefer flat colours in new UI)
  orangeGradient: ["#B45309", "#92400E"],
  redGradient: ["#C7333B", "#A82A31"],
  greenGradient: ["#0E7C5A", "#0A5C43"],
  yellowGradient: ["#D97706", "#B45309"],

  // Specifics
  inputBg: "#FFFFFF",
  accentLight: "#FDF0E1",
  secondary: "#EEF6F2",
  emergencyText: "#FFFFFF",
  routineText: "#0F241C",
  urgentText: "#92400E",
  inactiveTab: "#8A9791",
};
