"use client";
import { useApp } from "@/context/app-context";
import { Plus, User } from "lucide-react";

export function Stories() {
  const { user } = useApp();
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      <button className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors">
          <Plus className="w-6 h-6 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground">Ваша история</span>
      </button>
      <div className="text-center py-4 text-xs text-muted-foreground flex items-center">
        Историй пока нет
      </div>
    </div>
  );
}
