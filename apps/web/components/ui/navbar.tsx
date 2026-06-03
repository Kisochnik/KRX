"use client";

import Link from "next/link";
import { Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavbarProps = {
  onCreatePost?: () => void;
};

export function Navbar({ onCreatePost }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#2a2a2a] bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="font-mono text-xl font-black text-white lg:hidden">
          KRX
        </Link>
        <label className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-md border border-[#2a2a2a] bg-[#0b0b0b] px-3 text-neutral-400 transition focus-within:border-white">
          <Search className="h-4 w-4 shrink-0" />
          <input
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
            placeholder="Search KRX"
          />
        </label>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          title="Create post"
          aria-label="Create post"
          onClick={onCreatePost}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
