import type {
  Achievement,
  ProfileBadge,
  ActivityItem,
  ProfileTheme,
  DailyReward,
  FollowRelation,
  ReactionEmoji,
} from "@/lib/types";

export const PROFILE_THEMES: ProfileTheme[] = [
  { id: "mono", name: "Монохром", bannerClass: "theme-banner-mono", accentClass: "theme-accent-mono" },
  { id: "neon", name: "Неон", bannerClass: "theme-banner-neon", accentClass: "theme-accent-neon" },
  { id: "midnight", name: "Полночь", bannerClass: "theme-banner-midnight", accentClass: "theme-accent-midnight" },
  { id: "frost", name: "Мороз", bannerClass: "theme-banner-frost", accentClass: "theme-accent-frost" },
  { id: "void", name: "Войд", bannerClass: "theme-banner-void", accentClass: "theme-accent-void" },
];

export const PROFILE_BADGES: ProfileBadge[] = [
  { id: "b1", label: "Основатель", icon: "👑", color: "from-white/20 to-white/5" },
  { id: "b2", label: "KRX Pioneer", icon: "⚡", color: "from-white/15 to-transparent" },
  { id: "b3", label: "100K XP", icon: "💎", color: "from-white/10 to-transparent" },
  { id: "b4", label: "Verified", icon: "✓", color: "from-white/20 to-white/5" },
  { id: "b5", label: "Top Creator", icon: "🔥", color: "from-white/15 to-transparent" },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "Первый пост", description: "Опубликуйте первый пост в KVARON_X", icon: "📝", rarity: "common", unlocked: true, unlockedAt: "2026-01-15", xpReward: 100 },
  { id: "a2", title: "100 подписчиков", description: "Наберите 100 подписчиков", icon: "👥", rarity: "common", unlocked: true, unlockedAt: "2026-02-01", xpReward: 250 },
  { id: "a3", title: "Вирусный пост", description: "Пост с 10K+ просмотров", icon: "🚀", rarity: "rare", unlocked: true, unlockedAt: "2026-03-10", xpReward: 500 },
  { id: "a4", title: "KRX Legend", description: "Достигните 50 уровня", icon: "🏆", rarity: "legendary", unlocked: false, xpReward: 5000 },
  { id: "a5", title: "Социальная бабочка", description: "1000 подписок", icon: "🦋", rarity: "epic", unlocked: true, unlockedAt: "2026-04-20", xpReward: 1000 },
  { id: "a6", title: "Ночной волк", description: "Активность после полуночи 30 дней", icon: "🌙", rarity: "rare", unlocked: false, xpReward: 750 },
  { id: "a7", title: "Реакционный мастер", description: "Получите 500 реакций", icon: "😎", rarity: "epic", unlocked: true, unlockedAt: "2026-05-01", xpReward: 800 },
  { id: "a8", title: "Стример KRX", description: "Проведите 10 стримов", icon: "📺", rarity: "rare", unlocked: false, xpReward: 600 },
];

export const ACTIVITIES: ActivityItem[] = [
  { id: "act1", type: "post", userId: "u1", content: "опубликовал пост о запуске KVARON_X", createdAt: "2026-05-23T12:00:00" },
  { id: "act2", type: "achievement", userId: "u1", content: "получил достижение «Реакционный мастер»", createdAt: "2026-05-22T18:00:00" },
  { id: "act3", type: "level", userId: "u1", content: "достиг 42 уровня KRX", createdAt: "2026-05-21T10:00:00" },
  { id: "act4", type: "follow", userId: "u5", content: "подписался на вас", createdAt: "2026-05-20T14:30:00" },
  { id: "act5", type: "like", userId: "u2", content: "лайкнул ваш пост", createdAt: "2026-05-19T09:15:00" },
  { id: "act6", type: "post", userId: "u1", content: "закрепил пост в профиле", createdAt: "2026-05-18T16:00:00" },
];

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, label: "50 XP", xp: 50, claimed: true },
  { day: 2, label: "75 XP", xp: 75, claimed: true },
  { day: 3, label: "100 XP", xp: 100, claimed: true },
  { day: 4, label: "150 XP", xp: 150, claimed: false },
  { day: 5, label: "200 XP", xp: 200, claimed: false },
  { day: 6, label: "300 XP", xp: 300, claimed: false },
  { day: 7, label: "500 XP + Badge", xp: 500, claimed: false },
];

export const FOLLOWS: FollowRelation[] = [
  { followerId: "u2", followingId: "u1" },
  { followerId: "u3", followingId: "u1" },
  { followerId: "u5", followingId: "u1" },
  { followerId: "u7", followingId: "u1" },
  { followerId: "u1", followingId: "u2" },
  { followerId: "u1", followingId: "u5" },
  { followerId: "u1", followingId: "u4" },
];

export const REACTION_EMOJIS: ReactionEmoji[] = ["🔥", "❤️", "😂", "👍", "💀", "🎉", "👀", "⚡"];

export const MOCK_GIFS = [
  { id: "g1", label: "KRX Hype", preview: "⚡" },
  { id: "g2", label: "Neon Wave", preview: "🌊" },
  { id: "g3", label: "GG", preview: "🎮" },
  { id: "g4", label: "Fire", preview: "🔥" },
  { id: "g5", label: "Mind blown", preview: "🤯" },
  { id: "g6", label: "Cool", preview: "😎" },
];
