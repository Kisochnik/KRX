"use client";

import { TrendingUp, Users, Trophy, Music, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

const trends = [
  { tag: "#KRX_Gaming", posts: "12.5K постов" },
  { tag: "#TournamentKRX", posts: "8.2K постов" },
  { tag: "#NewMusic2024", posts: "5.1K постов" },
  { tag: "#KvaronClan", posts: "3.8K постов" },
];

const onlineFriends = [
  { name: "Baron_Kosyaka", status: "В игре", game: "CS2" },
  { name: "Alex_Pro", status: "Онлайн", game: null },
  { name: "DarkKnight", status: "Слушает музыку", game: null },
  { name: "Phoenix", status: "В игре", game: "Dota 2" },
];

const topPlayers = [
  { name: "ProGamer", rank: 1, points: "15,420" },
  { name: "Kvarden", rank: 2, points: "14,890" },
  { name: "GameMaster", rank: 3, points: "12,350" },
];

export function RightSidebar() {
  return (
    <aside className="fixed right-0 top-0 h-screen w-80 bg-sidebar border-l border-sidebar-border p-4 overflow-y-auto hidden xl:block">
      {/* Trending */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Тренды</h3>
        </div>
        <div className="space-y-3">
          {trends.map((trend, i) => (
            <button
              key={trend.tag}
              className="w-full text-left p-2 rounded-lg hover:bg-muted transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {trend.tag}
              </p>
              <p className="text-xs text-muted-foreground">{trend.posts}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Online Friends */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Друзья онлайн</h3>
          <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            {onlineFriends.length}
          </span>
        </div>
        <div className="space-y-2">
          {onlineFriends.map((friend) => (
            <button
              key={friend.name}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {friend.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">
                  {friend.name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {friend.game ? (
                    <>
                      <Gamepad2 className="w-3 h-3" />
                      {friend.game}
                    </>
                  ) : friend.status.includes("музыку") ? (
                    <>
                      <Music className="w-3 h-3" />
                      {friend.status}
                    </>
                  ) : (
                    friend.status
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Top Players */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-foreground">Топ игроков</h3>
        </div>
        <div className="space-y-2">
          {topPlayers.map((player) => (
            <div
              key={player.name}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg",
                player.rank === 1 && "bg-yellow-500/10",
                player.rank === 2 && "bg-gray-400/10",
                player.rank === 3 && "bg-orange-600/10"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  player.rank === 1 &&
                    "bg-yellow-500/20 text-yellow-500",
                  player.rank === 2 && "bg-gray-400/20 text-gray-400",
                  player.rank === 3 &&
                    "bg-orange-600/20 text-orange-600"
                )}
              >
                {player.rank}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {player.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {player.points} очков
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KRX Balance */}
      <div className="mt-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/30 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Баланс KRX</span>
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            VIP
          </span>
        </div>
        <p className="text-2xl font-bold text-foreground">
          1,250 <span className="text-primary">KRX</span>
        </p>
        <button className="mt-3 w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-primary/25">
          Пополнить
        </button>
      </div>
    </aside>
  );
}
