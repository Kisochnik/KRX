"use client";

import { Search } from "lucide-react";
import { useLanguage } from "@/hooks";

export function ExploreGrid() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-white/30">
      <Search className="h-10 w-10 opacity-30" />
      <p className="text-sm">{t.explore.subtitle}</p>
    </div>
  );
}
