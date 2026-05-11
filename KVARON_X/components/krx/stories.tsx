"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const stories = [
  { id: 1, name: "Твоя история", isOwn: true, hasStory: false },
  { id: 2, name: "Baron", hasStory: true, isOnline: true },
  { id: 3, name: "Alex_Pro", hasStory: true, isOnline: true },
  { id: 4, name: "GameMaster", hasStory: true, isOnline: false },
  { id: 5, name: "MusicLover", hasStory: true, isOnline: true },
  { id: 6, name: "ProGamer", hasStory: true, isOnline: false },
  { id: 7, name: "DarkKnight", hasStory: true, isOnline: true },
  { id: 8, name: "Phoenix", hasStory: true, isOnline: false },
];

export function Stories() {
  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {stories.map((story) => (
          <button
            key={story.id}
            className="flex flex-col items-center gap-2 min-w-[72px] group"
          >
            <div
              className={cn(
                "relative w-16 h-16 rounded-full p-[2px] transition-all duration-300",
                "hover:scale-110 active:scale-95",
                story.isOwn
                  ? "bg-muted"
                  : story.hasStory
                    ? "bg-gradient-to-tr from-primary via-red-500 to-primary"
                    : "bg-border"
              )}
            >
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                {story.isOwn ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {story.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              {story.isOnline && !story.isOwn && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
              )}
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[72px] group-hover:text-foreground transition-colors">
              {story.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
