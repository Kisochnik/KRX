"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TrendingPostCard } from "@/features/explore/TrendingPostCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { MOCK_USERS } from "@/data/users";
import { formatCount } from "@/utils";

const CATS = ["All","Technology","Design","Crypto","Culture","Science"];

const TREND_POSTS = [
  { id:"t1", user: MOCK_USERS.nova_sync,   tag:"Technology", likesCount:42100, text:"The KRX mesh protocol just hit 1M nodes. Decentralization at scale is real." },
  { id:"t2", user: MOCK_USERS.arc_lyra,    tag:"Design",     likesCount:28900, text:"Glassmorphism is not dead — it just needed the right context. KVARON_X proves it." },
  { id:"t3", user: MOCK_USERS.hex_drift,   tag:"Crypto",     likesCount:19400, text:"Why every crypto project should study KVARON_X's identity layer." },
  { id:"t4", user: MOCK_USERS.void_px,     tag:"Design",     likesCount:67200, text:"The aesthetic of the future is monochrome + precision. No noise, just signal." },
  { id:"t5", user: MOCK_USERS.sigma_node,  tag:"Technology", likesCount:14800, text:"Open protocol networks grow 10x faster than closed platforms. The data is clear." },
  { id:"t6", user: MOCK_USERS.delta_flux,  tag:"Culture",    likesCount:93700, text:"Consciousness is a social network. We're all just nodes with latency." },
];

const DISCOVER = [MOCK_USERS.nova_sync, MOCK_USERS.arc_lyra, MOCK_USERS.sigma_node, MOCK_USERS.delta_flux];

export default function ExplorePage() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  const posts = TREND_POSTS.filter(p =>
    (cat === "All" || p.tag === cat) &&
    (p.text.toLowerCase().includes(query.toLowerCase()) || !query)
  );

  return (
    <MainLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-5 py-4 glass-deep border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <h1 className="font-black text-lg mb-3" style={{ fontFamily: "Space Grotesk, system-ui" }}>Explore</h1>
          <SearchInput value={query} onChange={setQuery} placeholder="Search posts, people, tags..." className="mb-3" />
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                style={cat === c
                  ? { background: "var(--text-primary)", color: "var(--bg-primary)" }
                  : { background: "var(--bg-panel)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Trending posts grid */}
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
              Trending Posts
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {posts.map((p, i) => (
                <div key={p.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <TrendingPostCard post={p} />
                </div>
              ))}
              {posts.length === 0 && (
                <p className="col-span-2 text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
                  No results found
                </p>
              )}
            </div>
          </div>

          {/* Discover people */}
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
              Discover People
            </h2>
            <div className="space-y-2">
              {DISCOVER.map((u, i) => (
                <div key={u.id} className="glass rounded-2xl p-3 flex items-center gap-3 cursor-pointer post-card"
                     style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                  <Avatar user={u} size="lg" showOnline />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{u.username}</div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{u.bio}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {formatCount(u.followersCount)} followers
                    </div>
                  </div>
                  <Button
                    variant={followed.has(u.id) ? "ghost" : "primary"}
                    size="sm"
                    onClick={() => setFollowed(p => { const n = new Set(p); n.has(u.id) ? n.delete(u.id) : n.add(u.id); return n; })}
                  >
                    {followed.has(u.id) ? "Following" : "Follow"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
