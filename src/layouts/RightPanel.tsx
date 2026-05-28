"use client";

import { TrendingUp } from "lucide-react";
import { SearchBar, GlassPanel } from "@/ui";
import { FadeIn } from "@/animations";
import { useLanguage } from "@/hooks";
import { useAuth } from "@/context/AuthContext";
import { LAYOUT } from "@/settings";

export function RightPanel() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <aside
      style={{ width: LAYOUT.rightPanel }}
      className="hidden shrink-0 flex-col gap-5 overflow-y-auto border-l border-white/[0.06] bg-black/50 p-4 backdrop-blur-2xl xl:flex xl:p-5"
    >
      <FadeIn>
        <SearchBar />
      </FadeIn>

      {user && (
        <FadeIn delay={0.05}>
          <GlassPanel padding="md" className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] font-bold text-white">
                {user.nickname.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white">{user.nickname}</span>
                <span className="text-xs text-white/40">@{user.username || user.nickname.toLowerCase()}</span>
              </div>
            </div>
            {user.bio && (
              <p className="text-xs text-white/50">{user.bio}</p>
            )}
            <div className="flex gap-4 text-xs text-white/40">
              <span><span className="font-semibold text-white">0</span> {t.profile.following}</span>
              <span><span className="font-semibold text-white">0</span> {t.profile.followers}</span>
            </div>
          </GlassPanel>
        </FadeIn>
      )}

      <FadeIn delay={0.1}>
        <GlassPanel padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white/90">{t.trends.title}</h2>
            <TrendingUp className="h-4 w-4 text-white/35" />
          </div>
          <p className="text-xs text-white/30 text-center py-4">Трендів поки немає</p>
        </GlassPanel>
      </FadeIn>

      <footer className="mt-auto space-y-2 px-1 text-[10px] text-white/25">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {[t.footer.about, t.footer.api, t.footer.rules, t.footer.privacy].map(
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
