"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Users, UserPlus, Search } from "lucide-react";

export default function FriendsPage() {
  const { isAuthenticated } = useApp();
  const router = useRouter();
  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl"><Users className="w-8 h-8 text-primary" /></div>
              <div><h1 className="text-3xl font-bold text-foreground">Друзья</h1>
                <p className="text-muted-foreground">0 друзей</p></div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <UserPlus className="w-4 h-4" /> Найти друзей
            </button>
          </div>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input placeholder="Поиск друзей..." className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
          </div>
          <div className="text-center py-20 text-muted-foreground">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">У вас пока нет друзей</p>
            <p className="text-sm mt-2">Найдите знакомых через поиск</p>
          </div>
        </div>
      </main>
      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
