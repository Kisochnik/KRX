"use client";

import { useEffect, useState } from "react";

/** Simulates brief page load for skeleton UX */
export function usePageLoading(delayMs = 600) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  return loading;
}
