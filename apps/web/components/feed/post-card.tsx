"use client";

import { Heart, MessageCircle, Play, Repeat2, Send, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import NextImage from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { FeedPost } from "@/types/feed";

type PostCardProps = {
  post: FeedPost;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.28 }}
    >
      <Card interactive className="overflow-hidden">
        <div className="flex gap-3 p-4">
          <Avatar name={post.author.name} tone={post.author.avatarTone} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-sm font-bold text-white">{post.author.name}</h2>
              {post.author.verified ? <ShieldCheck className="h-4 w-4 text-white" /> : null}
              <span className="text-sm text-neutral-500">{post.author.handle}</span>
              <span className="text-sm text-neutral-600">/</span>
              <span className="text-sm text-neutral-500">{post.createdAt}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-neutral-200">{post.content}</p>
          </div>
        </div>
        {post.media ? (
          <div className="relative border-y border-[#2a2a2a] bg-[#141414]">
            <NextImage
              className="aspect-[16/10] w-full object-cover"
              src={post.media.src}
              alt={post.media.alt}
              width={1200}
              height={750}
              sizes="(min-width: 1024px) 680px, 100vw"
            />
            {post.media.type === "video" ? (
              <span className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white bg-black/70 text-white backdrop-blur">
                <Play className="h-4 w-4 fill-white" />
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="grid grid-cols-4 border-t border-[#2a2a2a] text-sm text-neutral-300">
          <button className="flex h-12 items-center justify-center gap-2 transition hover:bg-white hover:text-black">
            <Heart className="h-4 w-4" />
            {post.stats.reactions}
          </button>
          <button className="flex h-12 items-center justify-center gap-2 transition hover:bg-white hover:text-black">
            <MessageCircle className="h-4 w-4" />
            {post.stats.comments}
          </button>
          <button className="flex h-12 items-center justify-center gap-2 transition hover:bg-white hover:text-black">
            <Repeat2 className="h-4 w-4" />
            {post.stats.reposts}
          </button>
          <button className="flex h-12 items-center justify-center gap-2 transition hover:bg-white hover:text-black">
            <Send className="h-4 w-4" />
            Share
          </button>
        </div>
      </Card>
    </motion.article>
  );
}
