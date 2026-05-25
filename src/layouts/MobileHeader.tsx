"use client";

import Link from "next/link";
import { Menu, Settings } from "lucide-react";

interface MobileHeaderProps {
  title: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] glass-strong px-4 md:hidden">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xs font-black text-black"
        >
          KRX
        </Link>
        <h1 className="text-base font-bold">{title}</h1>
      </div>
      <Link
        href="/settings"
        className="rounded-full p-2 text-white/50 transition-all hover:bg-white/10 hover:text-white"
        aria-label="Настройки"
      >
        <Settings className="h-5 w-5" />
      </Link>
    </header>
  );
}
