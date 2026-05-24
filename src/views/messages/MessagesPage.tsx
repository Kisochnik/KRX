"use client";

import { useState } from "react";
import { AppShell } from "@/layouts";
import { ChatList, ChatWindow } from "@/components/messages";
import { PageHeader, SearchBar } from "@/ui";
import { useLanguage, useIsMobile } from "@/hooks";
import { cn } from "@/lib/utils";

export function MessagesPage() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeChat, setActiveChat] = useState("c1");
  const [showChat, setShowChat] = useState(!isMobile);

  const handleSelect = (id: string) => {
    setActiveChat(id);
    if (isMobile) setShowChat(true);
  };

  return (
    <AppShell showRightPanel={false} showMobileHeader title={t.messages.title}>
      <PageHeader
        title={t.messages.title}
        subtitle={t.messages.secure}
        className="hidden md:block"
      />
      <div className="border-b border-white/[0.06] px-4 py-3 md:px-6">
        <SearchBar placeholder={t.messages.search} />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className={cn(
            "h-full",
            isMobile && showChat ? "hidden" : "flex",
            isMobile ? "w-full" : ""
          )}
        >
          <ChatList activeId={activeChat} onSelect={handleSelect} />
        </div>
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            isMobile && !showChat ? "hidden" : "flex"
          )}
        >
          {isMobile && showChat && (
            <button
              type="button"
              onClick={() => setShowChat(false)}
              className="border-b border-white/[0.06] px-4 py-3 text-left text-sm text-white/60 md:hidden"
            >
              ← Назад
            </button>
          )}
          <ChatWindow conversationId={activeChat} />
        </div>
      </div>
    </AppShell>
  );
}
