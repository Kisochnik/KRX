"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { MessageCircle, Search, Send } from "lucide-react";

export default function ChatPage() {
  const { isAuthenticated } = useApp();
  const router = useRouter();
  const [message, setMessage] = useState("");
  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);
  if (!isAuthenticated) return null;
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 flex pb-20">
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Сообщения</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input placeholder="Поиск..." className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Нет диалогов</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
          <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
          <p>Выберите диалог для общения</p>
        </div>
      </main>
      <MusicPlayer />
    </div>
  );
}
