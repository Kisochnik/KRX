"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { stories } from "@/lib/data";
import { userRepository } from "@/lib/repositories";
import { cn } from "@/lib/utils";
import { useLanguage, useMotionConfig } from "@/hooks";
import { hoverLift } from "@/animations/variants";

export function Stories() {
  const { t } = useLanguage();
  const { shouldAnimate } = useMotionConfig();
  const currentUser = userRepository.getCurrent();

  const StoryWrapper = shouldAnimate ? motion.button : "button";

  return (
    <div className="border-b border-white/[0.06] px-4 py-5 lg:px-6">
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-thin">
        <StoryWrapper
          type="button"
          {...(shouldAnimate
            ? { whileHover: "hover", whileTap: "tap", variants: hoverLift }
            : {})}
          className="flex shrink-0 flex-col items-center gap-2.5"
        >
          <div className="relative">
            <div className="story-ring rounded-full">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-base font-bold lg:h-16 lg:w-16 lg:text-lg">
                {currentUser?.avatar}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black ring-2 ring-black">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </div>
          <span className="max-w-[72px] truncate text-xs text-white/60">
            {t.feed.yourStory}
          </span>
        </StoryWrapper>

        {stories.map((story, i) => {
          const user = userRepository.getById(story.userId);
          if (!user) return null;

          return (
            <StoryWrapper
              key={story.id}
              type="button"
              {...(shouldAnimate
                ? {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: i * 0.05 },
                    whileHover: "hover",
                    whileTap: "tap",
                    variants: hoverLift,
                  }
                : {})}
              className="flex shrink-0 flex-col items-center gap-2.5"
            >
              <div
                className={cn(
                  "rounded-full",
                  story.viewed ? "story-ring-viewed" : "story-ring"
                )}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-sm font-semibold ring-2 ring-black lg:h-16 lg:w-16">
                  {user.avatar}
                </div>
              </div>
              <span className="max-w-[72px] truncate text-xs text-white/60">
                {user.displayName.split(" ")[0]}
              </span>
            </StoryWrapper>
          );
        })}
      </div>
    </div>
  );
}
