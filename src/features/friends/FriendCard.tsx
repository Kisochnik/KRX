"use client";
import type { User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";

interface Props {
  user: User;
  status?: string;
  mutualCount?: number;
  variant?: "friend" | "request" | "suggestion";
  onAccept?: () => void;
  onDecline?: () => void;
  onMessage?: () => void;
  onView?: () => void;
}

export function FriendCard({ user, status, mutualCount, variant = "friend", onAccept, onDecline, onMessage, onView }: Props) {
  return (
    <div className="glass rounded-2xl p-3 flex items-center gap-3 post-card">
      <Avatar user={user} size="lg" showOnline />

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{user.username}</div>
        <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
          {status ?? user.bio}
        </div>
        {mutualCount != null && (
          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {mutualCount} mutual friends
          </div>
        )}
      </div>

      <div className="flex gap-1.5 flex-shrink-0">
        {variant === "friend" && (
          <>
            <button onClick={onMessage}
              className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{ color: "var(--text-secondary)" }} title="Message">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
            <button onClick={onView}
              className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{ color: "var(--text-secondary)" }} title="Profile">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
          </>
        )}
        {variant === "request" && (
          <>
            <button onClick={onAccept} className="btn-primary px-3 py-1.5 rounded-xl text-xs font-bold">Accept</button>
            <button onClick={onDecline} className="btn-ghost px-3 py-1.5 rounded-xl text-xs font-semibold">Decline</button>
          </>
        )}
      </div>
    </div>
  );
}
