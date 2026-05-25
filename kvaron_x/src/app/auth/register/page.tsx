"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CyberInput from "@/components/CyberInput";
import CyberButton from "@/components/CyberButton";
import OtpInput from "@/components/OtpInput";
import { User, Mail, Lock, Calendar, UserPlus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const { registerUser, sendVerificationOtp, verifyOtp, addToast } = useAuth();
  const router = useRouter();

  // Step states
  const [step, setStep] = useState<"form" | "verification">("form");

  // Form input states
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");

  // Control states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  // Validate form details
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!nickname.trim()) {
      newErrors.nickname = "Никнейм обязателен для заполнения.";
    } else if (nickname.length < 3) {
      newErrors.nickname = "Никнейм должен быть не менее 3 символов.";
    }

    if (!email.trim()) {
      newErrors.email = "Email обязателен для заполнения.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Неверный формат электронной почты.";
    }

    if (!password) {
      newErrors.password = "Пароль обязателен для заполнения.";
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен быть длиной от 6 символов.";
    }

    if (!dob) {
      newErrors.dob = "Пожалуйста, укажите дату рождения.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Simulate cryptographic processing / network registration overhead
    setTimeout(() => {
      // Trigger code generation and send toast
      sendVerificationOtp(email);
      setIsLoading(false);
      setStep("verification");
      
      addToast(
        "🛡️ Система Безопасности",
        "Создан шифрованный канал верификации. Пожалуйста, подтвердите вашу почту.",
        "success"
      );
    }, 1500);
  };

  // Resend code trigger
  const handleResendOtp = () => {
    sendVerificationOtp(email);
    addToast("🔄 Запрос кода", "Новый код подтверждения сгенерирован и отправлен на email.", "info");
  };

  // Verify OTP code
  const handleVerifyOtp = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = verifyOtp(email, code);
        
        if (isValid) {
          // Commit to fake backend registry
          const success = registerUser(nickname, email, dob, password);
          if (success) {
            resolve(true);
            
            // Relocate to login page after short delay to show success checkmark
            setTimeout(() => {
              router.push("/auth/login");
            }, 3000);
          } else {
            setIsLoading(false);
            resolve(false);
          }
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1500);
    });
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
          {step === "form" ? "Создание учетной записи" : "Подтверждение профиля"}
        </h2>
        <p className="text-[11px] text-cyber-text-muted">
          {step === "form"
            ? "Зарегистрируйте новый крипто-ключ профиля в системе."
            : "Введите код, отправленный на ваш шифрованный почтовый адрес."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "form" ? (
          <motion.form
            key="form-step"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-4.5"
          >
            {/* Nickname Input */}
            <CyberInput
              label="Никнейм"
              placeholder="neo_matrix"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setErrors((prev) => ({ ...prev, nickname: "" }));
              }}
              error={errors.nickname}
              shouldShake={shouldShake && !nickname}
              icon={<User className="w-4 h-4" />}
              disabled={isLoading}
            />

            {/* Email Input */}
            <CyberInput
              label="Email"
              placeholder="kvaronx_user@example.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={errors.email}
              shouldShake={shouldShake && !email}
              icon={<Mail className="w-4 h-4" />}
              disabled={isLoading}
            />

            {/* Password Input */}
            <CyberInput
              label="Пароль"
              placeholder="Минимум 6 символов"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              error={errors.password}
              shouldShake={shouldShake && !password}
              icon={<Lock className="w-4 h-4" />}
              disabled={isLoading}
            />

            {/* Date of Birth Input */}
            <CyberInput
              label="Дата рождения"
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setErrors((prev) => ({ ...prev, dob: "" }));
              }}
              error={errors.dob}
              shouldShake={shouldShake && !dob}
              icon={<Calendar className="w-4 h-4" />}
              disabled={isLoading}
            />

            {/* Form general error block */}
            {errors.form && (
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center font-mono text-[10px] text-zinc-400 select-text animate-cyber-shake">
                ⚠️ ОШИБКА: {errors.form}
              </div>
            )}

            {/* Register CTA Button */}
            <CyberButton type="submit" isLoading={isLoading} className="mt-3">
              Зарегистрироваться <UserPlus className="w-4 h-4 ml-1" />
            </CyberButton>
          </motion.form>
        ) : (
          <motion.div
            key="verification-step"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {/* OTP component */}
            <OtpInput
              identifier={email}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              isVerifying={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login link footer */}
      {step === "form" && (
        <div className="flex justify-center items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-white/30 pt-2 border-t border-white/5 select-none">
          <span>Уже есть аккаунт?</span>
          <Link
            href="/auth/login"
            className="text-white font-bold hover:underline transition-all duration-200"
          >
            Войти в систему
          </Link>
        </div>
      )}
    </motion.div>
  );
}
