"use client";

interface SearchInputProps {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", className = "" }: SearchInputProps) {
  return (
    <div className={`flex items-center gap-2 glass rounded-xl px-3 py-2.5 ${className}`}
         style={{ background: "rgba(255,255,255,0.04)" }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="bg-transparent text-sm flex-1 placeholder:text-gray-600"
        placeholder={placeholder}
        style={{ color: "var(--text-primary)" }}
      />
    </div>
  );
}
