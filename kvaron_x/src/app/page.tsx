"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundGrid from "@/components/BackgroundGrid";

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [bootText, setBootText] = useState("Инициализация квантового ядра...");

  // Progress counter simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Random progress jumps
        const next = prev + Math.floor(Math.random() * 8) + 3;
        return next > 100 ? 100 : next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Update booting log texts as progress increases
  useEffect(() => {
    if (progress < 25) {
      setBootText("ЗАГРУЗКА БАЗОВЫХ ПРОТОКОЛОВ СВЯЗИ...");
    } else if (progress < 50) {
      setBootText("ПОДКЛЮЧЕНИЕ СЕТЕВОГО ШЛЮЗА kvaronx@gmail.com...");
    } else if (progress < 75) {
      setBootText("АКТИВАЦИЯ МОДУЛЕЙ ГЛАССМОРФИЗМА И ТЕМНОЙ ТЕМЫ...");
    } else if (progress < 95) {
      setBootText("ПРОВЕРКА КРИПТОГРАФИЧЕСКИХ ТОКЕНОВ СЕССИИ...");
    } else {
      setBootText("ЗАПУСК СИСТЕМЫ...");
    }
  }, [progress]);

  // Session check and redirect on completion
  useEffect(() => {
    if (progress === 100) {
      const redirectTimer = setTimeout(() => {
        const session = localStorage.getItem("kvaron_session");
        if (session) {
          router.push("/dashboard");
        } else {
          router.push("/auth/login");
        }
      }, 800); // Small pause for full visual completion
      return () => clearTimeout(redirectTimer);
    }
  }, [progress, router]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 bg-cyber-black text-white font-mono select-none overflow-hidden">
      {/* Interactive Grid Background */}
      <BackgroundGrid />

      {/* Center Loader */}
      <div className="flex flex-col items-center gap-6 z-10 max-w-[450px] w-full text-center">
        
        {/* Animated outer circle and glowing shield */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative shadow-[0_0_40px_rgba(255,255,255,0.03)]"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>

          {/* Glowing scanner rotating around the shield */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-0 border border-transparent border-t-white/30 border-b-white/5 rounded-full"
          />
        </div>

        {/* Brand Name */}
        <div className="flex flex-col gap-1.5 mt-2">
          <span className="text-xl font-black tracking-[0.3em] uppercase text-white">
            KVARON_X
          </span>
          <span className="text-[8px] uppercase tracking-[0.4em] text-white/30">
            quantum security gate
          </span>
        </div>

        {/* Progress readouts */}
        <div className="w-full flex flex-col gap-2 mt-8">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-white/40 px-1 font-bold">
            <span className="animate-pulse">{bootText}</span>
            <span className="text-white font-mono">{progress}%</span>
          </div>

          {/* Custom progress loading bar */}
          <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Additional technology logs at bottom */}
        <div className="h-4 mt-2">
          <AnimatePresence mode="wait">
            {progress > 5 && progress < 98 && (
              <motion.div
                key={bootText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-[7.5px] uppercase tracking-widest text-white/20"
              >
                SECURE_CONN_ESTABLISHED // PORT_TLS_443 // AES_CBC_HMAC
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Grid overlay design elements */}
      <div className="absolute top-8 left-8 text-[8px] uppercase tracking-widest text-white/10 select-none">
        sys_status // loading
      </div>
      <div className="absolute bottom-8 right-8 text-[8px] uppercase tracking-widest text-white/10 select-none">
        kvaron_x // secure_access_sys
      </div>
    </div>
  );
}
