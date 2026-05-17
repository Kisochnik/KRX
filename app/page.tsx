"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { CreatePost } from "@/components/krx/create-post";
import { Stories } from "@/components/krx/stories";
import { PostCard } from "@/components/krx/post";
import { Flame, Zap, Sparkles, Laugh, Gamepad2, Ghost, Play, Newspaper, Tv, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedTab = "feed" | "pulse";
type PulseCategory = "all" | "funny" | "gaming" | "memes" | "anime" | "news" | "clips";

const PULSE_CATEGORIES: { id: PulseCategory; label: string; icon: React.ElementType }[] = [
  { id: "all",    label: "Всё",       icon: Grid3X3 },
  { id: "funny",  label: "Смешное",   icon: Laugh },
  { id: "gaming", label: "Игры",      icon: Gamepad2 },
  { id: "memes",  label: "Мемы",      icon: Ghost },
  { id: "anime",  label: "Anime",     icon: Sparkles },
  { id: "news",   label: "Новости",   icon: Newspaper },
  { id: "clips",  label: "Клипы",     icon: Tv },
];

const FEED_FILTERS = [
  { id: "all",       label: "Всё" },
  { id: "popular",   label: "Популярное" },
  { id: "following", label: "Подписки" },
  { id: "new",       label: "Новое" },
] as const;

export default function HomePage() {
  const { isAuthenticated, filteredPosts, feedFilter, setFeedFilter } = useApp();
  const router = useRouter();
  const [mainTab, setMainTab] = useState<FeedTab>("feed");
  const [pulseCategory, setPulseCategory] = useState<PulseCategory>("all");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/auth");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 mr-80 p-6 pb-28">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Main Tab switcher: Лента / KRX Pulse */}
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => setMainTab("feed")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                mainTab === "feed" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Flame className="w-4 h-4" /> Лента
            </button>
            <button
              onClick={() => setMainTab("pulse")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                mainTab === "pulse" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Zap className="w-4 h-4" /> KRX Pulse ⚡
            </button>
          </div>

          {/* ── FEED tab ── */}
          {mainTab === "feed" && (
            <>
              {/* Filter buttons */}
              <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {FEED_FILTERS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFeedFilter(f.id)}
                    className={cn(
                      "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                      feedFilter === f.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <Stories />
              <CreatePost />

              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Flame className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-base font-medium">Лента пуста</p>
                  <p className="text-sm mt-1">Создай первый пост!</p>
                </div>
              ) : (
                filteredPosts.map(post => <PostCard key={post.id} post={post} />)
              )}
            </>
          )}

          {/* ── PULSE tab ── */}
          {mainTab === "pulse" && (
            <>
              {/* Pulse header */}
              <div className="bg-gradient-to-r from-primary/20 via-red-500/10 to-card rounded-xl border border-primary/30 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">KRX Pulse ⚡</h2>
                    <p className="text-xs text-muted-foreground">Горячий контент платформы</p>
                  </div>
                </div>
              </div>

              {/* Pulse categories */}
              <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {PULSE_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setPulseCategory(cat.id)}
                      className={cn(
                        "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                        pulseCategory === cat.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" /> {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Pulse content placeholder */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Laugh,    label: "Смешные видео",   tag: "funny",  desc: "Лучшие моменты дня" },
                  { icon: Gamepad2, label: "Игровые апдейты", tag: "gaming", desc: "Новости из мира игр" },
                  { icon: Ghost,    label: "Мемы",            tag: "memes",  desc: "Актуальные мемы" },
                  { icon: Sparkles, label: "Anime Edits",     tag: "anime",  desc: "Лучшие клипы" },
                  { icon: Newspaper,label: "Новости",         tag: "news",   desc: "Что происходит" },
                  { icon: Tv,       label: "Стрим-клипы",    tag: "clips",  desc: "Моменты со стримов" },
                ].filter(c => pulseCategory === "all" || c.tag === pulseCategory).map(card => {
                  const Icon = card.icon;
                  return (
                    <div key={card.tag}
                      className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all cursor-pointer group">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{card.label}</h3>
                      <p className="text-xs text-muted-foreground">{card.desc}</p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-primary">
                        <Play className="w-3 h-3 fill-primary" /> Смотреть
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pulse empty state when category has no posts yet */}
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-xl">
                <Zap className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Контент скоро появится</p>
                <p className="text-xs mt-1">Публикуй посты — они попадут в Pulse</p>
              </div>
            </>
          )}
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
