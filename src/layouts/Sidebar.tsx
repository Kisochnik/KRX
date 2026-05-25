"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Sparkles } from "lucide-react";
import {
  MAIN_NAV,
  SERVER_CHANNELS,
  BOOKMARKS_LINK,
} from "@/config/navigation";
import { Avatar, NavLink } from "@/ui";
import { cn } from "@/lib/utils";
import { useLanguage, useSettings } from "@/hooks";
import { userRepository } from "@/lib/repositories";
import { LAYOUT } from "@/settings";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { sidebarCollapsed, toggleSidebar } = useSettings();
  const currentUser = userRepository.getCurrent();

  const navLabels: Record<string, string> = {
    feed: t.nav.feed,
    explore: t.nav.explore,
    messages: t.nav.messages,
    notifications: t.nav.notifications,
    profile: t.nav.profile,
  };

  const serverLabels: Record<string, string> = {
    general: t.servers.general,
    dev: t.servers.dev,
    design: t.servers.design,
    music: t.servers.music,
  };

  const width = sidebarCollapsed
    ? LAYOUT.sidebar.collapsed
    : LAYOUT.sidebar.expanded;

  return (
    <aside
      style={{ width }}
      className="hidden shrink-0 flex-col border-r border-white/[0.06] bg-black/90 backdrop-blur-2xl transition-[width] duration-300 md:flex"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/[0.05] px-4 py-5">
        <button
          type="button"
          onClick={toggleSidebar}
          className="group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-black tracking-tighter text-black transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
          aria-label="Переключить sidebar"
        >
          <span className="relative z-10">KRX</span>
          <span className="absolute inset-0 shimmer opacity-0 transition-opacity group-hover:opacity-30" />
        </button>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <h1 className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
              <span className="gradient-text">{t.app.name}</span>
              <Sparkles className="h-3.5 w-3.5 text-white/50" />
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
              {t.app.tagline}
            </p>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {MAIN_NAV.map(({ href, labelKey, icon, badge }) => (
          <NavLink
            key={href}
            href={href}
            label={navLabels[labelKey]}
            icon={icon}
            active={pathname === href}
            badge={badge}
            collapsed={sidebarCollapsed}
          />
        ))}

        {!sidebarCollapsed && (
          <div className="my-5 border-t border-white/[0.06] pt-5">
            <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
              {t.servers.title}
            </p>
            <div className="space-y-0.5">
              {SERVER_CHANNELS.map(({ nameKey, icon: Icon }) => (
                <button
                  key={nameKey}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition-all duration-300 hover:bg-white/[0.05] hover:text-white/80"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05] text-white/50">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>{serverLabels[nameKey]}</span>
                </button>
              ))}
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/35 transition-all duration-300 hover:bg-white/[0.05] hover:text-white/60"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-white/15">
                  <Users className="h-3.5 w-3.5" />
                </span>
                <span>{t.nav.createServer}</span>
              </button>
            </div>
          </div>
        )}

        {!sidebarCollapsed && (
          <div className="space-y-0.5 pt-2">
            <Link
              href={BOOKMARKS_LINK.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition-all hover:bg-white/[0.05] hover:text-white/75"
            >
              <BOOKMARKS_LINK.icon className="h-[18px] w-[18px]" />
              <span>{t.nav.bookmarks}</span>
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                pathname === "/settings"
                  ? "bg-white/[0.08] text-white"
                  : "text-white/45 hover:bg-white/[0.05] hover:text-white/75"
              )}
            >
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              <span>{t.nav.settings}</span>
            </Link>
          </div>
        )}
      </nav>

      {/* User card */}
      {currentUser && (
        <div className="border-t border-white/[0.06] p-3">
          <Link
            href="/profile"
            className={cn(
              "glass-hover flex items-center gap-3 rounded-2xl p-3 transition-all",
              sidebarCollapsed && "justify-center"
            )}
          >
            <Avatar
              initials={currentUser.avatar}
              size="md"
              status={currentUser.status}
              showStatus
            />
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {currentUser.displayName}
                </p>
                <p className="truncate text-xs text-white/40">
                  @{currentUser.username}
                </p>
              </div>
            )}
          </Link>
        </div>
      )}
    </aside>
  );
}
