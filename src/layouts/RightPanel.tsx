"use client";

import { TrendingUp, Flame } from "lucide-react";
import { SearchBar, GlassPanel, UserRow, Avatar, ProfileCard } from "@/ui";
import { FadeIn } from "@/animations";
import { useLanguage } from "@/hooks";
import { userRepository } from "@/lib/repositories";
import { trends, CURRENT_USER_ID } from "@/lib/data";
import { LAYOUT } from "@/settings";

export function RightPanel() {
  const { t } = useLanguage();
  const currentUser = userRepository.getCurrent();
  const suggested = userRepository.getSuggested(CURRENT_USER_ID);
  const onlineUsers = userRepository.getOnline();

  return (
    <aside
      style={{ width: LAYOUT.rightPanel }}
      className="hidden shrink-0 flex-col gap-5 overflow-y-auto border-l border-white/[0.06] bg-black/50 p-4 backdrop-blur-2xl xl:flex xl:p-5"
    >
      <FadeIn>
        <SearchBar />
      </FadeIn>

      {currentUser && (
        <FadeIn delay={0.05}>
          <ProfileCard user={currentUser} />
        </FadeIn>
      )}

      <FadeIn delay={0.1}>
        <GlassPanel padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white/90">
              <Flame className="h-4 w-4 text-white/70" />
              {t.trends.title}
            </h2>
            <TrendingUp className="h-4 w-4 text-white/35" />
          </div>
          <ul className="space-y-4">
            {trends.map((trend, i) => (
              <li key={trend.id}>
                <button
                  type="button"
                  className="group w-full rounded-xl p-2 text-left transition-all duration-300 hover:bg-white/[0.04]"
                >
                  <p className="text-[10px] font-medium text-white/35">
                    {i + 1} · {trend.category}
                  </p>
                  <p className="mt-0.5 font-semibold text-white group-hover:text-white">
                    {trend.tag}
                  </p>
                  <p className="text-xs text-white/40">{trend.posts} постов</p>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="w-full rounded-xl py-2 text-xs font-medium text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            {t.trends.showMore}
          </button>
        </GlassPanel>
      </FadeIn>

      <FadeIn delay={0.15}>
        <GlassPanel padding="md">
          <h2 className="mb-4 text-sm font-bold text-white/90">
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
      </FadeIn>

      <FadeIn delay={0.2}>
        <GlassPanel padding="md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white/90">{t.online.title}</h2>
            <span className="flex items-center gap-1.5 text-[10px] text-white/40">
              <span className="status-online h-2 w-2 rounded-full animate-pulse-glow" />
              {onlineUsers.length}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                title={user.displayName}
                className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all duration-300 hover:bg-white/[0.05]"
              >
                <Avatar initials={user.avatar} size="sm" status="online" showStatus />
                <span className="w-full truncate text-center text-[10px] text-white/50">
                  {user.displayName.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[10px] text-white/30">
            {onlineUsers.length} {t.online.count}
          </p>
        </GlassPanel>
      </FadeIn>

      <footer className="mt-auto space-y-2 px-1 text-[10px] text-white/25">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {[t.footer.about, t.footer.pay, t.footer.api, t.footer.rules, t.footer.privacy].map(
            (label) => (
              <button key={label} type="button" className="hover:text-white/50">
                {label}
              </button>
            )
          )}
        </div>
        <p>{t.footer.copyright}</p>
      </footer>
    </aside>
  );
}
