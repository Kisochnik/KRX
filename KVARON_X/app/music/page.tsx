"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Music, Play, Heart, Clock, Disc3, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MusicPage() {
  const { isAuthenticated, user, tracks, addTrack, showPlayer, setCurrentTrack } = useApp();
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) router.replace("/auth");
    else showPlayer(); // Show player when entering Music section
  }, [isAuthenticated]);

  const handlePlay = (track: typeof tracks[0]) => {
    setCurrentTrack(track);
    showPlayer();
  };

  const handleAddTrack = () => {
    if (!newTitle || !newArtist) return;
    addTrack({ title: newTitle, artist: newArtist, duration: newDuration || "0:00", addedBy: user!.name });
    setNewTitle(""); setNewArtist(""); setNewDuration("");
    setShowAddForm(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 mr-80 p-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Music className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Музыка</h1>
                <p className="text-muted-foreground">{tracks.length} треков</p>
              </div>
            </div>
            {user?.isAdmin && (
              <button onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
                <Plus className="w-4 h-4" /> Добавить трек
              </button>
            )}
          </div>

          {/* Add Track Form (Admin only) */}
          {showAddForm && user?.isAdmin && (
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-4">Новый трек</h3>
              <div className="grid grid-cols-3 gap-4">
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Название трека"
                  className="px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                <input value={newArtist} onChange={e => setNewArtist(e.target.value)} placeholder="Исполнитель"
                  className="px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                <input value={newDuration} onChange={e => setNewDuration(e.target.value)} placeholder="Длительность (3:45)"
                  className="px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleAddTrack} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
                  Добавить
                </button>
                <button onClick={() => setShowAddForm(false)} className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all">
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Tracks list */}
          {tracks.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Disc3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Треков пока нет</p>
              {user?.isAdmin && <p className="text-sm mt-2">Нажмите «Добавить трек» чтобы начать</p>}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted-foreground">
                    <th className="p-4 w-12">#</th>
                    <th className="p-4">Название</th>
                    <th className="p-4 w-24"><Clock className="w-4 h-4" /></th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track, index) => (
                    <tr key={track.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors group">
                      <td className="p-4">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <span className="text-muted-foreground group-hover:hidden">{index + 1}</span>
                          <button onClick={() => handlePlay(track)} className="hidden group-hover:block">
                            <Play className="w-4 h-4 text-primary" />
                          </button>
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
                      <td className="p-4 text-muted-foreground">{track.duration}</td>
                      <td className="p-4">
                        <button onClick={() => {
                          const next = new Set(likedTracks);
                          next.has(track.id) ? next.delete(track.id) : next.add(track.id);
                          setLikedTracks(next);
                        }} className="hover:scale-110 transition-transform">
                          <Heart className={cn("w-5 h-5", likedTracks.has(track.id) ? "text-primary fill-primary" : "text-muted-foreground")} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
