"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProfileThemeId, OnlineStatus } from "@/lib/types";
import { CURRENT_USER_ID, getUserById } from "@/lib/data";
import { APP_CONFIG } from "@/settings/config";

export interface EditableProfile {
  displayName: string;
  username: string;
  bio: string;
  avatar: string;
  customStatus: string;
  status: OnlineStatus;
  themeId: ProfileThemeId;
  location: string;
  website: string;
}

interface ProfileContextValue {
  profile: EditableProfile;
  updateProfile: (patch: Partial<EditableProfile>) => void;
  followingIds: string[];
  followerIds: string[];
  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  bookmarkedPostIds: string[];
  toggleBookmark: (postId: string) => void;
  isBookmarked: (postId: string) => boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const STORAGE_KEY = "krx_profile_v2";

function loadProfile(): EditableProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function defaultProfile(): EditableProfile {
  const user = getUserById(CURRENT_USER_ID);
  return {
    displayName: user?.displayName ?? "KRX User",
    username: user?.username ?? "krx_user",
    bio: user?.bio ?? "",
    avatar: user?.avatar ?? "KRX",
    customStatus: user?.customStatus ?? "Создаю будущее KVARON_X",
    status: user?.status ?? "online",
    themeId: user?.themeId ?? "mono",
    location: user?.location ?? "Москва, Россия",
    website: user?.website ?? "kvaron.x/krx",
  };
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<EditableProfile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);
  const [followingIds, setFollowingIds] = useState<string[]>(["u2", "u5", "u4"]);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>(["p6", "p1"]);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) setProfile(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, hydrated]);

  const updateProfile = useCallback((patch: Partial<EditableProfile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  const toggleFollow = useCallback((userId: string) => {
    setFollowingIds((ids) =>
      ids.includes(userId) ? ids.filter((id) => id !== userId) : [...ids, userId]
    );
  }, []);

  const isFollowing = useCallback(
    (userId: string) => followingIds.includes(userId),
    [followingIds]
  );

  const toggleBookmark = useCallback((postId: string) => {
    setBookmarkedPostIds((ids) =>
      ids.includes(postId) ? ids.filter((id) => id !== postId) : [...ids, postId]
    );
  }, []);

  const isBookmarked = useCallback(
    (postId: string) => bookmarkedPostIds.includes(postId),
    [bookmarkedPostIds]
  );

  const followerIds = useMemo(
    () => ["u2", "u3", "u5", "u7", "u8"],
    []
  );

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      followingIds,
      followerIds,
      toggleFollow,
      isFollowing,
      bookmarkedPostIds,
      toggleBookmark,
      isBookmarked,
    }),
    [
      profile,
      updateProfile,
      followingIds,
      followerIds,
      toggleFollow,
      isFollowing,
      bookmarkedPostIds,
      toggleBookmark,
      isBookmarked,
    ]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
