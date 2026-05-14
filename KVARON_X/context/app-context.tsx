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
  blockedUsers?: string[]; // IDs of blocked users
}

export interface Transaction {
  id: number; type: "income" | "expense"; description: string; amount: number; date: string;
}

export interface Track {
  id: number; title: string; artist: string; duration: string; addedBy: string;
}

export interface PollOption { id: number; text: string; votes: number; }

export interface Comment {
  id: number; authorId: string; authorName: string; authorAvatar: string | null;
  text: string; createdAt: number;
}

export interface Post {
  id: number; authorId: string; authorName: string; authorAvatar: string | null;
  text: string; media: { type: "image" | "video" | "gif"; url: string }[];
  poll: { question: string; options: PollOption[] } | null;
  hashtags: string[]; likes: number; likedBy: string[];
  comments: number; commentList: Comment[];
  shares: number; sharedBy: string[];
  createdAt: number;
}

export interface Story {
  id: number; authorId: string; authorName: string; authorAvatar: string | null;
  media: { type: "image" | "video"; url: string };
  music?: { title: string; artist: string } | null;
  likes: number; likedBy: string[];
  createdAt: number;
}

export interface NewsReaction {
  emoji: string; count: number; userIds: string[];
}

export interface NewsPost {
  id: number;
  authorName: string;
  category: string;
  categoryColor: string;
  title: string;
  body: string;
  image?: string | null;
  views: number; viewedBy: string[];
  reactions: NewsReaction[];
  createdAt: number;
}

export const NEWS_AUTHORS = ["Kvarden", "Baron_Kosyaka", "KVARON_X"];
export const NEWS_CATEGORIES = [
  { label: "Обновления",   color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { label: "Турниры",      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { label: "Музыка",       color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { label: "Безопасность", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { label: "Магазин",      color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { label: "Платформа",    color: "bg-primary/20 text-primary border-primary/30" },
  { label: "Игры",         color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
];
export const NEWS_EMOJIS = ["🔥","👍","❤️","😮","😂","💯"];

export type NotifType =
  | "like" | "reaction" | "comment" | "mention" | "friend_request"
  | "message" | "news" | "game_event" | "shop_purchase" | "wallet";

export interface KRXNotification {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  icon?: string;       // emoji icon
  fromUser?: string;   // who triggered it
  link?: string;       // where to navigate
  read: boolean;
  createdAt: number;
}

export interface AppSettings {
  emailNotifications: boolean; pushNotifications: boolean; soundEnabled: boolean;
  privateProfile: boolean; showOnlineStatus: boolean; twoFactorAuth: boolean;
}

export type FeedFilter = "all" | "popular" | "following" | "new";
export type PulseCategory = "funny" | "gaming" | "memes" | "anime" | "news" | "clips";

interface RegisterData {
  name: string; email: string; password: string; birthDate: string; gender: "male" | "female";
}

interface AppContextType {
  user: User | null; isAuthenticated: boolean;
  login: (nameOrEmail: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void; updateUser: (data: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  blockUser: (targetId: string) => void;
  isBlocked: (targetId: string) => boolean;

  theme: Theme; setTheme: (t: Theme) => void;
  language: Language; setLanguage: (l: Language) => void; t: (key: string) => string;

  playerVisible: boolean; showPlayer: () => void;
  currentTrack: Track | null; setCurrentTrack: (track: Track | null) => void;
  tracks: Track[]; addTrack: (track: Omit<Track, "id">) => void;
  transactions: Transaction[]; sendMoney: (toUser: string, amount: number) => boolean;
  settings: AppSettings; updateSettings: (key: keyof AppSettings, value: boolean) => void;

  // Feed
  posts: Post[];
  addPost: (data: Omit<Post, "id" | "createdAt" | "likes" | "likedBy" | "comments" | "commentList" | "shares" | "sharedBy">) => void;
  toggleLike: (postId: number) => void;
  addComment: (postId: number, text: string) => void;
  sharePost: (postId: number) => void;

  // Stories
  stories: Story[];
  addStory: (media: Story["media"], music?: { title: string; artist: string } | null) => void;
  deleteStory: (storyId: number) => void;
  likeStory: (storyId: number) => void;

  // Trends
  trends: { tag: string; count: number }[];

  // Notifications
  notifications: KRXNotification[];
  unreadCount: number;
  pushNotif: (n: Omit<KRXNotification, "id" | "createdAt" | "read">) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  clearNotification: (id: number) => void;

  // News
  newsPosts: NewsPost[];
  addNewsPost: (data: Omit<NewsPost, "id" | "createdAt" | "views" | "viewedBy" | "reactions">) => void;
  viewNewsPost: (newsId: number) => void;
  reactToNews: (newsId: number, emoji: string) => void;

  // Feed filter
  feedFilter: FeedFilter;
  setFeedFilter: (f: FeedFilter) => void;
  filteredPosts: Post[];
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
function ls<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function lsSet(key: string, value: unknown) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
}

const USERS_KEY   = "krx_users";
const SESSION_KEY = "krx_session";
const POSTS_KEY   = "krx_posts";
const STORIES_KEY = "krx_stories";

function getUsers(): (User & { password: string })[] { return ls(USERS_KEY, []); }
function saveUsers(u: (User & { password: string })[]) { lsSet(USERS_KEY, u); }

// ─── Trend compute ──────────────────────────────────────────────────────────
function computeTrends(posts: Post[]): { tag: string; count: number }[] {
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const counts: Record<string, number> = {};
  for (const p of posts) {
    const age = now - p.createdAt;
    // Recency weight: newer posts count more
    const weight = age < 3600000 ? 3 : age < 86400000 ? 2 : 1;
    if (age > THREE_DAYS) continue;
    for (const tag of p.hashtags) {
      counts[tag] = (counts[tag] || 0) + weight;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));
}

// ─── Feed filter ────────────────────────────────────────────────────────────
function applyFilter(posts: Post[], filter: FeedFilter, userId: string | undefined): Post[] {
  switch (filter) {
    case "popular":
      return [...posts].sort((a, b) => (b.likes + b.comments * 2 + b.shares * 3) - (a.likes + a.comments * 2 + a.shares * 3));
    case "new":
      return [...posts].sort((a, b) => b.createdAt - a.createdAt);
    case "following":
      // For now returns current user's posts since we don't have a follow graph
      return posts.filter(p => p.authorId === userId);
    default:
      return posts;
  }
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
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("all");
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [notifications, setNotifications] = useState<KRXNotification[]>([]);

  const filteredPosts = applyFilter(posts, feedFilter, user?.id);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = ls<User | null>(SESSION_KEY, null);
    if (session) setUser(session);
    const savedTheme = ls<Theme>("krx_theme", "dark");
    setThemeState(savedTheme);
    const savedLang = ls<Language>("krx_lang", "ru");
    setLanguageState(savedLang);
    setTracks(ls("krx_tracks", []));

    const savedNotifs = ls<KRXNotification[]>("krx_notifs", []);
    setNotifications(savedNotifs);

    const savedNews = ls<NewsPost[]>("krx_news", []);
    setNewsPosts(savedNews);

    const savedPosts = ls<Post[]>(POSTS_KEY, []);
    // Migrate old posts that lack commentList/sharedBy
    const migratedPosts = savedPosts.map(p => ({
      ...p,
      commentList: p.commentList || [],
      sharedBy: p.sharedBy || [],
    }));
    setPosts(migratedPosts);
    setTrends(computeTrends(migratedPosts));

    const ONE_DAY = 86400000;
    const savedStories = ls<Story[]>(STORIES_KEY, [])
      .filter(s => Date.now() - s.createdAt < ONE_DAY)
      .map(s => ({ ...s, likes: s.likes || 0, likedBy: s.likedBy || [] }));
    setStories(savedStories);
    lsSet(STORIES_KEY, savedStories);
  }, []);

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
      blockedUsers: [],
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

  const blockUser = (targetId: string) => {
    const blocked = user?.blockedUsers || [];
    if (blocked.includes(targetId)) return;
    updateUser({ blockedUsers: [...blocked, targetId] });
  };

  const isBlocked = (targetId: string): boolean =>
    (user?.blockedUsers || []).includes(targetId);

  const forgotPassword = async (email: string): Promise<boolean> =>
    !!getUsers().find(u => u.email === email);

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
    setTransactions(prev => [tx, ...prev]);
    pushNotif({ type: "wallet", icon: "💸", title: "Перевод отправлен", body: `Вы отправили ${amount} KRX → @${toUserName}`, link: "/wallet" });
    return true;
  };

  const updateSettings = (key: keyof AppSettings, value: boolean) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  // ─── Feed ─────────────────────────────────────────────────────────────────
  const addPost = (data: Omit<Post, "id" | "createdAt" | "likes" | "likedBy" | "comments" | "commentList" | "shares" | "sharedBy">) => {
    const newPost: Post = {
      ...data, id: Date.now(), createdAt: Date.now(),
      likes: 0, likedBy: [], comments: 0, commentList: [], shares: 0, sharedBy: [],
    };
    const updated = [newPost, ...posts];
    setPosts(updated); lsSet(POSTS_KEY, updated);
    setTrends(computeTrends(updated));
    if (user) updateUser({ posts: (user.posts || 0) + 1 });
  };

  const toggleLike = (postId: number) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    const wasLiked = post?.likedBy.includes(user.id);
    const updated = posts.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likedBy.includes(user.id);
      return { ...p, likes: liked ? p.likes - 1 : p.likes + 1, likedBy: liked ? p.likedBy.filter(id => id !== user.id) : [...p.likedBy, user.id] };
    });
    setPosts(updated); lsSet(POSTS_KEY, updated);
    // Notify if liking (not unliking) and not own post
    if (!wasLiked && post && post.authorId !== user.id) {
      pushNotif({ type: "like", icon: "❤️", title: "Новый лайк", body: `@${user.name} лайкнул ваш пост`, fromUser: user.name, link: "/" });
    }
  };

  const addComment = (postId: number, text: string) => {
    if (!user || !text.trim()) return;
    const post = posts.find(p => p.id === postId);
    const comment: Comment = {
      id: Date.now(), authorId: user.id, authorName: user.name, authorAvatar: user.avatar, text: text.trim(), createdAt: Date.now(),
    };
    const updated = posts.map(p => p.id === postId
      ? { ...p, comments: p.comments + 1, commentList: [...(p.commentList || []), comment] }
      : p
    );
    setPosts(updated); lsSet(POSTS_KEY, updated);
    if (post && post.authorId !== user.id) {
      pushNotif({ type: "comment", icon: "💬", title: "Новый комментарий", body: `@${user.name}: «${text.trim().slice(0,60)}»`, fromUser: user.name, link: "/" });
    }
    // Mention detection
    const mentions = text.match(/@[\w]+/g) || [];
    mentions.forEach(m => {
      if (m.slice(1) !== user.name) {
        pushNotif({ type: "mention", icon: "📣", title: "Вас упомянули", body: `@${user.name} упомянул вас в комментарии`, fromUser: user.name, link: "/" });
      }
    });
  };

  const sharePost = (postId: number) => {
    if (!user) return;
    const updated = posts.map(p => {
      if (p.id !== postId) return p;
      if ((p.sharedBy || []).includes(user.id)) return p; // already shared
      return { ...p, shares: p.shares + 1, sharedBy: [...(p.sharedBy || []), user.id] };
    });
    setPosts(updated); lsSet(POSTS_KEY, updated);
  };

  // ─── Stories ──────────────────────────────────────────────────────────────
  const addStory = (media: Story["media"], music?: { title: string; artist: string } | null) => {
    if (!user) return;
    const newStory: Story = {
      id: Date.now(), authorId: user.id, authorName: user.name,
      authorAvatar: user.avatar, media, music: music || null, createdAt: Date.now(), likes: 0, likedBy: [],
    };
    const updated = [...stories, newStory];
    setStories(updated); lsSet(STORIES_KEY, updated);
  };

  const deleteStory = (storyId: number) => {
    if (!user) return;
    const updated = stories.filter(s => !(s.id === storyId && s.authorId === user.id));
    setStories(updated); lsSet(STORIES_KEY, updated);
  };

  const likeStory = (storyId: number) => {
    if (!user) return;
    const updated = stories.map(s => {
      if (s.id !== storyId) return s;
      const liked = (s.likedBy || []).includes(user.id);
      return { ...s, likes: liked ? s.likes - 1 : s.likes + 1, likedBy: liked ? s.likedBy.filter(id => id !== user.id) : [...(s.likedBy || []), user.id] };
    });
    setStories(updated); lsSet(STORIES_KEY, updated);
  };

  const pushNotif = (n: Omit<KRXNotification, "id" | "createdAt" | "read">) => {
    const notif: KRXNotification = { ...n, id: Date.now() + Math.random(), createdAt: Date.now(), read: false };
    setNotifications(prev => {
      const updated = [notif, ...prev].slice(0, 100); // keep last 100
      lsSet("krx_notifs", updated);
      return updated;
    });
  };

  const markRead = (id: number) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      lsSet("krx_notifs", updated);
      return updated;
    });
  };

  const markAllRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      lsSet("krx_notifs", updated);
      return updated;
    });
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      lsSet("krx_notifs", updated);
      return updated;
    });
  };

  const addNewsPost = (data: Omit<NewsPost, "id" | "createdAt" | "views" | "viewedBy" | "reactions">) => {
    const post: NewsPost = {
      ...data, id: Date.now(), createdAt: Date.now(),
      views: 0, viewedBy: [],
      reactions: NEWS_EMOJIS.map(emoji => ({ emoji, count: 0, userIds: [] })),
    };
    const updated = [post, ...newsPosts];
    setNewsPosts(updated); lsSet("krx_news", updated);
    pushNotif({ type: "news", icon: "📰", title: `${data.category}:`, body: data.title, fromUser: data.authorName, link: "/news" });
  };

  const viewNewsPost = (newsId: number) => {
    if (!user) return;
    const updated = newsPosts.map(n => {
      if (n.id !== newsId || n.viewedBy.includes(user.id)) return n;
      return { ...n, views: n.views + 1, viewedBy: [...n.viewedBy, user.id] };
    });
    setNewsPosts(updated); lsSet("krx_news", updated);
  };

  const reactToNews = (newsId: number, emoji: string) => {
    if (!user) return;
    const updated = newsPosts.map(n => {
      if (n.id !== newsId) return n;
      const reactions = n.reactions.map(r => {
        if (r.emoji !== emoji) return r;
        const hasReacted = r.userIds.includes(user.id);
        return {
          ...r,
          count: hasReacted ? r.count - 1 : r.count + 1,
          userIds: hasReacted ? r.userIds.filter(id => id !== user.id) : [...r.userIds, user.id],
        };
      });
      return { ...n, reactions };
    });
    setNewsPosts(updated); lsSet("krx_news", updated);
    const news = newsPosts.find(n => n.id === newsId);
    if (news && user) {
      pushNotif({ type: "reaction", icon: emoji, title: "Реакция на новость", body: `@${user.name} отреагировал на «${news.title.slice(0,40)}»`, fromUser: user.name, link: "/news" });
    }
  };

  return (
    <AppContext.Provider value={{
      user, isAuthenticated: !!user, login, register, logout, updateUser, forgotPassword, blockUser, isBlocked,
      theme, setTheme, language, setLanguage, t,
      playerVisible, showPlayer, currentTrack, setCurrentTrack, tracks, addTrack,
      notifications, unreadCount: notifications.filter(n => !n.read).length,
      pushNotif, markRead, markAllRead, clearNotification,
      transactions, sendMoney, settings, updateSettings,
      posts, addPost, toggleLike, addComment, sharePost,
      stories, addStory, deleteStory, likeStory,
      trends, feedFilter, setFeedFilter, filteredPosts,
      newsPosts, addNewsPost, viewNewsPost, reactToNews,
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
