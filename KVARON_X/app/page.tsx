import { Sidebar } from "@/components/krx/sidebar";
import { Stories } from "@/components/krx/stories";
import { CreatePost } from "@/components/krx/create-post";
import { Post } from "@/components/krx/post";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";

const posts = [
  {
    id: 1,
    author: "Kvarden",
    content:
      "Добро пожаловать в KVARON_X! 🎮 Новая эра социальных сетей начинается здесь. Присоединяйтесь к нашему сообществу геймеров и творческих людей!",
    likes: 1542,
    comments: 234,
    shares: 89,
    time: "2 часа назад",
    isVerified: true,
    level: 42,
  },
  {
    id: 2,
    author: "Baron_Kosyaka",
    content:
      "Только что выиграл турнир по CS2! 🏆 Спасибо всем, кто поддерживал! Следующая цель — топ-1 в рейтинге KRX.",
    likes: 892,
    comments: 156,
    shares: 45,
    time: "4 часа назад",
    isVerified: true,
    level: 38,
  },
  {
    id: 3,
    author: "GameMaster",
    content:
      "Новый клан 'Dark Phoenix' набирает участников! Требования: уровень 20+, активность в игровых комнатах. Пишите в ЛС!",
    likes: 567,
    comments: 89,
    shares: 34,
    time: "6 часов назад",
    isVerified: false,
    level: 25,
  },
  {
    id: 4,
    author: "MusicLover",
    content:
      "Загрузил новый плейлист 'Night Vibes' 🎵 Идеально для ночных сессий. Проверьте в разделе музыки!",
    likes: 345,
    comments: 67,
    shares: 23,
    time: "8 часов назад",
    isVerified: false,
    level: 18,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <RightSidebar />

      {/* Main Content */}
      <main className="ml-64 mr-0 xl:mr-80 pb-32 lg:pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Главная
            </h1>
            <p className="text-muted-foreground">
              Добро пожаловать в KVARON
              <span className="text-primary">_X</span>
            </p>
          </div>

          {/* Stories */}
          <div className="mb-6">
            <Stories />
          </div>

          {/* Create Post */}
          <div className="mb-6">
            <CreatePost />
          </div>

          {/* Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post.id} {...post} />
            ))}
          </div>
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
}
