"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
  CircleDollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PostProps {
  author: string;
  avatar?: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  time: string;
  isVerified?: boolean;
  isRich?: boolean;
  level?: number;
}

export function Post({
  author,
  content,
  likes: initialLikes,
  comments,
  shares,
  time,
  isVerified,
  isRich,
  level,
}: PostProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/30">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-primary/50">
              <span className="text-lg font-bold text-primary">
                {author.charAt(0)}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{author}</span>
              {isVerified && (
                <BadgeCheck className="w-4 h-4 text-primary fill-primary/20" />
              )}
              {isRich && (
                <CircleDollarSign className="w-4 h-4 text-yellow-500 fill-yellow-500/20" title="Богатый" />
              )}
              {level && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  Lvl {level}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground leading-relaxed">{content}</p>
      </div>

      {/* Image placeholder */}
      <div className="aspect-video bg-gradient-to-br from-primary/10 via-muted to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">KRX</span>
          </div>
          <p className="text-sm text-muted-foreground">Медиа контент</p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex items-center justify-between border-t border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
              "hover:scale-105 active:scale-95",
              liked
                ? "bg-primary/20 text-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all",
                liked && "fill-primary text-primary animate-pulse"
              )}
            />
            <span className="text-sm font-medium">{likes}</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{comments}</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">{shares}</span>
          </button>
        </div>

        <button
          onClick={() => setSaved(!saved)}
          className={cn(
            "p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95",
            saved
              ? "text-primary bg-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Bookmark className={cn("w-5 h-5", saved && "fill-primary")} />
        </button>
      </div>
    </article>
  );
}
