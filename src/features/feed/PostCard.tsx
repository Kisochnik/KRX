"use client";
import { useState } from "react";
import type { Post } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { formatCount } from "@/utils";

interface PostCardProps {
  post: Post;
  delay?: number;
}

export function PostCard({ post, delay = 0 }: PostCardProps) {
  const [liked,    setLiked]    = useState(post.isLiked ?? false);
  const [reposted, setReposted] = useState(post.isReposted ?? false);

  const likes    = post.likesCount    + (liked    ? 1 : 0);
  const reposts  = post.repostsCount  + (reposted ? 1 : 0);

  return (
    <article
      className="post-card px-5 py-4 border-b fade-up"
      style={{ borderColor: "var(--border)", animationDelay: `${delay}s` }}
    >
      <div className="flex gap-3">
        <Avatar user={post.author} size="md" showOnline />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="font-bold text-sm">{post.author.username}</span>
            {post.author.isVerified && <VerifiedBadge size={14} />}
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.author.handle}</span>
            <span style={{ color: "var(--text-muted)" }}>·</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.createdAt}</span>
            <button className="ml-auto p-1 rounded-lg hover:bg-white/5 transition-colors" style={{ color: "var(--text-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <circle cx="19" cy="12" r="1" fill="currentColor"/>
                <circle cx="5"  cy="12" r="1" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed mb-2.5" style={{ color: "var(--text-primary)" }}>
            {post.content}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ background: "rgba(79,158,255,0.12)", color: "var(--krx-blue)" }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-5">
            <ActionBtn color="var(--text-secondary)" hoverColor="var(--krx-blue)"
              icon={<CommentIcon />} count={post.commentsCount} />

            <ActionBtn color={reposted ? "var(--krx-green)" : "var(--text-secondary)"} hoverColor="var(--krx-green)"
              icon={<RepostIcon active={reposted} />} count={reposts}
              onClick={() => setReposted(v => !v)} />

            <ActionBtn color={liked ? "#ec4899" : "var(--text-secondary)"} hoverColor="#ec4899"
              icon={<HeartIcon active={liked} />} count={likes}
              onClick={() => setLiked(v => !v)} />

            <ActionBtn color="var(--text-muted)" hoverColor="var(--text-secondary)"
              icon={<ViewIcon />} count={post.viewsCount} />

            <ActionBtn color="var(--text-muted)" hoverColor="var(--text-secondary)"
              icon={<ShareIcon />} count={null} />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Sub-components ── */
function ActionBtn({ icon, count, color, hoverColor, onClick }: {
  icon: React.ReactNode;
  count: number | string | null;
  color: string;
  hoverColor: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs transition-colors"
      style={{ color }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = hoverColor; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = color; }}
    >
      {icon}
      {count !== null && <span className="tabular-nums">{typeof count === "number" ? formatCount(count) : count}</span>}
    </button>
  );
}

function CommentIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function HeartIcon({ active }: { active: boolean }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill={active ? "#ec4899" : "none"} stroke={active ? "#ec4899" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function RepostIcon({ active }: { active: boolean }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--krx-green)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
}
function ViewIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function ShareIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
}
