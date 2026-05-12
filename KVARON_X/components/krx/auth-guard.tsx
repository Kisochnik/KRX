"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/context/app-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/auth") {
      router.replace("/auth");
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated && pathname !== "/auth") {
    return null;
  }

  return <>{children}</>;
}
