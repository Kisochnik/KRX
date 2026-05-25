"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  Share2,
  Shield,
  Heart,
  AtSign,
} from "lucide-react";
import { Avatar, VerifiedBadge, Button, Tabs } from "@/ui";
import { PostCard } from "@/components/feed";
import { userRepository, postRepository } from "@/lib/repositories";
import { formatCount } from "@/lib/utils";
import { useLanguage, useMotionConfig } from "@/hooks";
import { cn } from "@/lib/utils";

export function ProfileView() {
  const { t } = useLanguage();
  const { shouldAnimate } = useMotionConfig();
  const user = userRepository.getCurrent();
  const userPosts = user ? postRepository.getByAuthor(user.id) : [];
  const [activeTab, setActiveTab] = useState("posts");

  if (!user) return null;

  const tabs = [
    { id: "posts", label: t.profile.tabs.posts },
    { id: "replies", label: t.profile.tabs.replies },
    { id: "media", label: t.profile.tabs.media },
    { id: "likes", label: t.profile.tabs.likes },
  ];

  const mediaGrid = userPosts.filter((p) => p.image);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Instagram-style banner + Discord roles */}
      <div className="relative h-44 overflow-hidden profile-banner lg:h-52">
        <div className="absolute inset-0 shimmer opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative px-4 pb-8 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={shouldAnimate ? { scale: 0.85, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            className="-mt-16 sm:-mt-20"
          >
            <Avatar
              initials={user.avatar}
              size="xl"
              status={user.status}
              showStatus
              className="ring-4 ring-black premium-shadow-lg"
            />
          </motion.div>
          <div className="flex gap-2 pb-1">
            <Button variant="outline" size="md">
              {t.profile.edit}
            </Button>
            <Button variant="secondary" size="md" className="!p-2.5">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="primary" size="md" className="!p-2.5">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              {user.verified && <VerifiedBadge />}
            </div>
            <p className="text-white/45">@{user.username}</p>
          </div>

          {/* Discord-style roles */}
          <div className="flex flex-wrap gap-2">
            <span className="role-badge flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-white/90">
              <Shield className="h-3 w-3" />
              KRX Admin
            </span>
            <span className="role-badge rounded-lg px-2.5 py-1 text-xs font-medium text-white/70">
              Founder
            </span>
            <span className="role-badge rounded-lg px-2.5 py-1 text-xs font-medium text-white/70">
              Verified
            </span>
          </div>

          <p className="max-w-lg text-[15px] leading-relaxed text-white/80">{user.bio}</p>

          <div className="flex flex-wrap gap-4 text-sm text-white/45">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> Москва, Россия
            </span>
            <span className="flex items-center gap-1.5">
              <LinkIcon className="h-4 w-4" /> kvaron.x/krx
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> С января 2026
            </span>
          </div>

          {/* Instagram stats */}
          <div className="flex gap-8 border-y border-white/[0.06] py-4">
            {[
              { value: user.posts, label: t.profile.postsCount },
              { value: formatCount(user.followers), label: t.profile.followers },
              { value: formatCount(user.following), label: t.profile.following },
            ].map(({ value, label }) => (
              <button key={label} type="button" className="text-center transition-opacity hover:opacity-80">
                <p className="text-lg font-bold">{value}</p>
                <p className="text-xs text-white/40">{label}</p>
              </button>
            ))}
          </div>
        </div>

        <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} className="mt-2" />

        {activeTab === "posts" &&
          userPosts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}

        {activeTab === "media" && (
          <div className="mt-4 grid grid-cols-3 gap-1">
            {mediaGrid.map((post) => (
              <div
                key={post.id}
                className={cn(
                  "aspect-square overflow-hidden rounded-lg border border-white/[0.06]",
                  post.image === "music" ? "post-image-music" : "post-image-art"
                )}
              />
            ))}
          </div>
        )}

        {activeTab === "replies" && (
          <div className="flex flex-col items-center gap-3 py-16 text-white/40">
            <AtSign className="h-10 w-10" />
            <p>Ответы появятся здесь</p>
          </div>
        )}

        {activeTab === "likes" && (
          <div className="flex flex-col items-center gap-3 py-16 text-white/40">
            <Heart className="h-10 w-10" />
            <p>Понравившиеся посты</p>
          </div>
        )}
      </div>
    </div>
  );
}
