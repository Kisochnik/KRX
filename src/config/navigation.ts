import {
  Home,
  Compass,
  MessageCircle,
  Bell,
  User,
  Users,
  Gamepad,
  Music,
  ShoppingBag,
  Settings,
  Bookmark,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  labelKey: "feed" | "explore" | "messages" | "notifications" | "profile" | "friends" | "games" | "music" | "shop";
  icon: LucideIcon;
  badge?: number;
}

export const MAIN_NAV: NavItem[] = [
  { href: "/", labelKey: "feed", icon: Home },
  { href: "/explore", labelKey: "explore", icon: Compass },
  { href: "/messages", labelKey: "messages", icon: MessageCircle, badge: 3 },
  { href: "/notifications", labelKey: "notifications", icon: Bell, badge: 2 },
  { href: "/friends", labelKey: "friends", icon: Users },
  { href: "/games", labelKey: "games", icon: Gamepad },
  { href: "/music", labelKey: "music", icon: Music },
  { href: "/shop", labelKey: "shop", icon: ShoppingBag },
  { href: "/profile", labelKey: "profile", icon: User },
];

export const SERVER_CHANNELS: unknown[] = [];

export const MOBILE_NAV: NavItem[] = [
  { href: "/", labelKey: "feed", icon: Home },
  { href: "/explore", labelKey: "explore", icon: Compass },
  { href: "/messages", labelKey: "messages", icon: MessageCircle, badge: 3 },
  { href: "/notifications", labelKey: "notifications", icon: Bell, badge: 2 },
  { href: "/profile", labelKey: "profile", icon: User },
];

export const BOOKMARKS_LINK = {
  href: "/profile",
  labelKey: "bookmarks" as const,
  icon: Bookmark,
};

export const SETTINGS_ITEM = {
  labelKey: "settings" as const,
  icon: Settings,
};
