"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ru" | "en";
export type Theme = "dark" | "light";

export interface User {
  id: string;
  name: string;
  email: string;
  gender: "male" | "female";
  birthDate: string;
  level: number;
  balance: number;
  friends: number;
  posts: number;
  isAdmin: boolean;
  isRich: boolean;
  avatar: string | null;
  banner: string | null;
  bio: string;
}

export interface Transaction {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  addedBy: string;
}

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (nameOrEmail: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<boolean>;

  // Theme
  theme: Theme;
  setTheme: (t: Theme) => void;

  // Language
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;

  // Music player
  playerVisible: boolean;
  showPlayer: () => void;
  currentTrack: Track | null;
  setCurrentTrack: (track: Track | null) => void;
  tracks: Track[];
  addTrack: (track: Omit<Track, "id">) => void;

  // Wallet
  transactions: Transaction[];
  sendMoney: (toUser: string, amount: number) => boolean;

  // Settings toggles
  settings: AppSettings;
  updateSettings: (key: keyof AppSettings, value: boolean) => void;
}

interface AppSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  privateProfile: boolean;
  showOnlineStatus: boolean;
  twoFactorAuth: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  gender: "male" | "female";
}

// ---------- i18n ----------
const translations: Record<Language, Record<string, string>> = {
  ru: {
    home: "Главная", news: "Новости", notifications: "Уведомления",
    games: "Игры", music: "Музыка", friends: "Друзья", chat: "Чат",
    profile: "Профиль", shop: "Магазин", wallet: "Кошелёк",
    settings: "Настройки", admin: "Админ панель",
    login: "Войти", register: "Регистрация", logout: "Выйти",
    email: "Почта", password: "Пароль", name: "Имя",
    birthDate: "Дата рождения", gender: "Пол",
    male: "Мужской", female: "Женский",
    forgotPassword: "Забыл пароль",
    sendMoney: "Отправить", balance: "Баланс",
    darkTheme: "Тёмная тема", lightTheme: "Светлая тема",
    save: "Сохранить", cancel: "Отмена", edit: "Редактировать",
    noAccount: "Нет аккаунта?", haveAccount: "Есть аккаунт?",
    level: "Уровень", posts: "Постов", friends_count: "Друзей",
    addTrack: "Добавить трек", trackTitle: "Название трека", artist: "Исполнитель",
    language: "Язык",
  },
  en: {
    home: "Home", news: "News", notifications: "Notifications",
    games: "Games", music: "Music", friends: "Friends", chat: "Chat",
    profile: "Profile", shop: "Shop", wallet: "Wallet",
    settings: "Settings", admin: "Admin Panel",
    login: "Login", register: "Register", logout: "Logout",
    email: "Email", password: "Password", name: "Name",
    birthDate: "Birth Date", gender: "Gender",
    male: "Male", female: "Female",
    forgotPassword: "Forgot Password",
    sendMoney: "Send", balance: "Balance",
    darkTheme: "Dark Theme", lightTheme: "Light Theme",
    save: "Save", cancel: "Cancel", edit: "Edit",
    noAccount: "No account?", haveAccount: "Have an account?",
    level: "Level", posts: "Posts", friends_count: "Friends",
    addTrack: "Add Track", trackTitle: "Track Title", artist: "Artist",
    language: "Language",
  },
};

// ---------- Mock users DB ----------
const USERS_KEY = "krx_users";
const SESSION_KEY = "krx_session";

function getUsers(): (User & { password: string })[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveUsers(users: (User & { password: string })[]) {
  if (typeof window !== "undefined") localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setThemeState] = useState<Theme>("dark");
  const [language, setLanguageState] = useState<Language>("ru");
  const [playerVisible, setPlayerVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    privateProfile: false,
    showOnlineStatus: true,
    twoFactorAuth: false,
  });

  // Load session on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try { setUser(JSON.parse(session)); } catch {}
    }
    const savedTheme = localStorage.getItem("krx_theme") as Theme | null;
    if (savedTheme) setThemeState(savedTheme);
    const savedLang = localStorage.getItem("krx_lang") as Language | null;
    if (savedLang) setLanguageState(savedLang);
    const savedTracks = localStorage.getItem("krx_tracks");
    if (savedTracks) { try { setTracks(JSON.parse(savedTracks)); } catch {} }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("krx_theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    if (typeof window !== "undefined") localStorage.setItem("krx_lang", l);
  };

  const t = (key: string) => translations[language][key] || key;

  const login = async (nameOrEmail: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const found = users.find(
      u => (u.email === nameOrEmail || u.name === nameOrEmail) && u.password === password
    );
    if (!found) return false;
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const users = getUsers();
    if (users.find(u => u.email === data.email)) return false;
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      gender: data.gender,
      birthDate: data.birthDate,
      level: 0,
      balance: 0,
      friends: 0,
      posts: 0,
      isAdmin: false,
      isRich: false,
      avatar: null,
      banner: null,
      bio: "",
    };
    users.push(newUser);
    saveUsers(users);
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setTransactions([]);
    return true;
  };

  const logout = () => {
    setUser(null);
    setPlayerVisible(false);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    // Update in users DB
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) { users[idx] = { ...users[idx], ...data }; saveUsers(users); }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    const users = getUsers();
    return !!users.find(u => u.email === email);
  };

  const showPlayer = () => setPlayerVisible(true);

  const addTrack = (track: Omit<Track, "id">) => {
    const newTrack = { ...track, id: Date.now() };
    const updated = [...tracks, newTrack];
    setTracks(updated);
    localStorage.setItem("krx_tracks", JSON.stringify(updated));
  };

  const sendMoney = (toUserName: string, amount: number): boolean => {
    if (!user || user.balance < amount || amount <= 0) return false;
    const users = getUsers();
    const recipient = users.find(u => u.name === toUserName);
    if (!recipient) return false;

    // Deduct from sender
    updateUser({ balance: user.balance - amount });

    // Add to recipient
    const rIdx = users.findIndex(u => u.name === toUserName);
    users[rIdx].balance += amount;
    saveUsers(users);

    const tx: Transaction = {
      id: Date.now(),
      type: "expense",
      description: `Перевод → @${toUserName}`,
      amount: -amount,
      date: new Date().toLocaleString("ru"),
    };
    setTransactions(prev => [tx, ...prev]);
    return true;
  };

  const updateSettings = (key: keyof AppSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AppContext.Provider value={{
      user, isAuthenticated: !!user,
      login, register, logout, updateUser, forgotPassword,
      theme, setTheme,
      language, setLanguage, t,
      playerVisible, showPlayer, currentTrack, setCurrentTrack, tracks, addTrack,
      transactions, sendMoney,
      settings, updateSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
