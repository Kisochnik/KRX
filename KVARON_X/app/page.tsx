"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { Post } from "@/components/krx/post";
import { CreatePost } from "@/components/krx/create-post";
import { Stories } from "@/components/krx/stories";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";

const posts = [
  {
    id: 1,
    author: "NightOwl_42",
    content: "Только что прошёл новый рейд в Destiny 2 — это было эпично! Команда огонь",
    likes: 234,
    comments: 18,
    shares: 7,
    time: "2 минуты назад",
    isVerified: true,
    isRich: true,
    level: 87,
  },
  {
    id: 2,
    author: "CyberQueen",
    content: "Новый трек вышел! Слушайте в разделе Музыка — называется 'Neon Dreams'. Написала за одну ночь",
    likes: 567,
    comments: 42,
    shares: 31,
    time: "15 минут назад",
    isVerified: false,
    isRich: false,
    level: 34,
  },
  {
    id: 3,
    author: "ProGamer_X",
    content: "Топ-1 на EU серверах третий раз подряд. Ranked grind продолжается, не останавливаемся",
    likes: 891,
    comments: 76,
    shares: 54,
    time: "1 час назад",
    isVerified: true,
    isRich: false,
    level: 99,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <Stories />
          <CreatePost />
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </div>
      </main>
      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
