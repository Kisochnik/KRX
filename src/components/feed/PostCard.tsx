"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  BarChart3,
} from "lucide-react";
import { Avatar, VerifiedBadge, IconButton } from "@/ui";
import type { Post } from "@/lib/types";
import { userRepository, commentRepository } from "@/lib/repositories";
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
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const author = userRepository.getById(post.authorId);
  const previewComments = commentRepository.getByPostId(post.id, 2);

  if (!author) return null;

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const content = (
    <article className="feed-card cursor-pointer border-b border-white/[0.06] px-4 py-5 lg:px-6">
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <Avatar initials={author.avatar} size="md" status={author.status} showStatus />
          <div className="mt-2 w-0.5 flex-1 min-h-[20px] bg-white/[0.06] rounded-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0">
              <span className="font-bold hover:underline">{author.displayName}</span>
              {author.verified && <VerifiedBadge />}
              <span className="text-white/40">@{author.username}</span>
              <span className="text-white/20">·</span>
              <span className="text-sm text-white/40">{formatTime(post.createdAt)}</span>
            </div>
            <IconButton icon={MoreHorizontal} label="Меню" />
          </div>

          <p className="mt-2.5 whitespace-pre-wrap text-[15px] leading-[1.6] text-white/92">
            {post.content}
          </p>

          {post.image && (
            <div
              className={cn(
                "mt-4 overflow-hidden rounded-2xl border border-white/[0.08] premium-shadow",
                post.image === "music" ? "post-image-music h-56 lg:h-64" : "post-image-art h-56 lg:h-64"
              )}
            >
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 text-5xl opacity-25">
                    {post.image === "music" ? "♪" : "◈"}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                    {post.image === "music" ? "KRX Music" : "KRX Art"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* X-style action bar */}
          <div className="mt-4 flex max-w-[420px] items-center justify-between">
            <button
              type="button"
              className="group flex items-center gap-1.5 rounded-full p-2 text-white/40 transition-all hover:bg-sky-500/10 hover:text-sky-400"
            >
              <MessageCircle className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
              <span className="text-xs">{formatCount(post.comments)}</span>
            </button>
            <button
              type="button"
              className={cn(
                "group flex items-center gap-1.5 rounded-full p-2 transition-all",
                post.reposted
                  ? "text-emerald-400"
                  : "text-white/40 hover:bg-emerald-500/10 hover:text-emerald-400"
              )}
            >
              <Repeat2 className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
              <span className="text-xs">{formatCount(post.reposts)}</span>
            </button>
            <button
              type="button"
              onClick={toggleLike}
              className={cn(
                "group flex items-center gap-1.5 rounded-full p-2 transition-all",
                liked
                  ? "text-rose-400"
                  : "text-white/40 hover:bg-rose-500/10 hover:text-rose-400"
              )}
            >
              <Heart
                className={cn(
                  "h-[18px] w-[18px] group-hover:scale-110 transition-transform",
                  liked && "fill-rose-400"
                )}
              />
              <span className="text-xs">{formatCount(likeCount)}</span>
            </button>
            <button
              type="button"
              className="group flex items-center gap-1.5 rounded-full p-2 text-white/40 transition-all hover:bg-white/10 hover:text-white"
            >
              <BarChart3 className="h-[18px] w-[18px]" />
              <span className="text-xs">{formatCount(post.views)}</span>
            </button>
            <div className="flex gap-0.5">
              <button type="button" className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white">
                <Bookmark className="h-[18px] w-[18px]" />
              </button>
              <button type="button" className="rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-white">
                <Share className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>

          {/* Comment previews */}
          {previewComments.length > 0 && (
            <div className="mt-4 space-y-3 rounded-2xl bg-white/[0.02] p-3 ring-1 ring-white/[0.05]">
              {previewComments.map((comment) => {
                const commentAuthor = userRepository.getById(comment.authorId);
                if (!commentAuthor) return null;
                return (
                  <div key={comment.id} className="flex gap-2.5">
                    <Avatar initials={commentAuthor.avatar} size="xs" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-white/90">
                          {commentAuthor.displayName}
                        </span>{" "}
                        <span className="text-white/65">{comment.content}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
              {post.comments > previewComments.length && (
                <button
                  type="button"
                  className="text-sm font-medium text-white/45 transition-colors hover:text-white/70"
                >
                  Показать все {formatCount(post.comments)} ответов
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );

  if (!shouldAnimate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={staggerDelay(index)}
    >
      {content}
    </motion.div>
  );
}
