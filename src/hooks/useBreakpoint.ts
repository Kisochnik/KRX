"use client";

import { BREAKPOINTS } from "@/settings/config";
import { useMediaQuery } from "./useMediaQuery";

export type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

export function useBreakpoint(): Breakpoint {
  const isWide = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const isTablet = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);

  if (isWide) return "wide";
  if (isDesktop) return "desktop";
  if (isTablet) return "tablet";
  return "mobile";
}

export function useIsMobile() {
  return useBreakpoint() === "mobile";
}

export function useIsDesktop() {
  const bp = useBreakpoint();
  return bp === "desktop" || bp === "wide";
}
