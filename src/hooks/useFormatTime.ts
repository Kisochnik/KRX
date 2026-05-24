"use client";

import { useLanguage } from "./useLanguage";
import { formatTimeAgo } from "@/lib/utils/format";

export function useFormatTime() {
  const { t } = useLanguage();

  return (iso: string) =>
    formatTimeAgo(iso, {
      justNow: t.time.justNow,
      minutes: t.time.minutes,
      hours: t.time.hours,
      days: t.time.days,
    });
}
