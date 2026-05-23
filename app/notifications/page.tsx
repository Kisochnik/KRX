"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NotificationItem } from "@/features/notifications/NotificationItem";
import { MOCK_NOTIFICATIONS } from "@/data/notifications";
import type { NotificationType } from "@/types";

const FILTERS: { id: string; label: string }[] = [
  { id: "all",    label: "All" },
  { id: "like",   label: "Likes" },
  { id: "follow", label: "Follows" },
  { id: "mention",label: "Mentions" },
  { id: "repost", label: "Reposts" },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const filtered = filter === "all"
    ? MOCK_NOTIFICATIONS
    : MOCK_NOTIFICATIONS.filter(n => n.type === filter as NotificationType);

  return (
    <MainLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-5 py-4 glass-deep border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-black text-lg" style={{ fontFamily: "Space Grotesk, system-ui" }}>Notifications</h1>
            {unread > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold" style={{ background: "var(--krx-blue)", color: "#fff" }}>
                {unread} new
              </span>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
                style={filter === f.id
                  ? { background: "var(--text-primary)", color: "var(--bg-primary)" }
                  : { background: "var(--bg-panel)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((n, i) => (
            <NotificationItem key={n.id} notification={n} delay={i * 0.04} />
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 gap-3" style={{ color: "var(--text-muted)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <p className="text-sm">No notifications here</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
