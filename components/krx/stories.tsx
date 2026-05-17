"use client";

import { useRef, useState } from "react";
import { useApp, Story } from "@/context/app-context";
import { Plus, X, Play, User, Heart, ChevronLeft, ChevronRight, Music, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

// Built-in music options for stories
const MUSIC_OPTIONS = [
  { title: "Neon Dreams", artist: "KRX Beats" },
  { title: "Dark Wave", artist: "Synthwave Pro" },
  { title: "Game Over", artist: "8-Bit Master" },
  { title: "Midnight Run", artist: "Lo-Fi Collective" },
  { title: "Rise Up", artist: "Epic Studio" },
  { title: "Pixel Heart", artist: "RetroVibes" },
];

type UploadStep = "idle" | "preview" | "music";

export function Stories() {
  const { user, stories, addStory, deleteStory, likeStory, isBlocked, tracks } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [viewingIdx, setViewingIdx] = useState<number | null>(null);

  // Upload flow state
  const [step, setStep] = useState<UploadStep>("idle");
  const [pendingFile, setPendingFile] = useState<{ type: "image" | "video"; url: string } | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<{ title: string; artist: string } | null>(null);

  // All available music = built-in + admin-added tracks
  const allMusic = [
    ...MUSIC_OPTIONS,
    ...tracks.map(t => ({ title: t.title, artist: t.artist })),
  ];

  // Live stories: < 24h, not blocked
  const live = stories.filter(s =>
    Date.now() - s.createdAt < 86400000 && !isBlocked(s.authorId)
  );

  const myStories = live.filter(s => s.authorId === user?.id);
  const isLikedByMe = (s: Story) => user ? (s.likedBy || []).includes(user.id) : false;

  const viewing = viewingIdx !== null ? live[viewingIdx] : null;

  // Step 1: file chosen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = () => {
      setPendingFile({ type: isVideo ? "video" : "image", url: reader.result as string });
      setStep("preview");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Step 2: publish
  const handlePublish = () => {
    if (!pendingFile) return;
    addStory(pendingFile, selectedMusic);
    setPendingFile(null);
    setSelectedMusic(null);
    setStep("idle");
  };

  const handleCancel = () => {
    setPendingFile(null);
    setSelectedMusic(null);
    setStep("idle");
  };

  const prev = () => setViewingIdx(i => i !== null && i > 0 ? i - 1 : i);
  const next = () => setViewingIdx(i => i !== null && i < live.length - 1 ? i + 1 : i);

  return (
    <>
      {/* ── Story row ── */}
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>

        {/* My story button — clean + icon, NO avatar */}
        <button
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
        >
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-primary/60 flex items-center justify-center bg-card group-hover:bg-primary/10 group-hover:border-primary transition-all">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
              <Plus className="w-6 h-6 text-primary" />
            </div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">Моя история</span>
        </button>

        {/* Stories */}
        {live.map((story, idx) => {
          const isOwn = story.authorId === user?.id;
          return (
            <div key={story.id} className="relative flex flex-col items-center gap-1.5 flex-shrink-0">
              <button onClick={() => setViewingIdx(idx)}>
                <div className={cn(
                  "w-16 h-16 rounded-full p-0.5",
                  isLikedByMe(story)
                    ? "bg-gradient-to-br from-primary to-primary/40"
                    : "bg-gradient-to-br from-red-500 via-primary to-orange-400"
                )}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-muted relative">
                    {story.media.type === "video" ? (
                      <>
                        <video src={story.media.url} className="w-full h-full object-cover" muted playsInline />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </>
                    ) : (
                      <img src={story.media.url} alt={story.authorName} className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              </button>

              {/* Delete button for own stories */}
              {isOwn && (
                <button
                  onClick={() => deleteStory(story.id)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  title="Удалить историю"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}

              <span className="text-xs text-muted-foreground truncate w-16 text-center">
                {isOwn ? "Моя" : story.authorName}
              </span>
            </div>
          );
        })}

        {live.length === 0 && (
          <p className="flex items-center text-xs text-muted-foreground py-5 pl-2 italic">
            Историй пока нет — будь первым!
          </p>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />

      {/* ── Upload flow modal: Step "preview" ── */}
      {step !== "idle" && pendingFile && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={handleCancel}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-sm overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Preview */}
            <div className="relative aspect-[9/16] max-h-[55vh] bg-black overflow-hidden">
              {pendingFile.type === "video"
                ? <video src={pendingFile.url} className="w-full h-full object-contain" muted autoPlay loop playsInline />
                : <img src={pendingFile.url} className="w-full h-full object-contain" />
              }
              {selectedMusic && (
                <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                  <Music className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-white text-xs font-medium truncate">{selectedMusic.title}</p>
                    <p className="text-white/60 text-xs truncate">{selectedMusic.artist}</p>
                  </div>
                  <button onClick={() => setSelectedMusic(null)} className="ml-auto text-white/60 hover:text-white flex-shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Music picker */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Выбрать музыку</span>
                {selectedMusic && <span className="ml-auto text-xs text-primary">✓ выбрано</span>}
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {allMusic.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMusic(selectedMusic?.title === m.title ? null : m)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all",
                      selectedMusic?.title === m.title
                        ? "bg-primary/15 border border-primary/40"
                        : "bg-muted/50 hover:bg-muted border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                      selectedMusic?.title === m.title ? "bg-primary" : "bg-primary/20"
                    )}>
                      <Music className={cn("w-3.5 h-3.5", selectedMusic?.title === m.title ? "text-primary-foreground" : "text-primary")} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.artist}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={handleCancel} className="flex-1 py-2.5 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-all">
                  Отмена
                </button>
                <button onClick={handlePublish} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                  Опубликовать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Story viewer modal ── */}
      {viewing && viewingIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setViewingIdx(null)}>
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 flex gap-1 px-4 pt-3 z-10">
            {live.map((_, i) => (
              <div key={i} className={cn("h-0.5 flex-1 rounded-full", i <= viewingIdx ? "bg-white" : "bg-white/30")} />
            ))}
          </div>

          {/* Author */}
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

          {/* Delete own story from viewer */}
          {viewing.authorId === user?.id && (
            <button
              onClick={e => { e.stopPropagation(); deleteStory(viewing.id); setViewingIdx(null); }}
              className="absolute top-8 right-16 z-10 p-2 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
              title="Удалить историю"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          )}

          {/* Media */}
          <div className="relative max-w-sm w-full max-h-[85vh] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {viewing.media.type === "video"
              ? <video key={viewing.id} src={viewing.media.url} controls autoPlay playsInline className="w-full h-full object-contain bg-black" />
              : <img key={viewing.id} src={viewing.media.url} alt="" className="w-full h-full object-contain" />
            }

            {/* Music label in viewer */}
            {viewing.music && (
              <div className="absolute bottom-14 left-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                <Music className="w-4 h-4 text-primary flex-shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium truncate">{viewing.music.title}</p>
                  <p className="text-white/60 text-xs">{viewing.music.artist}</p>
                </div>
              </div>
            )}

            {/* Like button */}
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

          {/* Prev / Next */}
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
