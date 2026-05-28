import type {
  User,
  Post,
  Story,
  Trend,
  Conversation,
  Message,
  Notification,
  ExploreItem,
  Comment,
} from "@/lib/types";

export const CURRENT_USER_ID = "u1";

export const users: User[] = [];
export const posts: Post[] = [];
export const stories: Story[] = [];
export const trends: Trend[] = [];
export const conversations: Conversation[] = [];
export const messagesByConversation: Record<string, Message[]> = {};
export const notifications: Notification[] = [];
export const exploreItems: ExploreItem[] = [];
export const comments: Record<string, Comment[]> = {};

export const getUserById = (id: string): User | undefined =>
  users.find((u) => u.id === id);

export const getPostById = (id: string): Post | undefined =>
  posts.find((p) => p.id === id);

export const getCommentsByPostId = (postId: string): Comment[] =>
  comments[postId] ?? [];
