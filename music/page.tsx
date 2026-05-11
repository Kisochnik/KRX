"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Music, Play, Heart, Clock, Disc3, TrendingUp } from "lucide-react";

const playlists = [
  { id: 1, name: "Gaming Mix", tracks: 45, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop" },
  { id: 2, name: "Chill Vibes", tracks: 32, image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop" },
  { id: 3, name: "Electronic", tracks: 67, image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200&h=200&fit=crop" },
  { id: 4, name: "Hip-Hop", tracks: 28, image: "https://images.unsplash.com/photo-1571609860754-01323be7dc52?w=200&h=200&fit=crop" },
];

const tracks = [
  { id: 1, title: "Neon Lights", artist: "SynthWave", duration: "3:45", plays: 125000, liked: true },
  { id: 2, title: "Digital Dreams", artist: "CyberPunk", duration: "4:12", plays: 98000, liked: false },
  { id: 3, title: "Night Drive", artist: "RetroFuture", duration: "3:28", plays: 156000, liked: true },
  { id: 4, title: "Electric Soul", artist: "VaporWave", duration: "5:01", plays: 87000, liked: false },
  { id: 5, title: "Midnight Run", artist: "DarkSynth", duration: "4:33", plays: 203000, liked: true },
];

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Music className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Музыка</h1>
              <p className="text-muted-foreground">Слушайте и открывайте новое</p>
            </div>
          </div>

          {/* Playlists */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Плейлисты</h2>
          <div className="grid grid-cols-4 gap-4 mb-10">
            {playlists.map(playlist => (
              <div 
                key={playlist.id}
                className="group relative bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="relative mb-4">
                  <img 
                    src={playlist.image} 
                    alt={playlist.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <button className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 hover:scale-110">
                    <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground">{playlist.name}</h3>
                <p className="text-sm text-muted-foreground">{playlist.tracks} треков</p>
              </div>
            ))}
          </div>

          {/* Top Tracks */}
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Популярные треки
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="p-4 w-12">#</th>
                  <th className="p-4">Название</th>
                  <th className="p-4">Прослушиваний</th>
                  <th className="p-4 w-20">
                    <Clock className="w-4 h-4" />
                  </th>
                  <th className="p-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track, index) => (
                  <tr 
                    key={track.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <span className="text-muted-foreground group-hover:hidden">{index + 1}</span>
                        <Play className="w-4 h-4 text-primary hidden group-hover:block" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                          <Disc3 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{track.title}</p>
                          <p className="text-sm text-muted-foreground">{track.artist}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {track.plays.toLocaleString()}
                    </td>
                    <td className="p-4 text-muted-foreground">{track.duration}</td>
                    <td className="p-4">
                      <button className="hover:scale-110 transition-transform">
                        <Heart className={`w-5 h-5 ${track.liked ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
