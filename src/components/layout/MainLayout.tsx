"use client";
import { Sidebar } from "./Sidebar";
import { RightPanel } from "./RightPanel";
import { usePathname } from "next/navigation";

const WITH_RIGHT_PANEL = ["/feed", "/explore"];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showRight = WITH_RIGHT_PANEL.some(p => pathname.startsWith(p));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: [
          "radial-gradient(ellipse at 15% 50%, rgba(79,158,255,0.04) 0%, transparent 55%)",
          "radial-gradient(ellipse at 85% 20%, rgba(168,85,247,0.04) 0%, transparent 55%)",
        ].join(", "),
      }} />

      <Sidebar />

      <main className="flex-1 flex overflow-hidden min-w-0">
        <div className="flex-1 overflow-hidden">{children}</div>
        {showRight && <RightPanel />}
      </main>
    </div>
  );
}
