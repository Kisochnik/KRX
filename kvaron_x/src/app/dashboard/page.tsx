"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BackgroundGrid from "@/components/BackgroundGrid";
import CyberButton from "@/components/CyberButton";
import { Shield, LogOut, Terminal, Activity, Users, Key, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user, logout, addToast } = useAuth();
  const router = useRouter();
  
  // Guard routing state
  const [isChecking, setIsChecking] = useState(true);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [sessionTime, setSessionTime] = useState(0);

  // Protection & Redirect Guard
  useEffect(() => {
    // Check if session exists in local storage fallback or state
    const session = localStorage.getItem("kvaron_session");
    if (!session && !user) {
      addToast(
        "🛡️ Защита Системы",
        "Обнаружена неавторизованная попытка входа. Запуск протокола блокировки.",
        "error"
      );
      
      // Delay to let the visual redirect screen show
      const t = setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
      return () => clearTimeout(t);
    } else {
      setIsChecking(false);
      
      // Initialize dynamic mock system logs
      setSystemLogs([
        `[${new Date().toLocaleTimeString()}] Инициализация криптографического ядра...`,
        `[${new Date().toLocaleTimeString()}] Сессия пользователя ${JSON.parse(session || "{}").nickname || "демо"} успешно заверена.`,
        `[${new Date().toLocaleTimeString()}] Проверка целостности ключей: 100% ОК.`,
        `[${new Date().toLocaleTimeString()}] Системный шлюз kvaronx@gmail.com запущен.`,
      ]);
    }
  }, [user, router, addToast]);

  // Dynamic log generator to make dashboard feel alive
  useEffect(() => {
    if (isChecking) return;

    const timer = setInterval(() => {
      const logs = [
        "Аудит безопасности: порты закрыты.",
        "Пинг к ноде KVX-Alpha: 14мс.",
        "Выполнено резервное копирование реестра.",
        "Проверка входящих токенов сессий... Активны.",
        "Обработка хэшей паролей: алгоритм PBKDF2 активен.",
        "Соединение с kvaronx@gmail.com стабильно.",
        "Синхронизация хэшей транзакций завершена.",
      ];
      
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setSystemLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] ${randomLog}`,
        ...prev.slice(0, 8), // Keep only top 8
      ]);
    }, 4500);

    return () => clearInterval(timer);
  }, [isChecking]);

  // Session duration timer
  useEffect(() => {
    if (isChecking) return;
    const t = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [isChecking]);

  // Format session time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${s < 10 ? `0${s}` : s}`;
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (isChecking) {
    // Elegant Security Verification Screen
    return (
      <div className="relative min-h-screen flex flex-col justify-center items-center px-4 bg-cyber-black text-white font-mono select-none overflow-hidden">
        <BackgroundGrid />
        
        {/* Decorative scanning red-dot or cyber light */}
        <div className="absolute inset-x-0 h-[1.5px] bg-zinc-500 top-0 animate-scanline pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 rounded-2xl max-w-[400px] text-center border-zinc-700/40 relative"
        >
          <AlertCircle className="w-12 h-12 text-zinc-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-white/90 mb-3">
            ПРОВЕРКА ДОСТУПА
          </h2>
          <p className="text-[10px] text-cyber-text-muted leading-relaxed uppercase tracking-wider mb-2">
            Идет верификация токена безопасности сессии...
          </p>
          <p className="text-[9px] text-white/20">
            Отказ в доступе. Перенаправление в сектор авторизации.
          </p>
        </motion.div>
      </div>
    );
  }

  const currentUser = user || { nickname: "Пользователь", email: "kvaronx_user@example.com", dob: "2000-01-01" };

  return (
    <div className="relative min-h-screen flex flex-col p-4 md:p-8 select-none overflow-hidden bg-cyber-black text-white">
      {/* Interactive Background */}
      <BackgroundGrid />

      {/* Grid Dashboard Layout */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 z-10 flex-1">
        
        {/* 1. Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold tracking-[0.25em] uppercase text-white">
                KVARON_X
              </span>
              <span className="font-mono text-[8px] uppercase tracking-widest text-white/30">
                Защищенный командный центр
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Session Timer readout */}
            <div className="flex flex-col items-end font-mono text-[9px] uppercase tracking-wider text-white/40">
              <span className="text-[8px] text-white/20">Время сессии</span>
              <span className="text-white font-bold">{formatTime(sessionTime)}</span>
            </div>
            
            {/* Logout button */}
            <CyberButton
              variant="outline"
              onClick={handleLogout}
              className="py-2.5 px-4 h-fit font-semibold"
            >
              Выйти <LogOut className="w-3.5 h-3.5 ml-1" />
            </CyberButton>
          </div>
        </header>

        {/* 2. Main Analytics Stats Grid */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: User Cryptographic Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-panel p-6 rounded-2xl glass-panel-glow flex flex-col justify-between h-[180px]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Крипто-профиль
              </h3>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>

            <div className="flex flex-col gap-1 pr-4">
              <span className="text-xl font-bold tracking-wide break-all truncate text-white uppercase select-text">
                {currentUser.nickname}
              </span>
              <span className="font-mono text-[10px] text-cyber-text-muted break-all select-text">
                {currentUser.email}
              </span>
            </div>

            <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-widest text-white/20 border-t border-white/5 pt-3">
              <span>Доступ подтвержден</span>
              <span>{currentUser.dob}</span>
            </div>
          </motion.div>

          {/* Card 2: Cryptographic status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl glass-panel-glow flex flex-col justify-between h-[180px]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> Шифрование сессии
              </h3>
              <span className="font-mono text-[9px] uppercase font-bold text-white px-2 py-0.5 rounded bg-white/5 border border-white/5">
                AES-256
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">
                99.86%
              </span>
              <span className="text-[10px] text-cyber-text-muted">
                Индекс защиты и целостности соединений.
              </span>
            </div>

            <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-widest text-white/20 border-t border-white/5 pt-3">
              <span>Шлюз связи</span>
              <span className="text-white select-all">kvaronx@gmail.com</span>
            </div>
          </motion.div>

          {/* Card 3: Interactive metrics */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl glass-panel-glow flex flex-col justify-between h-[180px]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Нагрузка модулей
              </h3>
              <div className="flex gap-1 h-3 items-end">
                <span className="w-0.5 h-1.5 bg-white/20 rounded-full animate-pulse" />
                <span className="w-0.5 h-3 bg-white rounded-full animate-pulse delay-75" />
                <span className="w-0.5 h-2.5 bg-white/50 rounded-full animate-pulse delay-150" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">
                14 мс
              </span>
              <span className="text-[10px] text-cyber-text-muted">
                Задержка шифрованного ядра KVX.
              </span>
            </div>

            <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-widest text-white/20 border-t border-white/5 pt-3">
              <span>Интеграция бэкенда</span>
              <span className="font-bold text-white uppercase">Имитация</span>
            </div>
          </motion.div>

        </main>

        {/* 3. Futuristic Security Terminal Logger */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex-1 min-h-[300px] flex flex-col glass-panel p-6 rounded-2xl glass-panel-glow gap-4"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-white/60 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Терминал аудита безопасности (Логирование транзакций)
            </h3>
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/20 select-none">
              Протокол LOG_STREAM
            </span>
          </div>

          <div className="flex-1 font-mono text-xs text-zinc-400 select-text overflow-y-auto max-h-[350px] flex flex-col gap-2.5 scrollbar-thin pr-2 scroll-smooth">
            {systemLogs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:text-white transition-colors py-0.5 border-l border-white/5 pl-3"
              >
                {log}
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
