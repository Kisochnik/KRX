"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/app-context";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, Bookmark, Shuffle, Repeat, X, Music2, Flag,
  ListMusic, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const {
    playerVisible, hidePlayer,
    isPlaying, togglePlay,
    currentTrack, nextTrack, prevTrack,
    volume, setVolume,
    shuffle, setShuffle,
    repeat, setRepeat,
    likeTrack, saveTrack,
    removeFromQueue,
    reportTrack,
    user, queue,
    likedTracks, savedTracks,
  } = useApp();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [reportingId, setReportingId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("");

  // Sync audio src when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrack?.audioUrl) {
      audio.src = currentTrack.audioUrl;
      if (isPlaying) audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.src = "";
    }
  }, [currentTrack]);

  // Play / pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && currentTrack?.audioUrl) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Progress sync + auto-next
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (!dragging && audio.duration) {
        setLocalProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onEnd = () => {
      if (repeat && audio.duration) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [dragging, repeat]);

  const seekTo = (pct: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) audio.currentTime = (pct / 100) * audio.duration;
    setLocalProgress(pct);
  };

  const formatTime = (pct: number, duration?: string): string => {
    if (!duration) return "0:00";
    const parts = duration.split(":").map(Number);
    const total = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
    const current = Math.floor((pct / 100) * total);
    return `${Math.floor(current / 60)}:${String(current % 60).padStart(2, "0")}`;
  };

  // Always render hidden audio element
  if (!playerVisible || !currentTrack) {
    return <audio ref={audioRef} />;
  }

  const isLiked = user ? likedTracks.some((t) => t.id === currentTrack.id) : false;
  const isSaved = user ? savedTracks.some((t) => t.id === currentTrack.id) : false;

  const handleReport = () => {
    if (!reportReason.trim()) return;
    reportTrack?.(currentTrack.id, reportReason.trim());
    setReportingId(null);
    setReportReason("");
  };

  return (
    <>
      <audio ref={audioRef} />

      {/* ── Report modal ── */}
      {reportingId !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setReportingId(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl w-full max-w-sm p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
              <Flag className="w-4 h-4 text-destructive" /> Пожаловаться на трек
            </h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Укажите причину жалобы..."
              rows={3}
              className="w-full px-3 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setReportingId(null)}
                className="flex-1 py-2 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim()}
                className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:bg-destructive/90 transition-all disabled:opacity-40"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Queue panel ── */}
      {showQueue && (
        <div className="fixed bottom-[72px] right-80 w-72 bg-card border border-border rounded-2xl shadow-2xl z-40 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="font-semibold text-foreground text-sm flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-primary" /> Очередь
              <span className="text-xs text-muted-foreground ml-1">({queue?.length ?? 0})</span>
            </p>
            <button onClick={() => setShowQueue(false)}>
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-border">
            {!queue || queue.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">Очередь пуста</p>
            ) : (
              queue.map((t, i) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 group">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {t.cover ? (
                      <img src={t.cover} alt={t.title} className="w-full h-full object-cover" />
                    ) : (
                      <Music2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{t.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{t.artist}</p>
                  </div>
                  <button
                    onClick={() => removeFromQueue?.(i)}
                    className="p-1 rounded-lg hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                    title="Убрать из очереди"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Player bar ── */}
      <div className="fixed bottom-0 left-64 right-80 bg-card/98 backdrop-blur-xl border-t border-border z-40 select-none">

        {/* Progress bar */}
        <div
          className="w-full h-1 bg-muted cursor-pointer group relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            seekTo(((e.clientX - rect.left) / rect.width) * 100);
          }}
        >
          <div
            className="h-full bg-primary rounded-full transition-[width] duration-100 group-hover:bg-primary/80"
            style={{ width: `${localProgress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `calc(${localProgress}% - 6px)` }}
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-3">

          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0 w-64 flex-shrink-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
              {currentTrack.cover ? (
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
              ) : (
                <Music2 className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={() => likeTrack(currentTrack.id)}
                className={cn(
                  "p-1.5 rounded-lg transition-all hover:scale-110",
                  isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                )}
                title="Лайк"
              >
                <Heart className={cn("w-4 h-4", isLiked && "fill-red-500")} />
              </button>
              <button
                onClick={() => saveTrack(currentTrack.id)}
                className={cn(
                  "p-1.5 rounded-lg transition-all hover:scale-110",
                  isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
                title="В библиотеку"
              >
                <Bookmark className={cn("w-4 h-4", isSaved && "fill-primary")} />
              </button>
              <button
                onClick={() => setReportingId(currentTrack.id)}
                className="p-1.5 rounded-lg transition-all hover:scale-110 text-muted-foreground hover:text-destructive"
                title="Пожаловаться"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={cn(
                  "p-1.5 rounded-lg transition-all hover:scale-110",
                  shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                title="Перемешать"
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                onClick={prevTrack}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                title="Предыдущий"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                onClick={nextTrack}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                title="Следующий"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={() => setRepeat(!repeat)}
                className={cn(
                  "p-1.5 rounded-lg transition-all hover:scale-110",
                  repeat ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                title="Повторять"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
            {/* Time */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground w-full max-w-sm">
              <span className="w-8 text-right tabular-nums">
                {formatTime(localProgress, currentTrack.duration)}
              </span>
              <div className="flex-1 h-0.5 bg-muted rounded-full" />
              <span className="w-8 tabular-nums">{currentTrack.duration || "0:00"}</span>
            </div>
          </div>

          {/* Volume + queue + close */}
          <div className="flex items-center gap-2 flex-shrink-0 w-52 justify-end">
            {/* Queue */}
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={cn(
                "p-1.5 rounded-lg transition-all hover:scale-110",
                showQueue ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              title="Очередь"
            >
              <ListMusic className="w-4 h-4" />
            </button>

            {/* Mute toggle */}
            <button
              onClick={() => setVolume(volume === 0 ? 70 : 0)}
              className="text-muted-foreground hover:text-foreground transition-all"
              title={volume === 0 ? "Включить звук" : "Выключить звук"}
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(+e.target.value)}
              className="w-20 h-1 accent-primary cursor-pointer"
            />

            {/* Close */}
            <button
              onClick={hidePlayer}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all hover:scale-110"
              title="Закрыть плеер"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
