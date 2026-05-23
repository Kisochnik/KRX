import type { User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { formatCount } from "@/utils";

export interface TrendPost { id: string; user: User; text: string; likesCount: number; tag: string; }

export function TrendingPostCard({ post }: { post: TrendPost }) {
  return (
    <div className="glass rounded-2xl p-4 cursor-pointer post-card">
      <div className="flex items-center gap-2 mb-2.5">
        <Avatar user={post.user} size="sm" />
        <span className="text-xs font-semibold truncate flex-1">{post.user.username}</span>
        <span className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ background: "var(--bg-panel)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
          {post.tag}
        </span>
      </div>
      <p className="text-xs leading-relaxed mb-3 line-clamp-3" style={{ color: "var(--text-primary)" }}>
        {post.text}
      </p>
      <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#ec4899"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        {formatCount(post.likesCount)}
      </div>
    </div>
  );
}
