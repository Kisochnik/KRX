"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export const KVARON_AUTH_EMAIL = "kvaronx@gmail.com";

export interface User {
  nickname: string;
  username: string; // same as nickname.toLowerCase(), for @handle
  email: string;
  telegram: string;
  dob: string;
  passwordHash: string;
  createdAt: string;
  emailVerified: boolean;
  avatar?: string;   // initials or URL
  bio?: string;
  language?: string;
}

export interface CyberToastType {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "error" | "security";
  duration: number;
}

type OtpChannel = "email" | "telegram";
type AuthResult = { success: boolean; error?: string };
type RecoveryResult = AuthResult & { code?: string; target?: string };

interface OtpRecord {
  code: string;
  channel: OtpChannel;
  expires: number;
  purpose: "register" | "recovery";
  serverSent?: boolean; // true if sent via /api/send-code
}

interface AuthContextType {
  user: User | null;
  users: User[];
  toasts: CyberToastType[];
  addToast: (title: string, message: string, type: CyberToastType["type"], duration?: number) => void;
  removeToast: (id: string) => void;
  sendVerificationOtp: (email: string) => Promise<void>;
  verifyOtp: (identifier: string, code: string) => boolean;
  verifyOtpAsync: (identifier: string, code: string) => Promise<boolean>;
  registerUser: (nickname: string, email: string, dob: string, passwordHash: string, language?: string) => AuthResult;
  loginUser: (identifier: string, passwordHash: string, remember?: boolean) => AuthResult;
  sendRecoveryOtp: (method: OtpChannel, identifier: string) => Promise<RecoveryResult>;
  resetPassword: (identifier: string, newPasswordHash: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const USERS_KEY = "kvaron_users";
const SESSION_KEY = "kvaron_session";
const OTP_TTL_MS = 5 * 60 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const normalizeNickname = (value: string) => value.trim().replace(/^@/, "").toLowerCase();
const normalizeTelegram = (value: string) => normalizeNickname(value);

const normalizeLookup = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("@")) return normalizeTelegram(trimmed);
  if (trimmed.includes("@")) return normalizeEmail(trimmed);
  return normalizeNickname(trimmed);
};

const getOtpKey = (identifier: string) => normalizeLookup(identifier);

const getUserLookupValues = (target: User) =>
  Array.from(
    new Set([
      normalizeEmail(target.email),
      normalizeNickname(target.nickname),
      normalizeNickname(target.username || target.nickname),
      normalizeTelegram(target.telegram),
    ])
  );

const createDemoUser = (): User => ({
  nickname: "demo",
  username: "demo",
  email: "demo@kvaronx.com",
  telegram: "demo",
  dob: "2000-01-01",
  passwordHash: "Password123",
  createdAt: new Date().toISOString(),
  emailVerified: true,
  bio: "Demo account for KVARON_X",
  language: "ru",
});

const sanitizeUser = (candidate: Partial<User> & { phone?: string }): User | null => {
  if (!candidate.nickname || !candidate.email || !candidate.passwordHash) return null;

  const nickname = String(candidate.nickname).trim();
  const email = normalizeEmail(String(candidate.email));

  if (!nickname || !email) return null;

  return {
    nickname,
    username: normalizeNickname(candidate.username || nickname),
    email,
    telegram: normalizeTelegram(candidate.telegram || nickname),
    dob: candidate.dob || "",
    passwordHash: String(candidate.passwordHash),
    createdAt: candidate.createdAt || new Date().toISOString(),
    emailVerified: candidate.emailVerified ?? true,
    avatar: candidate.avatar || nickname.slice(0, 2).toUpperCase(),
    bio: candidate.bio || "",
    language: candidate.language || "ru",
  };
};

const safeParseUsers = () => {
  if (typeof window === "undefined") return [];
  try {
    const savedUsers = window.localStorage.getItem(USERS_KEY);
    const parsedUsers = savedUsers ? (JSON.parse(savedUsers) as Array<Partial<User> & { phone?: string }>) : [];
    return parsedUsers.map(sanitizeUser).filter((item): item is User => Boolean(item));
  } catch {
    return [];
  }
};

const loadInitialUsers = () => {
  const savedUsers = safeParseUsers();
  const hasDemo = savedUsers.some((candidate) => normalizeNickname(candidate.nickname) === "demo");
  return hasDemo ? savedUsers : [...savedUsers, createDemoUser()];
};

const loadInitialUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const session = window.localStorage.getItem(SESSION_KEY) || window.sessionStorage.getItem(SESSION_KEY);
    return session ? sanitizeUser(JSON.parse(session)) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(loadInitialUser);
  const [users, setUsers] = useState<User[]>(loadInitialUsers);
  const [toasts, setToasts] = useState<CyberToastType[]>([]);
  const [otps, setOtps] = useState<Record<string, OtpRecord>>({});

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = (
    title: string,
    message: string,
    type: CyberToastType["type"] = "info",
    duration = 9000
  ) => {
    const id = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
    window.setTimeout(() => removeToast(id), duration);
  };

  const generate6DigitCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  const findUserByIdentifier = (identifier: string) => {
    const lookup = normalizeLookup(identifier);
    return users.find((candidate) => getUserLookupValues(candidate).includes(lookup));
  };

  const findUserIndexByIdentifier = (identifier: string) => {
    const lookup = normalizeLookup(identifier);
    return users.findIndex((candidate) => getUserLookupValues(candidate).includes(lookup));
  };

  const storeOtpLocally = (identifier: string, channel: OtpChannel, purpose: OtpRecord["purpose"]) => {
    const code = generate6DigitCode();
    const key = getOtpKey(identifier);
    setOtps((prev) => ({
      ...prev,
      [key]: { code, channel, purpose, expires: Date.now() + OTP_TTL_MS, serverSent: false },
    }));
    return code;
  };

  // --- REAL EMAIL SEND ---
  const sendVerificationOtp = async (email: string) => {
    const target = normalizeEmail(email);

    try {
      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: target, purpose: "register" }),
      });

      const data = await res.json();

      if (data.success) {
        // If server sent email, store a placeholder OTP (server handles verification)
        // For dev mode without SMTP, code is returned and stored locally
        if (data.dev && data.code) {
          const key = getOtpKey(target);
          setOtps((prev) => ({
            ...prev,
            [key]: {
              code: data.code,
              channel: "email",
              purpose: "register",
              expires: Date.now() + OTP_TTL_MS,
              serverSent: false,
            },
          }));
          addToast(
            "KVARON_X MAIL [DEV]",
            `SMTP не настроен. Код для разработки: ${data.code}. Действует 5 минут.`,
            "info",
            14000
          );
        } else {
          // Real send — store a sentinel so verifyOtp calls the server
          const key = getOtpKey(target);
          setOtps((prev) => ({
            ...prev,
            [key]: {
              code: "__server__",
              channel: "email",
              purpose: "register",
              expires: Date.now() + OTP_TTL_MS,
              serverSent: true,
            },
          }));
          addToast(
            "Код отправлен на вашу почту",
            `Письмо отправлено на ${target}. Введите 6-значный код. Он действует 5 минут.`,
            "info",
            12000
          );
        }
      } else {
        // Fallback to local OTP on server error
        const code = storeOtpLocally(target, "email", "register");
        addToast(
          "KVARON_X MAIL",
          `Не удалось отправить письмо. Код для входа: ${code}. Действует 5 минут.`,
          "error",
          14000
        );
      }
    } catch {
      // Network error fallback
      const code = storeOtpLocally(target, "email", "register");
      addToast(
        "KVARON_X MAIL",
        `Ошибка сети. Код для входа: ${code}. Действует 5 минут.`,
        "error",
        14000
      );
    }
  };

  const verifyOtp = (identifier: string, code: string): boolean => {
    const key = getOtpKey(identifier);
    const entry = otps[key];

    if (!entry) return false;

    if (Date.now() > entry.expires) {
      addToast("Код устарел", "Срок действия кода истёк. Запросите новый код.", "error");
      setOtps((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      return false;
    }

    if (entry.code !== code) return false;

    setOtps((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    return true;
  };

  // Async OTP verification for server-sent codes — used when real email was sent
  const verifyOtpAsync = async (identifier: string, code: string): Promise<boolean> => {
    const key = getOtpKey(identifier);
    const entry = otps[key];

    if (!entry) return false;

    if (Date.now() > entry.expires) {
      addToast("Код устарел", "Срок действия кода истёк. Запросите новый код.", "error");
      setOtps((prev) => { const copy = { ...prev }; delete copy[key]; return copy; });
      return false;
    }

    if (entry.serverSent) {
      try {
        const res = await fetch(`/api/send-code?email=${encodeURIComponent(identifier.trim().toLowerCase())}&code=${code}`);
        const data = await res.json();
        if (data.success) {
          setOtps((prev) => { const copy = { ...prev }; delete copy[key]; return copy; });
          return true;
        }
        return false;
      } catch {
        return false;
      }
    }

    return verifyOtp(identifier, code);
  };

  const registerUser = (
    nickname: string,
    email: string,
    dob: string,
    passwordHash: string,
    language: string = "ru"
  ): AuthResult => {
    const trimmedNickname = nickname.trim();
    const newUser: User = {
      nickname: trimmedNickname,
      username: normalizeNickname(trimmedNickname),
      email: normalizeEmail(email),
      telegram: normalizeTelegram(trimmedNickname),
      dob,
      passwordHash,
      createdAt: new Date().toISOString(),
      emailVerified: true,
      avatar: trimmedNickname.slice(0, 2).toUpperCase(),
      bio: "",
      language,
    };

    const newLookups = getUserLookupValues(newUser);
    const exists = users.some((candidate) =>
      getUserLookupValues(candidate).some((lookup) => newLookups.includes(lookup))
    );

    if (exists) {
      return { success: false, error: "Пользователь с таким никнеймом или email уже зарегистрирован." };
    }

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    // Save profile data under a dedicated key for easy access
    localStorage.setItem("krx_user", JSON.stringify(newUser));

    addToast(
      "Аккаунт создан",
      `Добро пожаловать, ${newUser.nickname}! Ваш профиль готов.`,
      "success"
    );

    return { success: true };
  };

  const loginUser = (identifier: string, passwordHash: string, remember = false): AuthResult => {
    const foundUser = findUserByIdentifier(identifier);

    if (!foundUser) {
      return { success: false, error: "Пользователь не найден. Проверьте имя пользователя или почту." };
    }
    if (!foundUser.emailVerified) {
      return { success: false, error: "Email ещё не подтверждён. Завершите регистрацию." };
    }
    if (foundUser.passwordHash !== passwordHash) {
      return { success: false, error: "Неверный пароль. Попробуйте ещё раз." };
    }

    setUser(foundUser);
    localStorage.setItem("krx_user", JSON.stringify(foundUser));

    // Restore user language preference
    if (foundUser.language) {
      localStorage.setItem("krx_locale", foundUser.language);
    }

    const sessionData = JSON.stringify(foundUser);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    if (remember) {
      localStorage.setItem(SESSION_KEY, sessionData);
    } else {
      sessionStorage.setItem(SESSION_KEY, sessionData);
    }

    addToast(
      "Вход подтверждён",
      `Сессия ${foundUser.nickname} открыта. Добро пожаловать в KVARON_X.`,
      "security",
      6500
    );

    return { success: true };
  };

  const sendRecoveryOtp = async (method: OtpChannel, identifier: string): Promise<RecoveryResult> => {
    const foundUser = findUserByIdentifier(identifier);
    if (!foundUser) {
      return { success: false, error: "Учётная запись с такими данными не найдена." };
    }

    const target = method === "email" ? foundUser.email : `@${normalizeTelegram(foundUser.telegram)}`;

    if (method === "email") {
      try {
        const res = await fetch("/api/send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: target, purpose: "recovery" }),
        });
        const data = await res.json();
        if (data.dev && data.code) {
          storeOtpLocally(target, "email", "recovery");
          // Override with server code
          const key = getOtpKey(target);
          setOtps((prev) => ({
            ...prev,
            [key]: { code: data.code, channel: "email", purpose: "recovery", expires: Date.now() + OTP_TTL_MS },
          }));
          addToast("KVARON_X MAIL [DEV]", `Код восстановления [dev]: ${data.code}`, "info", 14000);
          return { success: true, code: data.code, target };
        }
        addToast("Код отправлен", `Код восстановления отправлен на ${target}.`, "info", 10000);
        return { success: true, target };
      } catch {
        const code = storeOtpLocally(target, "email", "recovery");
        addToast("KVARON_X MAIL", `Код восстановления: ${code}`, "info", 14000);
        return { success: true, code, target };
      }
    }

    const code = storeOtpLocally(target, "telegram", "recovery");
    addToast("KVARON_X BOT", `Код восстановления в Telegram ${target}: ${code}`, "info", 14000);
    return { success: true, code, target };
  };

  const resetPassword = (identifier: string, newPasswordHash: string) => {
    const index = findUserIndexByIdentifier(identifier);
    if (index === -1) {
      addToast("Системная ошибка", "Не удалось найти пользователя для смены пароля.", "error");
      return false;
    }

    const updatedUsers = [...users];
    updatedUsers[index] = { ...updatedUsers[index], passwordHash: newPasswordHash };
    setUsers(updatedUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    const activeLookup = user ? getUserLookupValues(user) : [];
    const resetLookup = normalizeLookup(identifier);
    if (activeLookup.includes(resetLookup)) {
      setUser(updatedUsers[index]);
      localStorage.setItem("krx_user", JSON.stringify(updatedUsers[index]));
      const sessionData = JSON.stringify(updatedUsers[index]);
      if (localStorage.getItem(SESSION_KEY)) localStorage.setItem(SESSION_KEY, sessionData);
      if (sessionStorage.getItem(SESSION_KEY)) sessionStorage.setItem(SESSION_KEY, sessionData);
    }

    addToast("Пароль обновлён", "Теперь используйте новый пароль для входа.", "security");
    return true;
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("krx_user", JSON.stringify(updated));

    // Also update in users array
    const index = findUserIndexByIdentifier(user.email);
    if (index !== -1) {
      const updatedUsers = [...users];
      updatedUsers[index] = updated;
      setUsers(updatedUsers);
    }

    const sessionData = JSON.stringify(updated);
    if (localStorage.getItem(SESSION_KEY)) localStorage.setItem(SESSION_KEY, sessionData);
    if (sessionStorage.getItem(SESSION_KEY)) sessionStorage.setItem(SESSION_KEY, sessionData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("krx_user");
    sessionStorage.removeItem(SESSION_KEY);
    addToast("Выход выполнен", "Сессия KVARON_X завершена.", "info");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        toasts,
        addToast,
        removeToast,
        sendVerificationOtp,
        verifyOtp,
        verifyOtpAsync,
        registerUser,
        loginUser,
        sendRecoveryOtp,
        resetPassword,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
