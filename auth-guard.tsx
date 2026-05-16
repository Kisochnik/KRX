"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/app-context";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, Bookmark, Shuffle, Repeat, X, Music2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const {
    playerVisible, hidePlayer,
    isPlaying, togglePlay,
    currentTrack, nextTrack, prevTrack,
    progress, setProgress,
    volume, setVolume,
    shuffle, setShuffle,
    repeat, setRepeat,
    likeTrack, saveTrack,
    user, tracks,
    likedTracks, savedTracks,
  } = useApp();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Sync audio element with currentTrack
  useEffect(() => {
    if (!audioRef.current) return;
    if (currentTrack?.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      if (isPlaying) audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, [currentTrack]);

  // Play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && currentTrack?.audioUrl) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Progress sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      if (!dragging && audio.duration) {
        const p = (audio.currentTime / audio.duration) * 100;
        setLocalProgress(p);
      }
    };
    const onEnd = () => {
      if (repeat && audio.duration) { audio.currentTime = 0; audio.play(); }
      else nextTrack();
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => { audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("ended", onEnd); };
  }, [dragging, repeat]);

  const seekTo = (pct: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) audio.currentTime = (pct / 100) * audio.duration;
    setLocalProgress(pct);
  };

  const formatTime = (pct: number, duration?: string) => {
    if (!duration) return "0:00";
    const parts = duration.split(":").map(Number);
    const total = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
    const current = Math.floor((pct / 100) * total);
    return `${Math.floor(current / 60)}:${String(current % 60).padStart(2, "0")}`;
  };

  // Hide if no track and not playing
  if (!playerVisible || !currentTrack) return (
    <>
      <audio ref={audioRef} />
    </>
  );

  const isLiked = user ? likedTracks.some(t => t.id === currentTrack.id) : false;
  const isSaved = user ? savedTracks.some(t => t.id === currentTrack.id) : false;

  return (
    <>
      <audio ref={audioRef} />
      <div className="fixed bottom-0 left-64 right-80 bg-card/98 backdrop-blur-xl border-t border-border z-40 select-none">
        {/* Progress bar — full width top */}
        <div className="w-full h-1 bg-muted cursor-pointer group relative"
          onClick={e => { const rect = e.currentTarget.getBoundingClientRect(); seekTo(((e.clientX - rect.left) / rect.width) * 100); }}>
          <div className="h-full bg-primary rounded-full transition-all group-hover:bg-primary/80"
            style={{ width: `${localProgress}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${localProgress}% - 6px)` }} />
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0 w-64 flex-shrink-0">
            <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
              {currentTrack.cover
                ? <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
                : <Music2 className="w-5 h-5 text-primary" />
              }
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => likeTrack(currentTrack.id)}
                className={cn("p-1.5 rounded-lg transition-all hover:scale-110", isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500")}>
                <Heart className={cn("w-4 h-4", isLiked && "fill-red-500")} />
              </button>
              <button onClick={() => saveTrack(currentTrack.id)}
                className={cn("p-1.5 rounded-lg transition-all hover:scale-110", isSaved ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                <Bookmark className={cn("w-4 h-4", isSaved && "fill-primary")} />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <button onClick={() => setShuffle(!shuffle)}
                className={cn("p-1.5 rounded-lg transition-all hover:scale-110", shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                <Shuffle className="w-4 h-4" />
              </button>
              <button onClick={prevTrack} className="p-1.5 text-muted-foreground hover:text-foreground transition-all hover:scale-110">
                <SkipBack className="w-5 h-5" />
              </button>
              <button onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-1.5 text-muted-foreground hover:text-foreground transition-all hover:scale-110">
                <SkipForward className="w-5 h-5" />
              </button>
              <button onClick={() => setRepeat(!repeat)}
                className={cn("p-1.5 rounded-lg transition-all hover:scale-110", repeat ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                <Repeat className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground w-full max-w-sm">
              <span className="w-8 text-right">{formatTime(localProgress, currentTrack.duration)}</span>
              <div className="flex-1 h-1 bg-muted rounded-full" />
              <span className="w-8">{currentTrack.duration || "0:00"}</span>
            </div>
          </div>

          {/* Volume + close */}
          <div className="flex items-center gap-3 flex-shrink-0 w-48">
            <button onClick={() => setVolume(volume === 0 ? 70 : 0)}
              className="text-muted-foreground hover:text-foreground transition-all">
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input type="range" min={0} max={100} value={volume}
              onChange={e => setVolume(+e.target.value)}
              className="w-24 h-1 accent-primary cursor-pointer" />
            {/* Close button */}
            <button onClick={hidePlayer}
              title="Закрыть плеер"
              className="ml-2 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all hover:scale-110">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
