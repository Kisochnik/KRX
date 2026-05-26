"use client";

import React, { forwardRef, useState } from "react";
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
      <div className={`flex w-full flex-col gap-1.5 ${shouldShake ? "animate-cyber-shake" : ""}`}>
        <label className="select-none pl-0.5 font-mono text-[10px] uppercase tracking-widest text-white/52">
          {label}
        </label>

        <div className="group relative flex w-full items-center">
          {icon && (
            <div className="pointer-events-none absolute left-3.5 text-white/42 transition-colors duration-200 group-focus-within:text-white/72">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={currentType}
            className={`w-full rounded-lg border bg-black/40 px-4 py-3 text-sm tracking-wide text-white outline-none backdrop-blur-md transition-all duration-300 placeholder:text-white/20 focus:bg-black/65 ${
              error ? "border-white/35" : "border-white/10 focus:border-white/32"
            } ${icon ? "pl-11" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"} ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              title={showPassword ? "Скрыть пароль" : "Показать пароль"}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3.5 rounded-md p-1 text-white/42 transition-all duration-200 hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-1 focus:ring-white/30"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-white transition-all duration-300 group-focus-within:w-[calc(100%-1rem)]" />
        </div>

        {error && (
          <span className="pl-0.5 font-mono text-[10px] uppercase tracking-wider text-white/45">
            {error}
          </span>
        )}
      </div>
    );
  }
);

CyberInput.displayName = "CyberInput";

export default CyberInput;
