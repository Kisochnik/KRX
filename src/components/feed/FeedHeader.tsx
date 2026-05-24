"use client";

import { useState } from "react";
import { PageHeader, Tabs } from "@/ui";
import { useLanguage } from "@/hooks";

export function FeedHeader() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("forYou");

  const tabs = [
    { id: "forYou", label: t.feed.tabs.forYou },
    { id: "following", label: t.feed.tabs.following },
    { id: "live", label: t.feed.tabs.live },
    { id: "media", label: t.feed.tabs.media },
  ];

  return (
    <PageHeader
      title={t.feed.title}
      subtitle={t.feed.updated}
      action={
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="text-xs text-white/50">{t.feed.live}</span>
        </div>
      }
    >
      <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
    </PageHeader>
  );
}
