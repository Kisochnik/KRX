"use client";

import { useState } from "react";
import { useApp, Post as PostType, PollOption } from "@/context/app-context";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  BadgeCheck, Play, BarChart2, X, Send, User,
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

export function PostCard({ post }: { post: PostType }) {
  const { user, toggleLike, addComment, sharePost, isBlocked } = useApp();
  const [pollVotes, setPollVotes] = useState<PollOption[] | null>(null);
  const [voted, setVoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [shareToast, setShareToast] = useState(false);

  // Skip posts from blocked users
  if (isBlocked(post.authorId)) return null;

  const isLiked = user ? post.likedBy.includes(user.id) : false;
  const isShared = user ? (post.sharedBy || []).includes(user.id) : false;

  const handleVote = (optionId: number) => {
    if (voted) return;
    const opts = (pollVotes || post.poll!.options).map(o =>
      o.id === optionId ? { ...o, votes: o.votes + 1 } : o
    );
    setPollVotes(opts);
    setVoted(true);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText("");
  };

  const handleShare = () => {
    sharePost(post.id);
    setShareToast(true);
    if (navigator.share) {
      navigator.share({ title: `Пост от @${post.authorName}`, text: post.text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
    setTimeout(() => setShareToast(false), 2000);
  };

  const displayPoll = pollVotes || post.poll?.options || [];
  const totalVotes = displayPoll.reduce((s, o) => s + o.votes, 0);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden transition-all hover:border-border/60">
      {/* Shared indicator */}
      {isShared && (
        <div className="px-4 pt-3 pb-0 flex items-center gap-2 text-xs text-muted-foreground">
          <Share2 className="w-3.5 h-3.5" /> Вы поделились
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary overflow-hidden flex-shrink-0">
          {post.authorAvatar
            ? <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm bg-primary/10">
                {post.authorName[0]?.toUpperCase()}
              </div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-foreground text-sm">{post.authorName}</span>
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

      {/* Media */}
      {post.media.length > 0 && (
        <div className={cn("grid gap-0.5", post.media.length === 1 ? "grid-cols-1" : post.media.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
          {post.media.map((m, i) => (
            <div key={i} className={cn("relative bg-muted overflow-hidden", post.media.length === 1 ? "aspect-video" : "aspect-square")}>
              {m.type === "video" ? (
                <>
                  <video src={m.url} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
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
        <div className="px-4 py-3">
          <div className="bg-muted/40 rounded-xl p-4 border border-border">
            <p className="font-medium text-foreground mb-3 flex items-center gap-2 text-sm">
              <BarChart2 className="w-4 h-4 text-primary" /> {post.poll.question}
            </p>
            <div className="space-y-2">
              {displayPoll.map(opt => {
                const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                return (
                  <button key={opt.id} onClick={() => handleVote(opt.id)} disabled={voted}
                    className={cn("relative w-full text-left px-4 py-2.5 rounded-lg border overflow-hidden transition-all text-sm",
                      voted ? "border-border cursor-default" : "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer")}>
                    {voted && <div className="absolute inset-y-0 left-0 bg-primary/15 transition-all duration-700" style={{ width: `${pct}%` }} />}
                    <div className="relative flex items-center justify-between">
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
        <div className="flex items-center gap-1">
          {/* Like */}
          <button onClick={() => user && toggleLike(post.id)}
            className={cn("flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95",
              isLiked ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10")}>
            <Heart className={cn("w-4 h-4", isLiked && "fill-red-500")} />
            <span className="font-medium">{post.likes}</span>
          </button>

          {/* Comment */}
          <button onClick={() => setShowComments(!showComments)}
            className={cn("flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all hover:scale-105",
              showComments ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10")}>
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">{post.comments}</span>
          </button>

          {/* Share */}
          <button onClick={handleShare}
            className={cn("flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all hover:scale-105",
              shareToast ? "text-green-500 bg-green-500/10" : isShared ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10")}>
            <Share2 className="w-4 h-4" />
            <span className="font-medium">{shareToast ? "✓" : post.shares}</span>
          </button>
        </div>

        <button onClick={() => setBookmarked(!bookmarked)}
          className={cn("p-1.5 rounded-lg transition-all hover:scale-110", bookmarked ? "text-primary" : "text-muted-foreground hover:text-primary")}>
          <Bookmark className={cn("w-4 h-4", bookmarked && "fill-primary")} />
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-border bg-muted/20">
          {/* Existing comments */}
          {(post.commentList || []).length > 0 && (
            <div className="px-4 py-3 space-y-3 max-h-48 overflow-y-auto">
              {(post.commentList || []).map(c => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {c.authorAvatar
                      ? <img src={c.authorAvatar} className="w-full h-full object-cover" />
                      : <User className="w-3.5 h-3.5 text-primary" />
                    }
                  </div>
                  <div className="flex-1 bg-card rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold text-foreground mb-0.5">{c.authorName}</p>
                    <p className="text-xs text-foreground/80">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment input */}
          <div className="flex gap-2 px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-primary/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {user?.avatar
                ? <img src={user.avatar} className="w-full h-full object-cover" />
                : <User className="w-3.5 h-3.5 text-primary" />
              }
            </div>
            <div className="flex-1 flex gap-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleComment()}
                placeholder="Написать комментарий..."
                className="flex-1 text-sm px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button onClick={handleComment} disabled={!commentText.trim()}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
