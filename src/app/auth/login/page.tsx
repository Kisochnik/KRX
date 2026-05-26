"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AtSign, Check, KeyRound, Lock, LogIn, ShieldCheck, UserRound } from "lucide-react";
import CyberButton from "@/components/CyberButton";
import CyberInput from "@/components/CyberInput";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { loginUser, addToast } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const triggerShake = () => {
    setShouldShake(true);
    window.setTimeout(() => setShouldShake(false), 480);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const value = identifier.trim();

    if (!value) {
      nextErrors.identifier = "Введите имя пользователя или почту.";
    } else if (value.includes("@") && !value.startsWith("@") && !/\S+@\S+\.\S+/.test(value)) {
      nextErrors.identifier = "Проверьте формат почты.";
    } else if (!value.includes("@") && value.length < 3) {
      nextErrors.identifier = "Минимум 3 символа.";
    }

    if (!password) nextErrors.password = "Введите пароль.";

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      triggerShake();
      return;
    }

    setErrors({});
    setIsLoading(true);

    window.setTimeout(() => {
      const result = loginUser(identifier.trim(), password, rememberMe);

      if (result.success) {
        addToast("Доступ открыт", "Переходим в KVARON_X.", "success", 4200);
        window.setTimeout(() => router.push("/"), 650);
        return;
      }

      setIsLoading(false);
      setErrors({ form: result.error || "Не удалось войти." });
      addToast("Ошибка входа", result.error || "Проверьте данные и пароль.", "error");
      triggerShake();
    }, 850);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel relative flex flex-col gap-6 overflow-hidden rounded-2xl p-6 sm:p-8"
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="login-scan"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-white to-transparent"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-1.5 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
            <LogIn className="h-4 w-4 text-white/75" />
          </div>
          <h1 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/90">
            Вход в аккаунт
          </h1>
        </div>
        <p className="pl-10 text-[11px] text-white/42">
          Введите никнейм или почту, чтобы открыть защищённую сессию.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Имя пользователя", icon: <UserRound className="h-3.5 w-3.5" /> },
          { label: "Почта", icon: <AtSign className="h-3.5 w-3.5" /> },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/45"
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <CyberInput
          label="Имя пользователя или Почта"
          placeholder="demo или demo@kvaronx.com"
          type="text"
          value={identifier}
          onChange={(event) => {
            setIdentifier(event.target.value);
            setErrors((prev) => ({ ...prev, identifier: "", form: "" }));
          }}
          error={errors.identifier}
          icon={<UserRound className="h-4 w-4" />}
          disabled={isLoading}
          shouldShake={shouldShake && !identifier}
        />

        <div className="relative">
          <CyberInput
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((prev) => ({ ...prev, password: "", form: "" }));
            }}
            error={errors.password}
            icon={<Lock className="h-4 w-4" />}
            disabled={isLoading}
            shouldShake={shouldShake && !password}
          />
          <Link
            href="/auth/recovery"
            className="absolute right-0 -top-0.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-white/36 transition-colors hover:text-white"
          >
            <KeyRound className="h-3 w-3" />
            Забыли пароль?
          </Link>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setRememberMe((value) => !value)}
            disabled={isLoading}
            className="group flex items-center gap-2.5 text-left disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded border transition-all duration-200 ${
                rememberMe ? "border-white bg-white" : "border-white/20 bg-white/[0.03] group-hover:border-white/45"
              }`}
            >
              {rememberMe && <Check className="h-2.5 w-2.5 text-black" strokeWidth={3} />}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/42 transition-colors group-hover:text-white/65">
              Запомнить вход
            </span>
          </button>

          <div className="hidden items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-white/25 sm:flex">
            <ShieldCheck className="h-3 w-3" />
            Тёмный режим
          </div>
        </div>

        <AnimatePresence>
          {errors.form && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center font-mono text-[10px] uppercase tracking-wider text-white/45"
            >
              {errors.form}
            </motion.div>
          )}
        </AnimatePresence>

        <CyberButton type="submit" isLoading={isLoading} className="mt-1">
          Войти <LogIn className="ml-1.5 h-4 w-4" />
        </CyberButton>
      </form>

      <div className="flex items-center justify-center gap-1.5 border-t border-white/[0.05] pt-2 font-mono text-[9px] uppercase tracking-wider text-white/30">
        <span>Нет аккаунта?</span>
        <Link href="/auth/register" className="font-bold text-white transition-colors hover:text-white/70">
          Зарегистрироваться
        </Link>
      </div>
    </motion.div>
  );
}
