"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks";

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: number;
  collapsed?: boolean;
}

export function NavLink({
  href,
  label,
  icon: Icon,
  active,
  badge,
  collapsed,
}: NavLinkProps) {
  const { shouldAnimate } = useMotionConfig();

  return (
    <Link
      href={href}
      title={label}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-300",
        active
          ? "bg-white text-black premium-shadow"
          : "text-white/55 hover:bg-white/[0.06] hover:text-white",
        collapsed && "justify-center px-0"
      )}
    >
      {active && shouldAnimate && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute inset-0 rounded-2xl bg-white"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
      <Icon
        className={cn(
          "relative z-10 h-[22px] w-[22px] shrink-0 transition-transform duration-300 group-hover:scale-110",
          active ? "text-black" : ""
        )}
      />
      {!collapsed && (
        <>
          <span className="relative z-10 flex-1">{label}</span>
          {badge !== undefined && badge > 0 && (
            <Badge
              count={badge}
              variant={active ? "active" : "default"}
              className="relative z-10"
            />
          )}
        </>
      )}
      {collapsed && badge !== undefined && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 z-20 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-black">
          {badge}
        </span>
      )}
    </Link>
  );
}
