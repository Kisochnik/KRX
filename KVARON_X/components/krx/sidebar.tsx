"use client";

import { cn } from "@/lib/utils";
import {
  Home,
  Newspaper,
  Bell,
  Gamepad2,
  Music,
  Users,
  MessageCircle,
  User,
  ShoppingBag,
  Wallet,
  Settings,
  LogOut,
  Search,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Главная", href: "/" },
  { icon: Newspaper, label: "Новости", href: "/news" },
  { icon: Bell, label: "Уведомления", href: "/notifications", badge: 5 },
  { icon: Gamepad2, label: "Игры", href: "/games" },
  { icon: Music, label: "Музыка", href: "/music" },
  { icon: Users, label: "Друзья", href: "/friends" },
  { icon: MessageCircle, label: "Чат", href: "/chat", badge: 3 },
  { icon: User, label: "Профиль", href: "/profile" },
  { icon: ShoppingBag, label: "Магазин", href: "/shop" },
  { icon: Wallet, label: "Кошелёк", href: "/wallet" },
  { icon: Settings, label: "Настройки", href: "/settings" },
  { icon: Shield, label: "Админ панель", href: "/admin", isAdmin: true },
];

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("Главная");

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">K</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              KVARON<span className="text-primary">_X</span>
            </h1>
            <p className="text-xs text-muted-foreground">KRX Network</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск..."
            className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            const isAdmin = "isAdmin" in item && item.isAdmin;

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setActiveItem(item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-sidebar-accent hover:scale-[1.02] active:scale-[0.98]",
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-sidebar-foreground",
                    isAdmin && "border border-primary/30 bg-primary/5"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground",
                      isAdmin && "text-primary"
                    )}
                  />
                  <span className={cn(isAdmin && "text-primary")}>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isAdmin && (
                    <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                      ADMIN
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              Kvarden
            </p>
            <p className="text-xs text-primary">VIP • Lvl 42</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-destructive/20 transition-all duration-200 hover:scale-110 active:scale-95 group">
            <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
          </button>
        </div>
      </div>
    </aside>
  );
}
