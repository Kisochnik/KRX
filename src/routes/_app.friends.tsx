import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, UserMinus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/friends")({ component: FriendsPage });

const friends = [
  { name: "nova", handle: "@nova_x", online: true },
  { name: "kai", handle: "@kai", online: true },
  { name: "mira", handle: "@mira.lab", online: false },
  { name: "axel", handle: "@axel", online: true },
  { name: "june", handle: "@june", online: false },
  { name: "ren", handle: "@ren", online: true },
];

function FriendsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Friends</h1>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search people" className="pl-9 h-10 rounded-xl bg-muted/40 border-transparent" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {friends.map((f) => (
          <div key={f.handle} className="krx-card krx-card-hover p-4 flex items-center gap-3">
            <div className="relative">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-foreground/40 to-foreground/10 border border-border" />
              {f.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-foreground border-2 border-background" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.handle}</p>
            </div>
            <Button size="icon" variant="ghost" className="rounded-full"><UserMinus className="h-4 w-4" /></Button>
            <Button size="icon" className="rounded-full"><UserPlus className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
