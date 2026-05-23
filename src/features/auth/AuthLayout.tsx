export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: [
          "radial-gradient(ellipse at 30% 40%, rgba(79,158,255,0.06) 0%, transparent 60%)",
          "radial-gradient(ellipse at 70% 60%, rgba(168,85,247,0.06) 0%, transparent 60%)",
        ].join(", ")
      }} />
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  );
}
