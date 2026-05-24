"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, VerifiedBadge, Button, Tabs, IconButton } from "@/ui";
import { PostCard } from "@/components/feed";
import { userRepository, postRepository } from "@/lib/repositories";
import { formatCount } from "@/lib/utils";
import { useLanguage, useMotionConfig } from "@/hooks";
import { scaleIn } from "@/animations/variants";
import { smooth } from "@/animations/transitions";

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

  const AvatarBlock = shouldAnimate ? motion.div : "div";

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative h-40 border-b border-white/[0.06] profile-banner lg:h-48">
        <div className="absolute inset-0 shimmer opacity-30" />
        <div className="absolute right-4 top-4 lg:right-6">
          <IconButton icon={MoreHorizontal} label="Меню" />
        </div>
      </div>

      <div className="px-4 pb-8 lg:px-6">
        <div className="relative -mt-14 mb-5 flex items-end justify-between lg:-mt-16">
          <AvatarBlock
            {...(shouldAnimate
              ? { initial: "hidden", animate: "visible", variants: scaleIn, transition: smooth }
              : {})}
          >
            <Avatar
              initials={user.avatar}
              size="xl"
              status={user.status}
              showStatus
            />
          </AvatarBlock>
          <div className="flex gap-2 pb-2">
            <Button variant="outline" size="md">
              {t.profile.edit}
            </Button>
            <Button variant="primary" size="md" className="!p-2.5">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold lg:text-2xl">{user.displayName}</h1>
            {user.verified && <VerifiedBadge />}
          </div>
          <p className="text-white/40">@{user.username}</p>
          <p className="text-[15px] leading-relaxed text-white/80">{user.bio}</p>
          <div className="flex flex-wrap gap-4 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              Москва, Россия
            </span>
            <span className="flex items-center gap-1.5">
              <LinkIcon className="h-4 w-4 shrink-0" />
              kvaron.x/krx
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 shrink-0" />
              С января 2026
            </span>
          </div>
          <div className="flex flex-wrap gap-5 text-sm">
            <button type="button" className="hover:underline">
              <span className="font-bold text-white">
                {formatCount(user.following)}
              </span>{" "}
              <span className="text-white/40">{t.profile.following}</span>
            </button>
            <button type="button" className="hover:underline">
              <span className="font-bold text-white">
                {formatCount(user.followers)}
              </span>{" "}
              <span className="text-white/40">{t.profile.followers}</span>
            </button>
            <span>
              <span className="font-bold text-white">{user.posts}</span>{" "}
              <span className="text-white/40">{t.profile.postsCount}</span>
            </span>
          </div>
        </div>

        <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />

        {userPosts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}
