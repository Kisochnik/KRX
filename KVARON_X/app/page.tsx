"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { CreatePost } from "@/components/krx/create-post";
import { Stories } from "@/components/krx/stories";
import { PostCard } from "@/components/krx/post";
import { Flame } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, posts } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/auth");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 mr-80 p-6 pb-28">
        <div className="max-w-2xl mx-auto space-y-5">
          <Stories />
          <CreatePost />

          {posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Flame className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-base font-medium">Лента пуста</p>
              <p className="text-sm mt-1">Создай первый пост!</p>
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
