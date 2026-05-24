import {
  Home,
  Compass,
  MessageCircle,
  Bell,
  User,
  Hash,
  Bookmark,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  labelKey: "feed" | "explore" | "messages" | "notifications" | "profile";
  icon: LucideIcon;
  badge?: number;
}

export const MAIN_NAV: NavItem[] = [
  { href: "/", labelKey: "feed", icon: Home },
  { href: "/explore", labelKey: "explore", icon: Compass },
  { href: "/messages", labelKey: "messages", icon: MessageCircle, badge: 3 },
  { href: "/notifications", labelKey: "notifications", icon: Bell, badge: 2 },
  { href: "/profile", labelKey: "profile", icon: User },
];

export const SERVER_CHANNELS = [
  { nameKey: "general" as const, icon: Hash },
  { nameKey: "dev" as const, icon: Hash },
  { nameKey: "design" as const, icon: Hash },
  { nameKey: "music" as const, icon: Hash },
];

export const MOBILE_NAV: NavItem[] = MAIN_NAV;

export const BOOKMARKS_LINK = {
  href: "/profile",
  labelKey: "bookmarks" as const,
  icon: Bookmark,
};

export const SETTINGS_ITEM = {
  labelKey: "settings" as const,
  icon: Settings,
};
