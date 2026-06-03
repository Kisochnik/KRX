import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[#2a2a2a] bg-[#0b0b0b]",
        interactive && "transition duration-200 hover:border-white/60",
        className,
      )}
      {...props}
    />
  );
}
