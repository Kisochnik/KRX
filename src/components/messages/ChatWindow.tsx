"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks";

export function ChatWindow() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/30">
      <MessageCircle className="h-12 w-12 opacity-20" />
      <p className="text-sm">{t.messages.selectChat}</p>
    </div>
  );
}
