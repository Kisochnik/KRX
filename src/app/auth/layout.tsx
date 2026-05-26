"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LockKeyhole, Shield } from "lucide-react";
import BackgroundGrid from "@/components/BackgroundGrid";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex h-screen flex-col items-center overflow-y-auto bg-black px-4 py-8 text-white selection:bg-white selection:text-black sm:justify-center sm:py-10">
      <BackgroundGrid />

      <div className="pointer-events-none absolute inset-0 -z-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_22%)]" />
      <div className="pointer-events-none absolute left-0 top-0 h-24 w-px bg-gradient-to-b from-white/20 to-transparent" />
      <div className="pointer-events-none absolute left-0 top-0 h-px w-24 bg-gradient-to-r from-white/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-px bg-gradient-to-t from-white/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-px w-24 bg-gradient-to-l from-white/20 to-transparent" />

      <main className="relative z-10 flex w-full max-w-[520px] flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3"
        >
          <Link href="/auth/login" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/[0.09] group-hover:shadow-[0_0_24px_rgba(255,255,255,0.08)]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="select-none font-mono text-lg font-black tracking-[0.25em] text-white">
              KVARON<span className="text-zinc-500 transition-colors duration-300 group-hover:text-white">_X</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-white/38 backdrop-blur-xl">
            <LockKeyhole className="h-3 w-3" />
            Безопасный шлюз доступа
          </div>
        </motion.div>

        {children}

        <div className="flex items-center justify-between px-2 font-mono text-[8px] uppercase tracking-widest text-white/22">
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
            <span>Система активна</span>
          </div>
          <span>AUTH v3.0</span>
        </div>
      </main>
    </div>
  );
}
