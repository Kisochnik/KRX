"use client";
import type { Conversation } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { useState } from "react";

interface Props {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, activeId, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const filtered = conversations.filter(c =>
    c.user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-72 flex flex-col border-r flex-shrink-0 h-full" style={{ borderColor: "var(--border)" }}>
      <div className="px-4 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <h2 className="font-black text-base mb-3" style={{ fontFamily: "Space Grotesk, system-ui" }}>Messages</h2>
        <SearchInput value={query} onChange={setQuery} placeholder="Search conversations..." />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map(c => (
          <button key={c.id} onClick={() => onSelect(c.id)} className="w-full">
            <div className={`msg-item flex items-center gap-3 px-4 py-3 border-b ${activeId === c.id ? "active" : ""}`}
                 style={{ borderColor: "var(--border)" }}>
              <Avatar user={c.user} size="md" showOnline />
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-semibold text-sm truncate">{c.user.username}</span>
                  <span className="text-xs flex-shrink-0 ml-2" style={{ color: "var(--text-muted)" }}>{c.lastTime}</span>
                </div>
                <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{c.lastMessage}</div>
              </div>
              {c.unreadCount > 0 && <Badge count={c.unreadCount} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
