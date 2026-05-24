import { cn } from "@/lib/utils";
import type { OnlineStatus } from "@/lib/types";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  status?: OnlineStatus;
  showStatus?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-20 w-20 text-xl",
};

const statusSizeMap: Record<AvatarSize, string> = {
  xs: "h-2 w-2",
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-3.5 w-3.5",
  xl: "h-4 w-4",
};

const statusClassMap: Record<OnlineStatus, string> = {
  online: "status-online",
  idle: "status-idle",
  dnd: "status-dnd",
  offline: "status-offline",
};

export function Avatar({
  initials,
  size = "md",
  status,
  showStatus = false,
  className,
}: AvatarProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-white/10 font-semibold text-white ring-1 ring-white/10 transition-all duration-300 hover:ring-white/25 hover:bg-white/15",
          sizeMap[size]
        )}
      >
        {initials}
      </div>
      {showStatus && status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-black",
            statusSizeMap[size],
            statusClassMap[status]
          )}
        />
      )}
    </div>
  );
}
