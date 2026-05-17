"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, NEWS_AUTHORS, NEWS_CATEGORIES, NEWS_EMOJIS, NewsPost } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import {
  Newspaper, Eye, Clock, Plus, X, Image as ImageIcon,
  ChevronDown, Zap, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

function timeAgo(ms: number) {
  const d = Date.now() - ms;
  const m = Math.floor(d / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин. назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч. назад`;
  return `${Math.floor(h / 24)} д. назад`;
}

function getCategoryStyle(label: string) {
  return NEWS_CATEGORIES.find(c => c.label === label)?.color
    ?? "bg-primary/20 text-primary border-primary/30";
}

// ── News Card ────────────────────────────────────────────────────────────────
function NewsCard({ news, onView }: { news: NewsPost; onView: (id: number) => void }) {
  const { user, reactToNews } = useApp();
  const [expanded, setExpanded] = useState(false);

  const myReactions = news.reactions.filter(r => user && r.userIds.includes(user.id)).map(r => r.emoji);

  return (
    <article
      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all group"
      onClick={() => onView(news.id)}
    >
      {/* Hero image */}
      {news.image && (
        <div className="relative h-44 overflow-hidden">
          <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {/* Category badge on image */}
          <span className={cn("absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full border", getCategoryStyle(news.category))}>
            {news.category}
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Category (if no image) */}
        {!news.image && (
          <span className={cn("inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-3", getCategoryStyle(news.category))}>
            {news.category}:
          </span>
        )}

        {/* Title */}
        <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
          {news.title}
        </h2>

        {/* Body */}
        <p className={cn("text-sm text-muted-foreground leading-relaxed", !expanded && "line-clamp-3")}>
          {news.body}
        </p>
        {news.body.length > 200 && (
          <button
            onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-xs text-primary mt-1 hover:underline flex items-center gap-1"
          >
            {expanded ? "Свернуть" : "Читать дальше"}
            <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
          </button>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo(news.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {news.views.toLocaleString()} просмотров
          </span>
          <span className="ml-auto font-medium text-foreground/70">@{news.authorName}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-4 pt-3">
          {/* Reactions */}
          <div className="flex items-center gap-1 flex-wrap" onClick={e => e.stopPropagation()}>
            {news.reactions.map(r => {
              const reacted = myReactions.includes(r.emoji);
              return (
                <button
                  key={r.emoji}
                  onClick={() => reactToNews(news.id, r.emoji)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-full text-sm border transition-all hover:scale-110 active:scale-95",
                    reacted
                      ? "bg-primary/15 border-primary/40 text-foreground"
                      : "bg-muted/50 border-transparent hover:bg-muted hover:border-border"
                  )}
                >
                  <span>{r.emoji}</span>
                  {r.count > 0 && <span className="text-xs font-medium text-muted-foreground">{r.count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Create News Form ─────────────────────────────────────────────────────────
function CreateNewsForm({ onClose }: { onClose: () => void }) {
  const { addNewsPost } = useApp();
  const imgRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState(NEWS_CATEGORIES[0].label);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImage(r.result as string);
    r.readAsDataURL(f);
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) { setError("Заполните заголовок и текст"); return; }
    const catStyle = getCategoryStyle(category);
    addNewsPost({ authorName: "Kvarden", category, categoryColor: catStyle, title: title.trim(), body: body.trim(), image: image || null });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" /> Новая новость
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Category selector */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Категория</label>
            <div className="flex flex-wrap gap-2">
              {NEWS_CATEGORIES.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => setCategory(cat.label)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    category === cat.label ? cat.color + " scale-105" : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Заголовок</label>
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Например: Добавили новые вещи в магазин"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Текст новости</label>
            <textarea
              value={body} onChange={e => setBody(e.target.value)}
              rows={4} placeholder="Подробное описание..."
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm resize-none"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Обложка (необязательно)</label>
            {image ? (
              <div className="relative rounded-xl overflow-hidden h-32">
                <img src={image} className="w-full h-full object-cover" />
                <button onClick={() => setImage(null)} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button onClick={() => imgRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                <ImageIcon className="w-6 h-6" />
                <span className="text-sm">Загрузить обложку</span>
              </button>
            )}
            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-all">Отмена</button>
            <button onClick={handleSubmit} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all">Опубликовать</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function NewsPage() {
  const { isAuthenticated, user, newsPosts, viewNewsPost } = useApp();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);
  if (!isAuthenticated) return null;

  const canCreate = user && NEWS_AUTHORS.includes(user.name);

  const filtered = activeCategory === "all"
    ? newsPosts
    : newsPosts.filter(n => n.category === activeCategory);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Newspaper className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Новости KRX</h1>
                <p className="text-sm text-muted-foreground">{newsPosts.length} публикаций</p>
              </div>
            </div>
            {canCreate && (
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-4 h-4" /> Написать
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all",
                activeCategory === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"
              )}
            >
              Все
            </button>
            {NEWS_CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all",
                  activeCategory === cat.label ? cat.color : "bg-card text-muted-foreground border-border hover:border-primary/40"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* News list */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-primary/30" />
              </div>
              <p className="text-lg font-semibold">Новостей пока нет</p>
              <p className="text-sm mt-1">
                {canCreate ? "Нажмите «Написать», чтобы создать первую новость" : "Следите за обновлениями"}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Pinned / latest big card */}
              {filtered.length > 0 && (
                <NewsCard news={filtered[0]} onView={viewNewsPost} />
              )}
              {/* Rest as smaller grid */}
              {filtered.length > 1 && (
                <div className="grid gap-4">
                  {filtered.slice(1).map(news => (
                    <NewsCard key={news.id} news={news} onView={viewNewsPost} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />

      {showCreate && <CreateNewsForm onClose={() => setShowCreate(false)} />}
    </div>
  );
}
