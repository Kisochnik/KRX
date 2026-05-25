export type ReactionEmoji = "🔥" | "❤️" | "😂" | "👍" | "💀" | "🎉" | "👀" | "⚡";

export interface ReactionCount {
  emoji: ReactionEmoji;
  count: number;
  userIds: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface ProfileBadge {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: "post" | "like" | "follow" | "achievement" | "level";
  userId: string;
  content: string;
  createdAt: string;
}

export type ProfileThemeId = "mono" | "neon" | "midnight" | "frost" | "void";

export interface ProfileTheme {
  id: ProfileThemeId;
  name: string;
  bannerClass: string;
  accentClass: string;
}

export interface DailyReward {
  day: number;
  label: string;
  xp: number;
  claimed: boolean;
}

export interface FollowRelation {
  followerId: string;
  followingId: string;
}
