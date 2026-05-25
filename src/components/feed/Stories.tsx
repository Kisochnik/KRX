"use client";

import { motion } from "framer-motion";
import { Plus, Play } from "lucide-react";
import { stories } from "@/lib/data";
import { userRepository } from "@/lib/repositories";
import { cn } from "@/lib/utils";
import { useLanguage, useMotionConfig } from "@/hooks";

export function Stories() {
  const { t } = useLanguage();
  const { shouldAnimate } = useMotionConfig();
  const currentUser = userRepository.getCurrent();

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
                {currentUser?.avatar}
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

        {stories.map((story, i) => {
          const user = userRepository.getById(story.userId);
          if (!user) return null;
          const isLive = i === 3;

          return (
            <motion.button
              key={story.id}
              type="button"
              initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "rounded-2xl p-[2.5px]",
                  story.viewed ? "story-ring-viewed" : "story-ring"
                )}
              >
                <div className="relative flex h-[72px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-b from-white/15 to-white/5 text-sm font-semibold ring-1 ring-black/50">
                  {user.avatar}
                  {isLive && (
                    <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-md bg-white px-1.5 py-0.5 text-[8px] font-bold uppercase text-black">
                      <Play className="h-2 w-2 fill-black" />
                      Live
                    </span>
                  )}
                </div>
              </div>
              <span className="max-w-[56px] truncate text-[11px] text-white/55">
                {user.displayName.split(" ")[0]}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
