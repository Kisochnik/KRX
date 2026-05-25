"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar } from "./Avatar";
import { VerifiedBadge } from "./VerifiedBadge";
import type { User } from "@/lib/types";
import { formatCount } from "@/lib/utils";
import { useMotionConfig } from "@/hooks";

interface ProfileCardProps {
  user: User;
  compact?: boolean;
}

export function ProfileCard({ user, compact }: ProfileCardProps) {
  const { shouldAnimate } = useMotionConfig();

  const content = (
    <div className="relative overflow-hidden rounded-2xl premium-shadow-lg">
      <div className="h-16 profile-banner shimmer opacity-50" />
      <div className="relative -mt-8 px-4 pb-4">
        <Avatar
          initials={user.avatar}
          size={compact ? "md" : "lg"}
          status={user.status}
          showStatus
          className="ring-4 ring-black"
        />
        <div className="mt-3">
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-white">{user.displayName}</p>
            {user.verified && <VerifiedBadge />}
          </div>
          <p className="text-xs text-white/45">@{user.username}</p>
          {!compact && (
            <>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/55">
                {user.bio}
              </p>
              <div className="mt-3 flex gap-4 text-xs">
                <span>
                  <strong className="text-white">{formatCount(user.following)}</strong>{" "}
                  <span className="text-white/40">подписок</span>
                </span>
                <span>
                  <strong className="text-white">{formatCount(user.followers)}</strong>{" "}
                  <span className="text-white/40">подписчиков</span>
                </span>
              </div>
              <Link
                href="/profile"
                className="mt-3 block w-full rounded-xl bg-white py-2 text-center text-xs font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/10"
              >
                Мой профиль
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (!shouldAnimate) {
    return <div className="glass p-0 overflow-hidden">{content}</div>;
  }

  return (
    <motion.div
      className="glass overflow-hidden p-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
    >
      {content}
    </motion.div>
  );
}
