"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { User, Settings, Camera, MapPin, Calendar, Link as LinkIcon, Trophy, Gamepad2, Music, Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle2, CircleDollarSign } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const posts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop",
    likes: 234,
    comments: 18,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    likes: 567,
    comments: 42,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop",
    likes: 891,
    comments: 76,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop",
    likes: 123,
    comments: 9,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0f?w=400&h=400&fit=crop",
    likes: 456,
    comments: 31,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
    likes: 789,
    comments: 54,
  },
];

const stats = [
  { label: "Постов", value: "156" },
  { label: "Подписчиков", value: "12.5K" },
  { label: "Подписок", value: "324" },
];

const achievements = [
  { icon: Trophy, label: "Чемпион", color: "text-yellow-500" },
  { icon: Gamepad2, label: "Pro Gamer", color: "text-primary" },
  { icon: Music, label: "Меломан", color: "text-purple-500" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");
  const isRich = true; // Mock — заменить на реальный статус пользователя

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 pb-24">
        {/* Cover */}
        <div className="relative h-64 bg-gradient-to-r from-primary/30 via-primary/10 to-background">
          <button className="absolute bottom-4 right-4 p-2 bg-card/80 backdrop-blur rounded-lg hover:bg-card transition-colors">
            <Camera className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="max-w-4xl mx-auto px-6 -mt-20">
          <div className="flex items-end gap-6 mb-6">
            <div className="relative">
              <img 
                src="https://i.pravatar.cc/160?img=8" 
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-background object-cover"
              />
              <button className="absolute bottom-2 right-2 p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">KRX_Player</h1>
                <CheckCircle2 className="w-6 h-6 text-primary fill-primary/20" />
                {isRich && (
                  <CircleDollarSign className="w-6 h-6 text-yellow-500 fill-yellow-500/20" title="Богатый" />
                )}
              </div>
              <p className="text-muted-foreground mb-3">@krx_player</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Москва, Россия
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Присоединился в 2023
                </span>
                <span className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  krx-player.com
                </span>
              </div>
            </div>
            <div className="flex gap-3 pb-4">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Редактировать
              </button>
              <button className="p-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
                <Settings className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Bio */}
          <p className="text-foreground mb-6">
            Pro gamer | Streamer | CS2 & Dota 2 enthusiast | Люблю музыку и хорошие игры
          </p>

          {/* Stats & Achievements */}
          <div className="flex items-center gap-8 mb-8">
            <div className="flex gap-8">
              {stats.map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex gap-3">
              {achievements.map(ach => {
                const Icon = ach.icon;
                return (
                  <div key={ach.label} className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-full border border-border">
                    <Icon className={cn("w-4 h-4", ach.color)} />
                    <span className="text-sm text-foreground">{ach.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            {(["posts", "saved", "tagged"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === "posts" && "Публикации"}
                {tab === "saved" && "Сохранённые"}
                {tab === "tagged" && "Отмечен"}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-3 gap-4">
            {posts.map(post => (
              <div key={post.id} className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl">
                <img 
                  src={post.image} 
                  alt="Post"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <Heart className="w-5 h-5 fill-white" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-2 text-white font-medium">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    {post.comments}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
}
