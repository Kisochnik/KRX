"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ru" | "en";
export type Theme = "dark" | "light";

// ─── Types ─────────────────────────────────────────────────────────────────
export interface User {
  id: string; name: string; email: string; gender: "male" | "female";
  birthDate: string; level: number; balance: number; friends: number;
  posts: number; isAdmin: boolean; isRich: boolean;
  avatar: string | null; banner: string | null; bio: string;
}

export interface Transaction {
  id: number; type: "income" | "expense"; description: string; amount: number; date: string;
}

export interface Track {
  id: number; title: string; artist: string; duration: string; addedBy: string;
}

export interface PollOption { id: number; text: string; votes: number; }

export interface Post {
  id: number; authorId: string; authorName: string; authorAvatar: string | null;
  text: string; media: { type: "image" | "video" | "gif"; url: string }[];
  poll: { question: string; options: PollOption[] } | null;
  hashtags: string[]; likes: number; likedBy: string[];
  comments: number; shares: number;
  createdAt: number; // timestamp ms
}

export interface Story {
  id: number; authorId: string; authorName: string; authorAvatar: string | null;
  media: { type: "image" | "video"; url: string };
  createdAt: number; // expires 24h
}

export interface AppSettings {
  emailNotifications: boolean; pushNotifications: boolean; soundEnabled: boolean;
  privateProfile: boolean; showOnlineStatus: boolean; twoFactorAuth: boolean;
}

interface RegisterData {
  name: string; email: string; password: string; birthDate: string; gender: "male" | "female";
}

interface AppContextType {
  user: User | null; isAuthenticated: boolean;
  login: (nameOrEmail: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void; updateUser: (data: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  theme: Theme; setTheme: (t: Theme) => void;
  language: Language; setLanguage: (l: Language) => void; t: (key: string) => string;
  playerVisible: boolean; showPlayer: () => void;
  currentTrack: Track | null; setCurrentTrack: (track: Track | null) => void;
  tracks: Track[]; addTrack: (track: Omit<Track, "id">) => void;
  transactions: Transaction[]; sendMoney: (toUser: string, amount: number) => boolean;
  settings: AppSettings; updateSettings: (key: keyof AppSettings, value: boolean) => void;
  // Feed
  posts: Post[]; addPost: (data: Omit<Post, "id" | "createdAt" | "likes" | "likedBy" | "comments" | "shares">) => void;
  toggleLike: (postId: number) => void;
  stories: Story[]; addStory: (media: Story["media"]) => void;
  trends: { tag: string; count: number }[];
}

// ─── i18n ──────────────────────────────────────────────────────────────────
const translations: Record<Language, Record<string, string>> = {
  ru: {
    home: "Главная", news: "Новости", notifications: "Уведомления",
    games: "Игры", music: "Музыка", friends: "Друзья", chat: "Чат",
    profile: "Профиль", shop: "Магазин", wallet: "Кошелёк",
    settings: "Настройки", admin: "Админ панель",
    login: "Войти", register: "Регистрация", logout: "Выйти",
    email: "Почта", password: "Пароль", name: "Имя",
    birthDate: "Дата рождения", gender: "Пол",
    male: "Мужской", female: "Женский", forgotPassword: "Забыл пароль",
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
    male: "Male", female: "Female", forgotPassword: "Forgot Password",
    sendMoney: "Send", balance: "Balance",
    darkTheme: "Dark Theme", lightTheme: "Light Theme",
    save: "Save", cancel: "Cancel", edit: "Edit",
    noAccount: "No account?", haveAccount: "Have an account?",
    level: "Level", posts: "Posts", friends_count: "Friends",
    addTrack: "Add Track", trackTitle: "Track Title", artist: "Artist",
    language: "Language",
  },
};

// ─── Storage helpers ────────────────────────────────────────────────────────
const USERS_KEY = "krx_users";
const SESSION_KEY = "krx_session";
const POSTS_KEY = "krx_posts";
const STORIES_KEY = "krx_stories";

function ls<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function lsSet(key: string, value: unknown) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
}

function getUsers(): (User & { password: string })[] { return ls(USERS_KEY, []); }
function saveUsers(u: (User & { password: string })[]) { lsSet(USERS_KEY, u); }

// ─── Trend helpers ──────────────────────────────────────────────────────────
function computeTrends(posts: Post[]): { tag: string; count: number }[] {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const counts: Record<string, number> = {};
  for (const p of posts) {
    if (now - p.createdAt > ONE_DAY * 3) continue; // last 3 days window
    for (const tag of p.hashtags) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));
}

// ─── Context ────────────────────────────────────────────────────────────────
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
    emailNotifications: true, pushNotifications: true, soundEnabled: true,
    privateProfile: false, showOnlineStatus: true, twoFactorAuth: false,
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [trends, setTrends] = useState<{ tag: string; count: number }[]>([]);

  // Load on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = ls<User | null>(SESSION_KEY, null);
    if (session) setUser(session);
    const savedTheme = ls<Theme | null>("krx_theme", null);
    if (savedTheme) setThemeState(savedTheme);
    const savedLang = ls<Language | null>("krx_lang", null);
    if (savedLang) setLanguageState(savedLang);
    const savedTracks = ls<Track[]>("krx_tracks", []);
    setTracks(savedTracks);
    const savedPosts = ls<Post[]>(POSTS_KEY, []);
    setPosts(savedPosts);
    setTrends(computeTrends(savedPosts));

    // Stories — filter out expired (>24h)
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const savedStories = ls<Story[]>(STORIES_KEY, []).filter(s => Date.now() - s.createdAt < ONE_DAY);
    setStories(savedStories);
    lsSet(STORIES_KEY, savedStories);
  }, []);

  // Apply theme
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    lsSet("krx_theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const setLanguage = (l: Language) => { setLanguageState(l); lsSet("krx_lang", l); };
  const t = (key: string) => translations[language][key] || key;

  const login = async (nameOrEmail: string, password: string): Promise<boolean> => {
    const found = getUsers().find(u => (u.email === nameOrEmail || u.name === nameOrEmail) && u.password === password);
    if (!found) return false;
    const { password: _, ...ud } = found;
    setUser(ud); lsSet(SESSION_KEY, ud); return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const users = getUsers();
    if (users.find(u => u.email === data.email)) return false;
    const nu: User & { password: string } = {
      id: Date.now().toString(), ...data, level: 0, balance: 0, friends: 0,
      posts: 0, isAdmin: false, isRich: false, avatar: null, banner: null, bio: "",
    };
    users.push(nu); saveUsers(users);
    const { password: _, ...ud } = nu;
    setUser(ud); lsSet(SESSION_KEY, ud); setTransactions([]); return true;
  };

  const logout = () => { setUser(null); setPlayerVisible(false); localStorage.removeItem(SESSION_KEY); };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated); lsSet(SESSION_KEY, updated);
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) { users[idx] = { ...users[idx], ...data }; saveUsers(users); }
  };

  const forgotPassword = async (email: string): Promise<boolean> => !!getUsers().find(u => u.email === email);

  const showPlayer = () => setPlayerVisible(true);

  const addTrack = (track: Omit<Track, "id">) => {
    const updated = [...tracks, { ...track, id: Date.now() }];
    setTracks(updated); lsSet("krx_tracks", updated);
  };

  const sendMoney = (toUserName: string, amount: number): boolean => {
    if (!user || user.balance < amount || amount <= 0) return false;
    const users = getUsers();
    const rIdx = users.findIndex(u => u.name === toUserName);
    if (rIdx === -1) return false;
    updateUser({ balance: user.balance - amount });
    users[rIdx].balance += amount; saveUsers(users);
    const tx: Transaction = {
      id: Date.now(), type: "expense",
      description: `Перевод → @${toUserName}`,
      amount: -amount, date: new Date().toLocaleString("ru"),
    };
    setTransactions(prev => [tx, ...prev]); return true;
  };

  const updateSettings = (key: keyof AppSettings, value: boolean) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  // ─── Feed ────────────────────────────────────────────────────────────────
  const addPost = (data: Omit<Post, "id" | "createdAt" | "likes" | "likedBy" | "comments" | "shares">) => {
    const newPost: Post = {
      ...data, id: Date.now(), createdAt: Date.now(), likes: 0, likedBy: [], comments: 0, shares: 0,
    };
    const updated = [newPost, ...posts];
    setPosts(updated); lsSet(POSTS_KEY, updated);
    const newTrends = computeTrends(updated);
    setTrends(newTrends);
    if (user) updateUser({ posts: (user.posts || 0) + 1 });
  };

  const toggleLike = (postId: number) => {
    if (!user) return;
    const updated = posts.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likedBy.includes(user.id);
      return {
        ...p,
        likes: liked ? p.likes - 1 : p.likes + 1,
        likedBy: liked ? p.likedBy.filter(id => id !== user.id) : [...p.likedBy, user.id],
      };
    });
    setPosts(updated); lsSet(POSTS_KEY, updated);
  };

  const addStory = (media: Story["media"]) => {
    if (!user) return;
    const newStory: Story = {
      id: Date.now(), authorId: user.id, authorName: user.name, authorAvatar: user.avatar,
      media, createdAt: Date.now(),
    };
    const updated = [...stories, newStory];
    setStories(updated); lsSet(STORIES_KEY, updated);
  };

  return (
    <AppContext.Provider value={{
      user, isAuthenticated: !!user, login, register, logout, updateUser, forgotPassword,
      theme, setTheme, language, setLanguage, t,
      playerVisible, showPlayer, currentTrack, setCurrentTrack, tracks, addTrack,
      transactions, sendMoney, settings, updateSettings,
      posts, addPost, toggleLike, stories, addStory, trends,
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
