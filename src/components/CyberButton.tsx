"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export default function CyberButton({
  children,
  isLoading = false,
  variant = "primary",
  disabled,
  className = "",
  ...props
}: CyberButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "border border-white/10 bg-white/[0.055] text-white shadow-2xl hover:border-white/30 hover:bg-white/[0.085]";
      case "outline":
        return "border border-white/20 bg-transparent text-white hover:border-white/60 hover:bg-white/[0.055]";
      default:
        return "border border-white bg-white text-black hover:bg-transparent hover:text-white hover:shadow-[0_0_24px_rgba(255,255,255,0.18)]";
    }
  };

  return (
    <motion.div
      whileHover={!isLoading && !disabled ? { scale: 1.015, y: -0.5 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.985 } : {}}
      className="w-full"
    >
      <button
        disabled={isLoading || disabled}
        className={`relative flex w-full cursor-pointer select-none items-center justify-center gap-2.5 overflow-hidden rounded-lg px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${getVariantStyles()} ${className}`}
        {...props}
      >
        {isLoading && (
          <div className="pointer-events-none absolute inset-0">
            <div className="animate-scanline absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        )}

        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-current" />
            <span className="opacity-90">Проверка...</span>
          </>
        ) : (
          children
        )}

        <span className="absolute left-1 top-1 h-0.5 w-0.5 rounded-full bg-current opacity-30" />
        <span className="absolute bottom-1 right-1 h-0.5 w-0.5 rounded-full bg-current opacity-30" />
      </button>
    </motion.div>
  );
}
