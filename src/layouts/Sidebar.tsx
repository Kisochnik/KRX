"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users } from "lucide-react";
import {
  MAIN_NAV,
  SERVER_CHANNELS,
  BOOKMARKS_LINK,
  SETTINGS_ITEM,
} from "@/config/navigation";
import { Avatar, Badge } from "@/ui";
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
      className="hidden shrink-0 flex-col border-r border-white/[0.06] bg-black/80 backdrop-blur-xl transition-[width] duration-300 md:flex"
    >
      <div className="flex items-center gap-3 px-4 py-5 lg:px-5 lg:py-6">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold tracking-tighter text-black transition-transform hover:scale-105"
          aria-label="Переключить sidebar"
        >
          KRX
        </button>
        {!sidebarCollapsed && (
          <div className="min-w-0 animate-in fade-in duration-300">
            <h1 className="truncate text-lg font-bold tracking-tight gradient-text">
              {t.app.name}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              {t.app.tagline}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 lg:px-3">
        {MAIN_NAV.map(({ href, labelKey, icon: Icon, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={navLabels[labelKey]}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 lg:px-4",
                active
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "text-white/60 hover:bg-white/[0.06] hover:text-white",
                sidebarCollapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                  active && "text-black"
                )}
              />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{navLabels[labelKey]}</span>
                  {badge && (
                    <Badge count={badge} variant={active ? "active" : "default"} />
                  )}
                </>
              )}
            </Link>
          );
        })}

        {!sidebarCollapsed && (
          <div className="my-4 border-t border-white/[0.06] pt-4">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30 lg:px-4">
              {t.servers.title}
            </p>
            {SERVER_CHANNELS.map(({ nameKey, icon: Icon }) => (
              <button
                key={nameKey}
                type="button"
                className="glass-hover flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 hover:text-white/80 lg:px-4"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{serverLabels[nameKey]}</span>
              </button>
            ))}
            <button
              type="button"
              className="glass-hover mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40 hover:text-white/60 lg:px-4"
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>{t.nav.createServer}</span>
            </button>
          </div>
        )}

        {!sidebarCollapsed && (
          <>
            <Link
              href={BOOKMARKS_LINK.href}
              className="glass-hover flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 hover:text-white/80 lg:px-4"
            >
              <BOOKMARKS_LINK.icon className="h-4 w-4" />
              <span>{t.nav.bookmarks}</span>
            </Link>
            <button
              type="button"
              className="glass-hover flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 hover:text-white/80 lg:px-4"
            >
              <SETTINGS_ITEM.icon className="h-4 w-4" />
              <span>{t.nav.settings}</span>
            </button>
          </>
        )}
      </nav>

      {currentUser && (
        <div className="m-2 rounded-2xl glass p-3 lg:m-3">
          <div
            className={cn(
              "flex items-center gap-3",
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
          </div>
        </div>
      )}
    </aside>
  );
}
