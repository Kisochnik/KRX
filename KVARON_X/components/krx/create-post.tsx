"use client";
import { useState } from "react";
import { useApp } from "@/context/app-context";
import { Image, Video, BarChart2, Hash, Smile, User } from "lucide-react";

export function CreatePost() {
  const { user, updateUser } = useApp();
  const [text, setText] = useState("");
  const [posted, setPosted] = useState(false);

  const handlePost = () => {
    if (!text.trim()) return;
    // Increment post count
    updateUser({ posts: (user?.posts ?? 0) + 1 });
    setText("");
    setPosted(true);
    setTimeout(() => setPosted(false), 2000);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0">
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            : <User className="w-5 h-5 text-primary" />
          }
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`Что нового, ${user?.name ?? ""}?`}
            rows={2}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-sm"
          />
          {posted && <p className="text-xs text-green-500 mb-2">Пост опубликован!</p>}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex gap-2">
              {[Image, Video, BarChart2, Hash, Smile].map((Icon, i) => (
                <button key={i} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
            <button
              onClick={handlePost}
              disabled={!text.trim()}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Опубликовать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
