"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  Gamepad2,
  Home,
  MessageCircle,
  Music,
  Newspaper,
  Settings,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { label: "Feed", icon: Home, href: "/" },
  { label: "News", icon: Newspaper, href: "/news" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
  { label: "Friends", icon: Users, href: "/friends" },
  { label: "Messages", icon: MessageCircle, href: "/messages" },
  { label: "Games", icon: Gamepad2, href: "/games" },
  { label: "Music", icon: Music, href: "/music" },
  { label: "Store", icon: ShoppingBag, href: "/store" },
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-[#2a2a2a] bg-black/95 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-t-0">
      <div className="hidden h-16 items-center border-b border-[#2a2a2a] px-6 lg:flex">
        <Link href="/" className="font-mono text-2xl font-black text-white">
          KRX
        </Link>
      </div>
      <nav className="krx-scrollbar flex gap-1 overflow-x-auto px-2 py-2 lg:flex-col lg:overflow-visible lg:p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex h-12 min-w-12 items-center justify-center gap-3 rounded-md px-3 text-sm font-semibold text-neutral-400 transition duration-200 hover:bg-white/10 hover:text-white lg:justify-start",
                active && "bg-white text-black hover:bg-white hover:text-black",
              )}
              title={item.label}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
