interface BadgeProps {
  count: number;
  max?: number;
}

export function Badge({ count, max = 99 }: BadgeProps) {
  if (count <= 0) return null;
  return (
    <span
      className="text-white font-bold rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "var(--krx-blue)", fontSize: 9, minWidth: 16, height: 16, padding: "0 4px" }}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}
