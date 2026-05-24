export const APP_CONFIG = {
  name: "KVARON_X",
  shortName: "KRX",
  version: "2.5.0",
  defaultLocale: "ru" as const,
  storageKeys: {
    settings: "krx_settings",
    locale: "krx_locale",
  },
} as const;

export const LAYOUT = {
  sidebar: {
    expanded: 280,
    collapsed: 72,
  },
  rightPanel: 340,
  headerHeight: 64,
  mobileNavHeight: 64,
  maxContentWidth: 680,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
