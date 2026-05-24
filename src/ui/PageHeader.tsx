import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  children,
  sticky = true,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "z-10 glass-strong border-b border-white/[0.06]",
        sticky && "sticky top-0",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-6">
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight lg:text-xl">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-xs text-white/40 lg:text-sm">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </header>
  );
}
