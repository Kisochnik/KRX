"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder, className }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className={cn("group relative", className)}>
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-all duration-300 group-focus-within:text-white/70 group-focus-within:scale-110" />
      <input
        type="search"
        placeholder={placeholder ?? t.search.default}
        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-white shadow-inner transition-all duration-300 placeholder:text-white/30 outline-none backdrop-blur-xl focus:border-white/15 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)]"
      />
    </div>
  );
}
