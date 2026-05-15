"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, Track, MusicCategory, GAME_ADMINS } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import {
  Music, Play, Pause, Heart, Bookmark, Plus, X, Upload,
  Search, Trash2, Headphones, Flame, Clock, Library,
  Disc3, Edit3, Save, AlertCircle, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Category config ─────────────────────────────────────────────────────────
const CATEGORIES: { id: MusicCategory; label: string; emoji: string }[] = [
  { id: "all",        label: "Все треки",   emoji: "🎵" },
  { id: "popular",    label: "Популярное",  emoji: "🔥" },
  { id: "new",        label: "Новинки",     emoji: "✨" },
  { id: "phonk",      label: "Phonk",       emoji: "👹" },
  { id: "trap",       label: "Trap",        emoji: "🎤" },
  { id: "rock",       label: "Rock",        emoji: "🎸" },
  { id: "electronic", label: "Electronic",  emoji: "⚡" },
  { id: "gaming",     label: "Gaming",      emoji: "🎮" },
  { id: "chill",      label: "Chill",       emoji: "🌙" },
  { id: "memes",      label: "Мемы",        emoji: "😂" },
];

type LibTab = "liked" | "saved" | "recent";

// ─── Track Card ───────────────────────────────────────────────────────────────
function TrackCard({
  track, index, isActive, isPlaying, onPlay, queue,
}: {
  track: Track; index: number; isActive: boolean; isPlaying: boolean;
  onPlay: () => void; queue: Track[];
}) {
  const { user, likeTrack, saveTrack, deleteTrack, likedTracks, savedTracks } = useApp();
  const isLiked = user ? likedTracks.some(t => t.id === track.id) : false;
  const isSaved = user ? savedTracks.some(t => t.id === track.id) : false;
  const isAdmin = user && GAME_ADMINS.includes(user.name);

  return (
    <div className={cn(
      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer",
      isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/50 border border-transparent"
    )} onClick={onPlay}>
      {/* Index / Play indicator */}
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
        {isActive && isPlaying ? (
          <div className="flex items-end gap-0.5 h-4">
            {[1,2,3].map(i => (
              <div key={i} className="w-0.5 bg-primary rounded-full animate-bounce" style={{ height: `${[10,16,12][i-1]}px`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : (
          <>
            <span className="text-sm text-muted-foreground group-hover:hidden">{index + 1}</span>
            <Play className="w-4 h-4 text-primary hidden group-hover:block fill-primary" />
          </>
        )}
      </div>

      {/* Cover */}
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
        {track.cover
          ? <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
          : <Disc3 className="w-5 h-5 text-primary" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold truncate", isActive ? "text-primary" : "text-foreground")}>{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
        <span className="flex items-center gap-1"><Headphones className="w-3.5 h-3.5" /> {(track.plays || 0).toLocaleString()}</span>
        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {(track.likedBy || []).length}</span>
        <span className="w-10 text-right">{track.duration}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button onClick={() => likeTrack(track.id)}
          className={cn("p-1.5 rounded-lg transition-all hover:scale-110", isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500")}>
          <Heart className={cn("w-4 h-4", isLiked && "fill-red-500")} />
        </button>
        <button onClick={() => saveTrack(track.id)}
          className={cn("p-1.5 rounded-lg transition-all hover:scale-110", isSaved ? "text-primary" : "text-muted-foreground hover:text-primary")}>
          <Bookmark className={cn("w-4 h-4", isSaved && "fill-primary")} />
        </button>
        {isAdmin && (
          <button onClick={() => deleteTrack(track.id)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Add Track Modal ──────────────────────────────────────────────────────────
function AddTrackModal({ onClose }: { onClose: () => void }) {
  const { addTrack } = useApp();
  const coverRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState<MusicCategory>("all");
  const [cover, setCover] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState("");
  const [err, setErr] = useState("");

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setCover(r.result as string); r.readAsDataURL(f);
    e.target.value = "";
  };

  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setAudioName(f.name);
    // Try to get duration from audio file
    const audio = document.createElement("audio");
    const url = URL.createObjectURL(f);
    audio.src = url;
    audio.onloadedmetadata = () => {
      const m = Math.floor(audio.duration / 60);
      const s = Math.floor(audio.duration % 60);
      setDuration(`${m}:${String(s).padStart(2, "0")}`);
      URL.revokeObjectURL(url);
    };
    const r = new FileReader(); r.onload = () => setAudioUrl(r.result as string); r.readAsDataURL(f);
    e.target.value = "";
  };

  const submit = () => {
    if (!title.trim() || !artist.trim()) { setErr("Введите название и исполнителя"); return; }
    addTrack({ title: title.trim(), artist: artist.trim(), duration: duration || "0:00", category, cover: cover || null, audioUrl: audioUrl || null, addedBy: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Music className="w-5 h-5 text-primary" /> Добавить трек</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">
          {err && <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3"><AlertCircle className="w-4 h-4" />{err}</div>}

          {/* Cover + basic info */}
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors flex-shrink-0 border-2 border-dashed border-primary/30 relative"
              onClick={() => coverRef.current?.click()}>
              {cover ? <img src={cover} className="w-full h-full object-cover" /> : <><Disc3 className="w-8 h-8 text-primary/40" /><span className="absolute bottom-1 text-[9px] text-primary/60">Обложка</span></>}
            </div>
            <div className="flex-1 space-y-2">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Название трека *"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <input value={artist} onChange={e => setArtist(e.target.value)} placeholder="Исполнитель *"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Длительность (авто)"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Категория</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.filter(c => c.id !== "all").map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all",
                    category === cat.id ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground hover:border-primary/30")}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audio file */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Аудиофайл (MP3, WAV)</label>
            <button onClick={() => audioRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 bg-muted/50 border border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-muted transition-all text-sm text-muted-foreground hover:text-foreground">
              <Upload className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{audioName || "Выбрать аудиофайл"}</span>
              {audioUrl && <span className="text-green-500 ml-auto">✓</span>}
            </button>
          </div>

          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
          <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={handleAudio} />

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80">Отмена</button>
            <button onClick={submit} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all">Добавить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MusicPage() {
  const { isAuthenticated, user, tracks, showPlayer, playTrack, currentTrack, isPlaying, likedTracks, savedTracks, recentTracks } = useApp();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<MusicCategory>("all");
  const [libTab, setLibTab] = useState<LibTab>("liked");
  const [showLib, setShowLib] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); else showPlayer(); }, [isAuthenticated]);
  if (!isAuthenticated) return null;

  const isAdmin = user && GAME_ADMINS.includes(user.name);

  // Filter tracks
  let filtered = tracks;
  if (activeCategory === "popular") filtered = [...tracks].sort((a, b) => (b.plays || 0) - (a.plays || 0));
  else if (activeCategory === "new") filtered = [...tracks].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  else if (activeCategory !== "all") filtered = tracks.filter(t => t.category === activeCategory);
  if (search.trim()) filtered = filtered.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) || t.artist.toLowerCase().includes(search.toLowerCase())
  );

  const libTracks = libTab === "liked" ? likedTracks : libTab === "saved" ? savedTracks : recentTracks;

  const handlePlay = (track: Track) => {
    playTrack(track, filtered.length > 0 ? filtered : [track]);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 mr-80 pb-28">
        {/* Hero banner */}
        <div className="relative h-52 bg-gradient-to-br from-primary/30 via-primary/10 to-background overflow-hidden">
          <div className="absolute inset-0 flex items-center px-8 gap-6">
            <div className="w-28 h-28 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-2xl shadow-primary/20">
              <Music className="w-14 h-14 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">KRX Network</p>
              <h1 className="text-4xl font-black text-foreground mb-2">Музыка</h1>
              <p className="text-muted-foreground">{tracks.length} треков · {likedTracks.length} лайков</p>
              <div className="flex gap-3 mt-4">
                {filtered.length > 0 && (
                  <button onClick={() => handlePlay(filtered[0])}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 hover:scale-[1.02] transition-all active:scale-95">
                    <Play className="w-4 h-4 fill-current" /> Слушать всё
                  </button>
                )}
                <button onClick={() => setShowLib(!showLib)}
                  className={cn("flex items-center gap-2 px-5 py-2.5 rounded-full font-medium border transition-all", showLib ? "bg-primary/10 border-primary text-primary" : "bg-card/60 border-border text-foreground hover:border-primary/40")}>
                  <Library className="w-4 h-4" /> Библиотека
                </button>
                {isAdmin && (
                  <button onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-card/80 text-foreground rounded-full font-medium border border-border hover:border-primary/40 transition-all">
                    <Plus className="w-4 h-4" /> Добавить
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pt-5 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск треков и исполнителей..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
          </div>

          {/* Library panel */}
          {showLib && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex border-b border-border">
                {([
                  { id: "liked" as LibTab, label: "Лайки", icon: Heart, count: likedTracks.length },
                  { id: "saved" as LibTab, label: "Сохранённые", icon: Bookmark, count: savedTracks.length },
                  { id: "recent" as LibTab, label: "Недавние", icon: Clock, count: recentTracks.length },
                ]).map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setLibTab(tab.id)}
                      className={cn("flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-all",
                        libTab === tab.id ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground")}>
                      <Icon className="w-4 h-4" /> {tab.label}
                      {tab.count > 0 && <span className={cn("text-xs px-1.5 py-0.5 rounded-full", libTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>{tab.count}</span>}
                    </button>
                  );
                })}
              </div>
              {libTracks.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  {libTab === "liked" ? "Лайкайте треки — они появятся здесь" : libTab === "saved" ? "Сохраняйте треки для быстрого доступа" : "История прослушиваний появится здесь"}
                </div>
              ) : (
                <div className="p-2">
                  {libTracks.map((track, i) => (
                    <TrackCard key={track.id} track={track} index={i}
                      isActive={currentTrack?.id === track.id}
                      isPlaying={currentTrack?.id === track.id && isPlaying}
                      onPlay={() => handlePlay(track)}
                      queue={libTracks} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-[1.02]",
                  activeCategory === cat.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                )}>
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* Track list header */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground text-lg">
              {CATEGORIES.find(c => c.id === activeCategory)?.label || "Треки"}
              <span className="text-sm font-normal text-muted-foreground ml-2">{filtered.length} треков</span>
            </h2>
            {activeCategory === "popular" && <TrendingUp className="w-5 h-5 text-primary" />}
          </div>

          {/* Tracks */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Disc3 className="w-14 h-14 mx-auto mb-3 opacity-20" />
              <p className="font-semibold text-base">{search ? "Ничего не найдено" : "Треков нет"}</p>
              <p className="text-sm mt-1">{isAdmin && !search ? "Нажмите «Добавить» чтобы загрузить первый трек" : search ? "Попробуйте другой запрос" : "Администратор скоро добавит музыку"}</p>
              {isAdmin && !search && (
                <button onClick={() => setShowAdd(true)} className="mt-5 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all">
                  <Plus className="w-4 h-4 inline mr-2" />Добавить трек
                </button>
              )}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2rem_2.5rem_1fr_auto_auto_auto_5rem] gap-3 px-4 py-2 text-xs text-muted-foreground border-b border-border items-center">
                <span>#</span><span></span><span>Название</span>
                <span className="hidden md:block">Прослушиваний</span>
                <span className="hidden md:block">Лайков</span>
                <span></span>
                <span className="text-right">Длительность</span>
              </div>
              {filtered.map((track, i) => (
                <TrackCard key={track.id} track={track} index={i}
                  isActive={currentTrack?.id === track.id}
                  isPlaying={currentTrack?.id === track.id && isPlaying}
                  onPlay={() => handlePlay(track)}
                  queue={filtered} />
              ))}
            </div>
          )}
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
      {showAdd && <AddTrackModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
