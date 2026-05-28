"use client";

import { motion } from "framer-motion";
import { Plus, Play } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useLanguage, useMotionConfig } from "@/hooks";

export function Stories() {
  const { t } = useLanguage();
  const { shouldAnimate } = useMotionConfig();
  const { user: currentUser } = useAuth();

  return (
    <div className="border-b border-white/[0.06] bg-black/20 px-4 py-4 lg:px-6">
      <div className="flex gap-3 overflow-x-auto pb-1">
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="flex shrink-0 flex-col items-center gap-2"
        >
          <div className="relative">
            <div className="story-ring rounded-2xl">
              <div className="flex h-[72px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-b from-white/10 to-black text-base font-bold">
                {currentUser?.nickname?.slice(0,2).toUpperCase()}
              </div>
            </div>
            <span className="absolute -bottom-1 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-white text-black ring-2 ring-black">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </div>
          <span className="max-w-[56px] truncate text-[11px] font-medium text-white/55">
            {t.feed.yourStory}
          </span>
        </motion.button>

        
      </div>
    </div>
  );
}
