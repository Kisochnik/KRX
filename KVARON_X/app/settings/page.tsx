"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Settings, User, Bell, Shield, Palette, Globe, Lock, Eye, Volume2, Moon, Smartphone, Upload, Image, Play, Check, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const settingsSections = [
  { id: "account", label: "Аккаунт", icon: User },
  { id: "notifications", label: "Уведомления", icon: Bell },
  { id: "privacy", label: "Приватность", icon: Shield },
  { id: "appearance", label: "Внешний вид", icon: Palette },
  { id: "language", label: "Язык", icon: Globe },
];

const wallpapers = [
  { id: 1, name: "Neon City", type: "static", url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&h=200&fit=crop", premium: false },
  { id: 2, name: "Abstract Red", type: "static", url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=200&fit=crop", premium: false },
  { id: 3, name: "Dark Gradient", type: "static", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=200&fit=crop", premium: false },
  { id: 4, name: "Cyber Wave", type: "live", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop", premium: true },
  { id: 5, name: "Fire Animation", type: "live", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop", premium: true },
  { id: 6, name: "Matrix Rain", type: "live", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop", premium: true },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account");
  const [selectedWallpaper, setSelectedWallpaper] = useState<number | null>(1);
  const [wallpaperFilter, setWallpaperFilter] = useState<"all" | "static" | "live">("all");
  const isAdmin = true; // Mock admin status
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    darkMode: true,
    privateProfile: false,
    showOnlineStatus: true,
    twoFactorAuth: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Настройки</h1>
              <p className="text-muted-foreground">Управление аккаунтом и предпочтениями</p>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-1">
                {settingsSections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                        activeSection === section.id
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              {activeSection === "account" && (
                <div className="space-y-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Информация профиля</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Имя пользователя</label>
                        <input 
                          type="text" 
                          defaultValue="KRX_Player"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Email</label>
                        <input 
                          type="email" 
                          defaultValue="player@kvaron.com"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Биография</label>
                        <textarea 
                          rows={3}
                          defaultValue="Pro gamer | Streamer | CS2 & Dota 2 enthusiast"
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">
                          Пол <span className="text-destructive">*</span>
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              defaultChecked
                              className="w-4 h-4 accent-primary"
                            />
                            <span className="text-foreground text-sm">Мужской</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              className="w-4 h-4 accent-primary"
                            />
                            <span className="text-foreground text-sm">Женский</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <button className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      Сохранить изменения
                    </button>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      Безопасность
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <div>
                          <p className="font-medium text-foreground">Двухфакторная аутентификация</p>
                          <p className="text-sm text-muted-foreground">Защитите свой аккаунт</p>
                        </div>
                        <button
                          onClick={() => toggleSetting("twoFactorAuth")}
                          className={cn(
                            "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
                            settings.twoFactorAuth ? "bg-primary" : "bg-muted"
                          )}
                        >
                          <span className={cn(
                            "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-200",
                            settings.twoFactorAuth && "translate-x-5"
                          )} />
                        </button>
                      </div>
                      <button className="text-primary hover:underline text-sm">
                        Изменить пароль
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Уведомления</h2>
                  <div className="space-y-4">
                    {[
                      { key: "emailNotifications", icon: Bell, label: "Email уведомления", desc: "Получать уведомления на почту" },
                      { key: "pushNotifications", icon: Smartphone, label: "Push уведомления", desc: "Уведомления в браузере" },
                      { key: "soundEnabled", icon: Volume2, label: "Звуковые уведо��ления", desc: "Звук при новых сообщениях" },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">{item.label}</p>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSetting(item.key as keyof typeof settings)}
                            className={cn(
                              "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
                              settings[item.key as keyof typeof settings] ? "bg-primary" : "bg-muted"
                            )}
                          >
                            <span className={cn(
                              "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-200",
                              settings[item.key as keyof typeof settings] && "translate-x-5"
                            )} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeSection === "privacy" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Приватность</h2>
                  <div className="space-y-4">
                    {[
                      { key: "privateProfile", icon: Lock, label: "Закрытый профиль", desc: "Только подписчики видят контент" },
                      { key: "showOnlineStatus", icon: Eye, label: "Показывать онлайн статус", desc: "Другие видят когда вы в сети" },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">{item.label}</p>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSetting(item.key as keyof typeof settings)}
                            className={cn(
                              "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
                              settings[item.key as keyof typeof settings] ? "bg-primary" : "bg-muted"
                            )}
                          >
                            <span className={cn(
                              "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-200",
                              settings[item.key as keyof typeof settings] && "translate-x-5"
                            )} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeSection === "appearance" && (
                <div className="space-y-6">
                  {/* Theme Toggle */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Тема</h2>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Тёмная тема</p>
                          <p className="text-sm text-muted-foreground">Использовать тёмное оформление</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSetting("darkMode")}
                        className={cn(
                          "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
                          settings.darkMode ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <span className={cn(
                          "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-200",
                          settings.darkMode && "translate-x-5"
                        )} />
                      </button>
                    </div>
                  </div>

                  {/* Wallpapers */}
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-foreground">Обои профиля</h2>
                      <div className="flex gap-2">
                        {(["all", "static", "live"] as const).map(filter => (
                          <button
                            key={filter}
                            onClick={() => setWallpaperFilter(filter)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                              wallpaperFilter === filter
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {filter === "all" ? "Все" : filter === "static" ? (
                              <span className="flex items-center gap-1"><Image className="w-3 h-3" /> Фото</span>
                            ) : (
                              <span className="flex items-center gap-1"><Play className="w-3 h-3" /> Живые</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {wallpapers
                        .filter(w => wallpaperFilter === "all" || w.type === wallpaperFilter)
                        .map(wallpaper => (
                          <button
                            key={wallpaper.id}
                            onClick={() => setSelectedWallpaper(wallpaper.id)}
                            className={cn(
                              "relative rounded-lg overflow-hidden border-2 transition-all group",
                              selectedWallpaper === wallpaper.id
                                ? "border-primary ring-2 ring-primary/30"
                                : "border-transparent hover:border-primary/50"
                            )}
                          >
                            <img
                              src={wallpaper.url}
                              alt={wallpaper.name}
                              className="w-full h-24 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-sm font-medium">{wallpaper.name}</span>
                            </div>
                            {wallpaper.type === "live" && (
                              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary/90 text-primary-foreground text-[10px] font-medium rounded flex items-center gap-1">
                                <Play className="w-2.5 h-2.5 fill-current" /> LIVE
                              </span>
                            )}
                            {wallpaper.premium && (
                              <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-yellow-500/90 text-black text-[10px] font-medium rounded">
                                VIP
                              </span>
                            )}
                            {selectedWallpaper === wallpaper.id && (
                              <div className="absolute bottom-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </button>
                        ))}
                    </div>

                    {/* Admin Upload Section */}
                    {isAdmin && (
                      <div className="border-t border-border pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-foreground">Админ: Загрузка обоев</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <Image className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Загрузить фото</span>
                            <span className="text-xs text-muted-foreground mt-1">PNG, JPG до 5MB</span>
                            <input type="file" accept="image/*" className="hidden" />
                          </label>
                          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <Play className="w-8 h-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">Загрузить видео</span>
                            <span className="text-xs text-muted-foreground mt-1">MP4, WebM до 20MB</span>
                            <input type="file" accept="video/*" className="hidden" />
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Загруженные обои будут доступны всем пользователям в магазине
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === "language" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Язык интерфейса</h2>
                  <div className="space-y-2">
                    {["Русский", "English", "Українська", "Deutsch"].map(lang => (
                      <button
                        key={lang}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg transition-colors",
                          lang === "Русский" 
                            ? "bg-primary/10 text-primary border border-primary/30" 
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
}
