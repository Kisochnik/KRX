"use client";

import { useRef, useState } from "react";
import { useApp, Story } from "@/context/app-context";
import { Plus, X, Play, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stories() {
  const { user, stories, addStory } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [viewing, setViewing] = useState<Story | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = () => {
      addStory({ type: isVideo ? "video" : "image", url: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Filter out expired stories (>24h)
  const live = stories.filter(s => Date.now() - s.createdAt < 24 * 60 * 60 * 1000);

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Add story */}
        <button
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-2 flex-shrink-0 group"
        >
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors overflow-hidden">
            {user?.avatar
              ? <img src={user.avatar} className="w-full h-full object-cover opacity-60" />
              : <User className="w-6 h-6 text-primary/50" />
            }
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
              <Plus className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">Моя история</span>
        </button>

        {/* Stories list */}
        {live.map(story => (
          <button
            key={story.id}
            onClick={() => setViewing(story)}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full border-2 border-primary p-0.5 overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden relative bg-muted">
                {story.media.type === "video" ? (
                  <video src={story.media.url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={story.media.url} className="w-full h-full object-cover" />
                )}
                {story.media.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground truncate w-16 text-center">
              {story.authorName}
            </span>
          </button>
        ))}

        {live.length === 0 && (
          <div className="flex items-center text-xs text-muted-foreground py-4 pl-2">
            Историй пока нет — будь первым!
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Story viewer modal */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setViewing(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => setViewing(null)}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Author */}
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden border-2 border-primary">
              {viewing.authorAvatar
                ? <img src={viewing.authorAvatar} className="w-full h-full object-cover" />
                : <User className="w-full h-full p-2 text-primary" />
              }
            </div>
            <div>
              <p className="text-white font-medium text-sm">{viewing.authorName}</p>
              <p className="text-white/60 text-xs">
                {Math.round((Date.now() - viewing.createdAt) / 60000)} мин. назад
              </p>
            </div>
          </div>

          <div className="max-w-sm w-full max-h-[80vh] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {viewing.media.type === "video" ? (
              <video src={viewing.media.url} controls autoPlay className="w-full h-full object-contain" />
            ) : (
              <img src={viewing.media.url} className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
