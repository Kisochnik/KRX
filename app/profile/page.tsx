"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProfileHeader } from "@/features/profile/ProfileHeader";
import { PostCard } from "@/features/feed/PostCard";
import { MOCK_USERS } from "@/data/users";
import { MOCK_POSTS } from "@/data/posts";

const TABS = ["Posts","Replies","Media","Likes"];

export default function ProfilePage() {
  const [tab, setTab] = useState("Posts");
  const me = MOCK_USERS.me;
  const myPosts = MOCK_POSTS.filter(p => p.author.id === "me").length > 0
    ? MOCK_POSTS.filter(p => p.author.id === "me")
    : MOCK_POSTS.slice(0, 3);

  return (
    <MainLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Page header */}
        <div className="px-5 py-3 glass-deep border-b flex items-center gap-3 flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <button className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <h1 className="font-black text-base" style={{ fontFamily: "Space Grotesk, system-ui" }}>{me.username}</h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{me.postsCount} posts</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ProfileHeader user={me} />

          {/* Tabs */}
          <div className="flex border-b px-5" style={{ borderColor: "var(--border)" }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-semibold transition-all relative ${tab === t ? "tab-active" : "tab-inactive"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {tab === "Posts" && myPosts.map((p, i) => (
              <PostCard key={p.id} post={p} delay={i * 0.06} />
            ))}
            {tab !== "Posts" && (
              <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: "var(--text-muted)" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
                <p className="text-sm">Nothing here yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
