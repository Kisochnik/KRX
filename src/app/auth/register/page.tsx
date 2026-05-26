"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Lock, Mail, ShieldCheck, User, UserPlus } from "lucide-react";
import CyberButton from "@/components/CyberButton";
import CyberInput from "@/components/CyberInput";
import OtpInput from "@/components/OtpInput";
import { KVARON_AUTH_EMAIL, useAuth } from "@/context/AuthContext";

type RegisterStep = "details" | "code";

const STEPS: RegisterStep[] = ["details", "code"];

const STEP_LABEL: Record<RegisterStep, string> = {
  details: "Регистрация",
  code: "Подтверждение почты",
};

const STEP_COPY: Record<RegisterStep, string> = {
  details: "Никнейм, email, пароль и дата рождения.",
  code: `Введите код из письма от ${KVARON_AUTH_EMAIL}.`,
};

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export default function RegisterPage() {
  const { registerUser, sendVerificationOtp, verifyOtp, addToast } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<RegisterStep>("details");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const verifyIdentifier = email.trim();

  const passwordScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-ZА-Я]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Zа-яА-Я0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const passwordLabel = ["Слабый", "Базовый", "Надёжный", "Сильный", "Премиум"][passwordScore];

  const triggerShake = () => {
    setShouldShake(true);
    window.setTimeout(() => setShouldShake(false), 480);
  };

  const validateDetails = () => {
    const nextErrors: Record<string, string> = {};

    if (!nickname.trim()) nextErrors.nickname = "Введите никнейм.";
    else if (nickname.trim().length < 3) nextErrors.nickname = "Минимум 3 символа.";
    else if (!/^[a-zA-Z0-9_]+$/.test(nickname.trim())) {
      nextErrors.nickname = "Только латиница, цифры и нижнее подчёркивание.";
    }

    if (!email.trim()) nextErrors.email = "Введите email.";
    else if (!isValidEmail(email.trim())) nextErrors.email = "Проверьте формат email.";

    if (!password) nextErrors.password = "Введите пароль.";
    else if (password.length < 8) nextErrors.password = "Минимум 8 символов.";

    if (!dob) nextErrors.dob = "Укажите дату рождения.";

    return nextErrors;
  };

  const handleDetailsSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateDetails();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      triggerShake();
      return;
    }

    setErrors({});
    setIsLoading(true);

    window.setTimeout(() => {
      sendVerificationOtp(email.trim());
      setIsLoading(false);
      setStep("code");
    }, 650);
  };

  const handleResendCode = () => {
    sendVerificationOtp(verifyIdentifier);
  };

  const handleVerifyCode = async (code: string) => {
    setIsLoading(true);

    return new Promise<boolean>((resolve) => {
      window.setTimeout(() => {
        const isValid = verifyOtp(verifyIdentifier, code);

        if (!isValid) {
          setIsLoading(false);
          resolve(false);
          return;
        }

        const result = registerUser(nickname, email, dob, password);
        setIsLoading(false);

        if (!result.success) {
          addToast("Регистрация остановлена", result.error || "Проверьте данные аккаунта.", "error");
          setErrors({ form: result.error || "Проверьте данные аккаунта." });
          setStep("details");
          resolve(false);
          return;
        }

        resolve(true);
        window.setTimeout(() => router.push("/auth/login"), 1800);
      }, 900);
    });
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
            key="register-scan"
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
            <UserPlus className="h-4 w-4 text-white/75" />
          </div>
          <h1 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/90">
            {STEP_LABEL[step]}
          </h1>
        </div>
        <p className="pl-10 text-[11px] text-white/42">{STEP_COPY[step]}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        {STEPS.map((item, index) => (
          <React.Fragment key={item}>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                step === item ? "w-8 bg-white" : index < stepIndex ? "w-2 bg-white/55" : "w-2 bg-white/15"
              }`}
            />
            {index < STEPS.length - 1 && (
              <div className={`h-px w-8 transition-colors ${index < stepIndex ? "bg-white/35" : "bg-white/10"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === "details" && (
          <motion.form
            key="details"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.22 }}
            onSubmit={handleDetailsSubmit}
            className="flex flex-col gap-4"
          >
            <CyberInput
              label="Никнейм"
              placeholder="neo_matrix"
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                setErrors((prev) => ({ ...prev, nickname: "", form: "" }));
              }}
              error={errors.nickname}
              icon={<User className="h-4 w-4" />}
              shouldShake={shouldShake && !nickname}
            />

            <CyberInput
              label="Email"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((prev) => ({ ...prev, email: "", form: "" }));
              }}
              error={errors.email}
              icon={<Mail className="h-4 w-4" />}
              shouldShake={shouldShake && !email}
            />

            <CyberInput
              label="Пароль"
              placeholder="Минимум 8 символов"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((prev) => ({ ...prev, password: "", form: "" }));
              }}
              error={errors.password}
              icon={<Lock className="h-4 w-4" />}
              shouldShake={shouldShake && !password}
            />

            {password.length > 0 && (
              <div className="-mt-1 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        passwordScore >= item ? "bg-white" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/35">
                  {passwordLabel}
                </span>
              </div>
            )}

            <CyberInput
              label="Дата рождения"
              type="date"
              value={dob}
              onChange={(event) => {
                setDob(event.target.value);
                setErrors((prev) => ({ ...prev, dob: "", form: "" }));
              }}
              error={errors.dob}
              icon={<Calendar className="h-4 w-4" />}
              shouldShake={shouldShake && !dob}
            />

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
              Отправить код <ArrowRight className="ml-1.5 h-4 w-4" />
            </CyberButton>
          </motion.form>
        )}

        {step === "code" && (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-5"
          >
            <OtpInput
              identifier={verifyIdentifier}
              onVerify={handleVerifyCode}
              onResend={handleResendCode}
              isVerifying={isLoading}
            />

            <button
              type="button"
              onClick={() => setStep("details")}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/32 transition-colors hover:text-white/65 disabled:opacity-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Изменить данные
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {step === "details" && (
        <div className="flex items-center justify-center gap-1.5 border-t border-white/[0.05] pt-2 font-mono text-[9px] uppercase tracking-wider text-white/30">
          <ShieldCheck className="h-3 w-3" />
          <span>Уже есть аккаунт?</span>
          <Link href="/auth/login" className="font-bold text-white transition-colors hover:text-white/70">
            Войти
          </Link>
        </div>
      )}
    </motion.div>
  );
}
