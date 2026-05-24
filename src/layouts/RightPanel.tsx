"use client";

import { TrendingUp } from "lucide-react";
import { SearchBar, GlassPanel, UserRow, Avatar } from "@/ui";
import { FadeIn } from "@/animations";
import { useLanguage } from "@/hooks";
import { userRepository } from "@/lib/repositories";
import { trends, CURRENT_USER_ID } from "@/lib/data";
import { LAYOUT } from "@/settings";

export function RightPanel() {
  const { t } = useLanguage();
  const suggested = userRepository.getSuggested(CURRENT_USER_ID);
  const onlineUsers = userRepository.getOnline();

  return (
    <aside
      style={{ width: LAYOUT.rightPanel }}
      className="hidden shrink-0 flex-col gap-5 overflow-y-auto border-l border-white/[0.06] bg-black/60 p-4 backdrop-blur-xl xl:flex xl:p-5"
    >
      <FadeIn>
        <SearchBar />
      </FadeIn>

      <GlassPanel padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/80">
            {t.trends.title}
          </h2>
          <TrendingUp className="h-4 w-4 text-white/40" />
        </div>
        <ul className="space-y-4">
          {trends.map((trend, i) => (
            <li key={trend.id}>
              <button
                type="button"
                className="group w-full text-left transition-all duration-300 hover:translate-x-1"
              >
                <p className="text-[10px] text-white/35">
                  {i + 1} · {trend.category}
                </p>
                <p className="font-semibold text-white group-hover:text-white/90">
                  {trend.tag}
                </p>
                <p className="text-xs text-white/40">{trend.posts} постов</p>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="text-xs text-white/50 transition-colors hover:text-white"
        >
          {t.trends.showMore}
        </button>
      </GlassPanel>

      <GlassPanel padding="md">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/80">
          {t.suggestions.title}
        </h2>
        <ul className="space-y-4">
          {suggested.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              actionLabel={t.suggestions.follow}
              onAction={() => {}}
            />
          ))}
        </ul>
      </GlassPanel>

      <GlassPanel padding="md">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white/80">
            {t.online.title}
          </h2>
          <span className="status-online h-2 w-2 animate-pulse-glow rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          {onlineUsers.map((user) => (
            <div
              key={user.id}
              title={user.displayName}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              <Avatar
                initials={user.avatar}
                size="sm"
                status="online"
                showStatus
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/35">
          {onlineUsers.length} {t.online.count}
        </p>
      </GlassPanel>

      <footer className="mt-auto space-y-1.5 text-[10px] text-white/25">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["about", t.footer.about],
              ["pay", t.footer.pay],
              ["api", t.footer.api],
              ["rules", t.footer.rules],
              ["privacy", t.footer.privacy],
            ] as const
          ).map(([key, label]) => (
            <button key={key} type="button" className="hover:text-white/50">
              {label}
            </button>
          ))}
        </div>
        <p>{t.footer.copyright}</p>
      </footer>
    </aside>
  );
}
