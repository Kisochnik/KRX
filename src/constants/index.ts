import type { NavSection } from "@/types";

export const NAV_ITEMS: {
  id: NavSection;
  label: string;
  href: string;
  badge?: number;
}[] = [
  { id: "feed",          label: "Home",          href: "/feed" },
  { id: "explore",       label: "Explore",       href: "/explore" },
  { id: "notifications", label: "Notifications", href: "/notifications", badge: 4 },
  { id: "messages",      label: "Messages",      href: "/messages", badge: 2 },
  { id: "friends",       label: "Friends",       href: "/friends" },
  { id: "profile",       label: "Profile",       href: "/profile" },
  { id: "settings",      label: "Settings",      href: "/settings" },
];

export const APP_NAME = "KVARON_X";
export const APP_SHORT = "KRX";
export const APP_VERSION = "v2.0 BETA";
