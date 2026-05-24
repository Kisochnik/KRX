"use client";

import { motion } from "framer-motion";
import { Heart, UserPlus, AtSign, Repeat2, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, PageHeader } from "@/ui";
import { notifications } from "@/lib/data";
import { userRepository } from "@/lib/repositories";
import type { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage, useFormatTime, useMotionConfig } from "@/hooks";
import { staggerDelay } from "@/animations/transitions";

const iconMap: Record<Notification["type"], LucideIcon> = {
  like: Heart,
  follow: UserPlus,
  mention: AtSign,
  repost: Repeat2,
  message: MessageCircle,
};

function NotificationItem({
  notification,
  index,
  typeLabels,
}: {
  notification: Notification;
  index: number;
  typeLabels: Record<Notification["type"], string>;
}) {
  const formatTime = useFormatTime();
  const { shouldAnimate } = useMotionConfig();
  const user = userRepository.getById(notification.fromUserId);
  const Icon = iconMap[notification.type];

  if (!user) return null;

  const content = (
    <div
      className={cn(
        "glass-hover flex cursor-pointer gap-4 border-b border-white/[0.06] px-4 py-5 lg:px-6",
        !notification.read && "bg-white/[0.03]"
      )}
    >
      <div className="relative shrink-0">
        <Avatar initials={user.avatar} size="md" />
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black ring-2 ring-black">
          <Icon className="h-3 w-3 text-white" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">{user.displayName}</span>{" "}
          <span className="text-white/60">{notification.content}</span>
        </p>
        <p className="mt-1 text-xs text-white/35">
          {formatTime(notification.createdAt)} · {typeLabels[notification.type]}
        </p>
      </div>
      {!notification.read && (
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-white" />
      )}
    </div>
  );

  if (!shouldAnimate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={staggerDelay(index, 0.05)}
    >
      {content}
    </motion.div>
  );
}

export function NotificationList() {
  const { t } = useLanguage();
  const unread = notifications.filter((n) => !n.read).length;

  const typeLabels = t.notifications.types;

  return (
    <>
      <PageHeader
        title={t.notifications.title}
        subtitle={`${unread} ${t.notifications.unread}`}
        action={
          <button
            type="button"
            className="text-xs text-white/50 transition-colors hover:text-white"
          >
            {t.notifications.markAll}
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto">
        {notifications.map((n, i) => (
          <NotificationItem
            key={n.id}
            notification={n}
            index={i}
            typeLabels={typeLabels}
          />
        ))}
      </div>
    </>
  );
}
