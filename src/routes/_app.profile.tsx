import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/profile")({ component: ProfilePage });

type Tab = "feed" | "photo" | "video" | "info";

function ProfilePage() {
  const [tab, setTab] = useState<Tab>("feed");

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="relative">
        <div className="h-44 md:h-56 bg-gradient-to-br from-muted via-background to-muted border-b border-border" />
        <div className="px-4 md:px-6">
          <div className="flex items-end justify-between -mt-12">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-foreground/40 to-foreground/10 border-4 border-background" />
            <Button variant="outline" className="rounded-full gap-2"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
          </div>
          <div className="mt-3">
            <h1 className="text-xl font-bold">You</h1>
            <p className="text-sm text-muted-foreground">@you · ID 000001</p>
            <p className="mt-3 text-sm">Minimalist, mostly. Lover of monochrome and quiet ideas.</p>
            <div className="mt-3 flex gap-5 text-sm">
              <span><strong>248</strong> <span className="text-muted-foreground">followers</span></span>
              <span><strong>62</strong> <span className="text-muted-foreground">friends</span></span>
            </div>
          </div>

          <div className="mt-6 border-b border-border flex gap-1">
            {(["feed", "photo", "video", "info"] as Tab[]).map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`relative px-4 py-3 text-sm capitalize transition
                  ${tab === tb ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tb}
                {tab === tb && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-foreground rounded-full" />}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {tab === "feed" && (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="krx-card p-4 text-sm">A short post from you · post #{i}</div>
                ))}
              </div>
            )}
            {tab === "photo" && (
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-muted to-background border border-border rounded-md" />
                ))}
              </div>
            )}
            {tab === "video" && (
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-video bg-gradient-to-br from-muted to-background border border-border rounded-lg" />
                ))}
              </div>
            )}
            {tab === "info" && (
              <dl className="krx-card p-4 text-sm divide-y divide-border">
                {[["Joined", "Jun 2026"], ["Location", "Internet"], ["Languages", "EN · UA · RU"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
