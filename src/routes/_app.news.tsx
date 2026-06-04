import { createFileRoute } from "@tanstack/react-router";
import { Pin, Eye, Heart, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/_app/news")({ component: NewsPage });

const news = [
  { id: 1, pinned: true, title: "KRX 1.0 is live", time: "Today", body: "A monochrome social network with everything in one place. Welcome aboard.", views: "120k" },
  { id: 2, title: "Introducing KRX Music", time: "Yesterday", body: "Playlists, favorites, and listening history — built natively into your feed." },
  { id: 3, title: "Stories, reactions, polls", time: "2d ago", body: "New ways to express. Less performance, more presence." },
];

function NewsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-3">
      <h1 className="text-2xl font-bold tracking-tight mb-2">News</h1>
      {news.map((n) => (
        <article key={n.id} className="krx-card krx-card-hover p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            {n.pinned && <span className="inline-flex items-center gap-1 text-foreground"><Pin className="h-3 w-3" /> Pinned</span>}
            <span>{n.time}</span>
          </div>
          <h2 className="text-xl font-semibold">{n.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{n.body}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {n.views ?? "—"}</span>
            <button className="flex items-center gap-1 hover:text-foreground"><Heart className="h-3.5 w-3.5" /></button>
            <button className="flex items-center gap-1 hover:text-foreground"><MessageCircle className="h-3.5 w-3.5" /></button>
          </div>
        </article>
      ))}
    </div>
  );
}
