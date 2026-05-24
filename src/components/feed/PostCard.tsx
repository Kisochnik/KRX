"use client";

import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { Avatar, VerifiedBadge, IconButton } from "@/ui";
import type { Post } from "@/lib/types";
import { userRepository } from "@/lib/repositories";
import { formatCount } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useLanguage, useFormatTime, useMotionConfig } from "@/hooks";
import { staggerDelay } from "@/animations/transitions";

interface PostCardProps {
  post: Post;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const { t } = useLanguage();
  const formatTime = useFormatTime();
  const { shouldAnimate } = useMotionConfig();
  const author = userRepository.getById(post.authorId);

  if (!author) return null;

  const actions = [
    { icon: MessageCircle, count: post.comments, label: t.post.comments },
    { icon: Repeat2, count: post.reposts, label: t.post.reposts, active: post.reposted },
    { icon: Heart, count: post.likes, label: t.post.likes, active: post.liked, fill: true },
    { icon: Bookmark, label: t.post.bookmark },
    { icon: Share, label: t.post.share },
  ];

  const content = (
    <article className="glass-hover border-b border-white/[0.06] px-4 py-5 transition-colors lg:px-6">
      <div className="flex gap-4">
        <Avatar
          initials={author.avatar}
          size="md"
          status={author.status}
          showStatus
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0">
              <span className="cursor-pointer font-semibold hover:underline">
                {author.displayName}
              </span>
              {author.verified && <VerifiedBadge />}
              <span className="text-white/40">@{author.username}</span>
              <span className="text-white/25">·</span>
              <span className="text-sm text-white/40">
                {formatTime(post.createdAt)}
              </span>
            </div>
            <IconButton icon={MoreHorizontal} label="Меню" />
          </div>

          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-white/90">
            {post.content}
          </p>

          {post.image && (
            <div
              className={cn(
                "mt-4 flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] lg:h-64",
                post.image === "music" ? "post-image-music" : "post-image-art"
              )}
            >
              <div className="text-center">
                <div className="mb-2 text-4xl opacity-30">
                  {post.image === "music" ? "♪" : "◈"}
                </div>
                <p className="text-sm uppercase tracking-widest text-white/40">
                  {post.image === "music" ? "KRX Music" : "KRX Art"}
                </p>
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-1 text-xs text-white/35">
            <Eye className="h-3 w-3" />
            {formatCount(post.views)} {t.feed.views}
          </div>

          <div className="mt-4 flex max-w-md items-center justify-between">
            {actions.map(({ icon: Icon, count, label, active, fill }) => (
              <button
                key={label}
                type="button"
                title={label}
                className={cn(
                  "group flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition-all duration-300",
                  active
                    ? "text-white"
                    : "text-white/40 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 group-hover:scale-125",
                    active && fill && "fill-white"
                  )}
                />
                {count !== undefined && (
                  <span className="text-xs">{formatCount(count)}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );

  if (!shouldAnimate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={staggerDelay(index)}
    >
      {content}
    </motion.div>
  );
}
