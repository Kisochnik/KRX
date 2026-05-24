"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

export function IconButton({
  icon: Icon,
  label,
  active,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cn(
        "rounded-full p-2 transition-all duration-300",
        active
          ? "text-white bg-white/10"
          : "text-white/40 hover:text-white hover:bg-white/[0.06] hover:scale-110",
        className
      )}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
