"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { MessageCircle, Search, Send, Image, Smile, Phone, Video, MoreVertical } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const chats = [
  { id: 1, name: "Alex_Pro", avatar: "https://i.pravatar.cc/50?img=1", lastMessage: "Го катку?", time: "2 мин", online: true, unread: 3 },
  { id: 2, name: "CyberNinja", avatar: "https://i.pravatar.cc/50?img=2", lastMessage: "Топ игра была!", time: "15 мин", online: true, unread: 0 },
  { id: 3, name: "GameMaster", avatar: "https://i.pravatar.cc/50?img=3", lastMessage: "Увидимся завтра", time: "1 час", online: false, unread: 0 },
  { id: 4, name: "ProGamer_X", avatar: "https://i.pravatar.cc/50?img=4", lastMessage: "Отправил тебе скрин", time: "3 часа", online: true, unread: 1 },
];

const messages = [
  { id: 1, sender: "Alex_Pro", text: "Привет! Как дела?", time: "14:30", isMine: false },
  { id: 2, sender: "me", text: "Привет! Всё отлично, играю", time: "14:31", isMine: true },
  { id: 3, sender: "Alex_Pro", text: "Круто! Го катку в CS2?", time: "14:32", isMine: false },
  { id: 4, sender: "me", text: "Давай, через 10 минут буду готов", time: "14:33", isMine: true },
  { id: 5, sender: "Alex_Pro", text: "Го катку?", time: "14:35", isMine: false },
];

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex pb-20">
        {/* Chat List */}
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Сообщения</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors",
                  activeChat.id === chat.id && "bg-primary/10 border-l-2 border-primary"
                )}
              >
                <div className="relative">
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full" />
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full" />
                {activeChat.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{activeChat.name}</h2>
                <p className="text-xs text-muted-foreground">{activeChat.online ? "В сети" : "Не в сети"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Video className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex", msg.isMine ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[70%] px-4 py-2 rounded-2xl",
                  msg.isMine 
                    ? "bg-primary text-primary-foreground rounded-br-sm" 
                    : "bg-card border border-border text-foreground rounded-bl-sm"
                )}>
                  <p>{msg.text}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    msg.isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Image className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Smile className="w-5 h-5 text-muted-foreground" />
              </button>
              <input
                type="text"
                placeholder="Написать сообщение..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button className="p-3 bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                <Send className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
}
