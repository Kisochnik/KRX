"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, RefreshCw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CyberButton from "./CyberButton";

interface OtpInputProps {
  identifier: string; // Email or username code was sent to
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => void;
  isVerifying: boolean;
  error?: string;
}

export default function OtpInput({
  identifier,
  onVerify,
  onResend,
  isVerifying,
  error: externalError,
}: OtpInputProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(59);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Track external errors
  useEffect(() => {
    if (externalError) {
      setError(externalError);
      // Trigger error shake by clearing state after short delay
      const t = setTimeout(() => setError(undefined), 2000);
      return () => clearTimeout(t);
    }
  }, [externalError]);

  // Countdown timer logic
  useEffect(() => {
    if (timer > 0 && !isSuccess) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isSuccess]);

  // Sync index ref list
  const registerInputRef = (index: number, el: HTMLInputElement | null) => {
    inputsRef.current[index] = el;
  };

  // Keyboard navigation and typing handler
  const handleChange = (index: number, val: string) => {
    // Only accept numeric inputs
    if (val && !/^\d+$/.test(val)) return;

    const newCode = [...code];
    // Keep only the last character entered
    newCode[index] = val.slice(-1);
    setCode(newCode);
    setError(undefined);

    // Auto-focus next input if filled
    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // Focus previous field and erase it
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
      setError(undefined);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) {
      setError("Скопируйте корректный 6-значный цифровой код.");
      return;
    }

    const digits = pastedData.split("");
    setCode(digits);
    setError(undefined);
    inputsRef.current[5]?.focus();
  };

  // Submit and verify code
  const handleSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Пожалуйста, заполните все 6 ячеек кода.");
      return;
    }

    const success = await onVerify(fullCode);
    if (success) {
      setIsSuccess(true);
    } else {
      setError("Неверный код доступа. Попробуйте еще раз.");
      setCode(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    }
  };

  // Resend code trigger
  const handleResend = () => {
    setIsResending(true);
    setError(undefined);
    setCode(Array(6).fill(""));
    onResend();
    
    // Simulate 1s loading network request for resend
    setTimeout(() => {
      setTimer(59);
      setIsResending(false);
      inputsRef.current[0]?.focus();
    }, 1000);
  };

  // Auto-focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="otp-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center"
          >
            {/* Instruction headers */}
            <p className="text-center text-xs text-cyber-text-muted mb-8 tracking-wide font-sans leading-relaxed">
              Мы отправили код подтверждения на <br />
              <span className="font-mono text-white/90 select-all font-semibold break-all bg-white/5 px-2 py-0.5 rounded border border-white/5 mt-1 inline-block">
                {identifier}
              </span>
              <br />Введите его ниже для подтверждения операции.
            </p>

            {/* Input grid */}
            <div className={`flex gap-3 mb-6 ${error ? "animate-cyber-shake" : ""}`}>
              {code.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => registerInputRef(idx, el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  disabled={isVerifying}
                  className="w-12 h-14 text-center font-mono text-xl font-bold bg-black/40 border border-white/10 rounded-lg text-white outline-none border-glow-focus transition-all duration-300 focus:bg-black/60 focus:border-white/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] disabled:opacity-50"
                />
              ))}
            </div>

            {/* OTP specific error message */}
            {error && (
              <span className="font-mono text-[10px] text-zinc-400 mb-6 tracking-wide text-center">
                🚨 {error}
              </span>
            )}

            {/* Resend code section */}
            <div className="flex items-center gap-1.5 mb-8 font-mono text-[10px] uppercase tracking-widest text-white/40">
              {timer > 0 ? (
                <span>Отправить повторно через {timer < 10 ? `0${timer}` : timer}с</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-white hover:text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase font-semibold"
                >
                  <RefreshCw className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`} />
                  Отправить повторно
                </button>
              )}
            </div>

            {/* Verify CTA */}
            <CyberButton
              type="button"
              onClick={handleSubmit}
              isLoading={isVerifying}
              className="mt-2"
            >
              Подтвердить <ArrowRight className="w-4 h-4 ml-1" />
            </CyberButton>
          </motion.div>
        ) : (
          <motion.div
            key="otp-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-6 text-center"
          >
            {/* Draw checkmark vector path using Framer Motion */}
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <motion.path
                  d="M20 6L9 17L4 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </motion.svg>
            </div>
            
            <h3 className="font-mono text-sm font-bold tracking-widest uppercase mb-2">
              Верификация Успешна
            </h3>
            <p className="text-xs text-cyber-text-muted max-w-[280px] leading-relaxed">
              Ваш код подтвержден. Вход в защищенный сектор системы разрешен.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
