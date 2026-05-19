"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import {
  Eye, EyeOff, User, Mail, Lock, Calendar,
  AlertCircle, CheckCircle, ArrowLeft, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Password rules (spec) ──────────────────────────────────────────────────
const PW_RULES = [
  { test: (p: string) => p.length >= 8,           label: "Минимум 8 символов" },
  { test: (p: string) => /^[A-ZА-ЯЁ]/.test(p),   label: "Первая буква — заглавная" },
  { test: (p: string) => /\d/.test(p),             label: "Минимум одна цифра" },
  { test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(p),
                                                    label: "Минимум один спецсимвол" },
];

function pwOk(p: string) { return PW_RULES.every(r => r.test(p)); }

// ─── Nickname real-time check ────────────────────────────────────────────────
function nickTaken(name: string): boolean {
  if (typeof window === "undefined" || !name) return false;
  try {
    return JSON.parse(localStorage.getItem("krx_users") || "[]")
      .some((u: { name: string }) => u.name.toLowerCase() === name.toLowerCase());
  } catch { return false; }
}

// ─── Shared input style ──────────────────────────────────────────────────────
const inp = (extra = "") =>
  `w-full px-4 py-3 pl-11 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl text-white
   placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all ${extra}`;

// ─── Page ────────────────────────────────────────────────────────────────────
type Screen =
  | "login"
  | "register"
  | "forgot_choose"   // выбор: Email или Telegram
  | "forgot_email"    // ввод email → код уходит на почту
  | "forgot_tg"       // инструкция по TG → ввод кода
  | "forgot_code"     // ввод кода (email flow)
  | "new_password";   // ввод нового пароля

export default function AuthPage() {
  const router = useRouter();
  const { login, register, forgotPassword } = useApp();

  const [screen, setScreen] = useState<Screen>("login");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  // Login
  const [lId, setLId] = useState("");
  const [lPw, setLPw] = useState("");
  const [showLPw, setShowLPw] = useState(false);

  // Register
  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPw, setRPw] = useState("");
  const [rBirth, setRBirth] = useState("");
  const [rGender, setRGender] = useState<"male" | "female">("male");
  const [showRPw, setShowRPw] = useState(false);
  const [nickSt, setNickSt] = useState<"idle" | "taken" | "free">("idle");

  // Forgot
  const [fEmail, setFEmail] = useState("");
  const [fCode, setFCode] = useState(""); // secret code (not shown to user)
  const [fInput, setFInput] = useState(""); // what user types
  const [newPw, setNewPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [codeOk, setCodeOk] = useState(false);

  // Nick debounce
  useEffect(() => {
    if (!rName) { setNickSt("idle"); return; }
    const t = setTimeout(() => setNickSt(nickTaken(rName) ? "taken" : "free"), 400);
    return () => clearTimeout(t);
  }, [rName]);

  const go = (s: Screen) => { setScreen(s); setErr(""); setOk(""); };

  // ── Login ──────────────────────────────────────────────────────────────────
  async function handleLogin() {
    if (!lId || !lPw) { setErr("Заполните все поля"); return; }
    setLoading(true); setErr("");
    const res = await login(lId, lPw);
    setLoading(false);
    if (res) router.push("/"); else setErr("Неверное имя/почта или пароль");
  }

  // ── Register ───────────────────────────────────────────────────────────────
  async function handleRegister() {
    if (!rName || !rEmail || !rPw || !rBirth) { setErr("Заполните все поля"); return; }
    if (nickSt === "taken") { setErr("Этот никнейм уже занят"); return; }
    if (!pwOk(rPw)) { setErr("Пароль не соответствует требованиям"); return; }
    setLoading(true); setErr("");
    const res = await register({ name: rName, email: rEmail, password: rPw, birthDate: rBirth, gender: rGender });
    setLoading(false);
    if (res) router.push("/"); else setErr("Email уже зарегистрирован");
  }

  // ── Forgot — Email flow ────────────────────────────────────────────────────
  async function handleSendEmail() {
    if (!fEmail) { setErr("Введите email"); return; }
    setLoading(true); setErr("");
    const exists = await forgotPassword(fEmail);
    setLoading(false);
    if (!exists) { setErr("Аккаунт с таким email не найден"); return; }
    // Generate secret code — in real app server sends it; here we simulate
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setFCode(code);
    // In demo: store for comparison. User does NOT see the code on screen.
    // Simulate "email sent"
    setOk("Код отправлен на " + fEmail);
    go("forgot_code");
  }

  // ── Forgot — Telegram flow ─────────────────────────────────────────────────
  function handleStartTg() {
    // In real app bot sends the code; here we pre-generate it silently
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setFCode(code);
    go("forgot_tg");
  }

  // ── Verify code ────────────────────────────────────────────────────────────
  function handleVerifyCode() {
    if (!fInput.trim()) { setErr("Введите код"); return; }
    if (fInput.trim() !== fCode) { setErr("Неверный код"); return; }
    setErr(""); setCodeOk(true); go("new_password");
  }

  // ── Save new password ──────────────────────────────────────────────────────
  function handleSavePw() {
    if (!pwOk(newPw)) { setErr("Пароль не соответствует требованиям"); return; }
    setOk("Пароль изменён! Войдите с новым паролем.");
    setTimeout(() => go("login"), 1600);
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-black text-2xl">K</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">KVARON_X</h1>
          <p className="text-zinc-500 mt-1 text-sm">KRX Network</p>
        </div>

        <div className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-8">

          {/* Tabs — only on login/register */}
          {(screen === "login" || screen === "register") && (
            <div className="flex bg-[#1a1a1a] rounded-xl p-1 mb-6">
              {(["login", "register"] as Screen[]).map(s => (
                <button key={s} onClick={() => go(s)}
                  className={cn("flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    screen === s
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:text-zinc-300"
                  )}>
                  {s === "login" ? "Войти" : "Регистрация"}
                </button>
              ))}
            </div>
          )}

          {/* Back button on sub-screens */}
          {!["login", "register"].includes(screen) && (
            <button onClick={() => go(screen === "forgot_code" || screen === "forgot_tg" ? "forgot_choose" : screen === "new_password" ? "forgot_choose" : "login")}
              className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
          )}

          {/* Error / success */}
          {err && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-4 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" /> {err}
            </div>
          )}
          {ok && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl mb-4 text-sm text-green-400">
              <CheckCircle className="w-4 h-4 shrink-0" /> {ok}
            </div>
          )}

          {/* ══════════ LOGIN ══════════ */}
          {screen === "login" && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input value={lId} onChange={e => setLId(e.target.value)}
                  placeholder="Никнейм или эл. почта"
                  className={inp()} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input value={lPw} onChange={e => setLPw(e.target.value)}
                  type={showLPw ? "text" : "password"} placeholder="Пароль"
                  className={inp("pr-11")} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                <button onClick={() => setShowLPw(!showLPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                  {showLPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button onClick={() => go("forgot_choose")}
                className="text-sm text-zinc-500 hover:text-white transition-colors w-full text-right">
                Забыл пароль
              </button>

              <button onClick={handleLogin} disabled={loading}
                className="w-full py-3 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-40">
                {loading ? "Входим..." : "Войти"}
              </button>
            </div>
          )}

          {/* ══════════ REGISTER ══════════ */}
          {screen === "register" && (
            <div className="space-y-4">

              {/* Nickname */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input value={rName} onChange={e => setRName(e.target.value)}
                  placeholder="Уникальный никнейм"
                  className={cn(inp("pr-24"),
                    nickSt === "taken" && "border-red-500/50",
                    nickSt === "free"  && "border-green-500/50"
                  )} />
                {nickSt === "taken" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400 font-semibold">Занят</span>
                )}
                {nickSt === "free" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-400 font-semibold">✓ Свободен</span>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input value={rEmail} onChange={e => setREmail(e.target.value)}
                  type="email" placeholder="Электронная почта" className={inp()} />
              </div>

              {/* Password + rules */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input value={rPw} onChange={e => setRPw(e.target.value)}
                    type={showRPw ? "text" : "password"} placeholder="Пароль"
                    className={inp("pr-11")} />
                  <button onClick={() => setShowRPw(!showRPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                    {showRPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {rPw && (
                  <ul className="mt-2.5 space-y-1.5 px-1">
                    {PW_RULES.map(r => (
                      <li key={r.label}
                        className={cn("text-xs flex items-center gap-2 transition-colors",
                          r.test(rPw) ? "text-green-400" : "text-zinc-600")}>
                        <span className="w-3">{r.test(rPw) ? "✓" : "○"}</span>
                        {r.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Birth date */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input value={rBirth} onChange={e => setRBirth(e.target.value)}
                  type="date" className={inp()} />
              </div>

              {/* Gender */}
              <div className="flex gap-6 px-1">
                {(["male", "female"] as const).map(g => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" checked={rGender === g}
                      onChange={() => setRGender(g)}
                      className="w-4 h-4 accent-white" />
                    <span className="text-sm text-zinc-300">{g === "male" ? "Мужской" : "Женский"}</span>
                  </label>
                ))}
              </div>

              <button onClick={handleRegister} disabled={loading || nickSt === "taken"}
                className="w-full py-3 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-40">
                {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
              </button>
            </div>
          )}

          {/* ══════════ FORGOT — ВЫБОР МЕТОДА ══════════ */}
          {screen === "forgot_choose" && (
            <div className="space-y-4">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-white">Восстановление пароля</h2>
                <p className="text-zinc-500 text-sm mt-1">Как получить код подтверждения?</p>
              </div>

              {/* Email */}
              <button onClick={() => go("forgot_email")}
                className="w-full flex items-center gap-4 p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl hover:border-white/20 transition-all text-left group">
                <div className="w-11 h-11 bg-[#222] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#2a2a2a] transition-colors">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Через Email</p>
                  <p className="text-xs text-zinc-600 mt-0.5">Код придёт на привязанную почту</p>
                </div>
              </button>

              {/* Telegram */}
              <button onClick={handleStartTg}
                className="w-full flex items-center gap-4 p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl hover:border-blue-500/30 transition-all text-left group">
                <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Через Telegram-бота</p>
                  <p className="text-xs text-zinc-600 mt-0.5">Бот @KVARON_X_bot пришлёт код</p>
                </div>
              </button>
            </div>
          )}

          {/* ══════════ FORGOT — EMAIL: ввод почты ══════════ */}
          {screen === "forgot_email" && (
            <div className="space-y-4">
              <div className="mb-2">
                <h2 className="text-xl font-bold text-white">Восстановление через Email</h2>
                <p className="text-zinc-500 text-sm mt-1">Введите почту, привязанную к аккаунту — мы пришлём код</p>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input value={fEmail} onChange={e => setFEmail(e.target.value)}
                  type="email" placeholder="Электронная почта"
                  className={inp()} onKeyDown={e => e.key === "Enter" && handleSendEmail()} />
              </div>
              <button onClick={handleSendEmail} disabled={loading}
                className="w-full py-3 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all disabled:opacity-40">
                {loading ? "Отправляем..." : "Отправить код"}
              </button>
            </div>
          )}

          {/* ══════════ FORGOT — TELEGRAM: инструкция + ввод кода ══════════ */}
          {screen === "forgot_tg" && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Код через Telegram</h2>
                <p className="text-zinc-500 text-sm mt-2">
                  Напишите боту{" "}
                  <a href="https://t.me/KVARON_X_bot" target="_blank" rel="noreferrer"
                    className="text-blue-400 font-semibold hover:underline">
                    @KVARON_X_bot
                  </a>{" "}
                  команду <span className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded">/code</span>
                  {" "}и он пришлёт вам код
                </p>
              </div>

              <div>
                <label className="block text-zinc-500 text-xs font-medium mb-2 uppercase tracking-wider">
                  Введите код из Telegram
                </label>
                <input value={fInput} onChange={e => setFInput(e.target.value)}
                  placeholder="● ● ● ● ● ●"
                  className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 text-center text-2xl tracking-[0.5em] font-mono transition-all"
                  maxLength={6} />
              </div>

              <button onClick={handleVerifyCode}
                className="w-full py-3 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98]">
                Подтвердить
              </button>
            </div>
          )}

          {/* ══════════ FORGOT — EMAIL CODE: ввод кода из письма ══════════ */}
          {screen === "forgot_code" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">Код из письма</h2>
                <p className="text-zinc-500 text-sm mt-1">Введите код, который мы отправили на вашу почту</p>
              </div>

              <div>
                <input value={fInput} onChange={e => setFInput(e.target.value)}
                  placeholder="● ● ● ● ● ●"
                  className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 text-center text-2xl tracking-[0.5em] font-mono transition-all"
                  maxLength={6} />
              </div>

              <button onClick={handleVerifyCode}
                className="w-full py-3 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98]">
                Подтвердить
              </button>
            </div>
          )}

          {/* ══════════ NEW PASSWORD ══════════ */}
          {screen === "new_password" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">Новый пароль</h2>
                <p className="text-zinc-500 text-sm mt-1">Придумайте надёжный пароль для аккаунта</p>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  <input value={newPw} onChange={e => setNewPw(e.target.value)}
                    type={showNewPw ? "text" : "password"} placeholder="Новый пароль"
                    className={inp("pr-11")} />
                  <button onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                    {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {newPw && (
                  <ul className="mt-2.5 space-y-1.5 px-1">
                    {PW_RULES.map(r => (
                      <li key={r.label}
                        className={cn("text-xs flex items-center gap-2 transition-colors",
                          r.test(newPw) ? "text-green-400" : "text-zinc-600")}>
                        <span className="w-3">{r.test(newPw) ? "✓" : "○"}</span>
                        {r.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button onClick={handleSavePw} disabled={!pwOk(newPw)}
                className="w-full py-3 bg-white text-black rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-40">
                Сохранить пароль
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
