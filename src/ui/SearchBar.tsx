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
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors duration-300 group-focus-within:text-white/70" />
      <input
        type="search"
        placeholder={placeholder ?? t.search.default}
        className="glass glass-hover w-full rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-300"
      />
    </div>
  );
}
