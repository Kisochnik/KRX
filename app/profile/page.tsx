"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, GAME_ADMINS, LEVEL_REWARDS, BANNER_COLORS, XP_PER_LEVEL } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import {
  Camera, Edit3, Save, X, User, CircleDollarSign,
  Users, FileText, Trophy, ShieldCheck, Clock,
  Zap, Gift, Lock, Palette, Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PostCard } from "@/components/krx/post";

// ─── XP helpers ───────────────────────────────────────────────────────────────
function xpPercent(xp: number) { return Math.min(Math.round((xp / XP_PER_LEVEL) * 100), 100); }

function nextReward(level: number) {
  return LEVEL_REWARDS.find(r => r.level > level) || null;
}

function timeAgoSeen(ms: number) {
  const d = Date.now() - ms;
  const m = Math.floor(d / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин. назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч. назад`;
  return `${Math.floor(h / 24)} д. назад`;
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
function EditModal({ onClose }: { onClose: () => void }) {
  const { user, updateUser, setBannerColor, changePassword } = useApp();
  const [tab, setTab] = useState<"profile" | "security">("profile");
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [selectedColor, setSelectedColor] = useState(user?.bannerColor || "#7c3aed");

  // Security
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSaveProfile = () => {
    updateUser({ name: name.trim(), bio: bio.trim(), bannerColor: selectedColor });
    onClose();
  };

  const handleChangePw = () => {
    if (newPw !== confirmPw) { setPwMsg({ ok: false, text: "Пароли не совпадают" }); return; }
    if (newPw.length < 6) { setPwMsg({ ok: false, text: "Минимум 6 символов" }); return; }
    const ok = changePassword(oldPw, newPw);
    if (ok) { setPwMsg({ ok: true, text: "Пароль изменён!" }); setOldPw(""); setNewPw(""); setConfirmPw(""); }
    else setPwMsg({ ok: false, text: "Неверный текущий пароль" });
  };

  const TABS = [
    { id: "profile" as const, label: "Профиль" },
    { id: "security" as const, label: "Безопасность" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Редактировать профиль</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("flex-1 py-3 text-sm font-medium border-b-2 transition-all",
                tab === t.id ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground")}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {tab === "profile" && (
            <>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Имя пользователя</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary text-sm" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Биография</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Цвет баннера
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {BANNER_COLORS.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={cn("w-8 h-8 rounded-full transition-all hover:scale-110 border-2",
                        selectedColor === color ? "border-white scale-110 shadow-lg" : "border-transparent")}
                      style={{ backgroundColor: color }} />
                  ))}
                </div>
                {/* Preview */}
                <div className="mt-3 h-12 rounded-xl transition-all" style={{ background: `linear-gradient(135deg, ${selectedColor}40, ${selectedColor}10)`, borderColor: `${selectedColor}30`, border: "1px solid" }} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={onClose} className="flex-1 py-3 bg-muted/60 text-muted-foreground border border-border rounded-xl font-medium hover:bg-muted transition-all text-sm">Отмена</button>
                <button onClick={handleSaveProfile} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-95 text-sm">Сохранить</button>
              </div>
            </>
          )}

          {tab === "security" && (
            <>
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Смена пароля</h3>
                <div className="space-y-3">
                  {[
                    { val: oldPw, set: setOldPw, placeholder: "Текущий пароль" },
                    { val: newPw, set: setNewPw, placeholder: "Новый пароль" },
                    { val: confirmPw, set: setConfirmPw, placeholder: "Подтвердите новый пароль" },
                  ].map((f, i) => (
                    <input key={i} value={f.val} onChange={e => f.set(e.target.value)} type="password"
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                  ))}
                  {pwMsg && (
                    <p className={cn("text-sm px-3 py-2 rounded-lg", pwMsg.ok ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive")}>
                      {pwMsg.ok ? "✓" : "✗"} {pwMsg.text}
                    </p>
                  )}
                  <button onClick={handleChangePw} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                    Изменить пароль
                  </button>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Двухфакторная аутентификация</h3>
                <p className="text-xs text-muted-foreground mb-3">Подключите 2FA через Telegram-бот для дополнительной защиты</p>
                <div className={cn("flex items-center justify-between p-3 rounded-xl border", user?.twoFaEnabled ? "bg-green-500/5 border-green-500/30" : "bg-muted/20 border-border")}>
                  <span className="text-sm font-medium text-foreground">{user?.twoFaEnabled ? "✓ Включена" : "Не настроена"}</span>
                  <button onClick={() => updateUser({ twoFaEnabled: !user?.twoFaEnabled })}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", user?.twoFaEnabled ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
                    {user?.twoFaEnabled ? "Отключить" : "Подключить"}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Активные сессии</h3>
                <div className="space-y-2">
                  {[
                    { device: "Chrome · Windows", ip: "Текущая сессия", active: true },
                    { device: "Safari · iPhone", ip: "Последний вход 2ч назад", active: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.device}</p>
                        <p className={cn("text-xs", s.active ? "text-green-500" : "text-muted-foreground")}>{s.ip}</p>
                      </div>
                      {!s.active && <button className="text-xs text-destructive hover:underline">Завершить</button>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── XP Progress Block ────────────────────────────────────────────────────────
function XPBlock() {
  const { user } = useApp();
  if (!user) return null;
  const pct = xpPercent(user.xp || 0);
  const next = nextReward(user.level || 0);
  const isAdmin = GAME_ADMINS.includes(user.name);

  const unlocks = [
    { level: 10,  label: "GIF-аватарки",    unlocked: (user.level || 0) >= 10 || isAdmin },
    { level: 20,  label: "Баннеры",          unlocked: (user.level || 0) >= 20 || isAdmin },
    { level: 35,  label: "Обои профиля",     unlocked: (user.level || 0) >= 35 || isAdmin },
    { level: 50,  label: "GIF-баннеры",      unlocked: (user.level || 0) >= 50 || isAdmin },
    { level: 999, label: "Живые обои 🔥",    unlocked: isAdmin },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" /> Уровень и прогресс
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary">{user.level || 0}</span>
          <span className="text-sm text-muted-foreground">ур.</span>
        </div>
      </div>

      {/* XP bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>{user.xp || 0} XP</span>
          <span>{XP_PER_LEVEL} XP</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {next
            ? `До уровня ${next.level}: ${Math.max(0, next.level * XP_PER_LEVEL - (user.level * XP_PER_LEVEL + (user.xp || 0)))} XP`
            : "Максимальный прогресс текущего сезона"}
        </p>
      </div>

      {/* Season info */}
      <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
        <Clock className="w-3.5 h-3.5" />
        Сезон сбрасывается каждые 3 месяца · купленный контент сохраняется
      </div>

      {/* Unlocks grid */}
      <div className="grid grid-cols-5 gap-2">
        {unlocks.map(u => (
          <div key={u.level} className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all",
            u.unlocked ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted/30 border-border text-muted-foreground"
          )}>
            {u.unlocked ? <Gift className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span className="text-[10px] font-medium leading-tight">{u.label}</span>
            {!u.unlocked && <span className="text-[9px]">Ур.{u.level === 999 ? "Адм" : u.level}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { isAuthenticated, user, updateUser, posts, checkSeasonReset, addXP, setOnlineStatus } = useApp();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  // Online status tracking + XP for time online
  useEffect(() => {
    if (!isAuthenticated) { router.replace("/auth"); return; }
    if (!user) return;
    setOnlineStatus("online");
    checkSeasonReset();

    // XP for time online: +2 XP every minute
    const xpTimer = setInterval(() => addXP(2), 60000);
    const handleHidden = () => {
      if (document.hidden) setOnlineStatus("away");
      else setOnlineStatus("online");
    };
    document.addEventListener("visibilitychange", handleHidden);
    return () => {
      clearInterval(xpTimer);
      document.removeEventListener("visibilitychange", handleHidden);
      setOnlineStatus("offline");
    };
  }, [isAuthenticated]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { updateUser({ avatar: reader.result as string }); addXP(50); };
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateUser({ banner: reader.result as string });
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated || !user) return null;

  // Posts that belong to this user
  const myPosts = posts.filter(p => p.authorId === user.id);
  const isAdmin = GAME_ADMINS.includes(user.name);
  const bannerColor = user.bannerColor || "#7c3aed";

  const statusInfo = {
    online: { label: "В сети", color: "text-green-500", dot: "bg-green-500" },
    away:   { label: "Отошёл", color: "text-yellow-500", dot: "bg-yellow-500" },
    offline:{ label: `Был в сети ${timeAgoSeen(user.lastSeen || Date.now())}`, color: "text-muted-foreground", dot: "bg-muted-foreground/50" },
  }[user.onlineStatus || "offline"];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Banner */}
          <div className="relative h-52 rounded-2xl overflow-hidden border border-border group"
            style={{ background: user.banner ? undefined : `linear-gradient(135deg, ${bannerColor}50, ${bannerColor}15, transparent)` }}>
            {user.banner && <img src={user.banner} alt="Banner" className="w-full h-full object-cover" />}
            {!user.banner && (
              <div className="absolute inset-0 flex items-end p-6">
                <div className="w-24 h-24 rounded-full opacity-10" style={{ background: bannerColor }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}
            <button onClick={() => bannerRef.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium">
              <Camera className="w-5 h-5" /> Изменить баннер
            </button>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          </div>

          {/* Avatar + Info row */}
          <div className="flex items-end gap-5 -mt-14 px-4">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-background bg-primary/20 overflow-hidden shadow-xl">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><User className="w-16 h-16 text-primary" /></div>
                }
              </div>
              <button onClick={() => avatarRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </button>
              {/* Online dot */}
              <span className={cn("absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-background", statusInfo.dot)} />
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Name block */}
            <div className="flex-1 pb-2 min-w-0" style={{paddingTop: "4.5rem"}}>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-black text-foreground">{user.name || "Пользователь"}</h1>
                {/* Verification / Admin badge — Bug fix */}
                {(isAdmin || user.isVerified) && (
                  <ShieldCheck className="w-6 h-6 text-primary fill-primary/20" title={isAdmin ? "Администратор" : "Верифицирован"} />
                )}
                {user.isRich && (
                  <CircleDollarSign className="w-6 h-6 text-yellow-500 fill-yellow-500/20" title="Богатый" />
                )}
              </div>
              <div className={cn("flex items-center gap-1.5 text-sm mb-2", statusInfo.color)}>
                <span className={cn("w-2 h-2 rounded-full", statusInfo.dot)} />
                {statusInfo.label}
              </div>
              {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}
            </div>

            {/* Edit button — fixed style: dark border, subtle */}
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 border border-border/60 rounded-xl text-foreground text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all flex-shrink-0 mb-2 bg-transparent">
              <Edit3 className="w-4 h-4 text-muted-foreground" /> Редактировать
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Trophy,   label: "Уровень",  value: user.level || 0 },
              { icon: Users,    label: "Друзья",   value: user.friends || 0 },
              { icon: FileText, label: "Посты",    value: myPosts.length },   // Bug fix: real count
            ].map(stat => (
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/30 transition-all">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* XP Block */}
          <XPBlock />

          {/* Posts feed — Bug fix: real posts */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Публикации
              <span className="text-sm font-normal text-muted-foreground ml-1">· {myPosts.length}</span>
            </h2>
            {myPosts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Постов пока нет</p>
                <p className="text-sm mt-1">Поделитесь чем-нибудь на главной странице</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myPosts.map(post => <PostCard key={post.id} post={post} />)}
              </div>
            )}
          </div>
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
      {editing && <EditModal onClose={() => setEditing(false)} />}
    </div>
  );
}
