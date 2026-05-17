"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useApp, GAME_ADMINS, Tournament, Clan, Room,
} from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import {
  Gamepad2, Trophy, Users, DoorOpen, Plus, X, Lock, Globe,
  Mail, Crown, Star, MessageCircle, Send, ShieldBan,
  Coins, AlertCircle, Camera, CheckCircle, Eye, EyeOff,
  Sword, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── helpers ────────────────────────────────────────────────────────────────
function timeAgo(ms: number) {
  const m = Math.floor((Date.now() - ms) / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин.`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч.`;
  return `${Math.floor(h / 24)} д.`;
}

// ─── Tournament Card ─────────────────────────────────────────────────────────
function TournamentCard({ t }: { t: Tournament }) {
  const { user, joinTournament } = useApp();
  const joined = user && t.participants.includes(user.id);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all group">
      {t.banner && <img src={t.banner} className="w-full h-32 object-cover" />}
      {!t.banner && (
        <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Trophy className="w-12 h-12 text-primary/40" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-foreground text-base leading-snug">{t.title}</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
            {t.game}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span>📅 {t.date}</span>
          <span>🏆 {t.prizePool}</span>
          <span>👥 {t.participants.length}/{t.maxPlayers}</span>
        </div>
        <button
          onClick={() => !joined && joinTournament(t.id)}
          disabled={!!joined}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
            joined
              ? "bg-green-500/10 text-green-500 border border-green-500/30 cursor-default"
              : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
          )}
        >
          {joined ? "✓ Вы участвуете" : "Участвовать"}
        </button>
      </div>
    </div>
  );
}

// ─── Create Tournament Modal ─────────────────────────────────────────────────
function CreateTournamentModal({ onClose }: { onClose: () => void }) {
  const { createTournament } = useApp();
  const imgRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(""); const [game, setGame] = useState("");
  const [date, setDate] = useState(""); const [prize, setPrize] = useState("");
  const [max, setMax] = useState("32"); const [banner, setBanner] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const submit = () => {
    if (!title || !game || !date) { setErr("Заполните все обязательные поля"); return; }
    createTournament({ title, game, date, prizePool: prize || "TBD", maxPlayers: parseInt(max) || 32, banner, createdBy: "" });
    onClose();
  };

  return (
    <Modal title="Новый турнир" onClose={onClose}>
      {err && <ErrorMsg text={err} />}
      <Field label="Название *"><Input value={title} onChange={setTitle} placeholder="KRX Championship" /></Field>
      <Field label="Игра *"><Input value={game} onChange={setGame} placeholder="CS2, Dota 2, Valorant..." /></Field>
      <Field label="Дата *"><input type="datetime-local" value={date} onChange={e => setDate(e.target.value)}
        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary text-sm" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Призовой фонд"><Input value={prize} onChange={setPrize} placeholder="500 KRX" /></Field>
        <Field label="Макс. игроков"><Input value={max} onChange={setMax} placeholder="32" /></Field>
      </div>
      <Field label="Баннер (необязательно)">
        {banner
          ? <div className="relative h-24 rounded-xl overflow-hidden"><img src={banner} className="w-full h-full object-cover" /><BtnX onClick={() => setBanner(null)} /></div>
          : <UploadBtn onClick={() => imgRef.current?.click()} />}
        <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setBanner(r.result as string); r.readAsDataURL(f); } e.target.value = ""; }} />
      </Field>
      <ModalActions onCancel={onClose} onSubmit={submit} submitLabel="Создать турнир" />
    </Modal>
  );
}

// ─── Clan Card ───────────────────────────────────────────────────────────────
function ClanCard({ clan }: { clan: Clan }) {
  const { user, joinClan, leaveClan, banFromClan } = useApp();
  const isMember = user && clan.members.includes(user.id);
  const isOwner  = user && clan.ownerId === user.id;
  const isAdmin  = user && GAME_ADMINS.includes(user.name);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 overflow-hidden border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
          {clan.avatar ? <img src={clan.avatar} className="w-full h-full object-cover" /> : <Sword className="w-6 h-6 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground truncate">{clan.name}</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">[{clan.tag}]</span>
            {clan.isPaid && <Crown className="w-4 h-4 text-yellow-500" title="Платный клан" />}
          </div>
          <p className="text-xs text-muted-foreground">{clan.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {clan.members.length}/200</span>
        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" /> Ур. {clan.level}</span>
        <span>от @{clan.ownerName}</span>
      </div>
      {/* XP bar */}
      <div className="h-1.5 bg-muted rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min((clan.xp % 1000) / 10, 100)}%` }} />
      </div>
      <div className="flex gap-2">
        {!isMember && !isOwner && (
          <button onClick={() => joinClan(clan.id)} className="flex-1 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95">
            Вступить
          </button>
        )}
        {(isMember && !isOwner) && (
          <button onClick={() => leaveClan(clan.id)} className="flex-1 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-all">
            Покинуть
          </button>
        )}
        {isOwner && <span className="flex-1 py-2 text-center text-sm text-primary font-medium">Ваш клан</span>}
      </div>
    </div>
  );
}

// ─── Create Clan Modal ───────────────────────────────────────────────────────
function CreateClanModal({ onClose }: { onClose: () => void }) {
  const { user, createClan } = useApp();
  const imgRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(""); const [tag, setTag] = useState("");
  const [desc, setDesc] = useState(""); const [isPaid, setIsPaid] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null); const [err, setErr] = useState("");
  const isAdmin = user && GAME_ADMINS.includes(user.name);

  const submit = () => {
    if (!name.trim() || !tag.trim()) { setErr("Введите название и тег"); return; }
    if (tag.length > 5) { setErr("Тег максимум 5 символов"); return; }
    const ok = createClan({ name: name.trim(), tag: tag.trim().toUpperCase(), avatar, description: desc.trim(), isPaid });
    if (!ok) { setErr("Недостаточно KRX для создания"); return; }
    onClose();
  };

  return (
    <Modal title="Создать клан" onClose={onClose}>
      {err && <ErrorMsg text={err} />}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary/40 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => imgRef.current?.click()}>
          {avatar ? <img src={avatar} className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-primary/60" />}
        </div>
        <div className="flex-1">
          <Field label="Название клана *"><Input value={name} onChange={setName} placeholder="Например: Cyber Warriors" /></Field>
        </div>
        <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setAvatar(r.result as string); r.readAsDataURL(f); } e.target.value = ""; }} />
      </div>
      <Field label="Тег клана * (макс. 5 букв)"><Input value={tag} onChange={v => setTag(v.toUpperCase().slice(0,5))} placeholder="CYBER" /></Field>
      <Field label="Описание"><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="О вашем клане..." className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm resize-none" /></Field>
      {!isAdmin && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
          <div>
            <p className="text-sm font-medium text-foreground">Платный клан</p>
            <p className="text-xs text-muted-foreground">Приоритет в списке · Стоит 500 KRX</p>
          </div>
          <Toggle checked={isPaid} onChange={setIsPaid} />
        </div>
      )}
      {!isAdmin && isPaid && <p className="text-xs text-muted-foreground">Баланс: <span className="text-primary">{user?.balance ?? 0} KRX</span></p>}
      <ModalActions onCancel={onClose} onSubmit={submit} submitLabel="Создать клан" />
    </Modal>
  );
}

// ─── Room Card ───────────────────────────────────────────────────────────────
function RoomCard({ room, onOpen }: { room: Room; onOpen: (r: Room) => void }) {
  const { user } = useApp();
  const isMember = user && room.members.includes(user.id);
  const privacyIcon = room.privacy === "open" ? <Globe className="w-3.5 h-3.5" /> : room.privacy === "invite" ? <Mail className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />;

  return (
    <div
      className={cn("bg-card border rounded-2xl p-4 hover:border-primary/40 transition-all cursor-pointer group", room.isPaid ? "border-yellow-500/30" : "border-border")}
      style={room.bgColor ? { background: `linear-gradient(135deg, ${room.bgColor}22, transparent)` } : undefined}
      onClick={() => onOpen(room)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{room.name}</h3>
        <div className="flex items-center gap-1.5">
          {room.isPaid && <Crown className="w-4 h-4 text-yellow-500" />}
          <span className="text-muted-foreground">{privacyIcon}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        🎮 {room.game} · @{room.ownerName}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {room.members.length}/{room.maxPlayers}</span>
        {room.entryFee > 0 && <span className="flex items-center gap-1 text-yellow-500"><Coins className="w-3.5 h-3.5" /> {room.entryFee} KRX</span>}
        {isMember && <span className="text-green-500 font-medium">✓ Внутри</span>}
      </div>
    </div>
  );
}

// ─── Room Detail Modal ───────────────────────────────────────────────────────
function RoomDetailModal({ room, onClose }: { room: Room; onClose: () => void }) {
  const { user, joinRoom, leaveRoom, banFromRoom, sendRoomMessage } = useApp();
  const [msg, setMsg] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [pwErr, setPwErr] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const isMember = user && room.members.includes(user.id);
  const isOwner  = user && room.ownerId === user.id;

  const handleJoin = () => {
    const ok = joinRoom(room.id, pwInput || undefined);
    if (!ok) setPwErr(room.privacy === "password" ? "Неверный пароль или недостаточно KRX" : "Не удалось войти");
  };

  const handleSend = () => {
    if (!msg.trim()) return;
    sendRoomMessage(room.id, msg);
    setMsg("");
    setTimeout(() => { chatRef.current?.scrollTo({ top: 9999, behavior: "smooth" }); }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-bold text-foreground">{room.name}</h2>
            <p className="text-xs text-muted-foreground">🎮 {room.game} · {room.members.length} участников</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        {!isMember ? (
          <div className="p-6 flex flex-col items-center gap-4">
            <DoorOpen className="w-14 h-14 text-primary/40" />
            <p className="text-base font-semibold text-foreground">Войти в комнату?</p>
            {room.entryFee > 0 && (
              <p className="text-sm text-yellow-500 flex items-center gap-1"><Coins className="w-4 h-4" /> Вход: {room.entryFee} KRX</p>
            )}
            {room.privacy === "password" && (
              <input value={pwInput} onChange={e => setPwInput(e.target.value)} type="password" placeholder="Пароль комнаты"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary" />
            )}
            {pwErr && <ErrorMsg text={pwErr} />}
            <button onClick={handleJoin} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all">
              Войти
            </button>
          </div>
        ) : (
          <>
            {/* Chat */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
              {room.chat.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">Начните общение!</p>
              )}
              {room.chat.map(m => (
                <div key={m.id} className="flex items-start gap-2 group">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                    {m.authorName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{m.authorName}</span>
                      <span className="text-xs text-muted-foreground">{timeAgo(m.createdAt)}</span>
                      {isOwner && m.authorName !== user?.name && (
                        <button onClick={() => banFromRoom(room.id, m.authorName)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                          <ShieldBan className="w-3.5 h-3.5 text-destructive" title="Забанить" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Написать в чат..." className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary" />
              <button onClick={handleSend} disabled={!msg.trim()} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </div>
            {isMember && !isOwner && (
              <button onClick={() => { leaveRoom(room.id); onClose(); }} className="mx-3 mb-3 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
                Покинуть комнату
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Create Room Modal ───────────────────────────────────────────────────────
function CreateRoomModal({ onClose }: { onClose: () => void }) {
  const { user, createRoom } = useApp();
  const [name, setName] = useState(""); const [game, setGame] = useState("");
  const [privacy, setPrivacy] = useState<Room["privacy"]>("open");
  const [password, setPassword] = useState(""); const [showPw, setShowPw] = useState(false);
  const [isPaid, setIsPaid] = useState(false); const [fee, setFee] = useState("0");
  const [bgColor, setBgColor] = useState("#7c3aed"); const [err, setErr] = useState("");
  const isAdmin = user && GAME_ADMINS.includes(user.name);

  const submit = () => {
    if (!name.trim() || !game.trim()) { setErr("Введите название и игру"); return; }
    const ok = createRoom({ name: name.trim(), game: game.trim(), privacy, password: privacy === "password" ? password : undefined, isPaid, entryFee: parseInt(fee) || 0, bgColor: isPaid ? bgColor : undefined });
    if (!ok) { setErr("Недостаточно KRX для создания"); return; }
    onClose();
  };

  return (
    <Modal title="Создать комнату" onClose={onClose}>
      {err && <ErrorMsg text={err} />}
      <Field label="Название *"><Input value={name} onChange={setName} placeholder="Ranked Lobby #1" /></Field>
      <Field label="Игра *"><Input value={game} onChange={setGame} placeholder="CS2, Valorant..." /></Field>
      <Field label="Приватность">
        <div className="flex gap-2">
          {(["open","invite","password"] as const).map(p => (
            <button key={p} onClick={() => setPrivacy(p)} className={cn("flex-1 py-2 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5",
              privacy === p ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground hover:border-primary/30")}>
              {p === "open" ? <><Globe className="w-3.5 h-3.5" /> Открытая</> : p === "invite" ? <><Mail className="w-3.5 h-3.5" /> По приглашению</> : <><Lock className="w-3.5 h-3.5" /> Пароль</>}
            </button>
          ))}
        </div>
      </Field>
      {privacy === "password" && (
        <Field label="Пароль">
          <div className="relative">
            <input value={password} onChange={e => setPassword(e.target.value)} type={showPw ? "text" : "password"} placeholder="Пароль комнаты" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary pr-10" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>
        </Field>
      )}
      {!isAdmin && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
          <div><p className="text-sm font-medium text-foreground">Платная комната</p><p className="text-xs text-muted-foreground">Приоритет · Кастомизация · Стоит 200 KRX</p></div>
          <Toggle checked={isPaid} onChange={setIsPaid} />
        </div>
      )}
      {(isPaid || isAdmin) && (
        <div className="space-y-3">
          <Field label="Плата за вход (KRX, 0 = бесплатно)">
            <Input value={fee} onChange={setFee} placeholder="0" />
          </Field>
          <Field label="Цвет фона">
            <div className="flex items-center gap-3">
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent" />
              <span className="text-sm text-muted-foreground">{bgColor}</span>
            </div>
          </Field>
        </div>
      )}
      <ModalActions onCancel={onClose} onSubmit={submit} submitLabel="Создать комнату" />
    </Modal>
  );
}

// ─── Reusable UI bits ────────────────────────────────────────────────────────
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm text-muted-foreground mb-1.5">{label}</label>{children}</div>;
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />;
}
function ErrorMsg({ text }: { text: string }) {
  return <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3"><AlertCircle className="w-4 h-4 flex-shrink-0" />{text}</div>;
}
function UploadBtn({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="w-full h-20 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all text-sm"><Camera className="w-5 h-5" /> Загрузить изображение</button>;
}
function BtnX({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80"><X className="w-3.5 h-3.5 text-white" /></button>;
}
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return <button onClick={() => onChange(!checked)} className={cn("relative w-11 h-6 rounded-full transition-colors", checked ? "bg-primary" : "bg-muted")}>
    <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform", checked ? "translate-x-6" : "translate-x-1")} />
  </button>;
}
function ModalActions({ onCancel, onSubmit, submitLabel }: { onCancel: () => void; onSubmit: () => void; submitLabel: string }) {
  return <div className="flex gap-3 pt-1">
    <button onClick={onCancel} className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-all">Отмена</button>
    <button onClick={onSubmit} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-95">{submitLabel}</button>
  </div>;
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
type Tab = "tournaments" | "clans" | "rooms";

export default function GamesPage() {
  const { isAuthenticated, user, tournaments, clans, rooms } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("tournaments");
  const [modal, setModal] = useState<"tournament" | "clan" | "room" | null>(null);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);
  if (!isAuthenticated || !user) return null;

  const isAdmin = GAME_ADMINS.includes(user.name);

  // Sort: paid rooms first
  const sortedRooms = [...rooms].sort((a, b) => (b.isPaid ? 1 : 0) - (a.isPaid ? 1 : 0));
  const sortedClans = [...clans].sort((a, b) => (b.isPaid ? 1 : 0) - (a.isPaid ? 1 : 0));

  const TABS: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: "tournaments", label: "Турниры", icon: Trophy,   count: tournaments.length },
    { id: "clans",       label: "Кланы",   icon: Sword,    count: clans.length },
    { id: "rooms",       label: "Комнаты", icon: DoorOpen, count: rooms.length },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl"><Gamepad2 className="w-7 h-7 text-primary" /></div>
              <div><h1 className="text-2xl font-bold text-foreground">KRX Games</h1>
                <p className="text-sm text-muted-foreground">Игровой хаб платформы</p></div>
            </div>
            {/* Create buttons */}
            <div className="flex gap-2">
              {tab === "tournaments" && isAdmin && (
                <button onClick={() => setModal("tournament")} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95">
                  <Plus className="w-4 h-4" /> Создать турнир
                </button>
              )}
              {tab === "clans" && (
                <button onClick={() => setModal("clan")} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95">
                  <Plus className="w-4 h-4" /> Создать клан
                </button>
              )}
              {tab === "rooms" && (
                <button onClick={() => setModal("room")} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95">
                  <Plus className="w-4 h-4" /> Создать комнату
                </button>
              )}
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    tab === t.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground")}>
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {t.count > 0 && <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-bold", tab === t.id ? "bg-white/20" : "bg-muted")}>{t.count}</span>}
                </button>
              );
            })}
          </div>

          {/* ── Tournaments ── */}
          {tab === "tournaments" && (
            tournaments.length === 0 ? (
              <EmptyState icon={<Trophy className="w-12 h-12 text-primary/30" />} title="Турниров пока нет"
                desc={isAdmin ? "Создайте первый турнир для платформы" : "Следите за объявлениями"}
                action={isAdmin ? { label: "Создать турнир", onClick: () => setModal("tournament") } : undefined} />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {tournaments.map(t => <TournamentCard key={t.id} t={t} />)}
              </div>
            )
          )}

          {/* ── Clans ── */}
          {tab === "clans" && (
            sortedClans.length === 0 ? (
              <EmptyState icon={<Sword className="w-12 h-12 text-primary/30" />} title="Кланов пока нет"
                desc="Создайте первый клан и набирайте бойцов"
                action={{ label: "Создать клан", onClick: () => setModal("clan") }} />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {sortedClans.map(c => <ClanCard key={c.id} clan={c} />)}
              </div>
            )
          )}

          {/* ── Rooms ── */}
          {tab === "rooms" && (
            sortedRooms.length === 0 ? (
              <EmptyState icon={<DoorOpen className="w-12 h-12 text-primary/30" />} title="Комнат пока нет"
                desc="Создайте лобби и пригласите друзей"
                action={{ label: "Создать комнату", onClick: () => setModal("room") }} />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {sortedRooms.map(r => <RoomCard key={r.id} room={r} onOpen={setActiveRoom} />)}
              </div>
            )
          )}
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />

      {modal === "tournament" && <CreateTournamentModal onClose={() => setModal(null)} />}
      {modal === "clan"       && <CreateClanModal       onClose={() => setModal(null)} />}
      {modal === "room"       && <CreateRoomModal       onClose={() => setModal(null)} />}
      {activeRoom && <RoomDetailModal room={rooms.find(r => r.id === activeRoom.id) || activeRoom} onClose={() => setActiveRoom(null)} />}
    </div>
  );
}

function EmptyState({ icon, title, desc, action }: { icon: React.ReactNode; title: string; desc: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <div className="w-20 h-20 bg-card border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">{icon}</div>
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="text-sm mt-1">{desc}</p>
      {action && <button onClick={action.onClick} className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-95">{action.label}</button>}
    </div>
  );
}
