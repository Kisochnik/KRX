"use client";

import { useMemo } from "react";
import { useSettings } from "./useSettings";
import { smooth } from "@/animations/transitions";

export function useMotionConfig() {
  const { animationsEnabled, reducedMotion } = useSettings();

  return useMemo(
    () => ({
      shouldAnimate: animationsEnabled && !reducedMotion,
      transition: reducedMotion ? { duration: 0 } : smooth,
    }),
    [animationsEnabled, reducedMotion]
  );
}
