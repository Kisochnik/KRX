"use client";
import { MOCK_USERS } from "@/data/users";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { formatCount } from "@/utils";
import { useState } from "react";

const TRENDS = [
  { tag: "#KVARON_X",     posts: 1200000, category: "Technology" },
  { tag: "#KRX_Launch",   posts: 804000,  category: "Trending" },
  { tag: "#Web4Protocol", posts: 341000,  category: "Tech" },
  { tag: "#DecentralSocial", posts: 218000, category: "Tech" },
  { tag: "#KRXIdentity",  posts: 97400,   category: "KVARON_X" },
];

const SUGGESTIONS = [
  MOCK_USERS.nova_sync,
  MOCK_USERS.arc_lyra,
  MOCK_USERS.sigma_node,
];

export function RightPanel() {
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  return (
    <aside className="w-80 flex flex-col h-full overflow-y-auto border-l flex-shrink-0"
           style={{ borderColor: "var(--border)", background: "var(--bg-panel)" }}>
      <div className="p-4 space-y-4">

        {/* Live stats */}
        <div className="glass rounded-2xl p-4" style={{
          background: "rgba(79,158,255,0.05)",
          borderColor: "rgba(79,158,255,0.15)"
        }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full online-dot flex-shrink-0" />
            <span className="text-xs font-bold tracking-widest" style={{ color: "var(--krx-blue)" }}>
              LIVE — KRX NETWORK
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["2.8M","Online"],["48K","Posts/hr"],["99.9%","Uptime"]].map(([v,l]) => (
              <div key={l}>
                <div className="font-black text-sm" style={{ fontFamily: "Space Grotesk, system-ui" }}>{v}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-bold text-sm">Trending on KRX</h3>
          </div>
          {TRENDS.map((t, i) => (
            <div key={i} className="trend-item px-4 py-3 border-b last:border-0"
                 style={{ borderColor: "var(--border)" }}>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.category}</div>
              <div className="font-bold text-sm my-0.5">{t.tag}</div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {formatCount(t.posts)} posts
              </div>
            </div>
          ))}
        </div>

        {/* Who to follow */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-bold text-sm">Who to follow</h3>
          </div>
          {SUGGESTIONS.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-b last:border-0 hover:bg-white/5 transition-colors"
                 style={{ borderColor: "var(--border)" }}>
              <Avatar user={u} size="md" showOnline />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm truncate">{u.username}</span>
                  {u.isVerified && <VerifiedBadge size={13} />}
                </div>
                <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
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

        {/* Footer */}
        <div className="flex flex-wrap gap-x-3 gap-y-1" style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {["Privacy","Terms","Cookies","About","Status","Help"].map(l => (
            <span key={l} className="cursor-pointer hover:underline">{l}</span>
          ))}
          <span>© 2025 KVARON_X</span>
        </div>
      </div>
    </aside>
  );
}
