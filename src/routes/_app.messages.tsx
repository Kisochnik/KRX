import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Smile, Image as ImageIcon, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/messages")({ component: MessagesPage });

const chats = [
  { id: 1, name: "nova", last: "see you at the launch", time: "2m", unread: 2 },
  { id: 2, name: "kai", last: "new track is up", time: "1h", unread: 0 },
  { id: 3, name: "design crew", last: "axel: pushed the new tokens", time: "3h", unread: 5, group: true },
  { id: 4, name: "mira", last: "❤️", time: "1d", unread: 0 },
];

const messages = [
  { from: "them", text: "yo, you up?", time: "10:24" },
  { from: "me", text: "always. what's good?", time: "10:25" },
  { from: "them", text: "see you at the launch", time: "10:26" },
];

function MessagesPage() {
  const [active, setActive] = useState(1);
  const activeChat = chats.find((c) => c.id === active)!;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex">
      {/* List */}
      <aside className="w-full sm:w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-bold">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`w-full flex items-center gap-3 p-3 text-left transition border-b border-border/50
                ${active === c.id ? "bg-accent/60" : "hover:bg-accent/30"}`}
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-foreground/40 to-foreground/10 border border-border shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm truncate">{c.name}</p>
                  <span className="text-[11px] text-muted-foreground shrink-0">{c.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.last}</p>
              </div>
              {c.unread > 0 && (
                <span className="h-5 min-w-5 px-1.5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Conversation */}
      <section className="hidden sm:flex flex-1 flex-col">
        <header className="h-14 px-4 border-b border-border flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-foreground/40 to-foreground/10 border border-border" />
          <div>
            <p className="text-sm font-semibold">{activeChat.name}</p>
            <p className="text-[11px] text-muted-foreground">online</p>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm
                ${m.from === "me" ? "bg-foreground text-background rounded-br-md" : "bg-muted rounded-bl-md"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground"><ImageIcon className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground"><Smile className="h-4 w-4" /></Button>
          <Input placeholder="Message" className="h-10 rounded-full bg-muted/40 border-transparent" />
          <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground"><Mic className="h-4 w-4" /></Button>
          <Button size="icon" className="rounded-full"><Send className="h-4 w-4" /></Button>
        </div>
      </section>
    </div>
  );
}
