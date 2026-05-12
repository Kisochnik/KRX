"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Camera, Edit3, Save, X, User, CheckCircle2, CircleDollarSign, Users, FileText, Trophy } from "lucide-react";

export default function ProfilePage() {
  const { isAuthenticated, user, updateUser } = useApp();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);

  const openEdit = () => {
    setEditName(user?.name || "");
    setEditBio(user?.bio || "");
    setEditing(true);
  };

  const saveEdit = () => {
    updateUser({ name: editName, bio: editBio });
    setEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateUser({ avatar: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateUser({ banner: reader.result as string });
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Banner */}
          <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-primary/5 border border-border mb-4 group">
            {user.banner
              ? <img src={user.banner} alt="Banner" className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
            }
            <button onClick={() => bannerRef.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-white">
              <Camera className="w-6 h-6" /> Изменить баннер
            </button>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          </div>

          {/* Avatar + Info */}
          <div className="flex items-end gap-6 -mt-16 mb-6 px-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-background bg-primary/20 overflow-hidden">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><User className="w-16 h-16 text-primary" /></div>
                }
              </div>
              <button onClick={() => avatarRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                {user.isRich && <CircleDollarSign className="w-6 h-6 text-yellow-500 fill-yellow-500/20" title="Богатый" />}
              </div>
              <p className="text-muted-foreground text-sm">{user.bio || "Нет биографии"}</p>
            </div>

            <button onClick={openEdit}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-all text-foreground">
              <Edit3 className="w-4 h-4" /> Редактировать
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: Trophy, label: "Уровень", value: user.level },
              { icon: Users, label: "Друзья", value: user.friends },
              { icon: FileText, label: "Посты", value: user.posts },
            ].map(stat => (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4 text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Posts placeholder */}
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
            Постов пока нет
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Редактировать профиль</h2>
              <button onClick={() => setEditing(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Имя пользователя</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Биография</label>
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary resize-none" />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={saveEdit}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all">
                  <Save className="w-4 h-4" /> Сохранить
                </button>
                <button onClick={() => setEditing(false)}
                  className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-all">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
