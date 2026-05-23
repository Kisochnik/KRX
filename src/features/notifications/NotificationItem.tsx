import type { Notification } from "@/types";
import { Avatar } from "@/components/ui/Avatar";

const TYPE_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  like:    { color: "#ec4899", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="#ec4899"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  follow:  { color: "#4f9eff", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4f9eff" strokeWidth="2.5" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
  repost:  { color: "#22c55e", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
  mention: { color: "#a855f7", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg> },
  reply:   { color: "#4f9eff", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4f9eff" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
};

interface Props { notification: Notification; delay?: number; }

export function NotificationItem({ notification: n, delay = 0 }: Props) {
  const typeInfo = TYPE_ICONS[n.type] ?? TYPE_ICONS.like;

  return (
    <div
      className="flex items-start gap-3 px-5 py-4 border-b hover:bg-white/[0.015] transition-colors cursor-pointer relative fade-up"
      style={{ borderColor: "var(--border)", animationDelay: `${delay}s` }}
    >
      {/* Unread indicator */}
      {!n.read && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full"
             style={{ background: "var(--krx-blue)" }} />
      )}

      {/* Avatar + type icon */}
      <div className="relative flex-shrink-0 mt-0.5">
        <Avatar user={n.fromUser} size="md" />
        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
             style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
          {typeInfo.icon}
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">{n.fromUser.username}</span>{" "}
          <span style={{ color: "var(--text-secondary)" }}>{n.text}</span>
        </p>
        <span className="text-xs mt-0.5 block" style={{ color: "var(--text-muted)" }}>{n.createdAt}</span>
      </div>

      {/* Unread dot */}
      {!n.read && (
        <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--krx-blue)" }} />
      )}
    </div>
  );
}
