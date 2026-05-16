"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, ChatConversation, ChatMessage } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import {
  MessageCircle, Search, Plus, X, Send, Paperclip,
  Smile, Mic, MoreVertical, Pin, BellOff, Trash2,
  ShieldBan, LogOut, Users, Edit3, Check, Reply,
  Copy, Image as ImageIcon, Video, File, BarChart2,
  ChevronLeft, Settings, UserPlus, Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── helpers ──────────────────────────────────────────────────────────────────
function timeAgo(ms: number) {
  const d = Date.now() - ms;
  const m = Math.floor(d / 60000);
  if (m < 1) return "сейчас";
  if (m < 60) return `${m}м`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}ч`;
  return `${Math.floor(h / 24)}д`;
}
function fullTime(ms: number) {
  return new Date(ms).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
}

const REACTION_EMOJIS = ["❤️", "👍", "😂", "🔥", "😮", "👎"];

// ─── Conversation List Item ───────────────────────────────────────────────────
function ConvItem({
  conv, active, onClick, userId,
  onPin, onMute, onDelete, onBlock, onLeave,
}: {
  conv: ChatConversation; active: boolean; onClick: () => void; userId: string;
  onPin: () => void; onMute: () => void; onDelete: () => void;
  onBlock: () => void; onLeave: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isPinned = conv.pinnedBy.includes(userId);
  const isMuted  = conv.mutedBy.includes(userId);
  const last = conv.messages[conv.messages.length - 1];
  const unread = conv.messages.filter(m => m.authorId !== userId && !m.deletedFor.includes(userId)).length; // simplified

  useEffect(() => {
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={cn(
      "group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all",
      active ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/60 border border-transparent"
    )} onClick={onClick}>
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-primary/20 border border-primary/20 flex items-center justify-center">
          {conv.avatar
            ? <img src={conv.avatar} className="w-full h-full object-cover" />
            : conv.type === "group"
              ? <Users className="w-5 h-5 text-primary" />
              : <div className="text-primary font-bold">{conv.name[0]?.toUpperCase()}</div>
          }
        </div>
        {conv.type === "personal" && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className={cn("text-sm font-semibold truncate", active ? "text-primary" : "text-foreground")}>
            {isPinned && "📌 "}{conv.name}
          </p>
          <span className="text-xs text-muted-foreground flex-shrink-0">{last ? timeAgo(last.createdAt) : ""}</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs text-muted-foreground truncate">
            {last ? (last.mediaType === "audio" ? "🎤 Голосовое" : last.mediaType === "image" ? "📷 Фото" : last.text || "…") : "Нет сообщений"}
          </p>
          {isMuted && <BellOff className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
        </div>
      </div>

      {/* Three-dots menu */}
      <div className="relative" ref={menuRef}>
        <button onClick={e => { e.stopPropagation(); setMenu(!menu); }}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all text-muted-foreground hover:text-foreground">
          <MoreVertical className="w-4 h-4" />
        </button>
        {menu && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-xl z-30 overflow-hidden text-sm">
            <button onClick={e => { e.stopPropagation(); onPin(); setMenu(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-muted text-foreground transition-colors">
              <Pin className="w-4 h-4" /> {isPinned ? "Открепить" : "Закрепить"}
            </button>
            <button onClick={e => { e.stopPropagation(); onMute(); setMenu(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-muted text-foreground transition-colors">
              <BellOff className="w-4 h-4" /> {isMuted ? "Вкл. уведомления" : "Откл. уведомления"}
            </button>
            <div className="border-t border-border" />
            {conv.type === "personal" && (
              <button onClick={e => { e.stopPropagation(); onBlock(); setMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-yellow-500/10 text-yellow-500 transition-colors">
                <ShieldBan className="w-4 h-4" /> Заблокировать
              </button>
            )}
            {conv.type === "group" && (
              <button onClick={e => { e.stopPropagation(); onLeave(); setMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-yellow-500/10 text-yellow-500 transition-colors">
                <LogOut className="w-4 h-4" /> Выйти из группы
              </button>
            )}
            <button onClick={e => { e.stopPropagation(); onDelete(); setMenu(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-destructive/10 text-destructive transition-colors">
              <Trash2 className="w-4 h-4" /> Удалить чат
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({
  msg, isOwn, convId,
  onReply, onEdit, onDelete, onReact,
}: {
  msg: ChatMessage; isOwn: boolean; convId: number;
  onReply: (m: ChatMessage) => void;
  onEdit: (m: ChatMessage) => void;
  onDelete: (id: number) => void;
  onReact: (msgId: number, emoji: string) => void;
}) {
  const [menu, setMenu] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(false); setEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={cn("group flex gap-2 mb-1", isOwn ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden flex-shrink-0 self-end flex items-center justify-center">
          {msg.authorAvatar
            ? <img src={msg.authorAvatar} className="w-full h-full object-cover" />
            : <span className="text-primary font-bold text-xs">{msg.authorName[0]?.toUpperCase()}</span>
          }
        </div>
      )}

      <div className={cn("max-w-[70%] flex flex-col", isOwn ? "items-end" : "items-start")}>
        {/* Author name (groups) */}
        {!isOwn && <p className="text-xs text-muted-foreground mb-1 ml-1">{msg.authorName}</p>}

        {/* Reply preview */}
        {msg.replyTo && (
          <div className={cn("text-xs px-3 py-1.5 rounded-lg mb-1 border-l-2 border-primary bg-muted/50",
            isOwn ? "text-right" : "text-left")}>
            <span className="text-primary font-medium">{msg.replyTo.authorName}: </span>
            <span className="text-muted-foreground">{msg.replyTo.text.slice(0, 60)}</span>
          </div>
        )}

        {/* Bubble */}
        <div ref={menuRef} className="relative">
          <div
            className={cn(
              "relative px-4 py-2.5 rounded-2xl text-sm transition-all",
              isOwn
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-card border border-border text-foreground rounded-bl-md",
              "cursor-pointer select-none"
            )}
            onContextMenu={e => { e.preventDefault(); setMenu(true); }}
            onClick={() => setMenu(!menu)}
          >
            {/* Media */}
            {msg.mediaType === "image" && msg.mediaUrl && (
              <img src={msg.mediaUrl} className="max-w-xs rounded-xl mb-2 object-cover" />
            )}
            {msg.mediaType === "video" && msg.mediaUrl && (
              <video src={msg.mediaUrl} controls className="max-w-xs rounded-xl mb-2" />
            )}
            {msg.mediaType === "audio" && msg.mediaUrl && (
              <div className="flex items-center gap-3 min-w-[200px] mb-1">
                <Mic className="w-4 h-4 flex-shrink-0" />
                <audio src={msg.mediaUrl} controls className="h-8 flex-1" style={{ filter: isOwn ? "invert(1) brightness(2)" : undefined }} />
                <span className="text-xs opacity-70">{msg.audioDuration || "0:00"}</span>
              </div>
            )}

            {/* Text */}
            {msg.text && <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}

            {/* Meta */}
            <div className={cn("flex items-center gap-1.5 mt-1", isOwn ? "justify-end" : "justify-start")}>
              <span className={cn("text-[10px]", isOwn ? "text-primary-foreground/60" : "text-muted-foreground")}>
                {fullTime(msg.createdAt)}{msg.edited ? " · изм." : ""}
              </span>
            </div>

            {/* Context menu */}
            {menu && (
              <div className={cn("absolute bottom-full mb-1 z-30 bg-card border border-border rounded-xl shadow-xl overflow-hidden text-sm w-44",
                isOwn ? "right-0" : "left-0")}>
                {/* Emoji reactions */}
                <div className="flex gap-1 px-2 py-2 border-b border-border">
                  {REACTION_EMOJIS.map(e => (
                    <button key={e} onClick={() => { onReact(msg.id, e); setMenu(false); }}
                      className="text-lg hover:scale-125 transition-transform">{e}</button>
                  ))}
                </div>
                <button onClick={() => { onReply(msg); setMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-muted text-foreground transition-colors">
                  <Reply className="w-4 h-4" /> Ответить
                </button>
                {isOwn && (
                  <button onClick={() => { onEdit(msg); setMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-muted text-foreground transition-colors">
                    <Edit3 className="w-4 h-4" /> Редактировать
                  </button>
                )}
                <button onClick={() => { navigator.clipboard?.writeText(msg.text); setMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-muted text-foreground transition-colors">
                  <Copy className="w-4 h-4" /> Копировать
                </button>
                {isOwn && (
                  <button onClick={() => { onDelete(msg.id); setMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-destructive/10 text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" /> Удалить
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Reactions */}
          {msg.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {msg.reactions.map(r => (
                <button key={r.emoji} onClick={() => onReact(msg.id, r.emoji)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-full text-xs border border-border hover:border-primary/40 transition-all hover:scale-110">
                  <span>{r.emoji}</span>
                  <span className="text-muted-foreground">{r.userIds.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Create Group Modal ───────────────────────────────────────────────────────
function CreateGroupModal({ onClose, onCreate }: { onClose: () => void; onCreate: (conv: ChatConversation) => void }) {
  const { user, friendList, createGroupChat } = useApp();
  const imgRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (uid: string) => setSelected(prev => prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]);

  const submit = () => {
    if (!name.trim() || selected.length === 0) return;
    const selectedFriends = friendList.filter(f => selected.includes(f.userId));
    const conv = createGroupChat(name.trim(), avatar, selected, selectedFriends.map(f => f.name));
    onCreate(conv); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-foreground text-lg flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Новая группа</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary/40 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => imgRef.current?.click()}>
              {avatar ? <img src={avatar} className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-primary/60" />}
            </div>
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-1.5">Название группы</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Моя группа"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>
          <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setAvatar(r.result as string); r.readAsDataURL(f); } }} />

          <div>
            <label className="block text-xs text-muted-foreground mb-2">Добавить участников ({selected.length} выбрано)</label>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {friendList.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Нет друзей для добавления</p>}
              {friendList.map(f => (
                <button key={f.userId} onClick={() => toggle(f.userId)}
                  className={cn("w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border",
                    selected.includes(f.userId) ? "bg-primary/10 border-primary/40" : "bg-muted/30 border-transparent hover:bg-muted/60")}>
                  <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {f.avatar ? <img src={f.avatar} className="w-full h-full object-cover" /> : <span className="text-primary font-bold text-xs">{f.name[0]?.toUpperCase()}</span>}
                  </div>
                  <span className="text-sm font-medium text-foreground flex-1 text-left">{f.name}</span>
                  {selected.includes(f.userId) && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80">Отмена</button>
            <button onClick={submit} disabled={!name.trim() || selected.length === 0}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-40">
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chat Window ──────────────────────────────────────────────────────────────
function ChatWindow({ conv, onBack }: { conv: ChatConversation; onBack: () => void }) {
  const { user, sendMessage, editMessage, deleteMessage, reactToMessage, removeMember, renameGroup, updateGroupAvatar, blockUser } = useApp();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null);
  const [showAttach, setShowAttach] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [editGroupName, setEditGroupName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(conv.name);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const isOwner = user?.id === conv.createdBy;
  const EMOJIS = ["😂","❤️","🔥","👍","😮","💯","😎","🎮","✨","🚀","👀","💪","😅","🤝","🙏"];

  useEffect(() => { chatRef.current?.scrollTo({ top: 99999 }); }, [conv.messages.length]);

  const handleSend = () => {
    if (!text.trim() && !editingMsg) return;
    if (editingMsg) {
      editMessage(conv.id, editingMsg.id, text.trim());
      setEditingMsg(null);
    } else {
      sendMessage(conv.id, text.trim(), null, null, replyTo ? { id: replyTo.id, authorName: replyTo.authorName, text: replyTo.text } : null);
      setReplyTo(null);
    }
    setText("");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => sendMessage(conv.id, "", r.result as string, type, null);
    r.readAsDataURL(f); e.target.value = "";
  };

  const handleGroupAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => updateGroupAvatar(conv.id, r.result as string); r.readAsDataURL(f); e.target.value = "";
  };

  const visibleMessages = conv.messages.filter(m => !m.deletedFor.includes(user?.id || ""));
  const convName = conv.type === "personal" ? conv.name : conv.name;
  const otherMemberId = conv.type === "personal" ? conv.memberIds.find(id => id !== user?.id) : null;

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors xl:hidden">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        <button className="flex items-center gap-3 flex-1 min-w-0 hover:bg-muted/50 rounded-xl p-1.5 transition-all" onClick={() => setShowInfo(!showInfo)}>
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden border border-primary/20 flex items-center justify-center">
              {conv.avatar ? <img src={conv.avatar} className="w-full h-full object-cover" />
                : conv.type === "group" ? <Users className="w-5 h-5 text-primary" />
                : <div className="text-primary font-bold">{conv.name[0]?.toUpperCase()}</div>}
            </div>
            {conv.type === "personal" && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />}
          </div>
          <div className="text-left min-w-0">
            <p className="font-semibold text-foreground text-sm">{conv.name}</p>
            <p className="text-xs text-muted-foreground">
              {conv.type === "group" ? `${conv.memberIds.length} участников` : "В сети"}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
            <Search className="w-4 h-4" />
          </button>
          <button onClick={() => setShowInfo(!showInfo)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Messages */}
        <div className="flex-1 flex flex-col min-h-0">
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-1">
            {visibleMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-16">
                <MessageCircle className="w-16 h-16 opacity-10 mb-4" />
                <p className="text-base font-medium">Начните общение!</p>
                <p className="text-sm mt-1">Отправьте первое сообщение</p>
              </div>
            )}
            {visibleMessages.map(msg => (
              <MessageBubble
                key={msg.id} msg={msg} convId={conv.id}
                isOwn={msg.authorId === user?.id}
                onReply={m => { setReplyTo(m); setEditingMsg(null); }}
                onEdit={m => { setEditingMsg(m); setText(m.text); setReplyTo(null); }}
                onDelete={id => deleteMessage(conv.id, id)}
                onReact={(msgId, emoji) => reactToMessage(conv.id, msgId, emoji)}
              />
            ))}
          </div>

          {/* Reply/Edit preview */}
          {(replyTo || editingMsg) && (
            <div className="mx-4 mb-2 flex items-start gap-3 px-4 py-2 bg-muted/60 rounded-xl border-l-2 border-primary">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary font-medium mb-0.5">
                  {editingMsg ? "✏️ Редактирование" : `↩️ Ответ на @${replyTo?.authorName}`}
                </p>
                <p className="text-xs text-muted-foreground truncate">{editingMsg?.text || replyTo?.text}</p>
              </div>
              <button onClick={() => { setReplyTo(null); setEditingMsg(null); setText(""); }}
                className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Emoji panel */}
          {showEmoji && (
            <div className="mx-4 mb-2 p-3 bg-card border border-border rounded-xl">
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setText(prev => prev + e)} className="text-xl hover:scale-125 transition-transform">{e}</button>
                ))}
              </div>
            </div>
          )}

          {/* Attachment panel */}
          {showAttach && (
            <div className="mx-4 mb-2 flex gap-3 p-3 bg-card border border-border rounded-xl">
              {[
                { label: "Фото", icon: ImageIcon, color: "text-blue-500", action: () => imgRef.current?.click() },
                { label: "Видео", icon: Video, color: "text-purple-500", action: () => videoRef.current?.click() },
              ].map(item => (
                <button key={item.label} onClick={() => { item.action(); setShowAttach(false); }}
                  className="flex flex-col items-center gap-1.5 px-4 py-3 bg-muted hover:bg-muted/80 rounded-xl transition-all flex-1 group">
                  <item.icon className={cn("w-6 h-6", item.color)} />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-end gap-2 px-4 pb-4 pt-2 flex-shrink-0">
            <button onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }}
              className={cn("p-2.5 rounded-xl transition-all flex-shrink-0", showAttach ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/10")}>
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Написать сообщение..."
                rows={1}
                className="w-full px-4 py-3 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none overflow-hidden leading-relaxed"
                style={{ maxHeight: "120px" }}
                onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 120) + "px"; }}
              />
            </div>

            <button onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }}
              className={cn("p-2.5 rounded-xl transition-all flex-shrink-0", showEmoji ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/10")}>
              <Smile className="w-5 h-5" />
            </button>

            <button onClick={handleSend} disabled={!text.trim()}
              className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40 flex-shrink-0">
              <Send className="w-5 h-5" />
            </button>
          </div>

          <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e, "image")} />
          <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={e => handleFile(e, "video")} />
        </div>

        {/* Info panel */}
        {showInfo && (
          <div className="w-72 border-l border-border bg-card/50 flex flex-col overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">Информация</h3>
              <button onClick={() => setShowInfo(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>

            {/* Group header */}
            <div className="p-4 flex flex-col items-center gap-3 border-b border-border">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/20 overflow-hidden border-2 border-primary/30 flex items-center justify-center">
                  {conv.avatar ? <img src={conv.avatar} className="w-full h-full object-cover" />
                    : conv.type === "group" ? <Users className="w-10 h-10 text-primary" />
                    : <div className="text-primary font-bold text-3xl">{conv.name[0]?.toUpperCase()}</div>}
                </div>
                {isOwner && conv.type === "group" && (
                  <>
                    <button onClick={() => imgRef.current?.click()}
                      className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-card">
                      <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                    </button>
                    <input type="file" accept="image/*" className="hidden" ref={imgRef} onChange={handleGroupAvatarChange} />
                  </>
                )}
              </div>
              {editGroupName && isOwner ? (
                <div className="flex gap-2 w-full">
                  <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" />
                  <button onClick={() => { renameGroup(conv.id, newGroupName); setEditGroupName(false); }}
                    className="p-2 bg-primary text-primary-foreground rounded-lg"><Check className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground">{conv.name}</p>
                  {isOwner && conv.type === "group" && (
                    <button onClick={() => setEditGroupName(true)} className="text-muted-foreground hover:text-primary"><Edit3 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              )}
              {conv.type === "personal" && (
                <Link href="/profile" className="text-sm text-primary hover:underline">Перейти в профиль</Link>
              )}
            </div>

            {/* Members */}
            {conv.type === "group" && (
              <div className="p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Участники · {conv.memberIds.length}/200
                </p>
                <div className="space-y-2">
                  {conv.memberNames.map((name, i) => (
                    <div key={conv.memberIds[i]} className="flex items-center gap-2.5 group">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                        {name[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm text-foreground flex-1">{name}</span>
                      {conv.adminIds.includes(conv.memberIds[i]) && (
                        <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">Адм.</span>
                      )}
                      {isOwner && conv.memberIds[i] !== user?.id && (
                        <button onClick={() => removeMember(conv.id, conv.memberIds[i])}
                          className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:bg-destructive/10 rounded transition-all">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type ChatTab = "all" | "online" | "groups" | "pinned";

export default function ChatPage() {
  const { isAuthenticated, user, conversations, pinConversation, muteConversation, deleteConversation, blockUser, removeMember, createPersonalChat } = useApp();
  const router = useRouter();
  const [activeConv, setActiveConv] = useState<ChatConversation | null>(null);
  const [tab, setTab] = useState<ChatTab>("all");
  const [search, setSearch] = useState("");
  const [showNewGroup, setShowNewGroup] = useState(false);

  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);
  if (!isAuthenticated || !user) return null;

  // Get live conv (always fresh from state)
  const liveConv = activeConv ? conversations.find(c => c.id === activeConv.id) || activeConv : null;

  let list = conversations;
  if (tab === "online")  list = list.filter(c => c.type === "personal");
  if (tab === "groups")  list = list.filter(c => c.type === "group");
  if (tab === "pinned")  list = list.filter(c => c.pinnedBy.includes(user.id));
  if (search.trim())     list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  // Sort: pinned first, then by last message time
  list = [...list].sort((a, b) => {
    const aPinned = a.pinnedBy.includes(user.id) ? 1 : 0;
    const bPinned = b.pinnedBy.includes(user.id) ? 1 : 0;
    if (bPinned !== aPinned) return bPinned - aPinned;
    const aTime = a.messages[a.messages.length - 1]?.createdAt || a.createdAt;
    const bTime = b.messages[b.messages.length - 1]?.createdAt || b.createdAt;
    return bTime - aTime;
  });

  const TABS: { id: ChatTab; label: string }[] = [
    { id: "all",    label: "Все" },
    { id: "online", label: "Личные" },
    { id: "groups", label: "Группы" },
    { id: "pinned", label: "Закреп." },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 ml-64 flex overflow-hidden" style={{ height: "100vh" }}>
        {/* Left: conversation list */}
        <div className={cn(
          "w-80 border-r border-border bg-card flex flex-col flex-shrink-0",
          liveConv ? "hidden xl:flex" : "flex"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" /> Сообщения
              </h1>
              <button onClick={() => setShowNewGroup(true)}
                className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all" title="Новая группа">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск чатов..."
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-2 border-b border-border">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn("flex-1 py-1.5 rounded-lg text-xs font-medium transition-all",
                  tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                {t.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2">
            {list.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">Нет чатов</p>
                <p className="text-xs mt-1">Напишите другу или создайте группу</p>
              </div>
            ) : list.map(conv => (
              <ConvItem key={conv.id} conv={conv} userId={user.id}
                active={liveConv?.id === conv.id}
                onClick={() => setActiveConv(conv)}
                onPin={() => pinConversation(conv.id)}
                onMute={() => muteConversation(conv.id)}
                onDelete={() => { deleteConversation(conv.id); if (liveConv?.id === conv.id) setActiveConv(null); }}
                onBlock={() => { const otherId = conv.memberIds.find(id => id !== user.id); if (otherId) blockUser(otherId); deleteConversation(conv.id); setActiveConv(null); }}
                onLeave={() => { removeMember(conv.id, user.id); setActiveConv(null); }}
              />
            ))}
          </div>
        </div>

        {/* Right: chat or empty */}
        {liveConv
          ? <ChatWindow conv={liveConv} onBack={() => setActiveConv(null)} />
          : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-24 h-24 bg-primary/5 border border-primary/10 rounded-3xl flex items-center justify-center mb-6">
                <MessageCircle className="w-12 h-12 text-primary/30" />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">Выберите чат</p>
              <p className="text-sm mb-6">Или создайте новый, чтобы начать общение</p>
              <button onClick={() => setShowNewGroup(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-95">
                <Users className="w-4 h-4" /> Создать группу
              </button>
            </div>
          )
        }
      </div>

      <MusicPlayer />
      {showNewGroup && <CreateGroupModal onClose={() => setShowNewGroup(false)} onCreate={conv => { setActiveConv(conv); }} />}
    </div>
  );
}
