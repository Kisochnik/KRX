"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Eye, EyeOff, User, Mail, Lock, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "login" | "register" | "forgot" | "telegram";

export default function AuthPage() {
  const router = useRouter();
  const { login, register, forgotPassword } = useApp();
  const [mode, setMode] = useState<Mode>("login");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regBirth, setRegBirth] = useState("");
  const [regGender, setRegGender] = useState<"male" | "female">("male");
  const [tgCode, setTgCode] = useState("");
  const [tgInput, setTgInput] = useState("");

  // Forgot
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLogin = async () => {
    if (!loginId || !loginPw) { setError("Заполните все поля"); return; }
    setLoading(true); setError("");
    const ok = await login(loginId, loginPw);
    setLoading(false);
    if (ok) router.push("/");
    else setError("Неверное имя/почта или пароль");
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPw || !regBirth) { setError("Заполните все поля"); return; }
    if (regPw.length < 6) { setError("Пароль минимум 6 символов"); return; }
    setLoading(true); setError("");
    const ok = await register({ name: regName, email: regEmail, password: regPw, birthDate: regBirth, gender: regGender });
    setLoading(false);
    if (ok) {
      // Show Telegram verification step
      setMode("telegram");
      setTgCode(Math.floor(100000 + Math.random() * 900000).toString());
    }
    else setError("Такой email уже зарегистрирован");
  };

  const handleForgot = async () => {
    if (!forgotEmail) { setError("Введите email"); return; }
    setLoading(true); setError("");
    const ok = await forgotPassword(forgotEmail);
    setLoading(false);
    if (ok) setSuccess("Инструкции отправлены на почту (демо режим)");
    else setError("Email не найден");
  };

  const inputClass = "w-full px-4 py-3 pl-11 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">K</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">KVARON<span className="text-primary">_X</span></h1>
          <p className="text-muted-foreground mt-1">KRX Network</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Tabs */}
          {mode !== "forgot" && mode !== "telegram" && (
            <div className="flex bg-muted rounded-xl p-1 mb-6">
              {(["login", "register"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                  className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                    mode === m ? "bg-card text-foreground shadow" : "text-muted-foreground hover:text-foreground"
                  )}>
                  {m === "login" ? "Войти" : "Регистрация"}
                </button>
              ))}
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg mb-4 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-4 text-sm text-green-600">
              <CheckCircle className="w-4 h-4 shrink-0" /> {success}
            </div>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="Имя или почта" className={inputClass} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={loginPw} onChange={e => setLoginPw(e.target.value)} type={showPw ? "text" : "password"} placeholder="Пароль" className={inputClass + " pr-11"}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button onClick={() => { setMode("forgot"); setError(""); }} className="text-sm text-primary hover:underline w-full text-right">
                Забыл пароль
              </button>
              <button onClick={handleLogin} disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                {loading ? "Входим..." : "Войти"}
              </button>
            </div>
          )}

          {/* REGISTER */}
          {mode === "register" && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Имя пользователя" className={inputClass} />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={regEmail} onChange={e => setRegEmail(e.target.value)} type="email" placeholder="Почта" className={inputClass} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={regPw} onChange={e => setRegPw(e.target.value)} type={showPw ? "text" : "password"} placeholder="Пароль (мин. 6 символов)" className={inputClass + " pr-11"} />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={regBirth} onChange={e => setRegBirth(e.target.value)} type="date" placeholder="Дата рождения" className={inputClass} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Пол <span className="text-destructive">*</span></p>
                <div className="flex gap-4">
                  {(["male", "female"] as const).map(g => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" checked={regGender === g} onChange={() => setRegGender(g)} className="w-4 h-4 accent-primary" />
                      <span className="text-sm text-foreground">{g === "male" ? "Мужской" : "Женский"}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={handleRegister} disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
              </button>
            </div>
          )}

          {/* TELEGRAM VERIFY */}
          {mode === "telegram" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">✈️</span>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Подтверждение через Telegram</h2>
                <p className="text-sm text-muted-foreground">
                  Напишите боту <span className="text-primary font-mono font-bold">@KVARON_X_bot</span> команду:
                </p>
                <div className="mt-3 p-3 bg-muted rounded-xl border border-border font-mono text-lg font-bold text-primary tracking-widest">
                  /verify {tgCode}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Затем введите код ниже</p>
              </div>
              <input value={tgInput} onChange={e => setTgInput(e.target.value)}
                placeholder="Введите код из Telegram..."
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-center text-lg tracking-widest font-mono" />
              <button onClick={() => {
                if (tgInput === tgCode) router.push("/");
                else setError("Неверный код. Попробуйте ещё раз");
              }} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all">
                Подтвердить
              </button>
              <button onClick={() => router.push("/")}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
                Пропустить (верифицировать позже)
              </button>
              {error && <div className="text-sm text-destructive text-center">{error}</div>}
            </div>
          )}

          {/* FORGOT */}
          {mode === "forgot" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Восстановление пароля</h2>
              <p className="text-sm text-muted-foreground">Введите email, привязанный к аккаунту</p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} type="email" placeholder="Почта" className={inputClass} />
              </div>
              <button onClick={handleForgot} disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                {loading ? "Отправляем..." : "Отправить инструкции"}
              </button>
              <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-sm text-primary hover:underline w-full text-center">
                ← Назад к входу
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
