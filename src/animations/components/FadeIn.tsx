"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "../variants";
import { smooth } from "../transitions";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const { shouldAnimate } = useMotionConfig();

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ ...smooth, delay }}
    >
      {children}
    </motion.div>
  );
}
