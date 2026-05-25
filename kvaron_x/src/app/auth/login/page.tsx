"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CyberInput from "@/components/CyberInput";
import CyberButton from "@/components/CyberButton";
import { Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { loginUser, addToast } = useAuth();
  const router = useRouter();

  // Form states
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Core validation
    const newErrors: { [key: string]: string } = {};
    if (!emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Пожалуйста, введите имя пользователя или почту.";
    }
    if (!password) {
      newErrors.password = "Пожалуйста, введите пароль.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simulate cyber-network analysis / scanning delay for premium futuristic effect
    setTimeout(() => {
      const result = loginUser(emailOrUsername, password);
      
      if (result.success) {
        addToast(
          "🔓 Доступ разрешен",
          "Верификация протоколов безопасности завершена. Переход в личный кабинет...",
          "success"
        );
        
        // Relocate to dashboard
        router.push("/dashboard");
      } else {
        setErrors({ form: result.error || "Ошибка аутентификации." });
        addToast("🚨 Системная ошибка", result.error || "Неверные учетные данные", "error");
        triggerShake();
        setIsLoading(false);
      }
    }, 1500);
  };

  const triggerShake = () => {
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-8 rounded-2xl glass-panel-glow flex flex-col gap-6 relative"
    >
      {/* Decorative vertical running scanner overlay on card */}
      {isLoading && (
        <div className="absolute inset-x-0 h-[1px] bg-white/20 blur-[0.5px] top-0 animate-scanline pointer-events-none" />
      )}

      {/* Card Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/5 pb-4 select-none">
        <h2 className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-white/90">
          Идентификация пользователя
        </h2>
        <p className="text-[11px] text-cyber-text-muted">
          Введите ваши криптографические ключи доступа для входа.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Username/Email Input */}
        <CyberInput
          label="Логин или Почта"
          placeholder="username / name@example.com"
          type="text"
          value={emailOrUsername}
          onChange={(e) => {
            setEmailOrUsername(e.target.value);
            setErrors((prev) => ({ ...prev, emailOrUsername: "", form: "" }));
          }}
          error={errors.emailOrUsername}
          shouldShake={shouldShake && !emailOrUsername}
          icon={<Mail className="w-4 h-4" />}
          disabled={isLoading}
        />

        {/* Password Input */}
        <div className="flex flex-col gap-1.5 relative">
          <CyberInput
            label="Пароль"
            placeholder="••••••••••••"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "", form: "" }));
            }}
            error={errors.password}
            shouldShake={shouldShake && !password}
            icon={<Lock className="w-4 h-4" />}
            disabled={isLoading}
          />
          
          {/* Recovery password button floating right of input */}
          <div className="absolute right-0 top-0 select-none">
            <Link
              href="/auth/recovery"
              className="font-mono text-[9px] uppercase tracking-wider text-white/40 hover:text-white transition-colors duration-150 mr-0.5"
            >
              Забыли?
            </Link>
          </div>
        </div>

        {/* Form General Error Alert */}
        {errors.form && (
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center font-mono text-[10px] text-zinc-400 select-text animate-cyber-shake">
            ⚠️ ОШИБКА: {errors.form}
          </div>
        )}

        {/* Submit Action CTA */}
        <CyberButton type="submit" isLoading={isLoading} className="mt-2">
          Войти <LogIn className="w-4 h-4 ml-1" />
        </CyberButton>

      </form>

      {/* Registration link footer */}
      <div className="flex justify-center items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-white/30 pt-2 border-t border-white/5 select-none">
        <span>Нет аккаунта?</span>
        <Link
          href="/auth/register"
          className="text-white font-bold hover:underline transition-all duration-200"
        >
          Создать профиль
        </Link>
      </div>

    </motion.div>
  );
}
