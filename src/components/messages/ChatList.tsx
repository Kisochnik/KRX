"use client";

import { Pin, CheckCheck } from "lucide-react";
import { Avatar, Badge } from "@/ui";
import { conversations } from "@/lib/data";
import { userRepository } from "@/lib/repositories";
import { cn } from "@/lib/utils";
import { useFormatTime } from "@/hooks";

interface ChatListProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export function ChatList({ activeId, onSelect }: ChatListProps) {
  const formatTime = useFormatTime();
  const pinned = conversations.slice(0, 1);
  const rest = conversations.slice(1);

  const renderChat = (conv: (typeof conversations)[0], pinnedChat?: boolean) => {
    const user = userRepository.getById(conv.userId);
    if (!user) return null;
    const active = conv.id === activeId;

    return (
      <button
        key={conv.id}
        type="button"
        onClick={() => onSelect(conv.id)}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-300",
          active
            ? "bg-white/[0.1] ring-1 ring-white/10"
            : "hover:bg-white/[0.05]"
        )}
      >
        <div className="relative shrink-0">
          <Avatar initials={user.avatar} size="lg" status={user.status} showStatus />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 truncate font-semibold text-[15px]">
              {pinnedChat && <Pin className="h-3 w-3 shrink-0 text-white/40" />}
              {user.displayName}
            </span>
            <span
              className={cn(
                "shrink-0 text-xs",
                conv.unread > 0 ? "font-semibold text-white" : "text-white/35"
              )}
            >
              {formatTime(conv.lastMessageAt)}
            </span>
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p
              className={cn(
                "truncate text-sm",
                conv.unread > 0 ? "font-medium text-white/80" : "text-white/45"
              )}
            >
              {conv.lastMessage}
            </p>
            {conv.unread > 0 ? (
              <Badge count={conv.unread} />
            ) : (
              <CheckCheck className="h-4 w-4 shrink-0 text-white/30" />
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex h-full w-full shrink-0 flex-col bg-[#0a0a0a] md:w-[340px] md:border-r md:border-white/[0.06]">
      <div className="flex-1 overflow-y-auto p-2">
        {pinned.length > 0 && (
          <div className="mb-2">
            <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-white/30">
              Закреплённые
            </p>
            {pinned.map((c) => renderChat(c, true))}
          </div>
        )}
        <div className="space-y-0.5">
          {rest.map((c) => renderChat(c))}
        </div>
      </div>
    </div>
  );
}
