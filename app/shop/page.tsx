"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, ShopItem, GAME_ADMINS } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import {
  ShoppingBag, Coins, Star, Sparkles, Frame, User, Image,
  Play, Type, Lock, Plus, X, Search, SlidersHorizontal,
  Gift, Trash2, AlertCircle, CheckCircle, Clock, Tag,
  ShoppingCart, Package, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",      label: "Все",             icon: ShoppingBag },
  { id: "avatar",   label: "Аватарки",        icon: User },
  { id: "banner",   label: "Баннеры",         icon: Image },
  { id: "wallpaper",label: "Обои",            icon: Play },
  { id: "frame",    label: "Рамки",           icon: Frame },
  { id: "nickcolor",label: "Цвет ника",       icon: Type },
  { id: "effect",   label: "Эффекты профиля", icon: Sparkles },
] as const;

const TYPE_LABELS: Record<ShopItem["type"], string> = {
  avatar: "Аватарка", banner: "Баннер", wallpaper: "Обои",
  frame: "Рамка", nickcolor: "Цвет ника", effect: "Эффект профиля",
};

function timeLeft(until: number) {
  const d = until - Date.now();
  if (d <= 0) return null;
  const h = Math.floor(d / 3600000);
  const m = Math.floor((d % 3600000) / 60000);
  return h > 0 ? `${h}ч ${m}м` : `${m}м`;
}

// ─── Add Item Modal (Admin) ───────────────────────────────────────────────────
function AddItemModal({ onClose }: { onClose: () => void }) {
  const { addShopItem } = useApp();
  const imgRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<ShopItem["type"]>("avatar");
  const [price, setPrice] = useState("");
  const [minLevel, setMinLevel] = useState("0");
  const [stock, setStock] = useState("");
  const [adminOnly, setAdminOnly] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountHours, setDiscountHours] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setImageUrl(r.result as string); r.readAsDataURL(f); e.target.value = "";
  };

  const submit = () => {
    if (!name.trim() || !price) { setErr("Заполните название и цену"); return; }
    addShopItem({
      name: name.trim(), type, price: parseInt(price) || 0,
      discountPrice: discountPrice ? parseInt(discountPrice) : null,
      discountUntil: discountHours ? Date.now() + parseInt(discountHours) * 3600000 : null,
      minLevel: parseInt(minLevel) || 0,
      imageUrl: imageUrl || null, isAnimated, adminOnly,
      stock: stock ? parseInt(stock) : null,
    });
    onClose();
  };

  const inputCls = "w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> Добавить товар
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">
          {err && <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3"><AlertCircle className="w-4 h-4" /> {err}</div>}

          {/* Image preview */}
          <div className="flex gap-4 items-start">
            <div className="w-24 h-24 rounded-xl bg-primary/10 border-2 border-dashed border-primary/30 overflow-hidden flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors flex-shrink-0"
              onClick={() => imgRef.current?.click()}>
              {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <Image className="w-8 h-8 text-primary/40" />}
            </div>
            <div className="flex-1 space-y-2">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Название товара *" className={inputCls} />
              <select value={type} onChange={e => setType(e.target.value as ShopItem["type"])} className={inputCls}>
                {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <input ref={imgRef} type="file" accept="image/*,.gif,.webm" className="hidden" onChange={handleImg} />

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-muted-foreground mb-1 block">Цена (KRX) *</label><input value={price} onChange={e => setPrice(e.target.value)} type="number" min="0" placeholder="500" className={inputCls} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Мин. уровень</label><input value={minLevel} onChange={e => setMinLevel(e.target.value)} type="number" min="0" placeholder="0" className={inputCls} /></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-muted-foreground mb-1 block">Скидочная цена</label><input value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} type="number" min="0" placeholder="—" className={inputCls} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Скидка (часов)</label><input value={discountHours} onChange={e => setDiscountHours(e.target.value)} type="number" min="1" placeholder="—" className={inputCls} /></div>
          </div>

          <div><label className="text-xs text-muted-foreground mb-1 block">Количество (пусто = ∞)</label><input value={stock} onChange={e => setStock(e.target.value)} type="number" min="1" placeholder="Без лимита" className={inputCls} /></div>

          <div className="flex gap-4">
            {[
              { label: "Анимированный", val: isAnimated, set: setIsAnimated },
              { label: "Только Адмиры", val: adminOnly, set: setAdminOnly },
            ].map(t => (
              <label key={t.label} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={t.val} onChange={e => t.set(e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-foreground">{t.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80">Отмена</button>
            <button onClick={submit} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all">Добавить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Gift Modal ───────────────────────────────────────────────────────────────
function GiftModal({ item, onClose }: { item: ShopItem; onClose: () => void }) {
  const { purchaseItem, friendList } = useApp();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const matches = friendList.filter(f => f.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  const handleGift = (name: string) => {
    const r = purchaseItem(item.id, name);
    setResult(r);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-foreground flex items-center gap-2"><Gift className="w-5 h-5 text-primary" /> Подарить</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-muted-foreground">Кому подарить <span className="text-foreground font-medium">«{item.name}»</span>?</p>
          {result ? (
            <div className={cn("flex items-center gap-2 p-3 rounded-xl text-sm", result.ok ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive")}>
              {result.ok ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {result.msg}
            </div>
          ) : (
            <>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по нику..."
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <div className="space-y-1">
                {matches.map(f => (
                  <button key={f.userId} onClick={() => handleGift(f.name)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-all border border-transparent hover:border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xs">
                      {f.name[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">{f.name}</span>
                    <Gift className="w-4 h-4 text-primary ml-auto" />
                  </button>
                ))}
                {query && matches.length === 0 && <p className="text-sm text-muted-foreground text-center py-2">Не найдено</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────────────
function ItemCard({ item }: { item: ShopItem }) {
  const { user, purchaseItem, deleteShopItem, inventory, canUseItem } = useApp();
  const [hover, setHover] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [showGift, setShowGift] = useState(false);
  const isAdmin = user && GAME_ADMINS.includes(user.name);
  const owned = inventory.some(i => i.itemId === item.id);
  const { allowed, reason } = canUseItem(item);
  const isAdmin2 = user && GAME_ADMINS.includes(user.name);

  const activePrice = (item.discountUntil && item.discountUntil > Date.now() && item.discountPrice)
    ? item.discountPrice : item.price;
  const hasDiscount = activePrice < item.price;
  const discountLeft = item.discountUntil ? timeLeft(item.discountUntil) : null;
  const stockLeft = item.stock !== null ? item.stock - item.soldCount : null;
  const discountPct = hasDiscount ? Math.round((1 - activePrice / item.price) * 100) : 0;

  const handleBuy = () => {
    const r = purchaseItem(item.id);
    setMsg({ ok: r.ok, text: r.msg });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <>
      <div
        className={cn("bg-card border rounded-2xl overflow-hidden transition-all group relative",
          owned ? "border-primary/40" : "border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5")}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      >
        {/* Image */}
        <div className="relative h-48 bg-muted overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name}
              className={cn("w-full h-full object-cover transition-transform duration-300", hover && "scale-105")} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <ShoppingBag className="w-12 h-12 text-primary/20" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {item.adminOnly && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">ADMIN</span>}
            {item.isAnimated && <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full font-bold">GIF</span>}
            {hasDiscount && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">-{discountPct}%</span>}
            {stockLeft !== null && stockLeft <= 5 && (
              <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
                Осталось {stockLeft}
              </span>
            )}
          </div>

          {owned && (
            <div className="absolute top-2 right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow">
              <CheckCircle className="w-4 h-4 text-white fill-white" />
            </div>
          )}

          {isAdmin && (
            <button onClick={() => deleteShopItem(item.id)}
              className="absolute bottom-2 right-2 p-1.5 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80">
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-foreground text-sm leading-tight">{item.name}</h3>
            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded flex-shrink-0">
              {TYPE_LABELS[item.type]}
            </span>
          </div>

          {item.minLevel > 0 && (
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Мин. уровень: {item.minLevel}
            </p>
          )}

          {stockLeft !== null && (
            <div className="mb-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Осталось: {stockLeft}/{item.stock}</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(stockLeft / (item.stock || 1)) * 100}%` }} />
              </div>
            </div>
          )}

          {discountLeft && (
            <div className="flex items-center gap-1 text-xs text-orange-400 mb-2">
              <Clock className="w-3 h-3" /> Скидка: {discountLeft}
            </div>
          )}

          {msg && (
            <div className={cn("text-xs p-2 rounded-lg mb-2 flex items-center gap-1", msg.ok ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive")}>
              {msg.ok ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />} {msg.text}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className={cn("font-bold text-lg", hasDiscount ? "text-green-400" : "text-foreground")}>
                  {activePrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through">{item.price.toLocaleString()}</span>
                )}
              </div>
            </div>
            <div className="flex gap-1.5">
              {!owned && (
                <button onClick={() => setShowGift(true)} title="Подарить"
                  className="p-2 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
                  <Gift className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={!owned ? handleBuy : undefined}
                disabled={owned || (!allowed && !isAdmin2)}
                className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95",
                  owned ? "bg-green-500/10 text-green-500 cursor-default text-xs" :
                  !allowed && !isAdmin2 ? "bg-muted text-muted-foreground cursor-not-allowed text-xs" :
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {owned ? "✓ Куплено" : !allowed && !isAdmin2 ? reason : "Купить"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showGift && <GiftModal item={item} onClose={() => setShowGift(false)} />}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const { isAuthenticated, user, shopItems } = useApp();
  const router = useRouter();
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [idSearch, setIdSearch] = useState("");
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { if (!isAuthenticated) router.replace("/auth"); }, [isAuthenticated]);
  if (!isAuthenticated || !user) return null;

  const isAdmin = GAME_ADMINS.includes(user.name);

  let filtered = shopItems;
  if (category !== "all") filtered = filtered.filter(i => i.type === category);
  if (search.trim()) filtered = filtered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  if (idSearch.trim()) filtered = filtered.filter(i => String(i.id).includes(idSearch.trim()));
  if (minPrice) filtered = filtered.filter(i => i.price >= parseInt(minPrice));
  if (maxPrice) filtered = filtered.filter(i => i.price <= parseInt(maxPrice));
  if (sortPrice === "asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortPrice === "desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl"><ShoppingBag className="w-7 h-7 text-primary" /></div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Магазин KRX</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span>Баланс: <span className="text-foreground font-semibold">{user.balance.toLocaleString()} KRX</span></span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(!showFilters)}
                className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                  showFilters ? "bg-primary/10 border-primary text-primary" : "bg-card border-border text-muted-foreground hover:border-primary/40")}>
                <SlidersHorizontal className="w-4 h-4" /> Фильтры
              </button>
              {isAdmin && (
                <button onClick={() => setShowAdd(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95">
                  <Plus className="w-4 h-4" /> Добавить товар
                </button>
              )}
            </div>
          </div>

          {/* Search + Categories */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по названию товара..."
                className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm" />
            </div>
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    className={cn("flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-[1.02]",
                      category === cat.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground")}>
                    <Icon className="w-3.5 h-3.5" /> {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Products grid */}
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <div className="w-20 h-20 bg-card border border-border rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 opacity-30" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Товаров нет</p>
                  <p className="text-sm mt-1">{isAdmin ? "Нажмите «Добавить товар» чтобы начать" : "Администратор скоро добавит товары"}</p>
                  {isAdmin && (
                    <button onClick={() => setShowAdd(true)} className="mt-5 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all">
                      <Plus className="w-4 h-4 inline mr-2" /> Добавить первый товар
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">{filtered.length} товаров</p>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(item => <ItemCard key={item.id} item={item} />)}
                  </div>
                </>
              )}
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="w-64 flex-shrink-0">
                <div className="bg-card border border-border rounded-2xl p-5 sticky top-6 space-y-5">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" /> Фильтры
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Поиск по ID</label>
                    <input value={idSearch} onChange={e => setIdSearch(e.target.value)} placeholder="Введите ID..."
                      className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Сортировка по цене</label>
                    <div className="space-y-2">
                      {([["asc", "Сначала дешёвые"], ["desc", "Сначала дорогие"]] as const).map(([val, label]) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="sort" checked={sortPrice === val} onChange={() => setSortPrice(sortPrice === val ? null : val)} className="w-4 h-4 accent-primary" />
                          <span className="text-sm text-foreground">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Диапазон цен (KRX)</label>
                    <div className="flex gap-2 items-center">
                      <input value={minPrice} onChange={e => setMinPrice(e.target.value)} type="number" min="0" placeholder="От"
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                      <span className="text-muted-foreground">—</span>
                      <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} type="number" min="0" placeholder="До"
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
                    </div>
                  </div>

                  <button onClick={() => { setSortPrice(null); setMinPrice(""); setMaxPrice(""); setIdSearch(""); setSearch(""); }}
                    className="w-full py-2.5 bg-muted text-muted-foreground rounded-xl text-sm hover:bg-muted/80 transition-all">
                    Сбросить всё
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <MusicPlayer />
      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
