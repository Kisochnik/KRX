import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Share, Image as ImageIcon, BarChart3, Smile, Eye, Radio } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/feed")({ component: FeedPage });

type Tab = "for_you" | "following" | "live";

const mockPosts = [
  { id: 1, author: "nova", handle: "@nova_x", time: "2m", text: "Black canvas, white type. Built KRX to stop the noise.", likes: 1240, comments: 88, reposts: 42, views: 28400 },
  { id: 2, author: "kai", handle: "@kai", time: "12m", text: "Just dropped a new playlist on KRX Music. Cold synths, warm hearts.", likes: 322, comments: 14, reposts: 6, views: 9200 },
  { id: 3, author: "mira", handle: "@mira.lab", time: "1h", text: "Stories on KRX feel different. Less performance, more presence.", likes: 980, comments: 51, reposts: 22, views: 18100 },
  { id: 4, author: "axel", handle: "@axel", time: "3h", text: "Polls > arguments. Change my mind.", likes: 612, comments: 132, reposts: 18, views: 14500 },
];

function FeedPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("for_you");

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
      {/* Tabs */}
      <div className="sticky top-14 z-20 -mx-4 md:-mx-6 px-4 md:px-6 mb-4 krx-glass border-b border-border">
        <div className="flex gap-1">
          {([
            { id: "for_you", label: t("feed.for_you") },
            { id: "following", label: t("feed.following") },
            { id: "live", label: t("feed.live"), icon: Radio },
          ] as const).map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm transition
                ${tab === tb.id ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {"icon" in tb && tb.icon ? <tb.icon className="h-3.5 w-3.5" /> : null}
              {tb.label}
              {tab === tb.id && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-10 bg-foreground rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="krx-card p-4 mb-4">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-foreground/30 to-foreground/10 shrink-0 border border-border" />
          <div className="flex-1">
            <textarea
              placeholder={t("feed.compose")}
              className="w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground text-base"
              rows={2}
            />
            <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
              <div className="flex gap-1 text-muted-foreground">
                {[ImageIcon, BarChart3, Smile].map((Icon, i) => (
                  <button key={i} className="h-9 w-9 rounded-lg hover:bg-accent flex items-center justify-center transition">
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <Button size="sm" className="rounded-full px-5">{t("feed.post")}</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {mockPosts.map((p) => (
          <article key={p.id} className="krx-card krx-card-hover p-4">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-foreground/40 to-foreground/10 shrink-0 border border-border" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 text-sm">
                  <span className="font-semibold">{p.author}</span>
                  <span className="text-muted-foreground">{p.handle}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{p.time}</span>
                </div>
                <p className="mt-1 text-[15px] leading-relaxed">{p.text}</p>
                <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
                  <Action icon={MessageCircle} count={p.comments} />
                  <Action icon={Repeat2} count={p.reposts} />
                  <Action icon={Heart} count={p.likes} />
                  <Action icon={Eye} count={p.views} />
                  <button className="ml-auto hover:text-foreground transition"><Share className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Action({ icon: Icon, count }: { icon: any; count: number }) {
  return (
    <button className="flex items-center gap-1.5 hover:text-foreground transition">
      <Icon className="h-4 w-4" />
      {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
    </button>
  );
}
