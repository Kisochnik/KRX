"use client";

import { cn } from "@/lib/utils";
import {
  Home, Newspaper, Bell, Gamepad2, Music, Sword,
  Users, MessageCircle, User, ShoppingBag, Wallet,
  Settings, Shield, LogOut, Search, CircleDollarSign,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";

const NAV_ITEMS = [
  { icon: Home,          label: "Главная",      href: "/" },
  { icon: Newspaper,     label: "Новости",       href: "/news" },
  { icon: Bell,          label: "Уведомления",   href: "/notifications" },
  { icon: Gamepad2,      label: "Игры",          href: "/games" },
  { icon: Music,         label: "Музыка",        href: "/music" },
  { icon: Sword,         label: "Кланы",         href: "/clans" },
  { icon: Users,         label: "Друзья",        href: "/friends" },
  { icon: MessageCircle, label: "Чат",           href: "/chat" },
  { icon: User,          label: "Профиль",       href: "/profile" },
  { icon: ShoppingBag,   label: "Магазин",       href: "/shop" },
  { icon: Wallet,        label: "Кошелёк",       href: "/wallet" },
  { icon: Settings,      label: "Настройки",     href: "/settings" },
  { icon: Shield,        label: "Админ",         href: "/admin", adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, unreadCount } = useApp();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">

      {/* ── Logo ── */}
      <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="text-primary-foreground font-black text-lg tracking-tight">K</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-foreground tracking-tight">
            KVARON<span className="text-primary">_X</span>
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium">KRX Network</p>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск..."
            className="w-full bg-input border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-1 overflow-y-auto">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            // Admin-only: hide if not admin
            if (item.adminOnly && (!user || !user.isAdmin)) return null;

            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                    "hover:bg-sidebar-accent",
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-sidebar-foreground",
                    item.adminOnly &&
                      "mt-1 border border-primary/30 bg-primary/5 text-primary"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive || item.adminOnly ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="flex-1">{item.label}</span>

                  {/* Notification badge */}
                  {item.href === "/notifications" && unreadCount > 0 && (
                    <span className="min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}

                  {/* Admin badge */}
                  {item.adminOnly && (
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-semibold">
                      ADMIN
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── User block ── */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-primary" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.name ?? "Гость"}
              </p>
              {user?.isAdmin && (
                <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" title="Администратор" />
              )}
              {user?.isRich && (
                <CircleDollarSign
                  className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20 flex-shrink-0"
                  title="KRX Rich"
                />
              )}
            </div>
            <p className="text-[11px] text-primary font-medium">
              Ур. {user?.level ?? 0}
              {user?.level !== undefined && (
                <span className="text-muted-foreground"> / 200</span>
              )}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Выйти"
            className="p-1.5 rounded-lg hover:bg-destructive/20 transition-all group"
          >
            <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  );
}
