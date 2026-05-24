export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

interface TimeLabels {
  justNow: string;
  minutes: string;
  hours: string;
  days: string;
}

export function formatTimeAgo(iso: string, labels: TimeLabels): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return labels.justNow;
  if (mins < 60) return `${mins} ${labels.minutes}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ${labels.hours}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${labels.days}`;
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}
