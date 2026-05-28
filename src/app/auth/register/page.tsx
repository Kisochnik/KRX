"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Globe,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import CyberButton from "@/components/CyberButton";
import CyberInput from "@/components/CyberInput";
import OtpInput from "@/components/OtpInput";
import { useAuth } from "@/context/AuthContext";
import { useLanguageContext } from "@/language/LanguageProvider";
import type { Locale } from "@/language/types";

type RegisterStep = "details" | "code";

const STEPS: RegisterStep[] = ["details", "code"];

const LANG_OPTIONS: { value: Locale | "uk"; label: string; flag: string }[] = [
  { value: "ru", label: "Русский", flag: "🇷🇺" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "uk", label: "Українська", flag: "🇺🇦" },
];

const STEP_LABEL: Record<RegisterStep, Record<string, string>> = {
  details: { ru: "Регистрация", en: "Register", uk: "Реєстрація" },
  code: { ru: "Подтверждение почты", en: "Email verification", uk: "Підтвердження пошти" },
};

const STEP_COPY: Record<RegisterStep, Record<string, string>> = {
  details: {
    ru: "Никнейм, email, пароль и дата рождения.",
    en: "Nickname, email, password and date of birth.",
    uk: "Нікнейм, email, пароль і дата народження.",
  },
  code: {
    ru: "Введите 6-значный код из письма.",
    en: "Enter the 6-digit code from your email.",
    uk: "Введіть 6-значний код з листа.",
  },
};

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export default function RegisterPage() {
  const { registerUser, sendVerificationOtp, verifyOtp, verifyOtpAsync, addToast } = useAuth();
  const { setLocale } = useLanguageContext();
  const router = useRouter();

  const [step, setStep] = useState<RegisterStep>("details");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [lang, setLang] = useState<string>("ru");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const verifyIdentifier = email.trim();

  // Labels based on chosen lang
  const label = (key: Record<string, string>) => key[lang] ?? key["ru"];

  const passwordScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-ZА-ЯҐЄІЇЁ]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Zа-яА-ЯґєіїёЁ0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const passwordLabel: Record<string, string[]> = {
    ru: ["Слабый", "Базовый", "Надёжный", "Сильный", "Премиум"],
    en: ["Weak", "Basic", "Good", "Strong", "Premium"],
    uk: ["Слабкий", "Базовий", "Надійний", "Сильний", "Преміум"],
  };

  const triggerShake = () => {
    setShouldShake(true);
    window.setTimeout(() => setShouldShake(false), 480);
  };

  const validateDetails = () => {
    const nextErrors: Record<string, string> = {};
    const errMsg = {
      nicknameRequired: { ru: "Введите никнейм.", en: "Enter a nickname.", uk: "Введіть нікнейм." },
      nicknameShort: { ru: "Минимум 3 символа.", en: "Minimum 3 characters.", uk: "Мінімум 3 символи." },
      nicknameInvalid: { ru: "Только латиница, цифры и _", en: "Only letters, digits and _", uk: "Лише латиниця, цифри і _" },
      emailRequired: { ru: "Введите email.", en: "Enter an email.", uk: "Введіть email." },
      emailInvalid: { ru: "Проверьте формат email.", en: "Check email format.", uk: "Перевірте формат email." },
      passwordRequired: { ru: "Введите пароль.", en: "Enter a password.", uk: "Введіть пароль." },
      passwordShort: { ru: "Минимум 8 символов.", en: "Minimum 8 characters.", uk: "Мінімум 8 символів." },
      dobRequired: { ru: "Укажите дату рождения.", en: "Enter date of birth.", uk: "Вкажіть дату народження." },
    };

    if (!nickname.trim()) nextErrors.nickname = label(errMsg.nicknameRequired);
    else if (nickname.trim().length < 3) nextErrors.nickname = label(errMsg.nicknameShort);
    else if (!/^[a-zA-Z0-9_]+$/.test(nickname.trim())) nextErrors.nickname = label(errMsg.nicknameInvalid);

    if (!email.trim()) nextErrors.email = label(errMsg.emailRequired);
    else if (!isValidEmail(email.trim())) nextErrors.email = label(errMsg.emailInvalid);

    if (!password) nextErrors.password = label(errMsg.passwordRequired);
    else if (password.length < 8) nextErrors.password = label(errMsg.passwordShort);

    if (!dob) nextErrors.dob = label(errMsg.dobRequired);

    return nextErrors;
  };

  const handleDetailsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateDetails();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      triggerShake();
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Apply selected language immediately for all supported locales
    setLocale(lang as Locale);

    await sendVerificationOtp(email.trim());
    setIsLoading(false);
    setStep("code");
  };

  const handleResendCode = () => {
    sendVerificationOtp(verifyIdentifier);
  };

  const handleVerifyCode = async (code: string): Promise<boolean> => {
    setIsLoading(true);

    return new Promise<boolean>((resolve) => {
      window.setTimeout(async () => {
        const isValid = await verifyOtpAsync(verifyIdentifier, code);

        if (!isValid) {
          setIsLoading(false);
          resolve(false);
          return;
        }

        const result = registerUser(nickname, email, dob, password, lang);
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

  const stepTitle = { details: STEP_LABEL.details, code: STEP_LABEL.code }[step];
  const stepDesc = { details: STEP_COPY.details, code: STEP_COPY.code }[step];

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
            {label(stepTitle)}
          </h1>
        </div>
        <p className="pl-10 text-[11px] text-white/42">{label(stepDesc)}</p>
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
            {/* Language selector */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                <Globe className="h-3.5 w-3.5" />
                {lang === "en" ? "Language" : lang === "uk" ? "Мова" : "Язык"}
              </label>
              <div className="flex gap-2">
                {LANG_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLang(option.value)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-medium transition-all duration-200 ${
                      lang === option.value
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/[0.06] bg-white/[0.03] text-white/40 hover:border-white/15 hover:text-white/60"
                    }`}
                  >
                    <span>{option.flag}</span>
                    <span className="hidden sm:inline">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <CyberInput
              label={lang === "en" ? "Nickname" : lang === "uk" ? "Нікнейм" : "Никнейм"}
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
              label={lang === "en" ? "Password" : lang === "uk" ? "Пароль" : "Пароль"}
              placeholder={lang === "en" ? "Min 8 characters" : lang === "uk" ? "Мінімум 8 символів" : "Минимум 8 символов"}
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
                  {(passwordLabel[lang] ?? passwordLabel.ru)[passwordScore]}
                </span>
              </div>
            )}

            <CyberInput
              label={lang === "en" ? "Date of birth" : lang === "uk" ? "Дата народження" : "Дата рождения"}
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
              {lang === "en" ? "Send code" : lang === "uk" ? "Надіслати код" : "Отправить код"}
              <ArrowRight className="ml-1.5 h-4 w-4" />
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
              {lang === "en" ? "Edit details" : lang === "uk" ? "Змінити дані" : "Изменить данные"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {step === "details" && (
        <div className="flex items-center justify-center gap-1.5 border-t border-white/[0.05] pt-2 font-mono text-[9px] uppercase tracking-wider text-white/30">
          <ShieldCheck className="h-3 w-3" />
          <span>{lang === "en" ? "Have an account?" : lang === "uk" ? "Вже є акаунт?" : "Уже есть аккаунт?"}</span>
          <Link href="/auth/login" className="font-bold text-white transition-colors hover:text-white/70">
            {lang === "en" ? "Log in" : lang === "uk" ? "Увійти" : "Войти"}
          </Link>
        </div>
      )}
    </motion.div>
  );
}
