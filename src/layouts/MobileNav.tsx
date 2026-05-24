"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV } from "@/config/navigation";
import { Badge } from "@/ui";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks";
import { LAYOUT } from "@/settings";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const labels: Record<string, string> = {
    feed: t.nav.feed,
    explore: t.nav.explore,
    messages: t.nav.messages,
    notifications: t.nav.notifications,
    profile: t.nav.profile,
  };

  return (
    <nav
      style={{ height: LAYOUT.mobileNavHeight }}
      className="flex shrink-0 items-center justify-around border-t border-white/[0.06] bg-black/90 px-2 backdrop-blur-xl md:hidden"
    >
      {MOBILE_NAV.map(({ href, labelKey, icon: Icon, badge }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-300",
              active ? "text-white" : "text-white/40"
            )}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {badge && !active && (
                <span className="absolute -right-2 -top-1">
                  <Badge count={badge} />
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{labels[labelKey]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
