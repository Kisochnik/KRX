import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/games")({ component: GamesPage });

const games = [
  { name: "Quantum Drift", desc: "A neon racer through the KRX network.", tag: "Racing" },
  { name: "Monochrome", desc: "A puzzle in pure black and white.", tag: "Puzzle" },
  { name: "Signal Lost", desc: "Co-op survival in deep space.", tag: "Survival" },
  { name: "Pixel Court", desc: "1v1 minimalist basketball.", tag: "Sports" },
];

function GamesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Games</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {games.map((g) => (
          <div key={g.name} className="krx-card krx-card-hover overflow-hidden">
            <div className="aspect-[16/9] bg-gradient-to-br from-muted to-background border-b border-border relative overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-20">
                {Array.from({ length: 72 }).map((_, i) => (
                  <div key={i} className="border border-foreground/10" />
                ))}
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{g.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">{g.tag}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{g.desc}</p>
              </div>
              <Button size="sm" className="rounded-full gap-1.5"><Play className="h-3.5 w-3.5" /> Play</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
