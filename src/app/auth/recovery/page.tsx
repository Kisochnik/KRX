"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, KeyRound, Lock, Mail, Send, ShieldCheck } from "lucide-react";
import CyberButton from "@/components/CyberButton";
import CyberInput from "@/components/CyberInput";
import OtpInput from "@/components/OtpInput";
import { KVARON_AUTH_EMAIL, useAuth } from "@/context/AuthContext";

type RecoveryMethod = "email" | "telegram";
type RecoveryStep = "method" | "identifier" | "verification" | "reset";

const METHODS: {
  id: RecoveryMethod;
  label: string;
  sub: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "email",
    label: "Почта",
    sub: `Код придёт от ${KVARON_AUTH_EMAIL}`,
    icon: <Mail className="h-5 w-5 text-white" />,
  },
  {
    id: "telegram",
    label: "Telegram",
    sub: "Код от бота @KVARON_X_BOT",
    icon: <Send className="h-5 w-5 text-white" />,
  },
];

const STEPS: RecoveryStep[] = ["method", "identifier", "verification", "reset"];

export default function RecoveryPage() {
  const { sendRecoveryOtp, verifyOtp, resetPassword, addToast } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<RecoveryStep>("method");
  const [method, setMethod] = useState<RecoveryMethod | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [verificationTarget, setVerificationTarget] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const triggerShake = () => {
    setShouldShake(true);
    window.setTimeout(() => setShouldShake(false), 500);
  };

  const selectMethod = (nextMethod: RecoveryMethod) => {
    setMethod(nextMethod);
    setIdentifier("");
    setVerificationTarget("");
    setErrors({});
    setStep("identifier");
  };

  const inputLabel = method === "email" ? "Email" : "Telegram";
  const inputPlaceholder = method === "email" ? "demo@kvaronx.com" : "@demo";
  const inputType = method === "email" ? "email" : "text";
  const inputIcon = method === "email" ? <Mail className="h-4 w-4" /> : <Send className="h-4 w-4" />;

  const validateIdentifier = () => {
    const nextErrors: Record<string, string> = {};
    const value = identifier.trim();

    if (!value) {
      nextErrors.identifier = "Заполните поле.";
    } else if (method === "email" && !/\S+@\S+\.\S+/.test(value)) {
      nextErrors.identifier = "Проверьте формат email.";
    } else if (method === "telegram" && !/^@?[a-zA-Z0-9_]{3,}$/.test(value)) {
      nextErrors.identifier = "Введите Telegram в формате @username.";
    }

    return nextErrors;
  };

  const handleIdentifierSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!method) return;

    const nextErrors = validateIdentifier();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      triggerShake();
      return;
    }

    setErrors({});
    setIsLoading(true);

    window.setTimeout(() => {
      const result = sendRecoveryOtp(method, identifier.trim());
      setIsLoading(false);

      if (result.success && result.target) {
        setVerificationTarget(result.target);
        setStep("verification");
        addToast(
          "Код отправлен",
          `Проверочный код отправлен через ${method === "email" ? "почту" : "Telegram"}.`,
          "success"
        );
        return;
      }

      setErrors({ identifier: result.error || "Учётная запись не найдена." });
      addToast("Ошибка", result.error || "Не удалось найти аккаунт.", "error");
      triggerShake();
    }, 1000);
  };

  const handleVerifyOtp = async (code: string): Promise<boolean> => {
    setIsLoading(true);

    return new Promise((resolve) => {
      window.setTimeout(() => {
        const isValid = verifyOtp(verificationTarget || identifier, code);
        setIsLoading(false);

        if (isValid) {
          resolve(true);
          window.setTimeout(() => setStep("reset"), 1300);
          return;
        }

        resolve(false);
      }, 900);
    });
  };

  const handleResendCode = () => {
    if (!method) return;
    const result = sendRecoveryOtp(method, identifier.trim());
    if (result.target) setVerificationTarget(result.target);
  };

  const handlePasswordReset = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!newPassword) nextErrors.newPassword = "Введите новый пароль.";
    else if (newPassword.length < 8) nextErrors.newPassword = "Минимум 8 символов.";
    if (!confirmPassword) nextErrors.confirmPassword = "Повторите пароль.";
    else if (newPassword !== confirmPassword) nextErrors.confirmPassword = "Пароли не совпадают.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      triggerShake();
      return;
    }

    setErrors({});
    setIsLoading(true);

    window.setTimeout(() => {
      const success = resetPassword(verificationTarget || identifier, newPassword);
      setIsLoading(false);
      if (success) window.setTimeout(() => router.push("/auth/login"), 800);
    }, 1000);
  };

  const handleBack = () => {
    setErrors({});
    if (step === "identifier") setStep("method");
    if (step === "verification") setStep("identifier");
  };

  const headerLabel: Record<RecoveryStep, string> = {
    method: "Восстановление пароля",
    identifier: "Куда отправить код",
    verification: "Введите код",
    reset: "Новый пароль",
  };

  const headerSub: Record<RecoveryStep, string> = {
    method: "Выберите почту или Telegram для получения 6-значного кода.",
    identifier: method === "email" ? "Введите email вашего аккаунта." : "Введите Telegram-ник вашего аккаунта.",
    verification: "Введите 6-значный код из сообщения.",
    reset: "Установите новый пароль для входа в KVARON_X.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel relative flex flex-col gap-6 overflow-hidden rounded-2xl p-6 sm:p-8"
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="scan"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-white to-transparent"
          />
        )}
      </AnimatePresence>

      <div className="relative flex flex-col gap-1.5 border-b border-white/[0.06] pb-4">
        {(step === "identifier" || step === "verification") && (
          <button
            type="button"
            onClick={handleBack}
            disabled={isLoading}
            className="absolute right-0 top-0 rounded-lg p-1.5 text-white/40 transition-all hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
            aria-label="Назад"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]">
            <KeyRound className="h-4 w-4 text-white/75" />
          </div>
          <h1 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/90">
            {headerLabel[step]}
          </h1>
        </div>
        <p className="pl-10 text-[11px] text-white/42">{headerSub[step]}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        {STEPS.map((item, index) => (
          <div key={item} className="flex items-center gap-2">
            <div
              className={`rounded-full transition-all duration-300 ${
                step === item
                  ? "h-3 w-3 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  : index < stepIndex
                    ? "h-2 w-2 bg-white/60"
                    : "h-2 w-2 bg-white/15"
              }`}
            />
            {index < STEPS.length - 1 && (
              <div className={`h-px w-6 transition-all duration-500 ${index < stepIndex ? "bg-white/40" : "bg-white/10"}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === "method" && (
          <motion.div
            key="method"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-2.5"
          >
            {METHODS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectMethod(item.id)}
                className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-left transition-all duration-300 hover:border-white/25 hover:bg-white/[0.07]"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/[0.1]">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-white">{item.label}</p>
                    <p className="mt-0.5 truncate text-[10px] text-white/35">{item.sub}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/70" />
              </button>
            ))}
          </motion.div>
        )}

        {step === "identifier" && (
          <motion.form
            key="identifier"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            onSubmit={handleIdentifierSubmit}
            className="flex flex-col gap-4"
          >
            <CyberInput
              label={inputLabel}
              placeholder={inputPlaceholder}
              type={inputType}
              value={identifier}
              onChange={(event) => {
                setIdentifier(event.target.value);
                setErrors((prev) => ({ ...prev, identifier: "" }));
              }}
              error={errors.identifier}
              shouldShake={shouldShake && !identifier}
              icon={inputIcon}
              disabled={isLoading}
            />

            <CyberButton type="submit" isLoading={isLoading}>
              Отправить код <ArrowRight className="ml-1.5 h-4 w-4" />
            </CyberButton>
          </motion.form>
        )}

        {step === "verification" && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            <OtpInput
              identifier={verificationTarget || identifier}
              onVerify={handleVerifyOtp}
              onResend={handleResendCode}
              isVerifying={isLoading}
            />
          </motion.div>
        )}

        {step === "reset" && (
          <motion.form
            key="reset"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onSubmit={handlePasswordReset}
            className="flex flex-col gap-4"
          >
            <CyberInput
              label="Новый пароль"
              placeholder="Минимум 8 символов"
              type="password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                setErrors((prev) => ({ ...prev, newPassword: "" }));
              }}
              error={errors.newPassword}
              shouldShake={shouldShake && !newPassword}
              icon={<Lock className="h-4 w-4" />}
              disabled={isLoading}
            />

            {newPassword.length > 0 && (
              <div className="-mt-2 flex gap-1">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                      newPassword.length >= item * 2 ? "bg-white" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            )}

            <CyberInput
              label="Повторите пароль"
              placeholder="Введите пароль ещё раз"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              error={errors.confirmPassword}
              shouldShake={shouldShake && !confirmPassword}
              icon={<Lock className="h-4 w-4" />}
              disabled={isLoading}
            />

            <CyberButton type="submit" isLoading={isLoading} className="mt-2">
              Обновить пароль <ShieldCheck className="ml-1.5 h-4 w-4" />
            </CyberButton>
          </motion.form>
        )}
      </AnimatePresence>

      {step === "method" && (
        <div className="flex items-center justify-center gap-1.5 border-t border-white/[0.05] pt-2 font-mono text-[9px] uppercase tracking-wider text-white/30">
          <Link href="/auth/login" className="flex items-center gap-1 font-bold text-white transition-colors hover:text-white/70">
            <ArrowLeft className="h-3 w-3" />
            Вернуться ко входу
          </Link>
        </div>
      )}
    </motion.div>
  );
}
