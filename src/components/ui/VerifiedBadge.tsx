interface VerifiedBadgeProps {
  size?: number;
}

export function VerifiedBadge({ size = 14 }: VerifiedBadgeProps) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full flex-shrink-0"
      style={{ background: "var(--krx-blue)", width: size, height: size }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}
