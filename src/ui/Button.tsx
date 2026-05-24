"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10",
  secondary:
    "bg-white/10 text-white hover:bg-white/15 border border-white/10",
  ghost: "text-white/60 hover:text-white hover:bg-white/[0.06]",
  outline:
    "border border-white/20 text-white hover:bg-white hover:text-black",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-full",
  md: "px-5 py-2 text-sm rounded-full",
  lg: "px-6 py-3 text-base rounded-full",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth,
  type = "button",
  disabled,
  onClick,
  ...rest
}: ButtonProps) {
  const { shouldAnimate } = useMotionConfig();
  const classes = cn(
    "inline-flex items-center justify-center font-semibold transition-all duration-300",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    disabled && "opacity-50 pointer-events-none",
    className
  );

  if (!shouldAnimate) {
    return (
      <button
        type={type}
        className={classes}
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
