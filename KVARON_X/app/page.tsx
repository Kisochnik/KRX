"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { CreatePost } from "@/components/krx/create-post";
import { Stories } from "@/components/krx/stories";

export default function HomePage() {
  const { isAuthenticated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/auth");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <Stories />
          <CreatePost />
          <div className="text-center py-12 text-muted-foreground text-sm">
            Пока нет постов. Будь первым!
          </div>
        </div>
      </main>
      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
