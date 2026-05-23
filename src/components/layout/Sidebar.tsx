"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, APP_NAME, APP_SHORT, APP_VERSION } from "@/constants";
import { NAV_ICONS } from "./NavIcons";
import { Badge } from "@/components/ui/Badge";
import { MOCK_USERS } from "@/data/users";

export function Sidebar() {
  const pathname = usePathname();
  const me = MOCK_USERS.me;

  return (
    <aside
      className="w-64 flex flex-col h-full glass-deep border-r flex-shrink-0"
      style={{ borderColor: "var(--border)" }}
    >
      {/* ── Logo ── */}
      <div className="px-6 pt-7 pb-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white flex-shrink-0">
          <span className="text-black font-black text-sm" style={{ fontFamily: "var(--font-syne, system-ui)" }}>
            {APP_SHORT}
          </span>
        </div>
        <div>
          <div className="font-black tracking-tight text-base krx-logo-text" style={{ fontFamily: "var(--font-syne, system-ui)" }}>
            {APP_NAME}
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>{APP_VERSION}</div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 glass" style={{ background: "rgba(255,255,255,0.04)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="bg-transparent text-sm flex-1 placeholder:text-gray-600"
            style={{ color: "var(--text-primary)" }}
            placeholder="Search KRX..."
          />
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = NAV_ICONS[item.id];

          return (
            <Link key={item.id} href={item.href}>
              <div
                className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? "active" : ""}`}
                style={{ color: isActive ? "#fff" : "var(--text-secondary)" }}
              >
                <Icon active={isActive} />
                <span className="flex-1">{item.label}</span>
                {item.badge ? <Badge count={item.badge} /> : null}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Compose ── */}
      <div className="px-4 py-3">
        <Link href="/feed">
          <button className="btn-primary w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Post
          </button>
        </Link>
      </div>

      {/* ── User card ── */}
      <div className="px-4 pb-5">
        <Link href="/profile">
          <div
            className="glass rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-colors hover:border-white/20"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="avatar-ring flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                   style={{ background: "#1a1a1a", color: me.avatarColor }}>
                {me.avatar}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{me.username}</div>
              <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{me.handle}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="5" r="1" fill="#555" /><circle cx="12" cy="12" r="1" fill="#555" /><circle cx="12" cy="19" r="1" fill="#555" />
            </svg>
          </div>
        </Link>
      </div>
    </aside>
  );
}
