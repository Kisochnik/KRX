"use client";

import { useState } from "react";
import { Phone, Video, Info, Paperclip, Smile, Send } from "lucide-react";
import { Avatar, IconButton, GlassPanel } from "@/ui";
import { conversations, messagesByConversation, CURRENT_USER_ID } from "@/lib/data";
import { userRepository } from "@/lib/repositories";
import type { OnlineStatus } from "@/lib/types";
import { useLanguage, useFormatTime } from "@/hooks";

interface ChatWindowProps {
  conversationId: string;
}

function statusLabel(
  status: OnlineStatus,
  labels: Record<OnlineStatus, string>
): string {
  return labels[status];
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { t } = useLanguage();
  const formatTime = useFormatTime();
  const [input, setInput] = useState("");

  const conv = conversations.find((c) => c.id === conversationId);
  const otherUser = conv ? userRepository.getById(conv.userId) : undefined;
  const messages = messagesByConversation[conversationId] ?? [];

  if (!otherUser) {
    return (
      <div className="flex flex-1 items-center justify-center text-white/40">
        {t.messages.selectChat}
      </div>
    );
  }

  const statusLabels = t.messages.status;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="glass-strong flex items-center justify-between border-b border-white/[0.06] px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Avatar
            initials={otherUser.avatar}
            size="md"
            status={otherUser.status}
            showStatus
          />
          <div>
            <p className="font-semibold">{otherUser.displayName}</p>
            <p className="text-xs text-white/40">
              {statusLabel(otherUser.status, statusLabels)}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <IconButton icon={Phone} label="Звонок" />
          <IconButton icon={Video} label="Видео" />
          <IconButton icon={Info} label="Инфо" />
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 lg:p-6">
        {messages.map((msg) => {
          const isMe = msg.senderId === CURRENT_USER_ID;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 lg:max-w-[70%] ${
                  isMe
                    ? "rounded-br-md bg-white text-black"
                    : "glass rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={`mt-1 text-[10px] ${
                    isMe ? "text-black/50" : "text-white/35"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/[0.06] p-4">
        <GlassPanel padding="sm" variant="subtle" className="flex items-center gap-3 !rounded-2xl">
          <IconButton icon={Paperclip} label="Файл" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.messages.placeholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
          />
          <IconButton icon={Smile} label="Эмодзи" />
          <button
            type="button"
            className="rounded-full bg-white p-2.5 text-black transition-all hover:scale-105 active:scale-95"
            aria-label="Отправить"
          >
            <Send className="h-4 w-4" />
          </button>
        </GlassPanel>
      </div>
    </div>
  );
}
