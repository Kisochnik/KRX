import { cn } from "@/lib/utils";

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

/** Main scrollable content region with consistent padding */
export function ScrollArea({ children, className }: ScrollAreaProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
