"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ConversationList } from "@/features/messages/ConversationList";
import { ChatPane } from "@/features/messages/ChatPane";
import { MOCK_CONVERSATIONS } from "@/data/conversations";
import type { Conversation } from "@/types";

export default function MessagesPage() {
  const [convos, setConvos] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState(MOCK_CONVERSATIONS[0].id);

  const active = convos.find(c => c.id === activeId)!;

  const handleSend = (convId: string, text: string) => {
    setConvos(prev => prev.map(c => {
      if (c.id !== convId) return c;
      return {
        ...c,
        lastMessage: text,
        lastTime: "now",
        messages: [...c.messages, { id: String(Date.now()), from: "me", text, time: "now", read: true }],
      };
    }));
  };

  return (
    <MainLayout>
      <div className="flex h-full overflow-hidden">
        <ConversationList conversations={convos} activeId={activeId} onSelect={setActiveId} />
        <ChatPane conversation={active} onSend={handleSend} />
      </div>
    </MainLayout>
  );
}
