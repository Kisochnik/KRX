"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeId, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex border-t border-white/[0.04]",
        className
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange?.(tab.id)}
            className={cn(
              "relative flex-1 py-3.5 text-sm font-medium transition-all duration-300",
              active
                ? "text-white"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
            )}
          >
            {tab.label}
            {active && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-white transition-all duration-300" />
            )}
          </button>
        );
      })}
    </div>
  );
}
