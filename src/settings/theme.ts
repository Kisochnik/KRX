export const THEME = {
  colors: {
    bg: "#000000",
    bgSecondary: "#0a0a0a",
    panel: "rgba(255, 255, 255, 0.04)",
    panelHover: "rgba(255, 255, 255, 0.07)",
    border: "rgba(255, 255, 255, 0.08)",
    borderHover: "rgba(255, 255, 255, 0.15)",
    text: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.55)",
    textMuted: "rgba(255, 255, 255, 0.35)",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    full: "9999px",
  },
  spacing: {
    page: "1.5rem",
    section: "1.25rem",
    card: "1rem",
    stack: "0.75rem",
  },
  transition: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;
