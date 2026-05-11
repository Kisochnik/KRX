"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Newspaper, TrendingUp, Clock, Star } from "lucide-react";

const newsItems = [
  {
    id: 1,
    category: "Обновление",
    title: "KVARON_X 2.0 — Новый движок и улучшенная производительность",
    excerpt: "Мы полностью переработали ядро платформы. Теперь всё работает в 3 раза быстрее!",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop",
    date: "2 часа назад",
    views: 15420,
    featured: true,
  },
  {
    id: 2,
    category: "Турниры",
    title: "Открыта регистрация на KRX Championship 2024",
    excerpt: "Призовой фонд 500,000 KRX. Регистрация до 15 декабря.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop",
    date: "5 часов назад",
    views: 8932,
    featured: false,
  },
  {
    id: 3,
    category: "Музыка",
    title: "Новый раздел — KRX Music с эксклюзивными треками",
    excerpt: "Слушайте музыку от независимых артистов прямо в приложении.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
    date: "1 день назад",
    views: 12543,
    featured: false,
  },
  {
    id: 4,
    category: "Безопасность",
    title: "Двухфакторная аутентификация теперь обязательна для верифицированных",
    excerpt: "Защитите свой аккаунт с помощью 2FA. Настройка занимает 2 минуты.",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop",
    date: "2 дня назад",
    views: 6721,
    featured: false,
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Newspaper className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Новости</h1>
              <p className="text-muted-foreground">Последние обновления KVARON_X</p>
            </div>
          </div>

          {/* Featured News */}
          {newsItems.filter(n => n.featured).map(news => (
            <div 
              key={news.id}
              className="relative rounded-2xl overflow-hidden mb-8 group cursor-pointer"
            >
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-3">
                  {news.category}
                </span>
                <h2 className="text-2xl font-bold text-white mb-2">{news.title}</h2>
                <p className="text-gray-300 mb-3">{news.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {news.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {news.views.toLocaleString()} просмотров
                  </span>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          ))}

          {/* News Grid */}
          <div className="grid gap-6">
            {newsItems.filter(n => !n.featured).map(news => (
              <div 
                key={news.id}
                className="flex gap-4 bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer group"
              >
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-48 h-32 object-cover rounded-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded mb-2">
                      {news.category}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{news.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {news.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {news.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
