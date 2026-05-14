"use client";

import { useRef, useState } from "react";
import { useApp, Story } from "@/context/app-context";
import { Plus, X, Play, User, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stories() {
  const { user, stories, addStory, likeStory, isBlocked } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [viewingIdx, setViewingIdx] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = () => addStory({ type: isVideo ? "video" : "image", url: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Filter: active (< 24h) + not from blocked users
  const live = stories.filter(s =>
    Date.now() - s.createdAt < 86400000 && !isBlocked(s.authorId)
  );

  const viewing = viewingIdx !== null ? live[viewingIdx] : null;
  const isLikedByMe = (s: Story) => user ? (s.likedBy || []).includes(user.id) : false;

  const prev = () => setViewingIdx(i => i !== null && i > 0 ? i - 1 : i);
  const next = () => setViewingIdx(i => i !== null && i < live.length - 1 ? i + 1 : i);

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {/* Add story button */}
        <button onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-1.5 flex-shrink-0 group">
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors overflow-hidden">
            {user?.avatar
              ? <img src={user.avatar} alt="my avatar" className="w-full h-full object-cover opacity-60" />
              : <User className="w-6 h-6 text-primary/50" />
            }
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
              <Plus className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">Моя история</span>
        </button>

        {/* Stories — correctly show each story's OWN media */}
        {live.map((story, idx) => (
          <button key={story.id} onClick={() => setViewingIdx(idx)} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className={cn(
              "w-16 h-16 rounded-full p-0.5 overflow-hidden",
              isLikedByMe(story) ? "bg-gradient-to-br from-primary to-primary/50" : "bg-gradient-to-br from-primary via-red-500 to-orange-400"
            )}>
              <div className="w-full h-full rounded-full overflow-hidden bg-muted relative">
                {/* Fix: show the story's media thumbnail, NOT the current user's avatar */}
                {story.media.type === "video" ? (
                  <>
                    <video src={story.media.url} className="w-full h-full object-cover" muted playsInline />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </>
                ) : (
                  <img src={story.media.url} alt={story.authorName} className="w-full h-full object-cover" />
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground truncate w-16 text-center">{story.authorName}</span>
          </button>
        ))}

        {live.length === 0 && (
          <p className="flex items-center text-xs text-muted-foreground py-5 pl-2 italic">
            Историй пока нет — будь первым!
          </p>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />

      {/* Story Viewer Modal */}
      {viewing && viewingIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setViewingIdx(null)}>
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 z-10">
            {live.map((_, i) => (
              <div key={i} className={cn("h-0.5 flex-1 rounded-full", i <= viewingIdx ? "bg-white" : "bg-white/30")} />
            ))}
          </div>

          {/* Author info */}
          <div className="absolute top-8 left-4 flex items-center gap-3 z-10" onClick={e => e.stopPropagation()}>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60">
              {viewing.authorAvatar
                ? <img src={viewing.authorAvatar} alt={viewing.authorName} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-primary/30 flex items-center justify-center text-white text-sm font-bold">
                    {viewing.authorName[0]?.toUpperCase()}
                  </div>
              }
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{viewing.authorName}</p>
              <p className="text-white/60 text-xs">{Math.round((Date.now() - viewing.createdAt) / 60000)} мин. назад</p>
            </div>
          </div>

          {/* Close */}
          <button className="absolute top-8 right-4 z-10 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" onClick={() => setViewingIdx(null)}>
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Media — the story's actual content */}
          <div className="relative max-w-sm w-full max-h-[85vh] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {viewing.media.type === "video" ? (
              <video key={viewing.id} src={viewing.media.url} controls autoPlay playsInline className="w-full h-full object-contain bg-black" />
            ) : (
              <img key={viewing.id} src={viewing.media.url} alt="" className="w-full h-full object-contain" />
            )}

            {/* Like button on story */}
            <button
              onClick={e => { e.stopPropagation(); likeStory(viewing.id); }}
              className={cn(
                "absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-sm transition-all",
                isLikedByMe(viewing) ? "bg-red-500/80 text-white" : "bg-black/40 text-white hover:bg-red-500/60"
              )}
            >
              <Heart className={cn("w-5 h-5", isLikedByMe(viewing) && "fill-white")} />
              <span className="text-sm font-medium">{viewing.likes}</span>
            </button>
          </div>

          {/* Prev / Next navigation */}
          {viewingIdx > 0 && (
            <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={e => { e.stopPropagation(); prev(); }}>
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
          {viewingIdx < live.length - 1 && (
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={e => { e.stopPropagation(); next(); }}>
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
