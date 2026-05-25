"use client";

import React from "react";
import BackgroundGrid from "@/components/BackgroundGrid";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 select-none overflow-hidden">
      {/* Interactive Cyber Background Grid */}
      <BackgroundGrid />

      {/* Cybernetic glowing decorative lines on the edges of the screen */}
      <div className="absolute top-0 left-0 w-16 h-[1px] bg-white/10" />
      <div className="absolute top-0 left-0 w-[1px] h-16 bg-white/10" />
      <div className="absolute bottom-0 right-0 w-16 h-[1px] bg-white/10" />
      <div className="absolute bottom-0 right-0 w-[1px] h-16 bg-white/10" />

      {/* Central Card Wrapper */}
      <div className="w-full max-w-[440px] flex flex-col gap-6 z-10">
        
        {/* Futuristic KVARON_X Logo & Branding */}
        <div className="flex flex-col items-center gap-2">
          <Link href="/auth/login" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono text-lg font-black tracking-[0.25em] text-white select-none">
              KVARON<span className="text-zinc-500 group-hover:text-white transition-colors duration-300">_X</span>
            </span>
          </Link>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 select-none">
            secure access gateway
          </span>
        </div>

        {/* Dynamic page container */}
        {children}

        {/* Futuristic System Status Footer */}
        <div className="flex items-center justify-between px-2 font-mono text-[8px] uppercase tracking-widest text-white/20 select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-white animate-ping" />
            <span>Система активна</span>
          </div>
          <span>v2.6.5-PROD</span>
        </div>

      </div>
    </div>
  );
}
