import { cn } from "@/lib/utils";

interface BadgeProps {
  count: number | string;
  variant?: "default" | "active";
  className?: string;
}

export function Badge({ count, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
        variant === "active"
          ? "bg-black/20 text-black"
          : "bg-white text-black",
        className
      )}
    >
      {count}
    </span>
  );
}
