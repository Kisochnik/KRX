"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import {
  Eye, EyeOff, User, Mail, Lock, Calendar, AlertCircle,
  CheckCircle, Send, MessageCircle, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "login" | "register" | "forgot_choose" | "forgot_email" | "forgot_telegram" | "forgot_code" | "telegram_verify";

function validatePassword(pw: string): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (pw.length < 8) errors.push("Минимум 8 символов");
  if (!/^[A-ZА-ЯЁ]/.test(pw)) errors.push("Первая буква должна быть заглавной");
  if (!/\d/.test(pw)) errors.push("Минимум одна цифра");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw)) errors.push("Минимум один спецсимвол");
  return { ok: errors.length === 0, errors };
}

function isNicknameTaken(name: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const users = JSON.parse(localStorage.getItem("krx_users") || "[]");
    return users.some((u) => u.name.toLowerCase() === name.toLowerCase());
  } catch { return false; }
}

const inputClass =
  "w-full px-4 py-3 pl-11 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all";

export default function AuthPage() {
  const router = useRouter();
  const { login, register, forgotPassword } = useApp();
  const [mode, setMode] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regBirth, setRegBirth] = useState("");
  const [regGender, setRegGender] = useState("male");
  const [nickStatus, setNickStatus] = useState("idle");

  const [forgotEmail, setForgotEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [tgCode, setTgCode] = useState("");
  const [tgInput, setTgInput] = useState("");

  useEffect(() => {
    if (!regName.trim()) { setNickStatus("idle"); return; }
    const t = setTimeout(() => {
      setNickStatus(isNicknameTaken(regName) ? "taken" : "available");
    }, 400);
    return () => clearTimeout(t);
  }, [regName]);

  const pwV = validatePassword(regPw);
  const go = (m) => { setMode(m); setError(""); setSuccess(""); };

  const handleLogin = async () => {
    if (!loginId || !loginPw) { setError("Заполните все поля"); return; }
    setLoading(true); setError("");
    const ok = await login(loginId, loginPw);
    setLoading(false);
    if (ok) router.push("/"); else setError("Неверное имя/почта или пароль");
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPw || !regBirth) { setError("Заполните все поля"); return; }
    if (nickStatus === "taken") { setError("Никнейм уже занят"); return; }
    if (!pwV.ok) { setError(pwV.errors[0]); return; }
    setLoading(true); setError("");
    const ok = await register({ name: regName, email: regEmail, password: regPw, birthDate: regBirth, gender: regGender });
    setLoading(false);
    if (ok) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setTgCode(code); go("telegram_verify");
    } else setError("Такой email уже зарегистрирован");
  };

  const handleForgotEmail = async () => {
    if (!forgotEmail) { setError("Введите email"); return; }
    setLoading(true); setError("");
    const ok = await forgotPassword(forgotEmail);
    setLoading(false);
    if (ok) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setSuccess("Код отправлен на почту (демо: " + code + ")");
      go("forgot_code");
    } else setError("Email не найден");
  };

  const handleForgotTelegram = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code); setTgCode(code); go("forgot_telegram");
  };

  const handleVerifyCode = () => {
    if (codeInput.trim() !== generatedCode) { setError("Неверный код"); return; }
    setCodeVerified(true); setError(""); setSuccess("Код верный! Введите новый пароль.");
  };

  const handleSavePassword = () => {
    const v = validatePassword(newPw);
    if (!v.ok) { setError(v.errors[0]); return; }
    setSuccess("Пароль изменён! Выполняется вход...");
    setTimeout(() => go("login"), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary/30">
            <span className="text-primary-foreground font-black text-2xl">K</span>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">KVARON<span className="text-primary">_X</span></h1>
          <p className="text-muted-foreground mt-1 text-sm">KRX Network</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl shadow-black/20">

          {(mode === "login" || mode === "register") && (
            <div className="flex bg-muted rounded-xl p-1 mb-6">
              {["login", "register"].map((m) => (
                <button key={m} onClick={() => go(m)}
                  className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
                    mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                  {m === "login" ? "Войти" : "Регистрация"}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl mb-4 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl mb-4 text-sm text-green-500">
              <CheckCircle className="w-4 h-4 shrink-0" /> {success}
            </div>
          )}

          {mode === "login" && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="Никнейм или почта" className={inputClass} onKeyDown={e => e.key==="Enter"&&handleLogin()} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={loginPw} onChange={e => setLoginPw(e.target.value)} type={showPw?"text":"password"} placeholder="Пароль" className={inputClass+" pr-11"} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button onClick={() => go("forgot_choose")} className="text-sm text-primary hover:underline w-full text-right">Забыл пароль</button>
              <button onClick={handleLogin} disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                {loading ? "Входим..." : "Войти"}
              </button>
            </div>
          )}

          {mode === "register" && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Уникальный никнейм"
                  className={cn(inputClass, nickStatus==="taken"&&"border-destructive", nickStatus==="available"&&"border-green-500")} />
                {nickStatus==="taken" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-destructive font-medium">Занят</span>}
                {nickStatus==="available" && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-500 font-medium">✓ Свободен</span>}
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={regEmail} onChange={e=>setRegEmail(e.target.value)} type="email" placeholder="Электронная почта" className={inputClass} />
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input value={regPw} onChange={e=>setRegPw(e.target.value)} type={showPw?"text":"password"} placeholder="Пароль" className={inputClass+" pr-11"} />
                  <button onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}
                  </button>
                </div>
                {regPw && (
                  <ul className="mt-2 space-y-1">
                    {[{ok:regPw.length>=8,text:"Минимум 8 символов"},{ok:/^[A-ZА-ЯЁ]/.test(regPw),text:"Первая буква заглавная"},{ok:/\d/.test(regPw),text:"Минимум одна цифра"},{ok:/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(regPw),text:"Минимум один спецсимвол"}].map(r=>(
                      <li key={r.text} className={cn("text-xs flex items-center gap-1.5",r.ok?"text-green-500":"text-muted-foreground")}>
                        <span>{r.ok?"✓":"○"}</span> {r.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input value={regBirth} onChange={e=>setRegBirth(e.target.value)} type="date" className={inputClass} />
              </div>
              <div className="flex gap-4">
                {["male","female"].map(g=>(
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" checked={regGender===g} onChange={()=>setRegGender(g)} className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-foreground">{g==="male"?"Мужской":"Женский"}</span>
                  </label>
                ))}
              </div>
              <button onClick={handleRegister} disabled={loading||nickStatus==="taken"} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                {loading?"Создаём...":"Зарегистрироваться"}
              </button>
            </div>
          )}

          {mode === "forgot_choose" && (
            <div className="space-y-4">
              <button onClick={()=>go("login")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4"/>Назад
              </button>
              <h2 className="text-xl font-bold text-foreground">Восстановление пароля</h2>
              <p className="text-sm text-muted-foreground">Выберите способ получения кода:</p>
              <button onClick={()=>go("forgot_email")} className="w-full flex items-center gap-4 p-4 bg-muted/50 border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-left">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-primary"/></div>
                <div><p className="font-semibold text-foreground text-sm">Через Email</p><p className="text-xs text-muted-foreground">Код придёт на подтверждённую почту</p></div>
              </button>
              <button onClick={handleForgotTelegram} className="w-full flex items-center gap-4 p-4 bg-muted/50 border border-border rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0"><MessageCircle className="w-5 h-5 text-blue-500"/></div>
                <div><p className="font-semibold text-foreground text-sm">Через Telegram-бота</p><p className="text-xs text-muted-foreground">@KVARON_X_bot пришлёт код в мессенджер</p></div>
              </button>
            </div>
          )}

          {mode === "forgot_email" && (
            <div className="space-y-4">
              <button onClick={()=>go("forgot_choose")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4"/>Назад</button>
              <h2 className="text-xl font-bold text-foreground">Восстановление через Email</h2>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                <input value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} type="email" placeholder="Электронная почта" className={inputClass}/>
              </div>
              <button onClick={handleForgotEmail} disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all">
                {loading?"Отправляем...":"Отправить код"}
              </button>
            </div>
          )}

          {mode === "forgot_telegram" && (
            <div className="space-y-4">
              <button onClick={()=>go("forgot_choose")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4"/>Назад</button>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3"><MessageCircle className="w-8 h-8 text-blue-500"/></div>
                <h2 className="text-xl font-bold text-foreground mb-2">Код через Telegram</h2>
                <p className="text-sm text-muted-foreground">Напишите боту <span className="text-primary font-mono font-bold">@KVARON_X_bot</span>:</p>
                <div className="mt-3 p-3 bg-muted rounded-xl border border-border font-mono text-lg font-bold text-primary tracking-widest">/reset {tgCode}</div>
              </div>
              <input value={codeInput} onChange={e=>setCodeInput(e.target.value)} placeholder="Код из Telegram" className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-center text-lg tracking-widest font-mono"/>
              {!codeVerified ? (
                <button onClick={handleVerifyCode} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all">Проверить код</button>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                    <input value={newPw} onChange={e=>setNewPw(e.target.value)} type={showNewPw?"text":"password"} placeholder="Новый пароль" className={inputClass+" pr-11"}/>
                    <button onClick={()=>setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showNewPw?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button>
                  </div>
                  <button onClick={handleSavePassword} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all">Сохранить пароль</button>
                </div>
              )}
            </div>
          )}

          {mode === "forgot_code" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">Введите код из письма</h2>
              <input value={codeInput} onChange={e=>setCodeInput(e.target.value)} placeholder="Код подтверждения" className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-center text-xl tracking-widest font-mono"/>
              {!codeVerified ? (
                <button onClick={handleVerifyCode} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all">Проверить</button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-green-500 font-medium">✓ Код верный — введите новый пароль</p>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                    <input value={newPw} onChange={e=>setNewPw(e.target.value)} type={showNewPw?"text":"password"} placeholder="Новый пароль" className={inputClass+" pr-11"}/>
                    <button onClick={()=>setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showNewPw?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button>
                  </div>
                  <button onClick={handleSavePassword} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all">Сохранить пароль</button>
                </div>
              )}
              <button onClick={()=>go("login")} className="w-full text-sm text-muted-foreground hover:text-foreground text-center">← Назад к входу</button>
            </div>
          )}

          {mode === "telegram_verify" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3"><Send className="w-8 h-8 text-blue-500"/></div>
                <h2 className="text-xl font-bold text-foreground mb-2">Подтверждение Telegram</h2>
                <p className="text-sm text-muted-foreground">Напишите боту <span className="text-primary font-mono font-bold">@KVARON_X_bot</span>:</p>
                <div className="mt-3 p-3 bg-muted rounded-xl border border-border font-mono text-lg font-bold text-primary tracking-widest">/verify {tgCode}</div>
              </div>
              <input value={tgInput} onChange={e=>setTgInput(e.target.value)} placeholder="Код из Telegram" className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-center text-xl tracking-widest font-mono"/>
              <button onClick={()=>{ if(tgInput===tgCode) router.push("/"); else setError("Неверный код"); }} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all">Подтвердить</button>
              <button onClick={()=>router.push("/")} className="w-full text-sm text-muted-foreground hover:text-foreground text-center transition-colors">Пропустить (позже)</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
