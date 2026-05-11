"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Gamepad2, Trophy, Users, Swords, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const games = [
  {
    id: 1,
    name: "Counter-Strike 2",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop",
    players: 12453,
    tournaments: 5,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Dota 2",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=400&fit=crop",
    players: 8932,
    tournaments: 3,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Valorant",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0f?w=300&h=400&fit=crop",
    players: 7621,
    tournaments: 4,
    rating: 4.7,
  },
  {
    id: 4,
    name: "League of Legends",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop",
    players: 15234,
    tournaments: 6,
    rating: 4.8,
  },
];

const tournaments = [
  {
    id: 1,
    name: "KRX Championship 2024",
    game: "Counter-Strike 2",
    prize: "500,000 KRX",
    teams: 32,
    status: "Регистрация",
    startsIn: "5 дней",
  },
  {
    id: 2,
    name: "Winter Cup",
    game: "Dota 2",
    prize: "250,000 KRX",
    teams: 16,
    status: "Идёт",
    startsIn: null,
  },
  {
    id: 3,
    name: "Pro League Season 3",
    game: "Valorant",
    prize: "100,000 KRX",
    teams: 8,
    status: "Скоро",
    startsIn: "2 недели",
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Игры</h1>
              <p className="text-muted-foreground">Турниры и соревнования</p>
            </div>
          </div>

          {/* Games Grid */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Популярные игры</h2>
          <div className="grid grid-cols-4 gap-4 mb-10">
            {games.map(game => (
              <div 
                key={game.id}
                className="group relative rounded-xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={game.image} 
                  alt={game.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-bold text-white mb-2">{game.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {game.players.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {game.rating}
                    </span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded">
                  {game.tournaments} турниров
                </div>
              </div>
            ))}
          </div>

          {/* Tournaments */}
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Активные турниры
          </h2>
          <div className="space-y-4">
            {tournaments.map(tournament => (
              <div 
                key={tournament.id}
                className="flex items-center justify-between p-5 bg-card rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Swords className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tournament.name}</h3>
                    <p className="text-sm text-muted-foreground">{tournament.game}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-lg font-bold text-primary">{tournament.prize}</p>
                    <p className="text-xs text-muted-foreground">Призовой фонд</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{tournament.teams}</p>
                    <p className="text-xs text-muted-foreground">Команд</p>
                  </div>
                  <div>
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium",
                      tournament.status === "Идёт" && "bg-green-500/20 text-green-400",
                      tournament.status === "Регистрация" && "bg-primary/20 text-primary",
                      tournament.status === "Скоро" && "bg-yellow-500/20 text-yellow-400"
                    )}>
                      {tournament.status}
                    </span>
                  </div>
                  {tournament.startsIn && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {tournament.startsIn}
                    </div>
                  )}
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
