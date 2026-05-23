"use client";
import { useState } from "react";
import type { User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Button } from "@/components/ui/Button";
import { formatCount } from "@/utils";

export function ProfileHeader({ user }: { user: User }) {
  const [following, setFollowing] = useState(false);

  return (
    <div>
      {/* Banner */}
      <div className="h-40 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #111 50%, #0a0a1a 100%)" }}>
        <div className="absolute inset-0" style={{
          backgroundImage: [
            "radial-gradient(circle at 25% 50%, rgba(79,158,255,0.15) 0%, transparent 55%)",
            "radial-gradient(circle at 75% 50%, rgba(168,85,247,0.12) 0%, transparent 55%)",
          ].join(", ")
        }} />
        <div className="absolute inset-0 flex items-center justify-center"
             style={{ opacity: 0.04, fontSize: 100, fontWeight: 900, fontFamily: "Space Grotesk, system-ui", color: "#fff", userSelect: "none" }}>
          KRX
        </div>
      </div>

      {/* Avatar row */}
      <div className="px-5 flex items-end justify-between -mt-10 mb-4">
        <div className="avatar-ring border-4 rounded-full" style={{ borderColor: "var(--bg-primary)" }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black"
               style={{ background: "#111", color: user.avatarColor, fontFamily: "Space Grotesk, system-ui" }}>
            {user.avatar}
          </div>
        </div>
        <div className="flex gap-2 mb-1">
          <Button variant="ghost" size="sm">Edit Profile</Button>
          <Button
            variant={following ? "ghost" : "primary"}
            size="sm"
            onClick={() => setFollowing(v => !v)}
          >
            {following ? "Following" : "Follow"}
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h2 className="font-black text-xl" style={{ fontFamily: "Space Grotesk, system-ui" }}>{user.username}</h2>
          {user.isVerified && <VerifiedBadge size={18} />}
        </div>
        <div className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
          {user.handle} · KRX Member since {user.joinedAt}
        </div>
        <p className="text-sm leading-relaxed mb-3">{user.bio}</p>
        <div className="flex flex-wrap gap-4 text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          {user.location && (
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {user.location}
            </span>
          )}
          {user.website && (
            <span className="flex items-center gap-1.5" style={{ color: "var(--krx-blue)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              {user.website}
            </span>
          )}
        </div>
        <div className="flex gap-5 text-sm">
          <span><strong className="font-bold">{formatCount(user.followingCount)}</strong>{" "}
            <span style={{ color: "var(--text-secondary)" }}>Following</span>
          </span>
          <span><strong className="font-bold">{formatCount(user.followersCount)}</strong>{" "}
            <span style={{ color: "var(--text-secondary)" }}>Followers</span>
          </span>
          <span><strong className="font-bold">{formatCount(user.postsCount)}</strong>{" "}
            <span style={{ color: "var(--text-secondary)" }}>Posts</span>
          </span>
        </div>
      </div>
    </div>
  );
}
