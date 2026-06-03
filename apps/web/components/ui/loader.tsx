"use client";

import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type LoaderProps = {
  label?: string;
  className?: string;
};

export function Loader({ label = "Loading", className }: LoaderProps) {
  return (
    <motion.div
      className={cn("inline-flex items-center gap-2 text-sm text-neutral-300", className)}
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.24 }}
      role="status"
    >
      <LoaderCircle className="h-4 w-4 animate-spin" />
      <span>{label}</span>
    </motion.div>
  );
}
