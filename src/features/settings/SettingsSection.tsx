interface Props { title: string; children: React.ReactNode; }

export function SettingsSection({ title, children }: Props) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold tracking-widest uppercase mb-3 px-1" style={{ color: "var(--text-muted)" }}>{title}</h3>
      <div className="glass rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        {children}
      </div>
    </div>
  );
}

interface RowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

export function SettingsRow({ icon, label, description, right, onClick, danger }: RowProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors border-b last:border-0 cursor-pointer"
      style={{ borderColor: "var(--border)" }}
      onClick={onClick}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
           style={{ background: danger ? "rgba(239,68,68,0.1)" : "var(--bg-panel)", color: danger ? "#ef4444" : "var(--text-secondary)" }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium" style={{ color: danger ? "#ef4444" : "var(--text-primary)" }}>{label}</div>
        {description && <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{description}</div>}
      </div>
      {right ?? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             style={{ color: "var(--text-muted)", flexShrink: 0 }}>
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      )}
    </div>
  );
}

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; }
export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
      style={{ background: checked ? "var(--krx-blue)" : "var(--border)" }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
        style={{
          background: "#fff",
          left: checked ? "calc(100% - 22px)" : "2px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)"
        }}
      />
    </button>
  );
}
