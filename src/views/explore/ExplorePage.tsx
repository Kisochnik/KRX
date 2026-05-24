"use client";

import { useState } from "react";
import { AppShell, ScrollArea } from "@/layouts";
import { ExploreGrid } from "@/components/explore";
import { PageHeader, SearchBar } from "@/ui";
import { useLanguage } from "@/hooks";
import { cn } from "@/lib/utils";

export function ExplorePage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: t.explore.categories.all },
    { id: "design", label: t.explore.categories.design },
    { id: "music", label: t.explore.categories.music },
    { id: "games", label: t.explore.categories.games },
    { id: "crypto", label: t.explore.categories.crypto },
    { id: "streams", label: t.explore.categories.streams },
    { id: "photo", label: t.explore.categories.photo },
    { id: "threeD", label: t.explore.categories.threeD },
  ];

  return (
    <AppShell showRightPanel>
      <PageHeader title={t.explore.title} subtitle={t.explore.subtitle}>
        <div className="space-y-4 px-4 pb-4 lg:px-6">
          <SearchBar placeholder={t.explore.search} />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                  activeCategory === cat.id
                    ? "bg-white text-black"
                    : "glass text-white/60 hover:bg-white/[0.08] hover:text-white"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>
      <ScrollArea>
        <ExploreGrid />
      </ScrollArea>
    </AppShell>
  );
}
