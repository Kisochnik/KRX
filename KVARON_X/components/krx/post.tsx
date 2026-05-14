"use client";

import { useState } from "react";
import { useApp, Post as PostType, PollOption } from "@/context/app-context";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  BadgeCheck, CircleDollarSign, Play, BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин. назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч. назад`;
  return `${Math.floor(h / 24)} д. назад`;
}

function renderTextWithHashtags(text: string) {
  const parts = text.split(/(#[\wа-яёА-ЯЁ]+)/gi);
  return parts.map((part, i) =>
    part.startsWith("#")
      ? <span key={i} className="text-primary font-medium cursor-pointer hover:underline">{part}</span>
      : <span key={i}>{part}</span>
  );
}

interface PostCardProps {
  post: PostType;
}

export function PostCard({ post }: PostCardProps) {
  const { user, toggleLike } = useApp();
  const [savedPoll, setSavedPoll] = useState<PollOption[] | null>(null);
  const [voted, setVoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const isLiked = user ? post.likedBy.includes(user.id) : false;

  const handleVote = (optionId: number) => {
    if (voted) return;
    const opts = (savedPoll || post.poll!.options).map(o =>
      o.id === optionId ? { ...o, votes: o.votes + 1 } : o
    );
    setSavedPoll(opts);
    setVoted(true);
  };

  const pollOptions = savedPoll || post.poll?.options || [];
  const totalVotes = pollOptions.reduce((sum, o) => sum + o.votes, 0);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-border/80 transition-all">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary overflow-hidden flex-shrink-0">
          {post.authorAvatar
            ? <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
                {post.authorName[0]?.toUpperCase()}
              </div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-foreground">{post.authorName}</span>
            <BadgeCheck className="w-4 h-4 text-primary fill-primary/20" />
          </div>
          <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Text */}
      {post.text && (
        <div className="px-4 pb-3 text-sm text-foreground leading-relaxed">
          {renderTextWithHashtags(post.text)}
        </div>
      )}

      {/* Media grid */}
      {post.media.length > 0 && (
        <div className={cn(
          "grid gap-1 mb-1",
          post.media.length === 1 ? "grid-cols-1" :
          post.media.length === 2 ? "grid-cols-2" : "grid-cols-3"
        )}>
          {post.media.map((m, i) => (
            <div key={i} className={cn(
              "relative bg-muted overflow-hidden",
              post.media.length === 1 ? "aspect-video" : "aspect-square"
            )}>
              {m.type === "video" ? (
                <>
                  <video src={m.url} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white ml-1" />
                    </div>
                  </div>
                </>
              ) : (
                <img src={m.url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Poll */}
      {post.poll && (
        <div className="px-4 pb-3">
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <p className="font-medium text-foreground mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              {post.poll.question}
            </p>
            <div className="space-y-2">
              {pollOptions.map(opt => {
                const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleVote(opt.id)}
                    disabled={voted}
                    className={cn(
                      "relative w-full text-left px-4 py-2.5 rounded-lg border overflow-hidden transition-all",
                      voted
                        ? "border-border cursor-default"
                        : "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                    )}
                  >
                    {voted && (
                      <div
                        className="absolute inset-y-0 left-0 bg-primary/15 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between text-sm">
                      <span className="text-foreground">{opt.text}</span>
                      {voted && <span className="text-primary font-semibold">{pct}%</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{totalVotes} голосов</p>
          </div>
        </div>
      )}

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {post.hashtags.map(tag => (
            <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium cursor-pointer hover:bg-primary/20 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => user && toggleLike(post.id)}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-all hover:scale-110 active:scale-95",
              isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
            )}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-red-500")} />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-all hover:scale-110">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-all hover:scale-110">
            <Share2 className="w-5 h-5" />
            <span>{post.shares}</span>
          </button>
        </div>
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={cn("transition-all hover:scale-110 active:scale-95", bookmarked ? "text-primary" : "text-muted-foreground hover:text-primary")}
        >
          <Bookmark className={cn("w-5 h-5", bookmarked && "fill-primary")} />
        </button>
      </div>
    </div>
  );
}
