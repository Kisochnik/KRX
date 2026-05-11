"use client";

import { Image, Video, BarChart3, Hash, Smile, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const actionButtons = [
  { icon: Image, label: "Фото", color: "text-green-500" },
  { icon: Video, label: "Видео", color: "text-blue-500" },
  { icon: BarChart3, label: "Опрос", color: "text-yellow-500" },
  { icon: Hash, label: "Хештег", color: "text-primary" },
];

export function CreatePost() {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        "bg-card rounded-xl border transition-all duration-300",
        isFocused ? "border-primary shadow-lg shadow-primary/10" : "border-border"
      )}
    >
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-primary/50 shrink-0">
            <span className="text-lg font-bold text-primary">K</span>
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Что нового, Kvarden?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent resize-none text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[60px]"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-1">
          {actionButtons.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className={cn(
                  "p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-muted",
                  action.color
                )}
                title={action.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
          <button className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95">
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <button
          disabled={!content.trim()}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200",
            "hover:scale-105 active:scale-95",
            content.trim()
              ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
          <span>Опубликовать</span>
        </button>
      </div>
    </div>
  );
}
