"use client";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks";
import { Sidebar } from "./Sidebar";
import { RightPanel } from "./RightPanel";
import { MobileNav } from "./MobileNav";
import { MobileHeader } from "./MobileHeader";

export interface AppShellProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
  showMobileHeader?: boolean;
  title?: string;
}

export function AppShell({
  children,
  showRightPanel = true,
  showMobileHeader = false,
  title,
}: AppShellProps) {
  const isMobile = useIsMobile();

  return (
    <div className="grid-bg flex h-dvh w-full overflow-hidden bg-black">
      {!isMobile && <Sidebar />}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {isMobile && showMobileHeader && title && (
          <MobileHeader title={title} />
        )}
        <main
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            !isMobile && "border-x border-white/[0.04]"
          )}
        >
          {children}
        </main>
        {isMobile && <MobileNav />}
      </div>

      {showRightPanel && !isMobile && <RightPanel />}
    </div>
  );
}
