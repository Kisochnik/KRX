"use client";

import { TrendingUp, Users, Trophy, Hash } from "lucide-react";
import { useApp } from "@/context/app-context";

export function RightSidebar() {
  const { trends } = useApp();

  return (
    <aside className="fixed right-0 top-0 h-screen w-80 bg-sidebar border-l border-sidebar-border p-4 overflow-y-auto hidden xl:block">

      {/* Trending Hashtags */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Тренды</h3>
        </div>

        {trends.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-3">
            Публикуй посты с #хештегами — они появятся здесь
          </p>
        ) : (
          <div className="space-y-1">
            {trends.map((trend, i) => (
              <button
                key={trend.tag}
                className="w-full text-left p-2.5 rounded-lg hover:bg-muted transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">#{i + 1}</span>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {trend.tag}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{trend.count} постов</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top Players */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Топ игроков</h3>
        </div>
        <div className="text-center py-6 text-muted-foreground text-sm">
          Рейтинг пока пуст
        </div>
      </div>

      {/* Online Friends */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Друзья онлайн</h3>
          <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">0</span>
        </div>
        <div className="text-center py-6 text-muted-foreground text-sm">
          Нет друзей онлайн
        </div>
      </div>
    </aside>
  );
}
