"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  shouldShake?: boolean;
}

const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ label, error, icon, type = "text", shouldShake = false, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const currentType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${shouldShake ? "animate-cyber-shake" : ""}`}>
        {/* Futuristic Minimal Label */}
        <label className="font-mono text-[10px] uppercase tracking-widest text-white/50 pl-0.5 select-none">
          {label}
        </label>

        {/* Input Wrapper Container */}
        <div className="relative flex items-center w-full">
          {/* Left Icon (optional) */}
          {icon && (
            <div className="absolute left-3.5 text-white/40 pointer-events-none transition-colors duration-200">
              {icon}
            </div>
          )}

          {/* Core Input Field */}
          <input
            type={currentType}
            ref={ref}
            className={`w-full px-4 py-3 text-sm font-sans tracking-wide text-white bg-black/40 border ${
              error ? "border-zinc-500/80" : "border-white/10"
            } rounded-lg backdrop-blur-md outline-none border-glow-focus transition-all duration-300 ${
              icon ? "pl-11" : "pl-4"
            } ${isPassword ? "pr-11" : "pr-4"} focus:bg-black/60 focus:border-white/30 ${className}`}
            {...props}
          />

          {/* Password Eye Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-white/40 hover:text-white transition-colors duration-150 rounded"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* Bottom decorative scanner light at the border */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-white transition-all duration-300 group-focus-within:w-full" />
        </div>

        {/* Error message */}
        {error && (
          <span className="font-mono text-[10px] text-zinc-400 pl-0.5 tracking-wider">
            🚨 {error}
          </span>
        )}
      </div>
    );
  }
);

CyberInput.displayName = "CyberInput";

export default CyberInput;
