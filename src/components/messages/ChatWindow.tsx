"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Video, Search, MoreVertical, Paperclip, Smile, Mic, Send, Check, CheckCheck } from "lucide-react";
import { Avatar, IconButton } from "@/ui";
import { conversations, messagesByConversation, CURRENT_USER_ID } from "@/lib/data";
import { userRepository } from "@/lib/repositories";
import type { OnlineStatus, Message } from "@/lib/types";
import { useLanguage } from "@/hooks";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  conversationId: string;
}

function statusLabel(status: OnlineStatus, labels: Record<OnlineStatus, string>) {
  return labels[status];
}

function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupMessages(messages: Message[]) {
  const groups: Message[][] = [];
  let current: Message[] = [];

  messages.forEach((msg, i) => {
    const prev = messages[i - 1];
    const sameSender = prev?.senderId === msg.senderId;
    const closeTime =
      prev &&
      new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 120000;

    if (sameSender && closeTime) {
      current.push(msg);
    } else {
      if (current.length) groups.push(current);
      current = [msg];
    }
  });
  if (current.length) groups.push(current);
  return groups;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const conv = conversations.find((c) => c.id === conversationId);
  const otherUser = conv ? userRepository.getById(conv.userId) : undefined;
  const messages = messagesByConversation[conversationId] ?? [];
  const groups = groupMessages(messages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationId, messages.length]);

  if (!otherUser) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 chat-wallpaper">
        <div className="rounded-full bg-white/5 p-6">
          <Send className="h-8 w-8 text-white/30" />
        </div>
        <p className="text-white/40">{t.messages.selectChat}</p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#050505]">
      <header className="flex items-center justify-between border-b border-white/[0.06] bg-[#0c0c0c]/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Avatar initials={otherUser.avatar} size="md" status={otherUser.status} showStatus />
          <div>
            <p className="font-semibold">{otherUser.displayName}</p>
            <p className="text-xs text-emerald-400/90">
              {statusLabel(otherUser.status, t.messages.status)}
            </p>
          </div>
        </div>
        <div className="flex gap-0.5">
          <IconButton icon={Search} label="Поиск" />
          <IconButton icon={Phone} label="Звонок" />
          <IconButton icon={Video} label="Видео" />
          <IconButton icon={MoreVertical} label="Меню" />
        </div>
      </header>

      <div className="chat-wallpaper flex-1 overflow-y-auto px-4 py-4">
        {groups.map((group, gi) => {
          const isMe = group[0].senderId === CURRENT_USER_ID;
          return (
            <motion.div
              key={gi}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.03 }}
              className={cn("mb-3 flex", isMe ? "justify-end" : "justify-start")}
            >
              <div className={cn("flex max-w-[78%] flex-col gap-1", isMe ? "items-end" : "items-start")}>
                {group.map((msg, mi) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "px-4 py-2.5",
                      isMe ? "bubble-sent" : "bubble-received",
                      mi === 0 && isMe && "rounded-tr-2xl",
                      mi === group.length - 1 && isMe && "rounded-br-md",
                      mi === 0 && !isMe && "rounded-tl-2xl",
                      mi === group.length - 1 && !isMe && "rounded-bl-md",
                      mi > 0 && mi < group.length - 1 && (isMe ? "rounded-r-2xl rounded-l-2xl" : "rounded-2xl")
                    )}
                  >
                    <p className="text-[15px] leading-relaxed">{msg.content}</p>
                  </div>
                ))}
                <div className={cn("flex items-center gap-1 px-1", isMe ? "flex-row-reverse" : "")}>
                  <span className="text-[10px] text-white/30">
                    {formatMessageTime(group[group.length - 1].createdAt)}
                  </span>
                  {isMe &&
                    (group[group.length - 1].read ? (
                      <CheckCheck className="h-3.5 w-3.5 text-sky-400" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-white/35" />
                    ))}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/[0.06] bg-[#0c0c0c] p-3">
        <div className="flex items-end gap-2 rounded-2xl bg-white/[0.06] px-2 py-2 ring-1 ring-white/[0.08]">
          <IconButton icon={Paperclip} label="Файл" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.messages.placeholder}
            className="max-h-32 flex-1 resize-none bg-transparent py-2 text-[15px] outline-none placeholder:text-white/35"
          />
          <IconButton icon={Smile} label="Эмодзи" />
          {input.trim() ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          ) : (
            <IconButton icon={Mic} label="Голос" />
          )}
        </div>
      </div>
    </div>
  );
}
