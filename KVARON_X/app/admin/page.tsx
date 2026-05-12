"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";

import { Sidebar } from "@/components/krx/sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import {
  Users,
  FileText,
  AlertTriangle,
  Shield,
  Ban,
  CheckCircle,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Flag,
  Eye,
  Trash2,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Всего пользователей", value: "124,892", icon: Users, change: "+12.5%" },
  { label: "Активных сегодня", value: "8,432", icon: TrendingUp, change: "+5.2%" },
  { label: "Жалоб на модерации", value: "47", icon: AlertTriangle, change: "-8.1%" },
  { label: "Доход (KRX)", value: "892,340", icon: DollarSign, change: "+23.4%" },
];

const reports = [
  {
    id: 1,
    type: "spam",
    user: "toxic_user123",
    reporter: "normal_user",
    content: "Спам в комментариях",
    time: "5 мин назад",
    status: "pending",
  },
  {
    id: 2,
    type: "abuse",
    user: "bad_actor",
    reporter: "victim_user",
    content: "Оскорбления в чате",
    time: "12 мин назад",
    status: "pending",
  },
  {
    id: 3,
    type: "scam",
    user: "scammer_acc",
    reporter: "alert_user",
    content: "Попытка мошенничества",
    time: "1 час назад",
    status: "reviewed",
  },
];

const recentUsers = [
  { id: 1, name: "Новый юзер 1", email: "user1@mail.com", status: "active", joined: "Сегодня" },
  { id: 2, name: "Новый юзер 2", email: "user2@mail.com", status: "pending", joined: "Сегодня" },
  { id: 3, name: "Новый юзер 3", email: "user3@mail.com", status: "active", joined: "Вчера" },
  { id: 4, name: "Новый юзер 4", email: "user4@mail.com", status: "banned", joined: "Вчера" },
];

const adminTabs = [
  { id: "overview", label: "Обзор", icon: TrendingUp },
  { id: "users", label: "Пользователи", icon: Users },
  { id: "reports", label: "Жалобы", icon: Flag },
  { id: "content", label: "Контент", icon: FileText },
  { id: "moderation", label: "Модерация", icon: Shield },
];

export default function AdminPage() {
  const { isAuthenticated, user } = useApp();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated || !user?.isAdmin) router.replace("/"); }, [isAuthenticated]);
  if (!isAuthenticated) return null;

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Админ Панель
            </h1>
            <p className="text-muted-foreground mt-1">Управление платформой KVARON_X</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Роль:</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Главный Администратор
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-card rounded-xl p-2 border border-border">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.change.startsWith("+");
            return (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isPositive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground text-xs">vs прошлая неделя</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Reports */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Flag className="w-5 h-5 text-primary" />
                Последние жалобы
              </h2>
              <button className="text-primary text-sm hover:underline">Все жалобы</button>
            </div>
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        report.type === "spam" && "bg-yellow-500/20 text-yellow-500",
                        report.type === "abuse" && "bg-red-500/20 text-red-500",
                        report.type === "scam" && "bg-orange-500/20 text-orange-500"
                      )}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">@{report.user}</p>
                      <p className="text-xs text-muted-foreground">{report.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{report.time}</span>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Новые пользователи
              </h2>
              <button className="text-primary text-sm hover:underline">Все пользователи</button>
            </div>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        user.status === "active" && "bg-green-500/20 text-green-500",
                        user.status === "pending" && "bg-yellow-500/20 text-yellow-500",
                        user.status === "banned" && "bg-red-500/20 text-red-500"
                      )}
                    >
                      {user.status === "active" && "Активен"}
                      {user.status === "pending" && "Ожидает"}
                      {user.status === "banned" && "Забанен"}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-muted-foreground/10 transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-card border border-border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              <Ban className="w-6 h-6 text-red-500" />
              <span className="text-sm text-foreground">Забанить</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <span className="text-sm text-foreground">Рассылка</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              <Eye className="w-6 h-6 text-yellow-500" />
              <span className="text-sm text-foreground">Просмотр логов</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              <Trash2 className="w-6 h-6 text-red-400" />
              <span className="text-sm text-foreground">Удалить контент</span>
            </button>
          </div>
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
}
