export type OnlineStatus = "online" | "idle" | "dnd" | "offline";

export type CustomProfileStatus = string;

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  friends?: number;
  posts: number;
  verified: boolean;
  status: OnlineStatus;
  customStatus?: CustomProfileStatus;
  banner?: string;
  themeId?: import("./social").ProfileThemeId;
  level?: number;
  xp?: number;
  xpToNext?: number;
  badgeIds?: string[];
  location?: string;
  website?: string;
  joinedAt?: string;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  image?: string;
  gif?: string;
  likes: number;
  reposts: number;
  comments: number;
  views: number;
  createdAt: string;
  liked?: boolean;
  reposted?: boolean;
  bookmarked?: boolean;
  pinned?: boolean;
  reactions?: import("./social").ReactionCount[];
}

export interface Story {
  id: string;
  userId: string;
  viewed: boolean;
  label: string;
}

export interface Trend {
  id: string;
  tag: string;
  posts: string;
  category: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export interface Notification {
  id: string;
  type: "like" | "follow" | "mention" | "repost" | "message" | "achievement";
  fromUserId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface ExploreItem {
  id: string;
  title: string;
  category: string;
  image: string;
  likes: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  likes: number;
  createdAt: string;
  gif?: string;
}

export * from "./social";
