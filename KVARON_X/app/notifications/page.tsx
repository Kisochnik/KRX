"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, KRXNotification, NotifType } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Bell, BellOff, Check, CheckCheck, Trash2, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ── Config ────────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<NotifType, string> = {
  like:          "Лайки",
  reaction:      "Реакции",
  comment:       "Комментарии",
  mention:       "Упоминания",
  friend_request:"Друзья",
  message:       "Сообщения",
  news:          "Новости",
  game_event:    "Игры",
  shop_purchase: "Магазин",
  wallet:        "Кошелёк",
};

const TYPE_GROUPS: { label: string; types: NotifType[] }[] = [
  { label: "Всё",      types: [] },
  { label: "Социальные", types: ["like","reaction","comment","mention","friend_request","message"] },
  { label: "Системные",  types: ["news","game_event","shop_purchase","wallet"] },
];

function timeAgo(ms: number) {
  const d = Date.now() - ms;
  const m = Math.floor(d / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин.`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч.`;
  return `${Math.floor(h / 24)} д.`;
}

// Colour strip per type
function typeColor(type: NotifType) {
  if (["like","reaction"].includes(type))          return "bg-red-500";
  if (["comment","mention"].includes(type))        return "bg-blue-500";
  if (["friend_request","message"].includes(type)) return "bg-green-500";
  if (type === "news")                             return "bg-primary";
  if (type === "game_event")                       return "bg-orange-500";
  if (["shop_purchase","wallet"].includes(type))   return "bg-yellow-500";
  return "bg-muted-foreground";
}

// ── Single card ───────────────────────────────────────────────────────────────
function NotifCard({ notif, onRead, onDelete }: {
  notif: KRXNotification;
  onRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      onClick={() => !notif.read && onRead(notif.id)}
      className={cn(
        "relative flex items-start gap-4 p-4 rounded-xl border transition-all group cursor-pointer",
        notif.read
          ? "bg-card border-border opacity-70 hover:opacity-100"
          : "bg-card border-primary/30 shadow-sm hover:border-primary/50"
      )}
    >
      {/* Colour strip */}
      <div className={cn("absolute left-0 top-3 bottom-3 w-0.5 rounded-full", typeColor(notif.type))} />

      {/* Icon bubble */}
      <div className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0",
        notif.read ? "bg-muted" : "bg-primary/10"
      )}>
        {notif.icon || "🔔"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-semibold", notif.read ? "text-muted-foreground" : "text-foreground")}>
            {notif.title}
          </p>
          <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(notif.createdAt)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{notif.body}</p>

        <div className="flex items-center gap-3 mt-2">
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            notif.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
          )}>
            {TYPE_LABELS[notif.type]}
          </span>
          {notif.fromUser && (
            <span className="text-xs text-muted-foreground">от @{notif.fromUser}</span>
          )}
          {notif.link && (
            <Link href={notif.link} onClick={e => e.stopPropagation()}
              className="text-xs text-primary hover:underline ml-auto">
              Перейти →
            </Link>
          )}
        </div>
      </div>

      {/* Unread dot */}
      {!notif.read && (
        <div className="absolute top-3 right-10 w-2 h-2 rounded-full bg-primary" />
      )}

      {/* Delete button */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(notif.id); }}
        className="absolute top-3 right-3 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
      >
        <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const { isAuthenticated, notifications, unreadCount, markRead, markAllRead, clearNotification, pushNotif } = useApp();
  const router = useRouter();
  const [activeGroup, setActiveGroup] = useState(0); // index into TYPE_GROUPS
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);
  if (!isAuthenticated) return null;

  const group = TYPE_GROUPS[activeGroup];
  let filtered = group.types.length === 0
    ? notifications
    : notifications.filter(n => group.types.includes(n.type));
  if (showOnlyUnread) filtered = filtered.filter(n => !n.read);

  // Demo notifications injector (for testing)
  const injectDemo = () => {
    const demos: Omit<KRXNotification, "id" | "createdAt" | "read">[] = [
      { type: "like",          icon: "❤️", title: "Новый лайк",             body: "@Baron_Kosyaka лайкнул ваш пост", fromUser: "Baron_Kosyaka", link: "/" },
      { type: "comment",       icon: "💬", title: "Новый комментарий",       body: "@Kvarden: «Отличный пост!»",      fromUser: "Kvarden",       link: "/" },
      { type: "mention",       icon: "📣", title: "Вас упомянули",           body: "@user123 упомянул вас",           fromUser: "user123",       link: "/" },
      { type: "friend_request",icon: "👤", title: "Запрос в друзья",         body: "@NightRider хочет добавить вас",  fromUser: "NightRider",    link: "/friends" },
      { type: "message",       icon: "✉️", title: "Новое сообщение",         body: "@CyberQueen: «Привет!»",          fromUser: "CyberQueen",    link: "/chat" },
      { type: "news",          icon: "📰", title: "Обновления:",             body: "Добавили новые вещи в магазин",   fromUser: "KVARON_X",      link: "/news" },
      { type: "game_event",    icon: "🎮", title: "Игровое событие",         body: "Клановый турнир начнётся через 1ч",                           link: "/games" },
      { type: "shop_purchase", icon: "🛍️", title: "Покупка совершена",       body: "Рамка «Neon Glow» активирована",                             link: "/shop" },
      { type: "wallet",        icon: "💰", title: "Зачисление средств",      body: "Вы получили 500 KRX от @Kvarden", fromUser: "Kvarden",       link: "/wallet" },
    ];
    demos.forEach(d => setTimeout(() => pushNotif(d), Math.random() * 300));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative p-3 bg-primary/10 rounded-xl">
                <Bell className="w-7 h-7 text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Уведомления</h1>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} непрочитанных` : "Всё прочитано"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Unread filter toggle */}
              <button
                onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                  showOnlyUnread ? "bg-primary/10 border-primary/40 text-primary" : "bg-card border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                <Filter className="w-4 h-4" />
                {showOnlyUnread ? "Непрочитанные" : "Все"}
              </button>

              {/* Mark all read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-card border border-border text-muted-foreground hover:border-primary/30 transition-all"
                >
                  <CheckCheck className="w-4 h-4" /> Прочитать все
                </button>
              )}
            </div>
          </div>

          {/* Group tabs */}
          <div className="flex gap-2 mb-6 bg-card border border-border rounded-xl p-1">
            {TYPE_GROUPS.map((g, i) => (
              <button
                key={g.label}
                onClick={() => setActiveGroup(i)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                  activeGroup === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Notification list */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <div className="w-20 h-20 bg-card border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BellOff className="w-10 h-10 opacity-30" />
              </div>
              <p className="text-lg font-semibold">Нет уведомлений</p>
              <p className="text-sm mt-1">
                {showOnlyUnread ? "Все уведомления прочитаны" : "Активность появится здесь"}
              </p>
              {/* Demo button for testing */}
              <button
                onClick={injectDemo}
                className="mt-6 px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-all border border-primary/20"
              >
                🔔 Показать демо уведомления
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Summary bar */}
              <div className="flex items-center justify-between px-1 mb-3">
                <p className="text-sm text-muted-foreground">{filtered.length} уведомлений</p>
                <button
                  onClick={() => filtered.forEach(n => clearNotification(n.id))}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Очистить
                </button>
              </div>

              {filtered.map(notif => (
                <NotifCard
                  key={notif.id}
                  notif={notif}
                  onRead={markRead}
                  onDelete={clearNotification}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
