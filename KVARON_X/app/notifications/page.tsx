"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const { isAuthenticated } = useApp();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);
  if (!isAuthenticated) return null;
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl"><Bell className="w-8 h-8 text-primary" /></div>
            <div><h1 className="text-3xl font-bold text-foreground">Уведомления</h1></div>
          </div>
          <div className="text-center py-20 text-muted-foreground">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Нет уведомлений</p>
          </div>
        </div>
      </main>
      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
