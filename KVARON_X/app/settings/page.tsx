"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Settings, Bell, Shield, Palette, Globe, Save, Moon, Sun, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={cn("relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none",
        checked ? "bg-primary" : "bg-muted")}>
      <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
        checked ? "translate-x-7" : "translate-x-1")} />
    </button>
  );
}

export default function SettingsPage() {
  const { isAuthenticated, user, updateUser, theme, setTheme, language, setLanguage, settings, updateSettings } = useApp();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [name, setName] = useState(user?.name || "");

  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);

  const handleSave = () => {
    updateUser({ name, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl"><Settings className="w-8 h-8 text-primary" /></div>
            <div><h1 className="text-3xl font-bold text-foreground">Настройки</h1>
              <p className="text-muted-foreground">Управление аккаунтом</p></div>
          </div>

          {saved && (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-xl mb-6 text-green-600">
              <CheckCircle className="w-5 h-5" /> Сохранено!
            </div>
          )}

          {/* Profile info */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Профиль
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Имя пользователя</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Биография</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Пол</label>
                <div className="flex gap-4">
                  {(["male", "female"] as const).map(g => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" checked={user?.gender === g}
                        onChange={() => updateUser({ gender: g })} className="w-4 h-4 accent-primary" />
                      <span className="text-sm text-foreground">{g === "male" ? "Мужской" : "Женский"}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
                <Save className="w-4 h-4" /> Сохранить
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" /> Тема оформления
            </h2>
            <div className="flex gap-4">
              <button onClick={() => setTheme("dark")}
                className={cn("flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all flex-1",
                  theme === "dark" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")}>
                <Moon className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Тёмная</p>
                  <p className="text-xs text-muted-foreground">Меньше нагрузки на глаза</p>
                </div>
                {theme === "dark" && <CheckCircle className="w-5 h-5 text-primary ml-auto" />}
              </button>
              <button onClick={() => setTheme("light")}
                className={cn("flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all flex-1",
                  theme === "light" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")}>
                <Sun className="w-6 h-6 text-yellow-500" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Светлая</p>
                  <p className="text-xs text-muted-foreground">Классический вид</p>
                </div>
                {theme === "light" && <CheckCircle className="w-5 h-5 text-primary ml-auto" />}
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Язык
            </h2>
            <div className="flex gap-4">
              {(["ru", "en"] as const).map(lang => (
                <button key={lang} onClick={() => setLanguage(lang)}
                  className={cn("flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all",
                    language === lang ? "border-primary bg-primary/10" : "border-border hover:border-primary/50")}>
                  <span className="text-2xl">{lang === "ru" ? "🇷🇺" : "🇺🇸"}</span>
                  <span className="font-medium text-foreground">{lang === "ru" ? "Русский" : "English"}</span>
                  {language === lang && <CheckCircle className="w-4 h-4 text-primary ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notification toggles */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Уведомления
            </h2>
            <div className="space-y-4">
              {([
                { key: "emailNotifications" as const, label: "Email уведомления", desc: "Получать уведомления на почту" },
                { key: "pushNotifications" as const, label: "Push уведомления", desc: "Уведомления в браузере" },
                { key: "soundEnabled" as const, label: "Звуки", desc: "Звуковые уведомления" },
              ]).map(item => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Toggle checked={settings[item.key]} onChange={v => updateSettings(item.key, v)} />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy toggles */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Приватность
            </h2>
            <div className="space-y-4">
              {([
                { key: "privateProfile" as const, label: "Закрытый профиль", desc: "Только друзья видят профиль" },
                { key: "showOnlineStatus" as const, label: "Показывать онлайн статус", desc: "Другие видят, когда вы онлайн" },
                { key: "twoFactorAuth" as const, label: "Двухфакторная аутентификация", desc: "Дополнительная защита аккаунта" },
              ]).map(item => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Toggle checked={settings[item.key]} onChange={v => updateSettings(item.key, v)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
