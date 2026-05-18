"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ru" | "en";
export type Theme = "dark" | "light";

// ─── Types ─────────────────────────────────────────────────────────────────
export interface User {
  id: string; name: string; email: string; gender: "male" | "female";
  birthDate: string; level: number; balance: number; friends: number;
  posts: number; isAdmin: boolean; isRich: boolean; isVerified: boolean;
  avatar: string | null; banner: string | null; bio: string;
  blockedUsers?: string[];
  xp: number;
  xpToNext: number;
  bannerColor: string;
  seasonStart: number;      // timestamp of last season reset
  lastSeen: number;         // timestamp
  onlineStatus: "online" | "away" | "offline";
  ownedItems: string[];     // IDs of permanently owned shop items
  twoFaEnabled: boolean;
}

// XP system
export const XP_PER_LEVEL = 1000;
export const XP_PER_MINUTE_ONLINE = 2;
export const SEASON_DURATION_MS = 90 * 24 * 60 * 60 * 1000; // 3 months
export const LEVEL_REWARDS: { level: number; desc: string; krx?: number }[] = [
  { level: 10,  desc: "GIF-аватарки разблокированы" },
  { level: 20,  desc: "Баннеры профиля + 100 KRX", krx: 100 },
  { level: 35,  desc: "Обои профиля + 250 KRX", krx: 250 },
  { level: 50,  desc: "GIF-баннеры + 500 KRX", krx: 500 },
];
export const BANNER_COLORS = [
  "#7c3aed","#dc2626","#0891b2","#059669","#d97706",
  "#db2777","#4f46e5","#0d9488","#65a30d","#9333ea",
  "#1d4ed8","#b45309","#be185d","#0e7490","#15803d",
];

export type OnlineStatus = "online" | "dnd" | "offline";

export interface FriendRequest {
  id: number;
  fromId: string; fromName: string; fromAvatar: string | null;
  toId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: number;
}

export interface FriendEntry {
  userId: string; name: string; avatar: string | null; level: number;
  status: OnlineStatus;
  activity?: string | null; // "playing CS2" | "listening to X"
  pinned: boolean;
  addedAt: number;
}

export interface Transaction {
  id: number; type: "income" | "expense"; description: string; amount: number; date: string;
}

export type MusicCategory = "all" | "popular" | "new" | "phonk" | "trap" | "rock" | "electronic" | "gaming" | "chill" | "memes";

export interface Track {
  id: number; title: string; artist: string; duration: string; addedBy: string;
  cover?: string | null;       // base64 or url
  audioUrl?: string | null;    // base64 audio
  category: MusicCategory;
  plays: number;
  likedBy: string[];
  savedBy: string[];
  createdAt: number;
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

// ─── Shop Types ──────────────────────────────────────────────────────────────
export interface ShopItem {
  id: number;
  name: string;
  type: "avatar" | "banner" | "wallpaper" | "frame" | "nickcolor" | "effect";
  price: number;
  discountPrice?: number | null;
  discountUntil?: number | null;
  minLevel: number;
  imageUrl: string | null;
  isAnimated: boolean;
  adminOnly: boolean;
  stock: number | null; // null = unlimited
  soldCount: number;
  createdAt: number;
}

export interface InventoryItem {
  itemId: number;
  purchasedAt: number;
  equipped: boolean;
}

// ─── Chat Types ──────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: number;
  authorId: string; authorName: string; authorAvatar: string | null;
  text: string;
  mediaUrl?: string | null; mediaType?: "image" | "video" | "audio" | null;
  audioDuration?: string;
  replyTo?: { id: number; authorName: string; text: string } | null;
  reactions: { emoji: string; userIds: string[] }[];
  edited: boolean;
  deletedFor: string[]; // userIds who deleted
  createdAt: number;
}

export interface ChatConversation {
  id: number;
  type: "personal" | "group";
  name: string;
  avatar: string | null;
  memberIds: string[];
  memberNames: string[];
  adminIds: string[];
  mutedBy: string[];
  pinnedBy: string[];
  messages: ChatMessage[];
  createdAt: number;
  createdBy: string;
}

// ─── Games Hub Types ────────────────────────────────────────────────────────
export const GAME_ADMINS = ["Kvarden", "Baron_Kosyaka", "KVARON_X"];

export interface Tournament {
  id: number; title: string; game: string; date: string;
  prizePool: string; maxPlayers: number; participants: string[];
  banner?: string | null; createdBy: string; createdAt: number;
}

export interface Clan {
  id: number; name: string; tag: string; avatar?: string | null;
  description: string; ownerId: string; ownerName: string;
  members: string[]; bannedUsers: string[];
  level: number; xp: number; isPaid: boolean;
  createdAt: number;
}

export interface Room {
  id: number; name: string; game: string;
  ownerId: string; ownerName: string;
  members: string[]; bannedUsers: string[];
  maxPlayers: number;
  privacy: "open" | "invite" | "password";
  password?: string;
  isPaid: boolean; entryFee: number; // 0 = free
  bgColor?: string; nickColor?: string;
  chat: { id: number; authorName: string; text: string; createdAt: number }[];
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
  // Profile / XP
  addXP: (amount: number) => void;
  setBannerColor: (color: string) => void;
  checkSeasonReset: () => void;
  changePassword: (oldPw: string, newPw: string) => boolean;
  setOnlineStatus: (status: User["onlineStatus"]) => void;
  deleteAvatar: () => void;
  deleteBanner: () => void;
  // Rate limiting
  canPost: () => boolean;
  lastPostTime: number;
  unblockUser: (targetId: string) => void;
  isBlocked: (targetId: string) => boolean;
  // Friends
  friendList: FriendEntry[];
  friendRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  sendFriendRequest: (toId: string, toName: string, toAvatar: string | null) => void;
  acceptFriendRequest: (reqId: number) => void;
  rejectFriendRequest: (reqId: number) => void;
  removeFriend: (userId: string) => void;
  pinFriend: (userId: string) => void;
  allUsers: { id: string; name: string; avatar: string | null; level: number }[];

  theme: Theme; setTheme: (t: Theme) => void;
  language: Language; setLanguage: (l: Language) => void; t: (key: string) => string;

  // Music player
  playerVisible: boolean;
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTrackIdx: number;
  progress: number;       // 0-100
  volume: number;         // 0-100
  shuffle: boolean; repeat: boolean;
  showPlayer: () => void;
  hidePlayer: () => void;
  setCurrentTrack: (track: Track | null) => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setProgress: (v: number) => void;
  setVolume: (v: number) => void;
  setShuffle: (v: boolean) => void;
  setRepeat: (v: boolean) => void;
  tracks: Track[];
  addTrack: (track: Omit<Track, "id" | "plays" | "likedBy" | "savedBy" | "createdAt">) => void;
  deleteTrack: (id: number) => void;
  likeTrack: (id: number) => void;
  saveTrack: (id: number) => void;
  incrementPlay: (id: number) => void;
  likedTracks: Track[];
  savedTracks: Track[];
  recentTracks: Track[];
  queue: Track[];
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

  // Shop
  shopItems: ShopItem[];
  inventory: InventoryItem[];
  addShopItem: (item: Omit<ShopItem, "id" | "createdAt" | "soldCount">) => void;
  deleteShopItem: (id: number) => void;
  purchaseItem: (itemId: number, giftToUser?: string) => { ok: boolean; msg: string };
  equipItem: (itemId: number) => void;
  canUseItem: (item: ShopItem) => { allowed: boolean; reason?: string };

  // Chat
  conversations: ChatConversation[];
  createPersonalChat: (friendId: string, friendName: string, friendAvatar: string | null) => ChatConversation;
  createGroupChat: (name: string, avatar: string | null, memberIds: string[], memberNames: string[]) => ChatConversation;
  sendMessage: (convId: number, text: string, mediaUrl?: string | null, mediaType?: ChatMessage["mediaType"], replyTo?: ChatMessage["replyTo"], audioDuration?: string) => void;
  editMessage: (convId: number, msgId: number, newText: string) => void;
  deleteMessage: (convId: number, msgId: number) => void;
  reactToMessage: (convId: number, msgId: number, emoji: string) => void;
  pinConversation: (convId: number) => void;
  muteConversation: (convId: number) => void;
  deleteConversation: (convId: number) => void;
  removeMember: (convId: number, userId: string) => void;
  renameGroup: (convId: number, name: string) => void;
  updateGroupAvatar: (convId: number, avatar: string) => void;
  getOrCreatePersonalChat: (friendId: string, friendName: string, friendAvatar: string | null) => ChatConversation;

  // Games Hub
  tournaments: Tournament[];
  clans: Clan[];
  rooms: Room[];
  createTournament: (data: Omit<Tournament, "id" | "createdAt" | "participants">) => boolean;
  joinTournament: (id: number) => boolean;
  createClan: (data: { name: string; tag: string; avatar?: string | null; description: string; isPaid: boolean }) => boolean;
  joinClan: (id: number) => boolean;
  leaveClan: (id: number) => void;
  banFromClan: (clanId: number, userId: string) => void;
  createRoom: (data: { name: string; game: string; privacy: Room["privacy"]; password?: string; isPaid: boolean; entryFee: number; bgColor?: string; nickColor?: string }) => boolean;
  joinRoom: (id: number, password?: string) => boolean;
  leaveRoom: (id: number) => void;
  banFromRoom: (roomId: number, userId: string) => void;
  sendRoomMessage: (roomId: number, text: string) => void;

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrackState] = useState<Track | null>(null);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [progress, setProgressState] = useState(0);
  const [volume, setVolumeState] = useState(70);
  const [shuffle, setShuffleState] = useState(false);
  const [repeat, setRepeatState] = useState(false);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
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
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [lastPostTime, setLastPostTime] = useState<number>(0);
  const [friendList, setFriendList] = useState<FriendEntry[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [clans, setClans] = useState<Clan[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const filteredPosts = applyFilter(posts, feedFilter, user?.id);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = ls<User | null>(SESSION_KEY, null);
    if (session) {
      // Migrate: ensure all new fields have defaults
      const patched: User = {
        isVerified: false, xp: 0, xpToNext: 1000, bannerColor: "#7c3aed",
        seasonStart: Date.now(), lastSeen: Date.now(), onlineStatus: "online",
        ownedItems: [], twoFaEnabled: false, blockedUsers: [],
        ...session,
      };
      setUser(patched);
      lsSet(SESSION_KEY, patched);
    }
    const savedTheme = ls<Theme>("krx_theme", "dark");
    setThemeState(savedTheme);
    const savedLang = ls<Language>("krx_lang", "ru");
    setLanguageState(savedLang);
    const savedTracks = ls<Track[]>("krx_tracks", []).map((t: Track) => ({
      ...t,
      category: t.category || "all" as MusicCategory,
      plays: t.plays || 0,
      likedBy: t.likedBy || [],
      savedBy: t.savedBy || [],
      createdAt: t.createdAt || Date.now(),
    }));
    setTracks(savedTracks);
    setRecentTracks(ls("krx_recent", []));

    const savedNotifs = ls<KRXNotification[]>("krx_notifs", []);
    setShopItems(ls<ShopItem[]>("krx_shop_items", []));
    setInventory(ls<InventoryItem[]>("krx_inventory", []));
    setConversations(ls<ChatConversation[]>("krx_convs", []));
    setFriendList(ls("krx_friends", []));
    setFriendRequests(ls("krx_freq", []));
    setSentRequests(ls("krx_fsent", []));
    setTournaments(ls("krx_tournaments", []));
    setClans(ls("krx_clans", []));
    setRooms(ls("krx_rooms", []));
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
      posts: 0, isAdmin: false, isRich: false, isVerified: false,
      avatar: null, banner: null, bio: "",
      blockedUsers: [], xp: 0, xpToNext: 1000, bannerColor: "#7c3aed",
      seasonStart: Date.now(), lastSeen: Date.now(), onlineStatus: "online",
      ownedItems: [], twoFaEnabled: false,
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
    // Sync avatar across all posts
    if (data.avatar !== undefined) {
      const updPosts = ls<Post[]>(POSTS_KEY, []).map(p =>
        p.authorId === user.id ? { ...p, authorAvatar: data.avatar || null } : p
      );
      lsSet(POSTS_KEY, updPosts);
      setPosts(updPosts);
    }
  };

  // ─── Shop ────────────────────────────────────────────────────────────────
  const addShopItem = (item: Omit<ShopItem, "id" | "createdAt" | "soldCount">) => {
    if (!user || !GAME_ADMINS.includes(user.name)) return;
    const newItem: ShopItem = { ...item, id: Date.now(), createdAt: Date.now(), soldCount: 0 };
    const updated = [...shopItems, newItem];
    setShopItems(updated); lsSet("krx_shop_items", updated);
  };

  const deleteShopItem = (id: number) => {
    if (!user || !GAME_ADMINS.includes(user.name)) return;
    const updated = shopItems.filter(i => i.id !== id);
    setShopItems(updated); lsSet("krx_shop_items", updated);
  };

  const canUseItem = (item: ShopItem): { allowed: boolean; reason?: string } => {
    if (!user) return { allowed: false, reason: "Необходима авторизация" };
    const isAdmin = GAME_ADMINS.includes(user.name);
    if (item.adminOnly && !isAdmin) return { allowed: false, reason: "Только для администраторов" };
    if (item.minLevel > 0 && (user.level || 0) < item.minLevel && !isAdmin)
      return { allowed: false, reason: `Доступно с ${item.minLevel} уровня` };
    return { allowed: true };
  };

  const purchaseItem = (itemId: number, giftToUser?: string): { ok: boolean; msg: string } => {
    if (!user) return { ok: false, msg: "Необходима авторизация" };
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return { ok: false, msg: "Товар не найден" };

    // Check stock
    if (item.stock !== null && item.soldCount >= item.stock)
      return { ok: false, msg: "Товар закончился" };

    // Check already owned
    const alreadyOwned = inventory.some(i => i.itemId === itemId);
    if (alreadyOwned && !giftToUser) return { ok: false, msg: "Уже в инвентаре" };

    const effectivePrice = (item.discountUntil && item.discountUntil > Date.now() && item.discountPrice)
      ? item.discountPrice : item.price;
    const isAdmin = GAME_ADMINS.includes(user.name);

    if (!isAdmin && user.balance < effectivePrice)
      return { ok: false, msg: "Недостаточно KRX" };

    // Deduct balance
    if (!isAdmin) updateUser({ balance: user.balance - effectivePrice });

    // Update sold count
    const updItems = shopItems.map(i => i.id === itemId ? { ...i, soldCount: i.soldCount + 1 } : i);
    setShopItems(updItems); lsSet("krx_shop_items", updItems);

    if (giftToUser) {
      // Gift: add to recipient (stored globally)
      const globalInv = ls<Record<string, InventoryItem[]>>("krx_global_inv", {});
      globalInv[giftToUser] = [...(globalInv[giftToUser] || []), { itemId, purchasedAt: Date.now(), equipped: false }];
      lsSet("krx_global_inv", globalInv);
      pushNotif({ type: "shop_purchase", icon: "🎁", title: "Подарок отправлен!", body: `Вы подарили «${item.name}» → @${giftToUser}`, link: "/shop" });
      return { ok: true, msg: `Подарок отправлен @${giftToUser}!` };
    }

    // Add to own inventory
    const newInvItem: InventoryItem = { itemId, purchasedAt: Date.now(), equipped: false };
    const updInv = [...inventory, newInvItem];
    setInventory(updInv); lsSet("krx_inventory", updInv);
    pushNotif({ type: "shop_purchase", icon: "🛍️", title: "Покупка совершена", body: `«${item.name}» добавлено в инвентарь`, link: "/shop" });
    // XP bonus
    addXP(20);
    return { ok: true, msg: "Куплено!" };
  };

  const equipItem = (itemId: number) => {
    if (!user) return;
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;
    const { allowed } = canUseItem(item);
    if (!allowed) return;
    const updInv = inventory.map(i => ({
      ...i,
      equipped: i.itemId === itemId ? true : (i.equipped && shopItems.find(s => s.id === i.itemId)?.type === item.type ? false : i.equipped)
    }));
    setInventory(updInv); lsSet("krx_inventory", updInv);
  };

    // ─── Chat ────────────────────────────────────────────────────────────────
  const saveConvs = (convs: ChatConversation[]) => { setConversations(convs); lsSet("krx_convs", convs); };

  const createPersonalChat = (friendId: string, friendName: string, friendAvatar: string | null): ChatConversation => {
    const existing = conversations.find(c => c.type === "personal" && c.memberIds.includes(friendId) && c.memberIds.includes(user!.id));
    if (existing) return existing;
    const conv: ChatConversation = {
      id: Date.now(), type: "personal", name: friendName, avatar: friendAvatar,
      memberIds: [user!.id, friendId], memberNames: [user!.name, friendName],
      adminIds: [], mutedBy: [], pinnedBy: [], messages: [], createdAt: Date.now(), createdBy: user!.id,
    };
    saveConvs([conv, ...conversations]); return conv;
  };

  const getOrCreatePersonalChat = (friendId: string, friendName: string, friendAvatar: string | null): ChatConversation => {
    return createPersonalChat(friendId, friendName, friendAvatar);
  };

  const createGroupChat = (name: string, avatar: string | null, memberIds: string[], memberNames: string[]): ChatConversation => {
    const conv: ChatConversation = {
      id: Date.now(), type: "group", name, avatar,
      memberIds: [user!.id, ...memberIds], memberNames: [user!.name, ...memberNames],
      adminIds: [user!.id], mutedBy: [], pinnedBy: [], messages: [], createdAt: Date.now(), createdBy: user!.id,
    };
    saveConvs([conv, ...conversations]); return conv;
  };

  const sendMessage = (convId: number, text: string, mediaUrl?: string | null, mediaType?: ChatMessage["mediaType"], replyTo?: ChatMessage["replyTo"], audioDuration?: string) => {
    if (!user) return;
    const msg: ChatMessage = {
      id: Date.now(), authorId: user.id, authorName: user.name, authorAvatar: user.avatar,
      text: text.trim(), mediaUrl: mediaUrl || null, mediaType: mediaType || null,
      audioDuration, replyTo: replyTo || null, reactions: [], edited: false, deletedFor: [], createdAt: Date.now(),
    };
    const updated = conversations.map(c => c.id === convId ? { ...c, messages: [...c.messages, msg] } : c);
    saveConvs(updated);
  };

  const editMessage = (convId: number, msgId: number, newText: string) => {
    const updated = conversations.map(c => c.id !== convId ? c : {
      ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, text: newText, edited: true } : m)
    });
    saveConvs(updated);
  };

  const deleteMessage = (convId: number, msgId: number) => {
    if (!user) return;
    const updated = conversations.map(c => c.id !== convId ? c : {
      ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, deletedFor: [...m.deletedFor, user.id] } : m)
    });
    saveConvs(updated);
  };

  const reactToMessage = (convId: number, msgId: number, emoji: string) => {
    if (!user) return;
    const updated = conversations.map(c => {
      if (c.id !== convId) return c;
      return {
        ...c, messages: c.messages.map(m => {
          if (m.id !== msgId) return m;
          const existing = m.reactions.find(r => r.emoji === emoji);
          if (existing) {
            const hasReacted = existing.userIds.includes(user.id);
            return { ...m, reactions: m.reactions.map(r => r.emoji !== emoji ? r : { ...r, userIds: hasReacted ? r.userIds.filter(id => id !== user.id) : [...r.userIds, user.id] }).filter(r => r.userIds.length > 0) };
          }
          return { ...m, reactions: [...m.reactions, { emoji, userIds: [user.id] }] };
        })
      };
    });
    saveConvs(updated);
  };

  const pinConversation = (convId: number) => {
    if (!user) return;
    const updated = conversations.map(c => {
      if (c.id !== convId) return c;
      const pinned = c.pinnedBy.includes(user.id);
      return { ...c, pinnedBy: pinned ? c.pinnedBy.filter(id => id !== user.id) : [...c.pinnedBy, user.id] };
    });
    saveConvs(updated);
  };

  const muteConversation = (convId: number) => {
    if (!user) return;
    const updated = conversations.map(c => {
      if (c.id !== convId) return c;
      const muted = c.mutedBy.includes(user.id);
      return { ...c, mutedBy: muted ? c.mutedBy.filter(id => id !== user.id) : [...c.mutedBy, user.id] };
    });
    saveConvs(updated);
  };

  const deleteConversation = (convId: number) => saveConvs(conversations.filter(c => c.id !== convId));

  const removeMember = (convId: number, userId: string) => {
    const updated = conversations.map(c => c.id !== convId ? c : { ...c, memberIds: c.memberIds.filter(id => id !== userId), memberNames: c.memberNames.filter((_, i) => c.memberIds[i] !== userId) });
    saveConvs(updated);
  };

  const renameGroup = (convId: number, name: string) => {
    saveConvs(conversations.map(c => c.id === convId ? { ...c, name } : c));
  };

  const updateGroupAvatar = (convId: number, avatar: string) => {
    saveConvs(conversations.map(c => c.id === convId ? { ...c, avatar } : c));
  };

    const allUsers = (() => {
    const users = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("krx_users") || "[]") : [];
    return users.map((u: {id: string; name: string; avatar: string | null; level: number}) => ({ id: u.id, name: u.name, avatar: u.avatar, level: u.level }));
  })();

  const sendFriendRequest = (toId: string, toName: string, toAvatar: string | null) => {
    if (!user) return;
    if (sentRequests.find(r => r.toId === toId && r.status === "pending")) return;
    const req: FriendRequest = { id: Date.now(), fromId: user.id, fromName: user.name, fromAvatar: user.avatar, toId, status: "pending", createdAt: Date.now() };
    const updated = [...sentRequests, req];
    setSentRequests(updated); lsSet("krx_fsent", updated);
    // also store in global requests so recipient can see it
    const global = ls<FriendRequest[]>("krx_freq_global", []);
    lsSet("krx_freq_global", [...global, req]);
    pushNotif({ type: "friend_request", icon: "👤", title: "Заявка отправлена", body: `Вы отправили заявку @${toName}`, link: "/friends" });
  };

  const acceptFriendRequest = (reqId: number) => {
    if (!user) return;
    const req = friendRequests.find(r => r.id === reqId); if (!req) return;
    const newFriend: FriendEntry = { userId: req.fromId, name: req.fromName, avatar: req.fromAvatar, level: 0, status: "online" as OnlineStatus, activity: null, pinned: false, addedAt: Date.now() };
    const updFriends = [...friendList, newFriend];
    setFriendList(updFriends); lsSet("krx_friends", updFriends);
    const updReqs = friendRequests.map(r => r.id === reqId ? { ...r, status: "accepted" as const } : r);
    setFriendRequests(updReqs); lsSet("krx_freq", updReqs);
    updateUser({ friends: (user.friends || 0) + 1 });
    pushNotif({ type: "friend_request", icon: "✅", title: "Заявка принята", body: `@${req.fromName} теперь ваш друг!`, link: "/friends" });
  };

  const rejectFriendRequest = (reqId: number) => {
    const updReqs = friendRequests.map(r => r.id === reqId ? { ...r, status: "rejected" as const } : r);
    setFriendRequests(updReqs); lsSet("krx_freq", updReqs);
  };

  const removeFriend = (userId: string) => {
    if (!user) return;
    const updated = friendList.filter(f => f.userId !== userId);
    setFriendList(updated); lsSet("krx_friends", updated);
    updateUser({ friends: Math.max(0, (user.friends || 0) - 1) });
  };

  const pinFriend = (userId: string) => {
    const updated = friendList.map(f => f.userId === userId ? { ...f, pinned: !f.pinned } : f);
    setFriendList(updated); lsSet("krx_friends", updated);
  };

  const unblockUser = (targetId: string) => {
    updateUser({ blockedUsers: (user?.blockedUsers || []).filter(id => id !== targetId) });
  };

  const deleteAvatar = () => updateUser({ avatar: null });
  const deleteBanner = () => updateUser({ banner: null, bannerColor: "#7c3aed" });

  const RATE_LIMIT_MS = 5000; // 5 seconds between posts
  const canPost = (): boolean => Date.now() - lastPostTime >= RATE_LIMIT_MS;

  // ─── XP & Season ─────────────────────────────────────────────────────────
  const addXP = (amount: number) => {
    if (!user) return;
    const newXp = (user.xp || 0) + amount;
    const xpNeeded = XP_PER_LEVEL;
    const levelsGained = Math.floor(newXp / xpNeeded);
    const remainder = newXp % xpNeeded;
    if (levelsGained > 0) {
      const newLevel = (user.level || 0) + levelsGained;
      let bonusKrx = 0;
      LEVEL_REWARDS.forEach(r => { if (r.krx && user.level < r.level && newLevel >= r.level) bonusKrx += r.krx; });
      updateUser({ xp: remainder, level: newLevel, balance: (user.balance || 0) + bonusKrx });
      if (bonusKrx > 0) pushNotif({ type: "wallet", icon: "🎉", title: "Новый уровень!", body: `Уровень ${newLevel}! +${bonusKrx} KRX`, link: "/profile" });
    } else {
      updateUser({ xp: newXp });
    }
  };

  const setBannerColor = (color: string) => updateUser({ bannerColor: color });

  const checkSeasonReset = () => {
    if (!user) return;
    const now = Date.now();
    const start = user.seasonStart || now;
    if (now - start >= SEASON_DURATION_MS) {
      updateUser({ level: 0, xp: 0, seasonStart: now });
      pushNotif({ type: "game_event", icon: "🔄", title: "Новый сезон!", body: "Уровни сброшены. Начните прокачку заново!", link: "/profile" });
    }
  };

  const changePassword = (oldPw: string, newPw: string): boolean => {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user?.id && u.password === oldPw);
    if (idx === -1) return false;
    users[idx].password = newPw;
    saveUsers(users);
    return true;
  };

  const setOnlineStatus = (status: User["onlineStatus"]) => updateUser({ onlineStatus: status, lastSeen: Date.now() });

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
  const hidePlayer = () => { setPlayerVisible(false); setIsPlaying(false); };

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrackState(track);
    setIsPlaying(true);
    setPlayerVisible(true);
    setProgressState(0);
    if (newQueue) { setQueue(newQueue); setCurrentTrackIdx(newQueue.findIndex(t => t.id === track.id)); }
    // Add to recent
    setRecentTracks(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      const updated = [track, ...filtered].slice(0, 20);
      lsSet("krx_recent", updated);
      return updated;
    });
    // Increment plays
    setTracks(prev => {
      const updated = prev.map(t => t.id === track.id ? { ...t, plays: (t.plays || 0) + 1 } : t);
      lsSet("krx_tracks", updated);
      return updated;
    });
  };

  const togglePlay = () => setIsPlaying(prev => !prev);

  const nextTrack = () => {
    if (!queue.length) return;
    const nextIdx = shuffle
      ? Math.floor(Math.random() * queue.length)
      : (currentTrackIdx + 1) % queue.length;
    setCurrentTrackIdx(nextIdx);
    setCurrentTrackState(queue[nextIdx]);
    setProgressState(0);
  };

  const prevTrack = () => {
    if (!queue.length) return;
    const prevIdx = (currentTrackIdx - 1 + queue.length) % queue.length;
    setCurrentTrackIdx(prevIdx);
    setCurrentTrackState(queue[prevIdx]);
    setProgressState(0);
  };

  const setProgress = (v: number) => setProgressState(v);
  const setVolume = (v: number) => setVolumeState(v);
  const setShuffle = (v: boolean) => setShuffleState(v);
  const setRepeat = (v: boolean) => setRepeatState(v);

  // Keep legacy setCurrentTrack for stories compatibility
  const setCurrentTrack = (track: Track | null) => {
    setCurrentTrackState(track);
    if (track) { setPlayerVisible(true); setIsPlaying(true); }
    else { setIsPlaying(false); }
  };

  const addTrack = (track: Omit<Track, "id" | "plays" | "likedBy" | "savedBy" | "createdAt">) => {
    const newT: Track = { ...track, id: Date.now(), plays: 0, likedBy: [], savedBy: [], createdAt: Date.now() };
    const updated = [...tracks, newT];
    setTracks(updated); lsSet("krx_tracks", updated);
  };

  const deleteTrack = (id: number) => {
    if (!user || !['Kvarden','Baron_Kosyaka','KVARON_X'].includes(user.name)) return;
    const updated = tracks.filter(t => t.id !== id);
    setTracks(updated); lsSet("krx_tracks", updated);
    if (currentTrack?.id === id) { setCurrentTrackState(null); setIsPlaying(false); }
  };

  const likeTrack = (id: number) => {
    if (!user) return;
    const updated = tracks.map(t => {
      if (t.id !== id) return t;
      const liked = (t.likedBy || []).includes(user.id);
      return { ...t, likedBy: liked ? t.likedBy.filter(x => x !== user.id) : [...(t.likedBy || []), user.id] };
    });
    setTracks(updated); lsSet("krx_tracks", updated);
  };

  const saveTrack = (id: number) => {
    if (!user) return;
    const updated = tracks.map(t => {
      if (t.id !== id) return t;
      const saved = (t.savedBy || []).includes(user.id);
      return { ...t, savedBy: saved ? t.savedBy.filter(x => x !== user.id) : [...(t.savedBy || []), user.id] };
    });
    setTracks(updated); lsSet("krx_tracks", updated);
  };

  const incrementPlay = (id: number) => {
    setTracks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, plays: (t.plays || 0) + 1 } : t);
      lsSet("krx_tracks", updated);
      return updated;
    });
  };

  const likedTracks = tracks.filter(t => user && (t.likedBy || []).includes(user.id));
  const savedTracks = tracks.filter(t => user && (t.savedBy || []).includes(user.id));

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
    if (!canPost()) return; // Rate limit
    setLastPostTime(Date.now());
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

  // ─── Games Hub ───────────────────────────────────────────────────────────
  const CLAN_COST = 500;
  const ROOM_COST = 200;

  const createTournament = (data: Omit<Tournament, "id" | "createdAt" | "participants">): boolean => {
    if (!user || !GAME_ADMINS.includes(user.name)) return false;
    const t: Tournament = { ...data, id: Date.now(), createdAt: Date.now(), participants: [] };
    const updated = [t, ...tournaments];
    setTournaments(updated); lsSet("krx_tournaments", updated);
    pushNotif({ type: "game_event", icon: "🏆", title: "Турнир создан", body: `«${data.title}» — ${data.date}`, link: "/games" });
    return true;
  };

  const joinTournament = (id: number): boolean => {
    if (!user) return false;
    const updated = tournaments.map(t => {
      if (t.id !== id || t.participants.includes(user.id)) return t;
      return { ...t, participants: [...t.participants, user.id] };
    });
    setTournaments(updated); lsSet("krx_tournaments", updated);
    pushNotif({ type: "game_event", icon: "🎮", title: "Вы в турнире!", body: `Вы зарегистрировались`, link: "/games" });
    return true;
  };

  const createClan = (data: { name: string; tag: string; avatar?: string | null; description: string; isPaid: boolean }): boolean => {
    if (!user) return false;
    const isAdmin = GAME_ADMINS.includes(user.name);
    const cost = data.isPaid ? CLAN_COST : 0;
    if (!isAdmin && cost > 0 && user.balance < cost) return false;
    if (!isAdmin && cost > 0) updateUser({ balance: user.balance - cost });
    const clan: Clan = {
      id: Date.now(), ...data, ownerId: user.id, ownerName: user.name,
      members: [user.id], bannedUsers: [], level: 1, xp: 0, createdAt: Date.now(),
    };
    const updated = [clan, ...clans];
    setClans(updated); lsSet("krx_clans", updated);
    return true;
  };

  const joinClan = (id: number): boolean => {
    if (!user) return false;
    const updated = clans.map(c => {
      if (c.id !== id || c.members.includes(user.id) || c.bannedUsers.includes(user.id)) return c;
      if (c.members.length >= 200) return c;
      return { ...c, members: [...c.members, user.id] };
    });
    setClans(updated); lsSet("krx_clans", updated);
    return true;
  };

  const leaveClan = (id: number) => {
    if (!user) return;
    const updated = clans.map(c =>
      c.id === id ? { ...c, members: c.members.filter(m => m !== user.id) } : c
    );
    setClans(updated); lsSet("krx_clans", updated);
  };

  const banFromClan = (clanId: number, targetUserId: string) => {
    if (!user) return;
    const updated = clans.map(c => {
      if (c.id !== clanId || c.ownerId !== user.id) return c;
      return { ...c, members: c.members.filter(m => m !== targetUserId), bannedUsers: [...c.bannedUsers, targetUserId] };
    });
    setClans(updated); lsSet("krx_clans", updated);
  };

  const createRoom = (data: { name: string; game: string; privacy: Room["privacy"]; password?: string; isPaid: boolean; entryFee: number; bgColor?: string; nickColor?: string }): boolean => {
    if (!user) return false;
    const isAdmin = GAME_ADMINS.includes(user.name);
    const cost = data.isPaid ? ROOM_COST : 0;
    if (!isAdmin && cost > 0 && user.balance < cost) return false;
    if (!isAdmin && cost > 0) updateUser({ balance: user.balance - cost });
    const room: Room = {
      id: Date.now(), ...data, ownerId: user.id, ownerName: user.name,
      members: [user.id], bannedUsers: [], maxPlayers: 200, chat: [], createdAt: Date.now(),
    };
    const updated = [room, ...rooms];
    setRooms(updated); lsSet("krx_rooms", updated);
    return true;
  };

  const joinRoom = (id: number, password?: string): boolean => {
    if (!user) return false;
    const room = rooms.find(r => r.id === id);
    if (!room) return false;
    if (room.bannedUsers.includes(user.id)) return false;
    if (room.members.length >= room.maxPlayers) return false;
    if (room.privacy === "password" && room.password !== password) return false;
    // Paid entry
    if (room.entryFee > 0 && !GAME_ADMINS.includes(user.name)) {
      if (user.balance < room.entryFee) return false;
      updateUser({ balance: user.balance - room.entryFee });
    }
    const updated = rooms.map(r =>
      r.id === id && !r.members.includes(user.id) ? { ...r, members: [...r.members, user.id] } : r
    );
    setRooms(updated); lsSet("krx_rooms", updated);
    return true;
  };

  const leaveRoom = (id: number) => {
    if (!user) return;
    const updated = rooms.map(r =>
      r.id === id ? { ...r, members: r.members.filter(m => m !== user.id) } : r
    );
    setRooms(updated); lsSet("krx_rooms", updated);
  };

  const banFromRoom = (roomId: number, targetUserId: string) => {
    if (!user) return;
    const updated = rooms.map(r => {
      if (r.id !== roomId || r.ownerId !== user.id) return r;
      return { ...r, members: r.members.filter(m => m !== targetUserId), bannedUsers: [...r.bannedUsers, targetUserId] };
    });
    setRooms(updated); lsSet("krx_rooms", updated);
  };

  const sendRoomMessage = (roomId: number, text: string) => {
    if (!user || !text.trim()) return;
    const msg = { id: Date.now(), authorName: user.name, text: text.trim(), createdAt: Date.now() };
    const updated = rooms.map(r =>
      r.id === roomId ? { ...r, chat: [...r.chat.slice(-199), msg] } : r
    );
    setRooms(updated); lsSet("krx_rooms", updated);
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
      user, isAuthenticated: !!user, login, register, logout, updateUser, forgotPassword,
      addXP, setBannerColor, checkSeasonReset, changePassword, setOnlineStatus,
      deleteAvatar, deleteBanner, canPost, lastPostTime,
      blockUser, unblockUser, isBlocked,
      shopItems, inventory, addShopItem, deleteShopItem, purchaseItem, equipItem, canUseItem,
      conversations, createPersonalChat, createGroupChat, getOrCreatePersonalChat,
      sendMessage, editMessage, deleteMessage, reactToMessage,
      pinConversation, muteConversation, deleteConversation, removeMember, renameGroup, updateGroupAvatar,
      friendList, friendRequests, sentRequests, allUsers,
      sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, pinFriend,
      theme, setTheme, language, setLanguage, t,
      playerVisible, isPlaying, currentTrack, currentTrackIdx, queue, progress, volume, shuffle, repeat,
      showPlayer, hidePlayer, setCurrentTrack, playTrack, togglePlay, nextTrack, prevTrack,
      setProgress, setVolume, setShuffle, setRepeat,
      tracks, addTrack, deleteTrack, likeTrack, saveTrack, incrementPlay,
      likedTracks, savedTracks, recentTracks,
      notifications, unreadCount: notifications.filter(n => !n.read).length,
      pushNotif, markRead, markAllRead, clearNotification,
      transactions, sendMoney, settings, updateSettings,
      posts, addPost, toggleLike, addComment, sharePost,
      stories, addStory, deleteStory, likeStory,
      trends, feedFilter, setFeedFilter, filteredPosts,
      tournaments, clans, rooms, createTournament, joinTournament,
      createClan, joinClan, leaveClan, banFromClan,
      createRoom, joinRoom, leaveRoom, banFromRoom, sendRoomMessage,
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
