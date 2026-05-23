// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  handle: string;
  avatar: string;       // initials fallback
  avatarColor: string;
  bio: string;
  location?: string;
  website?: string;
  joinedAt: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen?: string;
}

// ─── Post ─────────────────────────────────────────────────────────────────────
export interface Post {
  id: string;
  author: User;
  content: string;
  tags: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  viewsCount: string;
  imageUrl?: string;
  isLiked?: boolean;
  isReposted?: boolean;
}

// ─── Message ──────────────────────────────────────────────────────────────────
export interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: Message[];
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type NotificationType = "like" | "follow" | "mention" | "repost" | "reply";

export interface Notification {
  id: string;
  type: NotificationType;
  fromUser: User;
  text: string;
  createdAt: string;
  read: boolean;
  postId?: string;
}

// ─── Theme ───────────────────────────────────────────────────────────────────
export type Theme = "dark" | "light";

// ─── Nav ─────────────────────────────────────────────────────────────────────
export type NavSection = "feed" | "explore" | "notifications" | "messages" | "friends" | "profile" | "settings";
