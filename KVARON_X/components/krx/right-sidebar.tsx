"use client";

import { TrendingUp, Users, Trophy, Gamepad2 } from "lucide-react";
import { useApp } from "@/context/app-context";

const trends = [
  { tag: "#KRX_Gaming", posts: "0 постов" },
  { tag: "#TournamentKRX", posts: "0 постов" },
];

export function RightSidebar() {
  const { user } = useApp();
  return (
    <aside className="fixed right-0 top-0 h-screen w-80 bg-sidebar border-l border-sidebar-border p-4 overflow-y-auto hidden xl:block">
      {/* Trending */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Тренды</h3>
        </div>
        <div className="space-y-3">
          {trends.map(trend => (
            <button key={trend.tag} className="w-full text-left p-2 rounded-lg hover:bg-muted transition-all group">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{trend.tag}</p>
              <p className="text-xs text-muted-foreground">{trend.posts}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Top Players — empty */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Топ игроков</h3>
        </div>
        <div className="text-center py-6 text-muted-foreground text-sm">
          Рейтинг пока пуст
        </div>
      </div>

      {/* Online Friends — empty by default */}
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
