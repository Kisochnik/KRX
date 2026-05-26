"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export const KVARON_AUTH_EMAIL = "kvaronx@gmail.com";

export interface User {
  nickname: string;
  email: string;
  telegram: string;
  dob: string;
  passwordHash: string;
  createdAt: string;
  emailVerified: boolean;
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
}

interface AuthContextType {
  user: User | null;
  users: User[];
  toasts: CyberToastType[];
  addToast: (title: string, message: string, type: CyberToastType["type"], duration?: number) => void;
  removeToast: (id: string) => void;
  sendVerificationOtp: (email: string) => string;
  verifyOtp: (identifier: string, code: string) => boolean;
  registerUser: (nickname: string, email: string, dob: string, passwordHash: string) => AuthResult;
  loginUser: (identifier: string, passwordHash: string, remember?: boolean) => AuthResult;
  sendRecoveryOtp: (method: OtpChannel, identifier: string) => RecoveryResult;
  resetPassword: (identifier: string, newPasswordHash: string) => boolean;
  logout: () => void;
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
      normalizeTelegram(target.telegram),
    ])
  );

const createDemoUser = (): User => ({
  nickname: "demo",
  email: "demo@kvaronx.com",
  telegram: "demo",
  dob: "2000-01-01",
  passwordHash: "Password123",
  createdAt: new Date().toISOString(),
  emailVerified: true,
});

const sanitizeUser = (candidate: Partial<User> & { phone?: string }): User | null => {
  if (!candidate.nickname || !candidate.email || !candidate.passwordHash) return null;

  const nickname = String(candidate.nickname).trim();
  const email = normalizeEmail(String(candidate.email));

  if (!nickname || !email) return null;

  return {
    nickname,
    email,
    telegram: normalizeTelegram(candidate.telegram || nickname),
    dob: candidate.dob || "",
    passwordHash: String(candidate.passwordHash),
    createdAt: candidate.createdAt || new Date().toISOString(),
    emailVerified: candidate.emailVerified ?? true,
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

  const storeOtp = (identifier: string, channel: OtpChannel, purpose: OtpRecord["purpose"]) => {
    const code = generate6DigitCode();
    const key = getOtpKey(identifier);

    setOtps((prev) => ({
      ...prev,
      [key]: {
        code,
        channel,
        purpose,
        expires: Date.now() + OTP_TTL_MS,
      },
    }));

    return code;
  };

  const sendVerificationOtp = (email: string) => {
    const target = normalizeEmail(email);
    const code = storeOtp(target, "email", "register");

    addToast(
      "KVARON_X MAIL",
      `Письмо от ${KVARON_AUTH_EMAIL} отправлено на ${target}. Код подтверждения: ${code}. Он действует 5 минут.`,
      "info",
      14000
    );

    return code;
  };

  const verifyOtp = (identifier: string, code: string) => {
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

  const registerUser = (nickname: string, email: string, dob: string, passwordHash: string) => {
    const newUser: User = {
      nickname: nickname.trim(),
      email: normalizeEmail(email),
      telegram: normalizeTelegram(nickname),
      dob,
      passwordHash,
      createdAt: new Date().toISOString(),
      emailVerified: true,
    };

    const newLookups = getUserLookupValues(newUser);
    const exists = users.some((candidate) =>
      getUserLookupValues(candidate).some((lookup) => newLookups.includes(lookup))
    );

    if (exists) {
      return {
        success: false,
        error: "Пользователь с таким никнеймом или email уже зарегистрирован.",
      };
    }

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    addToast(
      "Почта подтверждена",
      `Аккаунт ${newUser.nickname} создан. Уведомление безопасности отправлено с ${KVARON_AUTH_EMAIL}.`,
      "success"
    );

    return { success: true };
  };

  const loginUser = (identifier: string, passwordHash: string, remember = false) => {
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
      `Сессия ${foundUser.nickname} открыта. Уведомление безопасности отправлено с ${KVARON_AUTH_EMAIL}.`,
      "security",
      6500
    );

    return { success: true };
  };

  const sendRecoveryOtp = (method: OtpChannel, identifier: string) => {
    const foundUser = findUserByIdentifier(identifier);

    if (!foundUser) {
      return { success: false, error: "Учётная запись с такими данными не найдена." };
    }

    const target = method === "email" ? foundUser.email : `@${normalizeTelegram(foundUser.telegram)}`;
    const code = storeOtp(target, method, "recovery");
    const channelLabel = method === "email" ? "на почту" : "в Telegram";

    addToast(
      method === "email" ? "KVARON_X MAIL" : "KVARON_X BOT",
      `Код восстановления отправлен ${channelLabel} ${target}. Код: ${code}. Служебный email: ${KVARON_AUTH_EMAIL}.`,
      "info",
      14000
    );

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
      const sessionData = JSON.stringify(updatedUsers[index]);
      if (localStorage.getItem(SESSION_KEY)) localStorage.setItem(SESSION_KEY, sessionData);
      if (sessionStorage.getItem(SESSION_KEY)) sessionStorage.setItem(SESSION_KEY, sessionData);
    }

    addToast(
      "Пароль обновлён",
      `Теперь используйте новый пароль для входа. Уведомление безопасности отправлено с ${KVARON_AUTH_EMAIL}.`,
      "security"
    );
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
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
        registerUser,
        loginUser,
        sendRecoveryOtp,
        resetPassword,
        logout,
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
