"use client";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SettingsSection, SettingsRow, Toggle } from "@/features/settings/SettingsSection";
import { MOCK_USERS } from "@/data/users";
import { Avatar } from "@/components/ui/Avatar";

export default function SettingsPage() {
  const [theme,       setTheme]       = useState<"dark"|"light">("dark");
  const [notifPosts,  setNotifPosts]  = useState(true);
  const [notifDMs,    setNotifDMs]    = useState(true);
  const [notifFollow, setNotifFollow] = useState(true);
  const [twoFA,       setTwoFA]       = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("krx-theme", theme); } catch {}
  }, [theme]);

  const me = MOCK_USERS.me;

  return (
    <MainLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-5 py-4 glass-deep border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
          <h1 className="font-black text-lg" style={{ fontFamily: "Space Grotesk, system-ui" }}>Settings</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Manage your KVARON_X account</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5">

          {/* Account card */}
          <div className="glass rounded-2xl p-4 flex items-center gap-4 mb-6">
            <Avatar user={me} size="xl" ring />
            <div>
              <div className="font-black text-base" style={{ fontFamily: "Space Grotesk, system-ui" }}>{me.username}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{me.handle}</div>
              <div className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block"
                   style={{ background: "rgba(79,158,255,0.12)", color: "var(--krx-blue)" }}>
                KRX Verified
              </div>
            </div>
          </div>

          {/* Appearance */}
          <SettingsSection title="Appearance">
            <SettingsRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}
              label="Theme"
              description={theme === "dark" ? "Dark mode is active" : "Light mode is active"}
              right={
                <div className="flex items-center gap-2 p-1 rounded-xl" style={{ background: "var(--bg-panel)", border: "1px solid var(--border)" }}>
                  {(["dark","light"] as const).map(t => (
                    <button key={t} onClick={() => setTheme(t)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all capitalize"
                      style={theme === t
                        ? { background: "var(--text-primary)", color: "var(--bg-primary)" }
                        : { color: "var(--text-muted)" }}>
                      {t === "dark" ? "🌑 Dark" : "☀️ Light"}
                    </button>
                  ))}
                </div>
              }
            />
            <SettingsRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>}
              label="Compact Mode"
              description="Reduce spacing and padding"
              right={<Toggle checked={compactMode} onChange={setCompactMode} />}
            />
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection title="Notifications">
            <SettingsRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
              label="Post interactions" description="Likes, reposts, comments"
              right={<Toggle checked={notifPosts} onChange={setNotifPosts} />} />
            <SettingsRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
              label="Direct Messages" description="When someone messages you"
              right={<Toggle checked={notifDMs} onChange={setNotifDMs} />} />
            <SettingsRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              label="New followers" description="When someone follows you"
              right={<Toggle checked={notifFollow} onChange={setNotifFollow} />} />
          </SettingsSection>

          {/* Security */}
          <SettingsSection title="Security">
            <SettingsRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
              label="Two-Factor Authentication" description={twoFA ? "Enabled — your account is protected" : "Add an extra layer of security"}
              right={<Toggle checked={twoFA} onChange={setTwoFA} />} />
            <SettingsRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>}
              label="Change Password" description="Last changed 30 days ago" />
            <SettingsRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
              label="Active Sessions" description="Manage connected devices" />
          </SettingsSection>

          {/* Account */}
          <SettingsSection title="Account">
            <SettingsRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>}
              label="Export Data" description="Download a copy of your data" />
            <SettingsRow icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
              label="Log Out" description="Sign out of KVARON_X" />
            <SettingsRow danger icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>}
              label="Delete Account" description="Permanently remove your account and data" />
          </SettingsSection>
        </div>
      </div>
    </MainLayout>
  );
}
