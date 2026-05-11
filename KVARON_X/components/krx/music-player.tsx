"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(35);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-3 z-40 lg:left-64 lg:right-80">
      <div className="flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-primary">K</span>
          </div>
          <div className="min-w-0 hidden sm:block">
            <p className="text-sm font-medium text-foreground truncate">
              Neon Dreams
            </p>
            <p className="text-xs text-muted-foreground truncate">KRX Music</p>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "p-1.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block",
              isLiked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-primary")} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block">
              <Shuffle className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-primary/30"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95">
              <SkipForward className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95 hidden sm:block">
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground w-8 text-right hidden sm:block">
              1:23
            </span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden group cursor-pointer">
              <div
                className="h-full bg-primary rounded-full relative"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 hidden sm:block">3:45</span>
          </div>
        </div>

        {/* Volume */}
        <div className="items-center gap-2 w-28 hidden md:flex flex-shrink-0">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden cursor-pointer">
            <div className="h-full w-2/3 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
