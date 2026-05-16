"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp, FriendEntry, OnlineStatus } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import {
  Users, UserPlus, Search, MoreVertical, MessageCircle,
  Pin, PinOff, ShieldBan, UserMinus, User, X, Check,
  ChevronDown, Globe, Clock, SortAsc, Wifi, Star,
  UserX, Send, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ── Status helpers ────────────────────────────────────────────────────────────
function StatusDot({ status }: { status: OnlineStatus }) {
  return (
    <span className={cn(
      "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card",
      status === "online" ? "bg-green-500" : status === "dnd" ? "bg-red-500" : "bg-muted-foreground/50"
    )} />
  );
}

function statusLabel(status: OnlineStatus) {
  return status === "online" ? "В сети" : status === "dnd" ? "Не беспокоить" : "Не в сети";
}
function statusColor(status: OnlineStatus) {
  return status === "online" ? "text-green-500" : status === "dnd" ? "text-red-400" : "text-muted-foreground";
}

// ── Friend Card ───────────────────────────────────────────────────────────────
function FriendCard({ friend }: { friend: FriendEntry }) {
  const { removeFriend, pinFriend, blockUser, pushNotif } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted/50 transition-all relative">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/30 overflow-hidden">
          {friend.avatar
            ? <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg">{friend.name[0]?.toUpperCase()}</div>
          }
        </div>
        <StatusDot status={friend.status} />
        {friend.pinned && <span className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center"><Pin className="w-2.5 h-2.5 text-white" /></span>}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground truncate">{friend.name}</span>
          {friend.level > 0 && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">Ур. {friend.level}</span>}
        </div>
        <div className={cn("text-xs flex items-center gap-1 mt-0.5", statusColor(friend.status))}>
          <span>{statusLabel(friend.status)}</span>
          {friend.activity && <span className="text-muted-foreground">· {friend.activity}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href="/chat"
          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          title="Написать">
          <MessageCircle className="w-4 h-4" />
        </Link>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                <User className="w-4 h-4" /> Профиль
              </Link>
              <button onClick={() => { pinFriend(friend.userId); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                {friend.pinned ? <><PinOff className="w-4 h-4" /> Открепить</> : <><Pin className="w-4 h-4" /> Закрепить</>}
              </button>
              <div className="border-t border-border" />
              <button onClick={() => { blockUser(friend.userId); removeFriend(friend.userId); setMenuOpen(false); pushNotif({ type: "mention", icon: "🚫", title: "Пользователь заблокирован", body: `@${friend.name} заблокирован`, link: "/friends" }); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-yellow-500 hover:bg-yellow-500/10 transition-colors">
                <ShieldBan className="w-4 h-4" /> Заблокировать
              </button>
              <button onClick={() => { removeFriend(friend.userId); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                <UserMinus className="w-4 h-4" /> Удалить из друзей
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Search / Add Friends Modal ────────────────────────────────────────────────
function FindFriendsModal({ onClose }: { onClose: () => void }) {
  const { user, allUsers, friendList, sendFriendRequest, sentRequests, friendRequests, acceptFriendRequest, rejectFriendRequest } = useApp();
  const [tab, setTab] = useState<"recs" | "search" | "incoming">("recs");
  const [query, setQuery] = useState("");

  const friendIds = new Set(friendList.map(f => f.userId));
  const pendingSentTo = new Set(sentRequests.filter(r => r.status === "pending").map(r => r.toId));
  const incoming = friendRequests.filter(r => r.toId === user?.id && r.status === "pending");

  // recommendations = all registered users except self and existing friends
  const recs = allUsers.filter(u => u.id !== user?.id && !friendIds.has(u.id));
  const searchResults = query.trim()
    ? recs.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const displayList = tab === "recs" ? recs : tab === "search" ? searchResults : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> Найти друзей
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: "recs" as const, label: "Рекомендации", icon: Sparkles },
            { id: "search" as const, label: "Поиск", icon: Search },
            { id: "incoming" as const, label: `Заявки${incoming.length > 0 ? ` (${incoming.length})` : ""}`, icon: UserPlus },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn("flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-all",
                  tab === t.id ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground")}>
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Search field */}
        {tab === "search" && (
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Поиск по нику или ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Incoming requests */}
          {tab === "incoming" && (
            incoming.length === 0
              ? <div className="text-center py-12 text-muted-foreground text-sm">Входящих заявок нет</div>
              : <div className="p-3 space-y-2">
                  {incoming.map(req => (
                    <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {req.fromAvatar ? <img src={req.fromAvatar} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{req.fromName}</p>
                        <p className="text-xs text-muted-foreground">{Math.round((Date.now() - req.createdAt) / 60000)} мин. назад</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => acceptFriendRequest(req.id)}
                          className="p-2 bg-green-500/10 text-green-500 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => rejectFriendRequest(req.id)}
                          className="p-2 bg-destructive/10 text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/20 transition-all">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
          )}

          {/* Recs / Search results */}
          {tab !== "incoming" && (
            displayList.length === 0
              ? <div className="text-center py-12 text-muted-foreground text-sm">
                  {tab === "search" && !query.trim() ? "Начните вводить ник" : tab === "search" ? "Никого не найдено" : "Нет рекомендаций — зарегистрируйте ещё один аккаунт для теста"}
                </div>
              : <div className="p-3 space-y-2">
                  {displayList.map(u => {
                    const alreadySent = pendingSentTo.has(u.id);
                    return (
                      <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-all">
                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : <div className="text-primary font-bold">{u.name[0]?.toUpperCase()}</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">{u.name}</p>
                          {u.level > 0 && <p className="text-xs text-muted-foreground">Уровень {u.level}</p>}
                        </div>
                        <button
                          onClick={() => !alreadySent && sendFriendRequest(u.id, u.name, u.avatar)}
                          disabled={alreadySent}
                          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                            alreadySent ? "bg-muted text-muted-foreground cursor-default" : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                          )}>
                          {alreadySent ? <><Check className="w-3.5 h-3.5" /> Отправлено</> : <><UserPlus className="w-3.5 h-3.5" /> Добавить</>}
                        </button>
                      </div>
                    );
                  })}
                </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
type FriendsTab = "all" | "online" | "pinned" | "blocked";
type SortKey = "online" | "alpha" | "level" | "recent";

export default function FriendsPage() {
  const { isAuthenticated, user, friendList, friendRequests, unblockUser, pushNotif } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<FriendsTab>("all");
  const [sort, setSort] = useState<SortKey>("online");
  const [search, setSearch] = useState("");
  const [showFind, setShowFind] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);
  if (!isAuthenticated || !user) return null;

  const blocked: string[] = user.blockedUsers || [];
  const incomingCount = friendRequests.filter(r => r.toId === user.id && r.status === "pending").length;

  // Filter
  let list = friendList.filter(f =>
    !search.trim() || f.name.toLowerCase().includes(search.toLowerCase())
  );
  if (tab === "online")  list = list.filter(f => f.status === "online");
  if (tab === "pinned")  list = list.filter(f => f.pinned);
  if (tab === "blocked") list = []; // shown separately

  // Sort
  list = [...list].sort((a, b) => {
    if (sort === "online") {
      const order: Record<OnlineStatus, number> = { online: 0, dnd: 1, offline: 2 };
      return order[a.status] - order[b.status];
    }
    if (sort === "alpha")  return a.name.localeCompare(b.name);
    if (sort === "level")  return b.level - a.level;
    if (sort === "recent") return b.addedAt - a.addedAt;
    return 0;
  });

  const TABS = [
    { id: "all"     as FriendsTab, label: "Все",          count: friendList.length },
    { id: "online"  as FriendsTab, label: "Онлайн",       count: friendList.filter(f => f.status === "online").length },
    { id: "pinned"  as FriendsTab, label: "Закреплённые", count: friendList.filter(f => f.pinned).length },
    { id: "blocked" as FriendsTab, label: "Чёрный список", count: blocked.length },
  ];

  const SORTS: { id: SortKey; label: string }[] = [
    { id: "online", label: "По онлайн" },
    { id: "alpha",  label: "По алфавиту" },
    { id: "level",  label: "По уровню" },
    { id: "recent", label: "По дате" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl"><Users className="w-7 h-7 text-primary" /></div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Друзья</h1>
                <p className="text-sm text-muted-foreground">
                  {friendList.length} друзей · {friendList.filter(f => f.status === "online").length} онлайн
                  {incomingCount > 0 && <span className="text-primary font-medium"> · {incomingCount} заявок</span>}
                </p>
              </div>
            </div>
            <button onClick={() => setShowFind(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20">
              <UserPlus className="w-4 h-4" /> Найти друзей
              {incomingCount > 0 && (
                <span className="ml-1 w-5 h-5 bg-white/20 rounded-full text-xs font-bold flex items-center justify-center">{incomingCount}</span>
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-4">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn("flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all",
                  tab === t.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground")}>
                {t.label}
                {t.count > 0 && (
                  <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-bold",
                    tab === t.id ? "bg-white/20" : "bg-muted text-muted-foreground")}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search + Sort bar */}
          {tab !== "blocked" && (
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Поиск по нику..."
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              </div>
              <div className="relative">
                <button onClick={() => setShowSort(!showSort)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 transition-all">
                  <SortAsc className="w-4 h-4" />
                  {SORTS.find(s => s.id === sort)?.label}
                  <ChevronDown className={cn("w-4 h-4 transition-transform", showSort && "rotate-180")} />
                </button>
                {showSort && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-xl shadow-xl z-10 overflow-hidden">
                    {SORTS.map(s => (
                      <button key={s.id} onClick={() => { setSort(s.id); setShowSort(false); }}
                        className={cn("w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted",
                          sort === s.id ? "text-primary font-medium" : "text-foreground")}>
                        {s.id === sort && "✓ "}{s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blocked tab */}
          {tab === "blocked" && (
            blocked.length === 0
              ? <EmptyState icon={<ShieldBan className="w-12 h-12 text-muted-foreground/30" />} title="Чёрный список пуст" desc="Заблокированные пользователи появятся здесь" />
              : <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
                  {blocked.map(uid => (
                    <div key={uid} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <UserX className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className="flex-1 text-sm text-muted-foreground font-mono">{uid}</span>
                      <button onClick={() => unblockUser(uid)}
                        className="px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:border-green-500/40 hover:text-green-500 transition-all">
                        Разблокировать
                      </button>
                    </div>
                  ))}
                </div>
          )}

          {/* Friends list */}
          {tab !== "blocked" && (
            list.length === 0
              ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Users className="w-12 h-12 text-primary/30" />
                  </div>
                  <p className="text-xl font-bold text-foreground mb-2">
                    {search ? "Никого не найдено" : tab === "online" ? "Все друзья офлайн" : tab === "pinned" ? "Нет закреплённых" : "У вас пока нет друзей"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                    {search ? "Попробуйте другое имя" : tab === "all" ? "Найдите знакомых или добавьте кого-то из рекомендаций" : ""}
                  </p>
                  {tab === "all" && !search && (
                    <button onClick={() => setShowFind(true)}
                      className="px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/25">
                      <UserPlus className="w-5 h-5 inline mr-2" /> Найти друзей
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  {/* Online section header */}
                  {tab === "all" && list.some(f => f.status === "online") && (
                    <div className="px-4 pt-3 pb-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Онлайн — {list.filter(f => f.status === "online").length}
                      </p>
                    </div>
                  )}
                  {list.filter(f => tab !== "all" || f.status === "online").map(f => <FriendCard key={f.userId} friend={f} />)}

                  {/* Offline section */}
                  {tab === "all" && list.some(f => f.status !== "online") && (
                    <>
                      <div className="px-4 pt-3 pb-1 border-t border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full" />
                          Не в сети — {list.filter(f => f.status !== "online").length}
                        </p>
                      </div>
                      {list.filter(f => f.status !== "online").map(f => <FriendCard key={f.userId} friend={f} />)}
                    </>
                  )}
                </div>
              )
          )}
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
      {showFind && <FindFriendsModal onClose={() => setShowFind(false)} />}
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      <div className="w-20 h-20 bg-card border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">{icon}</div>
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="text-sm mt-1">{desc}</p>
    </div>
  );
}
