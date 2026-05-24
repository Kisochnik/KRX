"use client";

import { Menu } from "lucide-react";
import { useSettings } from "@/hooks";

interface MobileHeaderProps {
  title: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const { toggleSidebar } = useSettings();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] glass-strong px-4 md:hidden">
      <button
        type="button"
        onClick={toggleSidebar}
        className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
        aria-label="Меню"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-base font-bold">{title}</h1>
    </header>
  );
}
