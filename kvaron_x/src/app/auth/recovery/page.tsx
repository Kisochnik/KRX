"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CyberInput from "@/components/CyberInput";
import CyberButton from "@/components/CyberButton";
import OtpInput from "@/components/OtpInput";
import { Mail, Send, Lock, ArrowLeft, ArrowRight, ShieldCheck, Check } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RecoveryPage() {
  const { sendRecoveryOtp, verifyOtp, resetPassword, addToast } = useAuth();
  const router = useRouter();

  // Wizard state: method selection -> identifier -> verification -> password reset
  const [step, setStep] = useState<"method" | "identifier" | "verification" | "reset">("method");
  const [method, setMethod] = useState<"email" | "telegram" | null>(null);
  const [identifier, setIdentifier] = useState("");
  
  // Password reset state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Control states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  // Custom Telegram Icon SVG for UI
  const TelegramIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );

  const selectMethod = (selMethod: "email" | "telegram") => {
    setMethod(selMethod);
    setIdentifier("");
    setErrors({});
    setStep("identifier");
  };

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!identifier.trim()) {
      setErrors({ identifier: "Пожалуйста, заполните это поле." });
      triggerShake();
      return;
    }

    if (method === "email" && !/\S+@\S+\.\S+/.test(identifier)) {
      setErrors({ identifier: "Неверный формат электронной почты." });
      triggerShake();
      return;
    }

    if (method === "telegram" && !identifier.startsWith("@")) {
      setErrors({ identifier: "Имя пользователя Telegram должно начинаться с '@'." });
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simulate cryptographic lookup overhead
    setTimeout(() => {
      if (method) {
        const result = sendRecoveryOtp(method, identifier);
        setIsLoading(false);

        if (result.success) {
          setStep("verification");
          addToast(
            "🛡️ Канал шифрования",
            `Запрос восстановления отправлен через ${method === "email" ? "почту" : "Telegram"}.`,
            "success"
          );
        } else {
          setErrors({ identifier: result.error || "Учетная запись не найдена." });
          addToast("🚨 Системное уведомление", result.error || "Ошибка запроса", "error");
          triggerShake();
        }
      }
    }, 1500);
  };

  const handleVerifyOtp = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate connection delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = verifyOtp(identifier, code);
        setIsLoading(false);
        if (isValid) {
          resolve(true);
          // Wait briefly for verification check animation to complete before sliding in password reset
          setTimeout(() => {
            setStep("reset");
          }, 1500);
        } else {
          resolve(false);
        }
      }, 1500);
    });
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!newPassword) {
      newErrors.newPassword = "Новый пароль обязателен.";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Пароль должен быть длиной от 6 символов.";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simulate password database update delay
    setTimeout(() => {
      const success = resetPassword(identifier, newPassword);
      setIsLoading(false);

      if (success) {
        setStep("method"); // reset state internally
        router.push("/auth/login");
      }
    }, 1500);
  };

  const handleBack = () => {
    setErrors({});
    if (step === "identifier") setStep("method");
    else if (step === "verification") setStep("identifier");
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

      {/* Card Header with optional Back Arrow */}
      <div className="flex flex-col gap-1.5 border-b border-white/5 pb-4 relative select-none">
        {step !== "method" && step !== "reset" && (
          <button
            onClick={handleBack}
            disabled={isLoading}
            className="absolute right-0 top-0 text-white/40 hover:text-white transition-colors duration-150 p-1 rounded cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <h2 className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-white/90">
          Сброс и восстановление доступа
        </h2>
        <p className="text-[11px] text-cyber-text-muted">
          {step === "method" && "Выберите предпочтительный метод для подтверждения вашей личности."}
          {step === "identifier" && `Введите адрес вашей почты или Telegram-аккаунт.`}
          {step === "verification" && `Введите 6-значный проверочный код из логов системы.`}
          {step === "reset" && `Установите новый криптографический пароль для вашего профиля.`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: Select Channel Method */}
        {step === "method" && (
          <motion.div
            key="method-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4"
          >
            {/* Email selection card */}
            <button
              onClick={() => selectMethod("email")}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer text-left w-full select-none"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/35">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    Электронная почта
                  </span>
                  <span className="text-[10px] text-cyber-text-muted mt-0.5">
                    Получение кода на kvaronx@gmail.com
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors group-hover:translate-x-0.5 duration-200" />
            </button>

            {/* Telegram selection card */}
            <button
              onClick={() => selectMethod("telegram")}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer text-left w-full select-none"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/35">
                  <TelegramIcon />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    Аккаунт Telegram
                  </span>
                  <span className="text-[10px] text-cyber-text-muted mt-0.5">
                    Код безопасности от @KVARON_X_BOT
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors group-hover:translate-x-0.5 duration-200" />
            </button>
          </motion.div>
        )}

        {/* STEP 2: Input Identifier */}
        {step === "identifier" && (
          <motion.form
            key="identifier-step"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handleIdentifierSubmit}
            className="flex flex-col gap-5"
          >
            <CyberInput
              label={method === "email" ? "Электронная Почта" : "Никнейм в Telegram"}
              placeholder={method === "email" ? "name@example.com" : "@username"}
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setErrors((prev) => ({ ...prev, identifier: "" }));
              }}
              error={errors.identifier}
              shouldShake={shouldShake && !identifier}
              icon={method === "email" ? <Mail className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              disabled={isLoading}
            />

            <CyberButton type="submit" isLoading={isLoading} className="mt-2">
              Выслать проверочный код <ArrowRight className="w-4 h-4 ml-1" />
            </CyberButton>
          </motion.form>
        )}

        {/* STEP 3: OTP Code verification */}
        {step === "verification" && (
          <motion.div
            key="verification-step"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <OtpInput
              identifier={identifier}
              onVerify={handleVerifyOtp}
              onResend={() => sendRecoveryOtp(method!, identifier)}
              isVerifying={isLoading}
            />
          </motion.div>
        )}

        {/* STEP 4: Set New Password Form */}
        {step === "reset" && (
          <motion.form
            key="reset-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onSubmit={handlePasswordResetSubmit}
            className="flex flex-col gap-4.5"
          >
            <CyberInput
              label="Новый Пароль"
              placeholder="Минимум 6 символов"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prev) => ({ ...prev, newPassword: "" }));
              }}
              error={errors.newPassword}
              shouldShake={shouldShake && !newPassword}
              icon={<Lock className="w-4 h-4" />}
              disabled={isLoading}
            />

            <CyberInput
              label="Повторите Пароль"
              placeholder="Введите пароль еще раз"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              error={errors.confirmPassword}
              shouldShake={shouldShake && !confirmPassword}
              icon={<Lock className="w-4 h-4" />}
              disabled={isLoading}
            />

            <CyberButton type="submit" isLoading={isLoading} className="mt-3">
              Обновить пароль <ShieldCheck className="w-4 h-4 ml-1" />
            </CyberButton>
          </motion.form>
        )}

      </AnimatePresence>

      {/* Footer login redirect links */}
      {step === "method" && (
        <div className="flex justify-center items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-white/30 pt-2 border-t border-white/5 select-none">
          <Link
            href="/auth/login"
            className="text-white hover:underline transition-all duration-200 flex items-center gap-1 font-bold"
          >
            <ArrowLeft className="w-3 h-3" /> Вернуться назад
          </Link>
        </div>
      )}
    </motion.div>
  );
}
