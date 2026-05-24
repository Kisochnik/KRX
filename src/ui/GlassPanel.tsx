import { cn } from "@/lib/utils";

type GlassVariant = "default" | "strong" | "subtle";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantClass: Record<GlassVariant, string> = {
  default: "glass",
  strong: "glass-strong",
  subtle: "bg-white/[0.02] border border-white/[0.06] backdrop-blur-md",
};

const paddingClass = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function GlassPanel({
  children,
  className,
  variant = "default",
  hover = false,
  padding = "md",
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        variantClass[variant],
        paddingClass[padding],
        hover && "glass-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
