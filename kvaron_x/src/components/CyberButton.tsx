"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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
        return "bg-zinc-900 border border-white/10 hover:border-white/30 text-white shadow-2xl";
      case "outline":
        return "bg-transparent border border-white/20 hover:border-white text-white hover:bg-white/5";
      default:
        // Premium white block with glowing hover
        return "bg-white text-black hover:bg-transparent hover:text-white border border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]";
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
        className={`relative overflow-hidden font-mono text-xs font-bold tracking-widest uppercase py-3.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2.5 w-full select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${getVariantStyles()} ${className}`}
        {...props}
      >
        {/* Dynamic scan line effect inside button when loading */}
        {isLoading && (
          <div className="absolute inset-0 pointer-events-none -z-0">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent absolute top-0 left-0 animate-scanline" />
          </div>
        )}

        {/* Spinner or children content */}
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span className="opacity-90">Сканирование...</span>
          </>
        ) : (
          children
        )}

        {/* Decorative tiny dots on the corners for secondary/primary */}
        <span className="absolute top-1 left-1 w-0.5 h-0.5 bg-current opacity-30 rounded-full" />
        <span className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-current opacity-30 rounded-full" />
      </button>
    </motion.div>
  );
}
