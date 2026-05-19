"use client";

import { useRef, useState } from "react";
import { useApp } from "@/context/app-context";
import {
  Image, Video, BarChart2, Hash, Smile, X, Plus, AlertCircle, User, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MediaItem = { type: "image" | "video" | "gif"; url: string };

const EMOJI_LIST = [
  "😂", "❤️", "🔥", "👍", "😎", "💯", "🎮", "🎵",
  "✨", "🚀", "👀", "💪", "😈", "🏆", "⚔️", "🌟",
];

// Validation: post cannot be only hashtags or emoji — needs real text or media
function validate(text: string, media: MediaItem[], hasPoll: boolean): string {
  const trimmed = text.trim();
  if (!trimmed && media.length === 0 && !hasPoll) {
    return "Добавьте текст, фото или видео";
  }
  if (trimmed && media.length === 0) {
    const noHashtags = trimmed.replace(/#[\wа-яёА-ЯЁ]+/gi, "").trim();
    const noEmoji = noHashtags
      .replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27FF}]/gu, "")
      .trim();
    if (!noEmoji) {
      return "Пост не может состоять только из хэштегов или эмодзи — добавьте текст или медиа";
    }
  }
  return "";
}

function extractHashtags(text: string): string[] {
  return (text.match(/#[\wа-яёА-ЯЁ]+/gi) || []).map((h) => h.toLowerCase());
}

export function CreatePost() {
  const { user, addPost, canPost } = useApp();
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);

  const hasContent = text.trim().length > 0 || media.length > 0;

  // ── Media handlers ─────────────────────────────────────────────────────────

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach((file) => {
      const type = file.type === "image/gif" ? "gif" : "image";
      const reader = new FileReader();
      reader.onload = () =>
        setMedia((prev) => [...prev, { type, url: reader.result as string }]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach((file) => {
      const videoEl = document.createElement("video");
      const url = URL.createObjectURL(file);
      videoEl.src = url;
      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        if (videoEl.duration > 300) {
          showError("Видео не должно быть длиннее 5 минут");
          return;
        }
        const reader = new FileReader();
        reader.onload = () =>
          setMedia((prev) => [...prev, { type: "video", url: reader.result as string }]);
        reader.readAsDataURL(file);
      };
    });
    e.target.value = "";
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 4000);
  };

  // ── Poll ───────────────────────────────────────────────────────────────────

  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions((prev) => [...prev, ""]);
  };
  const removePollOption = (idx: number) => {
    if (pollOptions.length > 2)
      setPollOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    // Anti-spam cooldown
    if (!canPost()) {
      setRateLimited(true);
      setTimeout(() => setRateLimited(false), 5000);
      return;
    }

    const err = validate(text, media, showPoll);
    if (err) { showError(err); return; }

    const poll =
      showPoll && pollQuestion.trim()
        ? {
            question: pollQuestion.trim(),
            options: pollOptions
              .filter((o) => o.trim())
              .map((t, i) => ({ id: i, text: t, votes: 0 })),
          }
        : null;

    if (poll && poll.options.length < 2) {
      showError("Добавьте минимум 2 варианта ответа в опрос");
      return;
    }

    addPost({
      authorId: user!.id,
      authorName: user!.name,
      authorAvatar: user?.avatar || null,
      text: text.trim(),
      media,
      poll,
      hashtags: extractHashtags(text),
    });

    // Reset form
    setText("");
    setMedia([]);
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowEmoji(false);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex gap-3">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-primary" />
          )}
        </div>

        <div className="flex-1">
          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Что нового, ${user?.name ?? ""}? Используй #хештег`}
            rows={3}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-sm leading-relaxed"
          />

          {/* Hashtag preview chips */}
          {extractHashtags(text).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {extractHashtags(text).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Media previews */}
          {media.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {media.map((m, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden w-24 h-24 bg-muted border border-border"
                >
                  {m.type === "video" ? (
                    <video src={m.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={m.url} className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={() => setMedia((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Poll builder */}
          {showPoll && (
            <div className="mb-3 p-3 bg-muted/50 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-primary" /> Опрос
                </p>
                <button
                  onClick={() => setShowPoll(false)}
                  className="p-1 hover:bg-muted rounded-lg"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <input
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Вопрос опроса..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary mb-2"
              />
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={opt}
                    onChange={(e) =>
                      setPollOptions((prev) =>
                        prev.map((o, j) => (j === i ? e.target.value : o))
                      )
                    }
                    placeholder={`Вариант ${i + 1}`}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      onClick={() => removePollOption(i)}
                      className="p-2 hover:bg-muted rounded-lg"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button
                  onClick={addPollOption}
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-1"
                >
                  <Plus className="w-4 h-4" /> Добавить вариант
                </button>
              )}
            </div>
          )}

          {/* Emoji picker — only available if post has content */}
          {showEmoji && hasContent && (
            <div className="mb-3 p-3 bg-muted/50 rounded-xl border border-border">
              <div className="flex flex-wrap gap-2">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setText((prev) => prev + emoji);
                      setShowEmoji(false);
                    }}
                    className="text-xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Anti-spam cooldown notice */}
          {rateLimited && (
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-3 text-sm text-yellow-600 dark:text-yellow-400">
              <Clock className="w-4 h-4 shrink-0" />
              Подождите перед следующей публикацией
            </div>
          )}

          {/* Validation error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl mb-3 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex gap-1">

              {/* Photo / GIF */}
              <button
                onClick={() => imageRef.current?.click()}
                title="Фото / GIF"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Image className="w-5 h-5" />
              </button>

              {/* Video */}
              <button
                onClick={() => videoRef.current?.click()}
                title="Видео (до 5 мин)"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Video className="w-5 h-5" />
              </button>

              {/* Poll */}
              <button
                onClick={() => setShowPoll(!showPoll)}
                title="Опрос"
                className={cn(
                  "p-2 rounded-lg transition-all",
                  showPoll
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                )}
              >
                <BarChart2 className="w-5 h-5" />
              </button>

              {/* Hashtag quick insert */}
              <button
                onClick={() => setText((prev) => prev + " #")}
                title="Хэштег"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Hash className="w-5 h-5" />
              </button>

              {/* Emoji — only enabled if content exists */}
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                title={!hasContent ? "Сначала добавьте текст или медиа" : "Эмодзи"}
                disabled={!hasContent}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  !hasContent
                    ? "text-muted-foreground/30 cursor-not-allowed"
                    : showEmoji
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                )}
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
            >
              Опубликовать
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageRef}
        type="file"
        accept="image/*,.gif"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={handleVideoChange}
      />
    </div>
  );
}
