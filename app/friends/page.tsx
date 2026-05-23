"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FriendCard } from "@/features/friends/FriendCard";
import { MOCK_USERS } from "@/data/users";

const FRIENDS_LIST = [
  { ...MOCK_USERS.nova_sync, status: "Building KRX mesh layer" },
  { ...MOCK_USERS.arc_lyra,  status: "Reading decentralization paper" },
  { ...MOCK_USERS.hex_drift, status: "Last seen 2h ago" },
  { ...MOCK_USERS.void_px,   status: "Last seen 5h ago" },
];
const REQUESTS = [
  { user: MOCK_USERS.sigma_node, mutual: 4 },
  { user: MOCK_USERS.delta_flux, mutual: 11 },
];

export default function FriendsPage() {
  const [tab, setTab] = useState<"friends"|"requests">("friends");
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [declined, setDeclined] = useState<Set<string>>(new Set());

  const online  = FRIENDS_LIST.filter(f => f.isOnline);
  const offline = FRIENDS_LIST.filter(f => !f.isOnline);
  const pending = REQUESTS.filter(r => !accepted.has(r.user.id) && !declined.has(r.user.id));

  const TABS = [
    { id: "friends",  label: "Friends",  count: FRIENDS_LIST.length },
    { id: "requests", label: "Requests", count: pending.length },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-5 py-4 glass-deep border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <h1 className="font-black text-lg mb-3" style={{ fontFamily: "Space Grotesk, system-ui" }}>Friends</h1>
          <div className="flex gap-1.5">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={tab === t.id
                  ? { background: "var(--text-primary)", color: "var(--bg-primary)" }
                  : { background: "var(--bg-panel)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {t.label}
                <span className="px-1.5 py-0.5 rounded-full" style={tab === t.id
                  ? { background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: 9 }
                  : { background: "var(--bg-glass)", color: "var(--text-muted)", fontSize: 9 }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {tab === "friends" && (
            <>
              {online.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
                    Online — {online.length}
                  </h2>
                  <div className="space-y-2">
                    {online.map((f, i) => (
                      <div key={f.id} style={{ animationDelay: `${i * 0.06}s` }} className="fade-up">
                        <FriendCard user={f} status={f.status} variant="friend" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {offline.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
                    Offline — {offline.length}
                  </h2>
                  <div className="space-y-2">
                    {offline.map((f, i) => (
                      <div key={f.id} style={{ animationDelay: `${(online.length + i) * 0.06}s` }} className="fade-up">
                        <FriendCard user={f} status={f.status} variant="friend" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {tab === "requests" && (
            <section>
              {pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: "var(--text-muted)" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <p className="text-sm">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pending.map((r, i) => (
                    <div key={r.user.id} className="fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                      <FriendCard
                        user={r.user} mutualCount={r.mutual} variant="request"
                        onAccept={() => setAccepted(p => new Set([...p, r.user.id]))}
                        onDecline={() => setDeclined(p => new Set([...p, r.user.id]))}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
