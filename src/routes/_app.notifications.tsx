import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, UserPlus, AtSign, Bell } from "lucide-react";

export const Route = createFileRoute("/_app/notifications")({ component: NotificationsPage });

const items = [
  { icon: Heart, who: "nova", text: "liked your post", time: "2m" },
  { icon: MessageCircle, who: "kai", text: "commented: \"this is gold\"", time: "12m" },
  { icon: UserPlus, who: "mira.lab", text: "started following you", time: "1h" },
  { icon: AtSign, who: "axel", text: "mentioned you in a reply", time: "3h" },
  { icon: Bell, who: "KRX", text: "Welcome to KRX. Your account is active.", time: "1d" },
];

function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Notifications</h1>
      <div className="krx-card divide-y divide-border">
        {items.map((n, i) => (
          <div key={i} className="flex items-center gap-3 p-4 hover:bg-accent/40 transition">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><n.icon className="h-4 w-4" /></div>
            <div className="flex-1 text-sm">
              <span className="font-medium">@{n.who}</span>{" "}
              <span className="text-muted-foreground">{n.text}</span>
            </div>
            <span className="text-xs text-muted-foreground">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
