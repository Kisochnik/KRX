import { createFileRoute } from "@tanstack/react-router";
import { Play, Heart, Clock, ListMusic } from "lucide-react";

export const Route = createFileRoute("/_app/music")({ component: MusicPage });

const tracks = [
  { t: "Static Bloom", a: "nova", d: "3:24" },
  { t: "Cold Synth", a: "kai", d: "4:01" },
  { t: "Monochrome Dreams", a: "mira", d: "2:48" },
  { t: "Night Signal", a: "axel", d: "3:55" },
  { t: "Silent Pulse", a: "june", d: "5:12" },
];

function MusicPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Music</h1>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { icon: ListMusic, label: "Playlists", count: 12 },
          { icon: Heart, label: "Favorites", count: 84 },
          { icon: Clock, label: "History", count: 230 },
        ].map((c) => (
          <div key={c.label} className="krx-card krx-card-hover p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center"><c.icon className="h-4 w-4" /></div>
            <div>
              <p className="text-sm font-medium">{c.label}</p>
              <p className="text-xs text-muted-foreground">{c.count} items</p>
            </div>
          </div>
        ))}
      </div>
      <div className="krx-card divide-y divide-border">
        {tracks.map((t, i) => (
          <div key={i} className="flex items-center gap-3 p-3 hover:bg-accent/40 transition group">
            <span className="w-6 text-center text-xs text-muted-foreground group-hover:hidden">{i + 1}</span>
            <button className="w-6 hidden group-hover:flex items-center justify-center"><Play className="h-3.5 w-3.5" /></button>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-foreground/30 to-foreground/5 border border-border" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t.t}</p>
              <p className="text-xs text-muted-foreground truncate">{t.a}</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Heart className="h-4 w-4" /></button>
            <span className="text-xs text-muted-foreground w-10 text-right">{t.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
