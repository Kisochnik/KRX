"use client";

import { motion } from "framer-motion";
import { Heart, Play } from "lucide-react";
import { exploreItems } from "@/lib/data";
import { formatCount } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks";
import { staggerDelay } from "@/animations/transitions";

const gradientMap: Record<string, string> = {
  design: "explore-gradient-design",
  music: "explore-gradient-music",
  "3d": "explore-gradient-3d",
  tutorial: "explore-gradient-tutorial",
  game: "explore-gradient-game",
  crypto: "explore-gradient-crypto",
  photo: "explore-gradient-photo",
  stream: "explore-gradient-stream",
};

export function ExploreGrid() {
  const { shouldAnimate } = useMotionConfig();

  return (
    <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:gap-4 lg:p-6">
      {exploreItems.map((item, i) => {
        const Card = shouldAnimate ? motion.button : "button";

        return (
          <Card
            key={item.id}
            type="button"
            {...(shouldAnimate
              ? {
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  transition: staggerDelay(i, 0.05),
                  whileHover: { scale: 1.02 },
                }
              : {})}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.08]"
          >
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105",
                gradientMap[item.image]
              )}
            >
              <span className="mb-2 text-3xl opacity-20">◈</span>
              {item.image === "stream" && (
                <Play className="mb-2 h-8 w-8 text-white/60" />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-xs uppercase tracking-wider text-white/50">
                {item.category}
              </p>
              <p className="truncate text-sm font-semibold">{item.title}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-white/50">
                <Heart className="h-3 w-3" />
                {formatCount(item.likes)}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
