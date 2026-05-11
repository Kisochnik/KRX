"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Users, UserPlus, Search, MessageCircle, Gamepad2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const friends = [
  { id: 1, name: "Alex_Pro", avatar: "https://i.pravatar.cc/80?img=1", status: "online", game: "CS2", mutualFriends: 12 },
  { id: 2, name: "CyberNinja", avatar: "https://i.pravatar.cc/80?img=2", status: "online", game: "Dota 2", mutualFriends: 8 },
  { id: 3, name: "GameMaster", avatar: "https://i.pravatar.cc/80?img=3", status: "offline", game: null, mutualFriends: 5 },
  { id: 4, name: "ProGamer_X", avatar: "https://i.pravatar.cc/80?img=4", status: "online", game: null, mutualFriends: 15 },
  { id: 5, name: "NightWolf", avatar: "https://i.pravatar.cc/80?img=5", status: "away", game: null, mutualFriends: 3 },
  { id: 6, name: "ShadowHunter", avatar: "https://i.pravatar.cc/80?img=6", status: "online", game: "Valorant", mutualFriends: 7 },
];

const requests = [
  { id: 1, name: "NewPlayer123", avatar: "https://i.pravatar.cc/80?img=10", mutualFriends: 2 },
  { id: 2, name: "GamerGirl", avatar: "https://i.pravatar.cc/80?img=11", mutualFriends: 5 },
];

export default function FriendsPage() {
  const [tab, setTab] = useState<"all" | "online" | "requests">("all");
  const [search, setSearch] = useState("");

  const filteredFriends = friends.filter(f => {
    if (tab === "online") return f.status === "online";
    return f.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Друзья</h1>
                <p className="text-muted-foreground">{friends.length} друзей, {friends.filter(f => f.status === "online").length} онлайн</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <UserPlus className="w-4 h-4" />
              Найти друзей
            </button>
          </div>

          {/* Search & Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск друзей..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex bg-card rounded-lg p-1 border border-border">
              {(["all", "online", "requests"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                    tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === "all" && "Все"}
                  {t === "online" && "Онлайн"}
                  {t === "requests" && `Заявки (${requests.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Friend Requests */}
          {tab === "requests" && (
            <div className="space-y-3 mb-6">
              {requests.map(request => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-4">
                    <img src={request.avatar} alt={request.name} className="w-14 h-14 rounded-full" />
                    <div>
                      <h3 className="font-semibold text-foreground">{request.name}</h3>
                      <p className="text-sm text-muted-foreground">{request.mutualFriends} общих друзей</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      Принять
                    </button>
                    <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
                      Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Friends Grid */}
          {tab !== "requests" && (
            <div className="grid grid-cols-2 gap-4">
              {filteredFriends.map(friend => (
                <div 
                  key={friend.id}
                  className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-full" />
                      <span className={cn(
                        "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card",
                        friend.status === "online" && "bg-green-500",
                        friend.status === "offline" && "bg-gray-500",
                        friend.status === "away" && "bg-yellow-500"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{friend.name}</h3>
                      {friend.game ? (
                        <p className="text-sm text-primary flex items-center gap-1">
                          <Gamepad2 className="w-3 h-3" />
                          Играет в {friend.game}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {friend.status === "online" ? "В сети" : friend.status === "away" ? "Отошёл" : "Не в сети"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <MessageCircle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
