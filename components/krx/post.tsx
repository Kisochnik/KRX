"use client";

import { useState } from "react";
import { useApp, Post as PostType, PollOption } from "@/context/app-context";
import {
  Heart, MessageCircle, Share2, MoreHorizontal, ShieldCheck,
  Play, BarChart2, Send, User, Trash2, Pencil, Flag, Bookmark,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Helpers ────────────────────────────────────────────────────────────────────

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
  return text.split(/(#[\wа-яёА-ЯЁ]+)/gi).map((part, i) =>
    part.startsWith("#") ? (
      <span key={i} className="text-primary font-medium cursor-pointer hover:underline">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// ── Verified badge ─────────────────────────────────────────────────────────────

export function VerifiedBadge() {
  return (
    <ShieldCheck
      className="w-4 h-4 text-primary fill-primary/20 flex-shrink-0"
      title="Администратор"
    />
  );
}

// ── Report modal ───────────────────────────────────────────────────────────────

function ReportModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-sm p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Flag className="w-4 h-4 text-destructive" /> Пожаловаться
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Жалоба будет отправлена администрации. Автор публикации не увидит, кто пожаловался.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Опишите причину жалобы..."
          rows={3}
          className="w-full px-3 py-2 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-all"
          >
            Отмена
          </button>
          <button
            onClick={() => { if (reason.trim()) { onSubmit(reason.trim()); onClose(); } }}
            disabled={!reason.trim()}
            className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:bg-destructive/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Post header ────────────────────────────────────────────────────────────────

function PostHeader({
  post,
  isAuthor,
  isAdmin,
  onDelete,
  onEdit,
  onReport,
}: {
  post: PostType;
  isAuthor: boolean;
  isAdmin: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onReport: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-start gap-3 p-4 pb-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary overflow-hidden flex-shrink-0">
        {post.authorAvatar ? (
          <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm bg-primary/10">
            {post.authorName[0]?.toUpperCase()}
          </div>
        )}
      </div>

      {/* Name & time */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-foreground text-sm">{post.authorName}</span>
          <VerifiedBadge />
        </div>
        <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
      </div>

      {/* 3-dots menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden min-w-[160px]">
              {(isAuthor || isAdmin) && (
                <>
                  <button
                    onClick={() => { onEdit(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Pencil className="w-4 h-4" /> Изменить
                  </button>
                  <button
                    onClick={() => { onDelete(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Удалить
                  </button>
                </>
              )}
              {!isAuthor && (
                <button
                  onClick={() => { onReport(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Flag className="w-4 h-4" /> Пожаловаться
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main PostCard ──────────────────────────────────────────────────────────────

export function PostCard({ post }: { post: PostType }) {
  const { user, toggleLike, addComment, sharePost, isBlocked, reportPost } = useApp();

  const [pollVotes, setPollVotes] = useState<PollOption[] | null>(null);
  const [voted, setVoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [shareToast, setShareToast] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(post.text);

  // Don't show posts from blocked users
  if (isBlocked(post.authorId)) return null;

  const isAuthor = user?.id === post.authorId;
  const isAdmin = user?.isAdmin ?? false;
  const isLiked = user ? post.likedBy.includes(user.id) : false;
  const isShared = user ? (post.sharedBy || []).includes(user.id) : false;

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleDelete = () => {
    const stored = JSON.parse(localStorage.getItem("krx_posts") || "[]");
    const updated = stored.filter((p: { id: number }) => p.id !== post.id);
    localStorage.setItem("krx_posts", JSON.stringify(updated));
    window.location.reload();
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditText(post.text);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    const stored = JSON.parse(localStorage.getItem("krx_posts") || "[]");
    const updated = stored.map((p: PostType) =>
      p.id === post.id ? { ...p, text: editText.trim() } : p
    );
    localStorage.setItem("krx_posts", JSON.stringify(updated));
    setEditMode(false);
    window.location.reload();
  };

  const handleVote = (optionId: number) => {
    if (voted) return;
    const opts = (pollVotes || post.poll!.options).map((o) =>
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

  const handleReport = (reason: string) => {
    reportPost?.(post.id, reason);
  };

  const displayPoll = pollVotes || post.poll?.options || [];
  const totalVotes = displayPoll.reduce((s, o) => s + o.votes, 0);

  return (
    <>
      {showReport && (
        <ReportModal onClose={() => setShowReport(false)} onSubmit={handleReport} />
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden transition-all hover:border-border/60">

        {/* Shared indicator */}
        {isShared && (
          <div className="px-4 pt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Share2 className="w-3.5 h-3.5" /> Вы поделились
          </div>
        )}

        {/* Header */}
        <PostHeader
          post={post}
          isAuthor={isAuthor}
          isAdmin={isAdmin}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onReport={() => setShowReport(true)}
        />

        {/* Text / Edit mode */}
        {editMode ? (
          <div className="px-4 pb-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:border-primary"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 py-1.5 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editText.trim()}
                className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-40"
              >
                Сохранить
              </button>
            </div>
          </div>
        ) : (
          post.text && (
            <div className="px-4 pb-3 text-sm text-foreground leading-relaxed">
              {renderTextWithHashtags(post.text)}
            </div>
          )
        )}

        {/* Media */}
        {post.media.length > 0 && (
          <div
            className={cn(
              "grid gap-0.5",
              post.media.length === 1 ? "grid-cols-1" : post.media.length === 2 ? "grid-cols-2" : "grid-cols-3"
            )}
          >
            {post.media.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "relative bg-muted overflow-hidden",
                  post.media.length === 1 ? "aspect-video" : "aspect-square"
                )}
              >
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
                <BarChart2 className="w-4 h-4 text-primary" />
                {post.poll.question}
              </p>
              <div className="space-y-2">
                {displayPoll.map((opt) => {
                  const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleVote(opt.id)}
                      disabled={voted}
                      className={cn(
                        "relative w-full text-left px-4 py-2.5 rounded-lg border overflow-hidden transition-all text-sm",
                        voted
                          ? "border-border cursor-default"
                          : "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                      )}
                    >
                      {voted && (
                        <div
                          className="absolute inset-y-0 left-0 bg-primary/15 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      )}
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
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium cursor-pointer hover:bg-primary/20 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center gap-1">

            {/* Like */}
            <button
              onClick={() => user && toggleLike(post.id)}
              className={cn(
                "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95",
                isLiked
                  ? "text-red-500 bg-red-500/10"
                  : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
              )}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-red-500")} />
              <span className="font-medium">{post.likes}</span>
            </button>

            {/* Comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={cn(
                "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all hover:scale-105",
                showComments
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">{post.comments}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className={cn(
                "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all hover:scale-105",
                shareToast
                  ? "text-green-500 bg-green-500/10"
                  : isShared
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
            >
              <Share2 className="w-4 h-4" />
              <span className="font-medium">{shareToast ? "✓" : post.shares}</span>
            </button>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={cn(
              "p-1.5 rounded-lg transition-all hover:scale-110",
              bookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Bookmark className={cn("w-4 h-4", bookmarked && "fill-primary")} />
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="border-t border-border bg-muted/20">
            {(post.commentList || []).length > 0 && (
              <div className="px-4 py-3 space-y-3 max-h-52 overflow-y-auto">
                {(post.commentList || []).map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {c.authorAvatar ? (
                        <img src={c.authorAvatar} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 bg-card rounded-xl px-3 py-2">
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
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  placeholder="Написать комментарий..."
                  className="flex-1 text-sm px-3 py-2 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
