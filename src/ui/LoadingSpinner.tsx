"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin-slow rounded-full border-white/20 border-t-white",
        sizes[size],
        className
      )}
      role="status"
      aria-label="Загрузка"
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-white/40">Загрузка KVARON_X...</p>
    </div>
  );
}
