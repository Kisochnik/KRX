"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks";

export function ChatList() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/30">
      <MessageCircle className="h-10 w-10 opacity-30" />
      <p className="text-sm">{t.messages.selectChat}</p>
    </div>
  );
}
