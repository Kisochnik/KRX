"use client";
import { useState, useRef, useEffect } from "react";
import type { Conversation, Message } from "@/types";
import { Avatar } from "@/components/ui/Avatar";

interface Props {
  conversation: Conversation;
  onSend: (convId: string, text: string) => void;
}

export function ChatPane({ conversation, onSend }: Props) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(conversation.id, text.trim());
    setText("");
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Chat header */}
      <div className="px-5 py-3.5 border-b flex items-center gap-3 flex-shrink-0"
           style={{ borderColor: "var(--border)", background: "var(--bg-panel)" }}>
        <Avatar user={conversation.user} size="md" showOnline />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm">{conversation.user.username}</div>
          <div className="text-xs" style={{ color: conversation.user.isOnline ? "var(--krx-green)" : "var(--text-muted)" }}>
            {conversation.user.isOnline ? "Online now" : `Last seen ${conversation.user.lastSeen}`}
          </div>
        </div>
        <div className="flex gap-1">
          {[
            "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.18h3a2 2 0 0 1 2 1.72",
            "M15 10l-4 4l6 6l4-14l-18-7l7 18l3-6",
          ].map((p, i) => (
            <button key={i} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
                    style={{ color: "var(--text-muted)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={p} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5 glass">
          <button className="hover:bg-white/5 rounded-lg p-1 transition-colors" style={{ color: "var(--krx-blue)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            className="flex-1 bg-transparent text-sm"
            style={{ color: "var(--text-primary)" }}
            placeholder={`Message ${conversation.user.username}...`}
          />
          <button
            onClick={handleSend}
            className="w-7 h-7 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            style={{ background: text.trim() ? "var(--text-primary)" : "var(--bg-glass)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                 stroke={text.trim() ? "var(--bg-primary)" : "var(--text-muted)"}
                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.from === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} fade-up`}>
      <div
        className="max-w-xs px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
        style={isMe
          ? { background: "var(--text-primary)", color: "var(--bg-primary)", borderRadius: "18px 18px 4px 18px" }
          : { background: "var(--bg-glass)", color: "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "18px 18px 18px 4px" }}
      >
        <p>{message.text}</p>
        <p className="text-xs mt-1" style={{ color: isMe ? "rgba(0,0,0,0.4)" : "var(--text-muted)" }}>
          {message.time}
        </p>
      </div>
    </div>
  );
}
