"use client";

import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/app-context";

export function MusicPlayer() {
  const { playerVisible, currentTrack } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(70);

  if (!playerVisible) return null;

  return (
    <div className="fixed bottom-0 left-64 right-80 bg-card/95 backdrop-blur-xl border-t border-border p-3 z-40">
      <div className="flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0 w-56">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-primary">K</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {currentTrack?.title || "Ничего не играет"}
            </p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack?.artist || "—"}</p>
          </div>
          <button onClick={() => setIsLiked(!isLiked)} className={cn("p-1.5 rounded-lg transition-all hover:scale-110", isLiked ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            <Heart className={cn("w-4 h-4", isLiked && "fill-primary")} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-3">
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-all hover:scale-110">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/30">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-all hover:scale-110">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full max-w-sm flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-8">0:00</span>
            <div className="flex-1 h-1 bg-muted rounded-full cursor-pointer">
              <div className="h-full bg-primary rounded-full w-0" />
            </div>
            <span className="text-xs text-muted-foreground w-8">{currentTrack?.duration || "0:00"}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 flex-shrink-0 w-32">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(+e.target.value)}
            className="w-full h-1 accent-primary cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
