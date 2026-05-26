"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, RefreshCw, ShieldCheck, Timer } from "lucide-react";
import CyberButton from "@/components/CyberButton";

interface OtpInputProps {
  identifier: string;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => void | Promise<void> | unknown;
  isVerifying?: boolean;
  externalError?: string;
}

const CODE_LENGTH = 6;
const RESEND_SECONDS = 59;

export default function OtpInput({
  identifier,
  onVerify,
  onResend,
  isVerifying = false,
  externalError,
}: OtpInputProps) {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    window.setTimeout(() => inputsRef.current[0]?.focus(), 80);
  }, []);

  useEffect(() => {
    if (timer <= 0 || isSuccess) return;
    const interval = window.setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timer, isSuccess]);

  const registerInputRef = (index: number, el: HTMLInputElement | null) => {
    inputsRef.current[index] = el;
  };

  const updateDigit = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const nextCode = [...code];
    nextCode[index] = value.slice(-1);
    setCode(nextCode);
    setError(undefined);

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      const nextCode = [...code];
      nextCode[index - 1] = "";
      setCode(nextCode);
      inputsRef.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);

    if (pasted.length !== CODE_LENGTH) {
      setError("Вставьте полный 6-значный код.");
      return;
    }

    setCode(pasted.split(""));
    setError(undefined);
    inputsRef.current[CODE_LENGTH - 1]?.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join("");

    if (fullCode.length !== CODE_LENGTH) {
      setError("Заполните все 6 цифр кода.");
      return;
    }

    const success = await onVerify(fullCode);
    if (success) {
      setIsSuccess(true);
      return;
    }

    setCode(Array(CODE_LENGTH).fill(""));
    setError("Код не подошёл. Проверьте цифры или запросите новый.");
    inputsRef.current[0]?.focus();
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    setError(undefined);
    await onResend();
    setCode(Array(CODE_LENGTH).fill(""));
    setTimer(RESEND_SECONDS);
    setIsResending(false);
    inputsRef.current[0]?.focus();
  };

  const visibleError = error || externalError;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="otp-form"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.24 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-center">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] shadow-[0_0_24px_rgba(255,255,255,0.05)]">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">
                  6-значный код
                </p>
                <p className="text-xs leading-relaxed text-white/45">
                  Код отправлен на{" "}
                  <span className="break-all font-mono font-semibold text-white/85">{identifier}</span>
                </p>
              </div>
            </div>

            <div className={`grid w-full grid-cols-6 gap-2 sm:gap-3 ${visibleError ? "animate-cyber-shake" : ""}`}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => registerInputRef(index, el)}
                  aria-label={`Цифра ${index + 1}`}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  className="h-12 min-w-0 rounded-lg border border-white/10 bg-black/45 text-center font-mono text-lg font-bold text-white outline-none transition-all duration-300 focus:border-white/40 focus:bg-black/70 focus:shadow-[0_0_18px_rgba(255,255,255,0.08)] disabled:opacity-50 sm:h-14 sm:text-xl"
                  disabled={isVerifying || isResending}
                  inputMode="numeric"
                  maxLength={1}
                  type="text"
                  value={digit}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                />
              ))}
            </div>

            <AnimatePresence>
              {visibleError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-center font-mono text-[10px] uppercase tracking-wider text-white/45"
                >
                  {visibleError}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex min-h-5 items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
              <Timer className="h-3.5 w-3.5" />
              {timer > 0 ? (
                <span>Повторная отправка через {timer < 10 ? `0${timer}` : timer}с</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="flex items-center gap-1.5 text-white transition-colors hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
                  Отправить код повторно
                </button>
              )}
            </div>

            <CyberButton type="button" isLoading={isVerifying} onClick={handleVerify}>
              Подтвердить код <ShieldCheck className="ml-1.5 h-4 w-4" />
            </CyberButton>
          </motion.div>
        ) : (
          <motion.div
            key="otp-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.24 }}
            className="flex flex-col items-center gap-4 py-6 text-center"
          >
            <motion.div
              initial={{ rotate: -20, scale: 0.85 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_0_32px_rgba(255,255,255,0.08)]"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0.4 }}
                animate={{ scale: 1.45, opacity: 0 }}
                transition={{ duration: 0.9, repeat: 1, ease: "easeOut" }}
                className="absolute inset-0 rounded-2xl border border-white/20"
              />
              <CheckCircle2 className="h-8 w-8 text-white" />
            </motion.div>
            <div className="space-y-1">
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.22em] text-white">
                Код подтверждён
              </h3>
              <p className="max-w-[280px] text-xs leading-relaxed text-white/45">
                Проверка завершена. Завершаем безопасный переход.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
