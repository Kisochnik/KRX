"use client";

import { AppShell, ScrollArea } from "@/layouts";
import { FeedHeader, Stories, ComposeBox } from "@/components/feed";
import { useLanguage } from "@/hooks";
import { FileText } from "lucide-react";

export function HomePage() {
  const { t } = useLanguage();

  return (
    <AppShell showRightPanel>
      <FeedHeader />
      <ScrollArea>
        <Stories />
        <ComposeBox />
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-white/25">
          <FileText className="h-10 w-10 opacity-20" />
          <p className="text-sm">{t.feed.compose}</p>
        </div>
      </ScrollArea>
    </AppShell>
  );
}
