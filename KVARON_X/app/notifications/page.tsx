"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Bell, Heart, MessageCircle, UserPlus, Trophy, Coins, CheckCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    type: "like",
    icon: Heart,
    user: "Alex_Pro",
    avatar: "https://i.pravatar.cc/40?img=1",
    action: "лайкнул ваш пост",
    time: "2 мин назад",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    icon: MessageCircle,
    user: "GameMaster",
    avatar: "https://i.pravatar.cc/40?img=2",
    action: "прокомментировал ваше фото",
    time: "15 мин назад",
    read: false,
  },
  {
    id: 3,
    type: "follow",
    icon: UserPlus,
    user: "CyberNinja",
    avatar: "https://i.pravatar.cc/40?img=3",
    action: "подписался на вас",
    time: "1 час назад",
    read: false,
  },
  {
    id: 4,
    type: "tournament",
    icon: Trophy,
    user: "KRX System",
    avatar: null,
    action: "Вы заняли 3 место в турнире CS2",
    time: "3 часа назад",
    read: true,
  },
  {
    id: 5,
    type: "coins",
    icon: Coins,
    user: "KRX System",
    avatar: null,
    action: "Вам начислено 500 KRX за активность",
    time: "5 часов назад",
    read: true,
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => !n.read);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Уведомления</h1>
                <p className="text-muted-foreground">{notifications.filter(n => !n.read).length} непрочитанных</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <CheckCheck className="w-4 h-4" />
              Прочитать все
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                filter === "all" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              Все
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                filter === "unread" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              Непрочитанные
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.map(notification => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:border-primary/50",
                    notification.read 
                      ? "bg-card border-border" 
                      : "bg-primary/5 border-primary/20"
                  )}
                >
                  {notification.avatar ? (
                    <img 
                      src={notification.avatar} 
                      alt={notification.user}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-foreground">
                      <span className="font-semibold">{notification.user}</span>{" "}
                      <span className="text-muted-foreground">{notification.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
