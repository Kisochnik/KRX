"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  Share2,
  Heart,
  AtSign,
  UserCheck,
} from "lucide-react";
import { Avatar, VerifiedBadge, Button, Tabs } from "@/ui";
import { PostCard } from "@/components/feed";
import { formatCount } from "@/lib/utils";
import { useLanguage, useMotionConfig } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// Helper: get initials from nickname
function getInitials(nickname: string): string {
  return nickname.slice(0, 2).toUpperCase();
}

// Helper: format join date
function formatJoinDate(isoString: string, lang: string): string {
  try {
    const date = new Date(isoString);
    const month = date.toLocaleString(
      lang === "ru" ? "ru-RU" : lang === "uk" ? "uk-UA" : "en-US",
      { month: "long" }
    );
    return `${lang === "en" ? "Since" : lang === "uk" ? "З" : "С"} ${month} ${date.getFullYear()}`;
  } catch {
    return "";
  }
}

export function ProfileView() {
  const { t, locale } = useLanguage();
  const { shouldAnimate } = useMotionConfig();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");

  // Priority: authenticated user from AuthContext; fallback to mock for demo
  const displayUser = authUser
    ? {
        id: authUser.email,
        username: authUser.username || authUser.nickname.toLowerCase(),
        displayName: authUser.nickname,
        avatar: authUser.avatar || getInitials(authUser.nickname),
        bio: authUser.bio || "",
        followers: 0,
        following: 0,
        posts: 0,
        verified: false,
        status: "online" as const,
        joinedAt: authUser.createdAt,
        isReal: true,
      }
    : null;

  const user = displayUser;

  const userPosts: never[] = [];

  if (!user) return null;

  const tabs = [
    { id: "posts", label: t.profile.tabs.posts },
    { id: "replies", label: t.profile.tabs.replies },
    { id: "media", label: t.profile.tabs.media },
    { id: "likes", label: t.profile.tabs.likes },
  ];

  const mediaGrid = userPosts.filter((p: { image?: string }) => p.image);
  const joinedStr = user.joinedAt ? formatJoinDate(user.joinedAt, locale) : null;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Banner */}
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
              initials={typeof user.avatar === "string" ? user.avatar : getInitials(user.displayName)}
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

          {/* Roles — only show for mock admin, not real users */}
          {!displayUser?.isReal && (
            <div className="flex flex-wrap gap-2">
              <span className="role-badge flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-white/90">
                <UserCheck className="h-3 w-3" />
                KRX Admin
              </span>
              <span className="role-badge rounded-lg px-2.5 py-1 text-xs font-medium text-white/70">
                Founder
              </span>
              <span className="role-badge rounded-lg px-2.5 py-1 text-xs font-medium text-white/70">
                Verified
              </span>
            </div>
          )}

          {user.bio ? (
            <p className="max-w-lg text-[15px] leading-relaxed text-white/80">{user.bio}</p>
          ) : displayUser?.isReal ? (
            <p className="max-w-lg text-[14px] leading-relaxed text-white/30 italic">
              {locale === "en" ? "No bio yet. Add it in settings." : locale === "uk" ? "Біо ще немає. Додайте в налаштуваннях." : "Биография не добавлена. Добавьте в настройках."}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-4 text-sm text-white/45">
            {(user as { location?: string }).location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {(user as { location?: string }).location}
              </span>
            )}
            {(user as { website?: string }).website && (
              <span className="flex items-center gap-1.5">
                <LinkIcon className="h-4 w-4" />
                {(user as { website?: string }).website}
              </span>
            )}
            {joinedStr && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {joinedStr}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-8 border-y border-white/[0.06] py-4">
            {[
              { value: user.posts ?? 0, label: t.profile.postsCount },
              { value: formatCount(user.followers ?? 0), label: t.profile.followers },
              { value: formatCount(user.following ?? 0), label: t.profile.following },
            ].map(({ value, label: statLabel }) => (
              <button key={statLabel} type="button" className="text-center transition-opacity hover:opacity-80">
                <p className="text-lg font-bold">{value}</p>
                <p className="text-xs text-white/40">{statLabel}</p>
              </button>
            ))}
          </div>
        </div>

        <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} className="mt-2" />

        {activeTab === "posts" && userPosts.length > 0 &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          userPosts.map((post: any, i: number) => <PostCard key={post.id} post={post} index={i} />)}

        {activeTab === "posts" && userPosts.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-white/40">
            <AtSign className="h-10 w-10" />
            <p>{locale === "en" ? "No posts yet" : locale === "uk" ? "Постів ще немає" : "Постов пока нет"}</p>
          </div>
        )}

        {activeTab === "media" && mediaGrid.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-1">
            {mediaGrid.map((post: { id: string; image?: string }) => (
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

        {activeTab === "media" && mediaGrid.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-white/40">
            <AtSign className="h-10 w-10" />
            <p>{locale === "en" ? "No media" : locale === "uk" ? "Медіа немає" : "Нет медиа"}</p>
          </div>
        )}

        {activeTab === "replies" && (
          <div className="flex flex-col items-center gap-3 py-16 text-white/40">
            <AtSign className="h-10 w-10" />
            <p>{locale === "en" ? "Replies appear here" : locale === "uk" ? "Відповіді з'являться тут" : "Ответы появятся здесь"}</p>
          </div>
        )}

        {activeTab === "likes" && (
          <div className="flex flex-col items-center gap-3 py-16 text-white/40">
            <Heart className="h-10 w-10" />
            <p>{locale === "en" ? "Liked posts" : locale === "uk" ? "Вподобані пости" : "Понравившиеся посты"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
