"use client";

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

  return (
    <div className="flex h-full w-full shrink-0 flex-col border-r border-white/[0.06] md:w-80">
      <div className="hidden border-b border-white/[0.06] p-4 md:block" />
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const user = userRepository.getById(conv.userId);
          if (!user) return null;
          const active = conv.id === activeId;

          return (
            <button
              key={conv.id}
              type="button"
              onClick={() => onSelect(conv.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all duration-300",
                active
                  ? "border-l-2 border-white bg-white/[0.08]"
                  : "border-l-2 border-transparent hover:bg-white/[0.04]"
              )}
            >
              <Avatar
                initials={user.avatar}
                size="md"
                status={user.status}
                showStatus
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">
                    {user.displayName}
                  </span>
                  <span className="shrink-0 text-[10px] text-white/35">
                    {formatTime(conv.lastMessageAt)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-white/45">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread > 0 && <Badge count={conv.unread} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
