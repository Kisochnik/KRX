"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ComposeBox } from "@/features/feed/ComposeBox";
import { PostCard } from "@/features/feed/PostCard";
import { StoriesBar } from "@/features/feed/StoriesBar";
import { MOCK_POSTS } from "@/data/posts";
import type { Post } from "@/types";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [tab, setTab] = useState<"following" | "foryou">("following");

  const handlePost = (text: string) => {
    const newPost: Post = {
      id: String(Date.now()),
      author: { id:"me", username:"kvaron_user", handle:"@kvaron_x", avatar:"KX",
                avatarColor:"#fff", bio:"", followersCount:284000, followingCount:12400,
                postsCount:1248, isVerified:true, isOnline:true, joinedAt:"January 2025" },
      content: text,
      tags: [],
      createdAt: "Just now",
      likesCount: 0, commentsCount: 0, repostsCount: 0, viewsCount: "0",
    };
    setPosts(p => [newPost, ...p]);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Page header */}
        <div className="px-5 py-4 glass-deep border-b flex items-center justify-between flex-shrink-0"
             style={{ borderColor: "var(--border)" }}>
          <div>
            <h1 className="font-black text-lg" style={{ fontFamily: "Space Grotesk, system-ui" }}>Home</h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Your KRX Feed</p>
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-panel)", border: "1px solid var(--border)" }}>
            {(["following","foryou"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize"
                style={tab === t
                  ? { background: "var(--text-primary)", color: "var(--bg-primary)" }
                  : { color: "var(--text-muted)" }}>
                {t === "foryou" ? "For You" : "Following"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <StoriesBar />
          <ComposeBox onPost={handlePost} />
          <div>
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} delay={i * 0.05} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
