"use client";
import { useState } from "react";
import { MOCK_USERS } from "@/data/users";
import type { User } from "@/types";

interface StoryItem {
  user: User;
  seen: boolean;
}

const STORIES: StoryItem[] = [
  { user: MOCK_USERS.krx_official, seen: false },
  { user: MOCK_USERS.nova_sync,    seen: false },
  { user: MOCK_USERS.arc_lyra,     seen: false },
  { user: MOCK_USERS.hex_drift,    seen: true  },
  { user: MOCK_USERS.void_px,      seen: true  },
  { user: MOCK_USERS.sigma_node,   seen: false },
  { user: MOCK_USERS.delta_flux,   seen: true  },
];

export function StoriesBar() {
  const [seen, setSeen] = useState<Set<string>>(
    new Set(STORIES.filter(s => s.seen).map(s => s.user.id))
  );

  return (
    <div className="px-4 py-4 border-b overflow-x-auto" style={{ borderColor: "var(--border)" }}>
      <div className="flex gap-4" style={{ minWidth: "max-content" }}>
        {/* Add story */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-dashed transition-colors group-hover:border-white/40"
               style={{ borderColor: "var(--border)", background: "var(--bg-panel)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--text-muted)" }}>
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: 10 }}>Your Story</span>
        </div>

        {/* User stories */}
        {STORIES.map((s) => {
          const isSeen = seen.has(s.user.id);
          return (
            <div
              key={s.user.id}
              className="flex flex-col items-center gap-1.5 cursor-pointer"
              onClick={() => setSeen(prev => new Set([...prev, s.user.id]))}
            >
              <div className={`story-ring ${isSeen ? "seen" : ""}`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold border-2"
                     style={{ background: "#111", borderColor: "var(--bg-primary)", color: s.user.avatarColor }}>
                  {s.user.avatar}
                </div>
              </div>
              <span className="text-xs truncate max-w-14"
                    style={{ color: isSeen ? "var(--text-muted)" : "var(--text-primary)", fontSize: 10 }}>
                {s.user.username}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
