import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Home, Newspaper, Bell, Users, MessageCircle, Gamepad2,
  Music, ShoppingBag, User, Bookmark, Settings, Search,
} from "lucide-react";
import { KrxLogo } from "./KrxLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";

const navItems = [
  { to: "/feed", icon: Home, key: "nav.feed" },
  { to: "/news", icon: Newspaper, key: "nav.news" },
  { to: "/notifications", icon: Bell, key: "nav.notifications" },
  { to: "/friends", icon: Users, key: "nav.friends" },
  { to: "/messages", icon: MessageCircle, key: "nav.messages" },
  { to: "/games", icon: Gamepad2, key: "nav.games" },
  { to: "/music", icon: Music, key: "nav.music" },
  { to: "/shop", icon: ShoppingBag, key: "nav.shop" },
  { to: "/profile", icon: User, key: "nav.profile" },
  { to: "/bookmarks", icon: Bookmark, key: "nav.bookmarks" },
  { to: "/settings", icon: Settings, key: "nav.settings" },
] as const;

export function AppShell() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 flex-col border-r border-border bg-sidebar sticky top-0 h-screen">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/feed"><KrxLogo /></Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                  ${active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                  }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 1.8} />
                <span className={active ? "font-medium" : ""}>{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border flex items-center justify-between">
          <Link to="/profile" className="flex items-center gap-2 min-w-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-foreground/30 to-foreground/10 border border-border shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">@you</p>
              <p className="text-[11px] text-muted-foreground">{t("common.online")}</p>
            </div>
          </Link>
          <LanguageSwitcher />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 krx-glass border-b border-border">
          <div className="flex items-center gap-3 px-4 md:px-6 h-14">
            <Link to="/feed" className="md:hidden"><KrxLogo showText={false} /></Link>
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search")}
                className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:bg-muted/60"
              />
            </div>
            <div className="md:hidden"><LanguageSwitcher /></div>
          </div>
        </header>

        <main className="flex-1 krx-fade-in">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden sticky bottom-0 krx-glass border-t border-border flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`p-2.5 rounded-xl ${active ? "text-foreground" : "text-muted-foreground"}`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
