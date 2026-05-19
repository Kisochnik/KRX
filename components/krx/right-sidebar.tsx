"use client";

import { TrendingUp, UserPlus, Users } from "lucide-react";
import { useApp } from "@/context/app-context";

export function RightSidebar() {
  const { trends, recommendedUsers, user } = useApp();

  return (
    <aside className="fixed right-0 top-0 h-screen w-80 bg-sidebar border-l border-sidebar-border p-4 overflow-y-auto hidden xl:block">

      {/* ── Trending Hashtags ── */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground text-sm">Популярные хэштеги</h3>
        </div>

        {!trends || trends.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4 italic">
            Публикуй посты с #хештегами — они появятся здесь
          </p>
        ) : (
          <div className="space-y-1">
            {trends.map((trend, i) => (
              <button
                key={trend.tag}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4 text-right">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      #{trend.tag}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{trend.count} постов</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Recommended People ── */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground text-sm">Рекомендации людей</h3>
        </div>

        {!recommendedUsers || recommendedUsers.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4 italic">
            Рекомендации появятся со временем
          </p>
        ) : (
          <div className="space-y-3">
            {recommendedUsers.map((rec) => (
              <div key={rec.id} className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {rec.avatar ? (
                    <img src={rec.avatar} alt={rec.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary font-bold text-sm">
                      {rec.name[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{rec.name}</p>
                  <p className="text-xs text-muted-foreground">Ур. {rec.level ?? 0}</p>
                </div>

                {/* Add friend */}
                <button
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all font-medium"
                  title="Добавить в друзья"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Добавить</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
