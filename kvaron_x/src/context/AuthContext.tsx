"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  nickname: string;
  email: string;
  dob: string;
  passwordHash: string; // Stored in plain text for demo simulation purposes
  createdAt: string;
}

export interface CyberToastType {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "error" | "security";
  duration: number;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  toasts: CyberToastType[];
  addToast: (title: string, message: string, type: CyberToastType["type"], duration?: number) => void;
  removeToast: (id: string) => void;
  sendVerificationOtp: (email: string) => string;
  verifyOtp: (identifier: string, code: string) => boolean;
  registerUser: (nickname: string, email: string, dob: string, passwordHash: string) => boolean;
  loginUser: (emailOrUsername: string, passwordHash: string) => { success: boolean; error?: string };
  sendRecoveryOtp: (method: "email" | "telegram", identifier: string) => { success: boolean; code?: string; error?: string };
  resetPassword: (identifier: string, newPasswordHash: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [toasts, setToasts] = useState<CyberToastType[]>([]);
  const [otps, setOtps] = useState<{ [key: string]: { code: string; expires: number } }>({});

  // 1. Initial Load from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem("kvaron_users");
    const parsedUsers: User[] = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Seed default demo user if not exists
    const hasDemo = parsedUsers.some(u => u.email === "demo@kvaronx.com" || u.nickname === "demo");
    if (!hasDemo) {
      const demoUser: User = {
        nickname: "demo",
        email: "demo@kvaronx.com",
        dob: "2000-01-01",
        passwordHash: "Password123",
        createdAt: new Date().toISOString(),
      };
      parsedUsers.push(demoUser);
      localStorage.setItem("kvaron_users", JSON.stringify(parsedUsers));
    }
    setUsers(parsedUsers);

    // Load active session if exists
    const activeSession = localStorage.getItem("kvaron_session");
    if (activeSession) {
      setUser(JSON.parse(activeSession));
    }
  }, []);

  // 2. Custom Toast System
  const addToast = (
    title: string,
    message: string,
    type: CyberToastType["type"] = "info",
    duration = 8000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper: generates 6-digit random code
  const generate6DigitCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // 3. Send OTP verification
  const sendVerificationOtp = (email: string) => {
    const code = generate6DigitCode();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    setOtps((prev) => ({ ...prev, [email.toLowerCase()]: { code, expires } }));

    // Simulate sending from kvaronx@gmail.com
    addToast(
      "✉️ [kvaronx@gmail.com]",
      `Код подтверждения отправлен на почту ${email}. Код доступа: ${code} (действует 5 минут)`,
      "info",
      12000
    );

    return code;
  };

  // 4. Verify OTP
  const verifyOtp = (identifier: string, code: string) => {
    const idLower = identifier.toLowerCase();
    const entry = otps[idLower];
    if (!entry) return false;
    
    if (Date.now() > entry.expires) {
      addToast("Ошибка верификации", "Срок действия кода подтверждения истек.", "error");
      return false;
    }

    if (entry.code !== code) {
      return false;
    }

    // Clean up OTP on successful verification
    setOtps((prev) => {
      const copy = { ...prev };
      delete copy[idLower];
      return copy;
    });

    return true;
  };

  // 5. Register User
  const registerUser = (nickname: string, email: string, dob: string, passwordHash: string) => {
    const emailLower = email.toLowerCase();
    const nickLower = nickname.toLowerCase();
    
    const exists = users.some(
      (u) => u.email.toLowerCase() === emailLower || u.nickname.toLowerCase() === nickLower
    );

    if (exists) {
      addToast("Ошибка регистрации", "Пользователь с таким Email или Никнеймом уже зарегистрирован.", "error");
      return false;
    }

    const newUser: User = {
      nickname,
      email: emailLower,
      dob,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("kvaron_users", JSON.stringify(updatedUsers));

    addToast(
      "🔐 Система KVARON_X",
      `Пользователь ${nickname} успешно зарегистрирован. Добро пожаловать!`,
      "success"
    );

    return true;
  };

  // 6. Login User
  const loginUser = (emailOrUsername: string, passwordHash: string) => {
    const query = emailOrUsername.toLowerCase();
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === query || u.nickname.toLowerCase() === query
    );

    if (!foundUser) {
      return { success: false, error: "Пользователь не найден. Проверьте правильность ввода." };
    }

    if (foundUser.passwordHash !== passwordHash) {
      return { success: false, error: "Неверный пароль. Попробуйте еще раз." };
    }

    // Success login
    setUser(foundUser);
    localStorage.setItem("kvaron_session", JSON.stringify(foundUser));

    // Security alert notification
    addToast(
      "🛡️ Безопасность аккаунта",
      `Обнаружен новый вход в профиль ${foundUser.nickname}. IP: 192.168.1.137 (Симуляция).`,
      "security",
      6000
    );

    return { success: true };
  };

  // 7. Password Recovery
  const sendRecoveryOtp = (method: "email" | "telegram", identifier: string) => {
    const searchVal = identifier.toLowerCase().replace("@", "");
    
    // Check if user exists
    const userExists = users.some(
      (u) =>
        u.email.toLowerCase() === searchVal ||
        u.nickname.toLowerCase() === searchVal
    );

    if (!userExists && searchVal !== "demo" && searchVal !== "demo@kvaronx.com") {
      return { success: false, error: "Учетная запись с указанными данными не найдена." };
    }

    const code = generate6DigitCode();
    const expires = Date.now() + 5 * 60 * 1000;
    setOtps((prev) => ({ ...prev, [searchVal]: { code, expires } }));

    if (method === "email") {
      // Simulate Email recovery send from kvaronx@gmail.com
      addToast(
        "✉️ [kvaronx@gmail.com]",
        `Инструкции по восстановлению отправлены на ${identifier}. Проверочный код: ${code}`,
        "info",
        12000
      );
    } else {
      // Simulate Telegram recovery send from @KVARON_X_BOT
      addToast(
        "🤖 [KVARON_X_BOT]",
        `Отправлен запрос восстановления для @${searchVal}. Код безопасности: ${code}`,
        "info",
        12000
      );
    }

    return { success: true, code };
  };

  // 8. Reset Password
  const resetPassword = (identifier: string, newPasswordHash: string) => {
    const searchVal = identifier.toLowerCase().replace("@", "");
    
    const index = users.findIndex(
      (u) =>
        u.email.toLowerCase() === searchVal ||
        u.nickname.toLowerCase() === searchVal
    );

    if (index === -1) {
      addToast("Системная ошибка", "Не удалось найти пользователя для сброса пароля.", "error");
      return false;
    }

    const updatedUsers = [...users];
    updatedUsers[index] = {
      ...updatedUsers[index],
      passwordHash: newPasswordHash,
    };

    setUsers(updatedUsers);
    localStorage.setItem("kvaron_users", JSON.stringify(updatedUsers));

    // Update active session if currently logged in as this user
    if (user && (user.email.toLowerCase() === searchVal || user.nickname.toLowerCase() === searchVal)) {
      const updatedUser = updatedUsers[index];
      setUser(updatedUser);
      localStorage.setItem("kvaron_session", JSON.stringify(updatedUser));
    }

    addToast(
      "🛡️ Смена пароля",
      "Пароль успешно обновлен! Используйте новый пароль для входа.",
      "success"
    );

    return true;
  };

  // 9. Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("kvaron_session");
    addToast("Система KVARON_X", "Вы успешно вышли из системы безопасности.", "info");
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
