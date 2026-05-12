"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { ShoppingBag, Coins, Star, ShoppingCart, Sparkles, Crown, Palette, Frame, User, Image, Play, Type, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Уровни доступа к контенту
const ACCESS_LEVELS = {
  gifAvatar: 50,      // GIF-аватарка: с 50 уровня или Админ
  staticBanner: 90,   // Статичный баннер: с 90 уровня
  gifBanner: 95,      // GIF-баннер: с 95 уровня или Админ
  wallpaper: 80,      // Обои профиля: с 80 уровня
  // liveWallpaper: только Администрация (на данный момент)
};

const categories = [
  { id: "all", label: "Все", icon: ShoppingBag },
  { id: "avatars", label: "Аватарки (ава)", icon: User },
  { id: "banners", label: "Баннеры", icon: Image },
  { id: "wallpapers", label: "Обои", icon: Play },
  { id: "frames", label: "Рамки", icon: Frame },
  { id: "nickcolor", label: "Цвет ника", icon: Type },
  { id: "effects", label: "Эффекты профиля", icon: Sparkles },
];

const products = [
  // Аватарки (ава)
  {
    id: 3,
    name: "Аватар Cyber Samurai",
    description: "Эксклюзивный киберпанк аватар (статичный)",
    price: 1500,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&h=300&fit=crop",
    category: "avatars",
    popular: true,
    subtype: "static", // static | gif
    requiredLevel: null,
    adminOnly: false,
  },
  {
    id: 4,
    name: "Аватар Neon Wolf GIF",
    description: "Анимированный неоновый волк — доступно с 50 уровня",
    price: 2000,
    oldPrice: 2500,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop",
    category: "avatars",
    popular: false,
    subtype: "gif",
    requiredLevel: 50,
    adminOnly: false,
  },
  {
    id: 5,
    name: "Аватар Dark Phoenix GIF",
    description: "Огненный феникс с анимацией — доступно с 50 уровня",
    price: 3000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop",
    category: "avatars",
    popular: true,
    subtype: "gif",
    requiredLevel: 50,
    adminOnly: false,
  },
  // Баннеры
  {
    id: 6,
    name: "Баннер Neon City",
    description: "Статичный неоновый баннер — доступно с 90 уровня",
    price: 1000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=300&h=150&fit=crop",
    category: "banners",
    popular: false,
    subtype: "static",
    requiredLevel: 90,
    adminOnly: false,
  },
  {
    id: 7,
    name: "Баннер Fire Storm GIF",
    description: "Анимированный огненный баннер — доступно с 95 уровня",
    price: 2500,
    oldPrice: 3000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=150&fit=crop",
    category: "banners",
    popular: true,
    subtype: "gif",
    requiredLevel: 95,
    adminOnly: false,
  },
  {
    id: 8,
    name: "Баннер Space Galaxy",
    description: "Статичная космическая тематика — доступно с 90 уровня",
    price: 1800,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=150&fit=crop",
    category: "banners",
    popular: false,
    subtype: "static",
    requiredLevel: 90,
    adminOnly: false,
  },
  // Обои
  {
    id: 9,
    name: "Живые обои Cyber Wave",
    description: "Анимированные киберпанк волны — только для Администрации",
    price: 3500,
    oldPrice: 4500,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop",
    category: "wallpapers",
    popular: true,
    subtype: "live",
    requiredLevel: null,
    adminOnly: true,
  },
  {
    id: 10,
    name: "Обои Abstract Red",
    description: "Статичные обои профиля — доступно с 80 уровня",
    price: 800,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=300&h=300&fit=crop",
    category: "wallpapers",
    popular: false,
    subtype: "static",
    requiredLevel: 80,
    adminOnly: false,
  },
  {
    id: 11,
    name: "Живые обои Matrix",
    description: "Падающий код в стиле Matrix — только для Администрации",
    price: 3000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop",
    category: "wallpapers",
    popular: true,
    subtype: "live",
    requiredLevel: null,
    adminOnly: true,
  },
  // Рамки
  {
    id: 12,
    name: "Рамка Fire Ring",
    description: "Огненная анимация для аватара",
    price: 3500,
    oldPrice: 4000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    category: "frames",
    popular: true,
    subtype: "animated",
    requiredLevel: null,
    adminOnly: false,
  },
  {
    id: 13,
    name: "Рамка Neon Glow",
    description: "Неоновое свечение вокруг аватара",
    price: 2000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop",
    category: "frames",
    popular: false,
    subtype: "animated",
    requiredLevel: null,
    adminOnly: false,
  },
  // Цвет ника
  {
    id: 20,
    name: "Ник — Золотой",
    description: "Золотой цвет имени в профиле, ленте и чате",
    price: 2500,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1610375461369-d613b564f4c4?w=300&h=300&fit=crop",
    category: "nickcolor",
    popular: true,
    subtype: "color",
    requiredLevel: null,
    adminOnly: false,
  },
  {
    id: 21,
    name: "Ник — Неоновый розовый",
    description: "Яркий розовый цвет имени",
    price: 1800,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=300&h=300&fit=crop",
    category: "nickcolor",
    popular: false,
    subtype: "color",
    requiredLevel: null,
    adminOnly: false,
  },
  {
    id: 22,
    name: "Ник — Радужный градиент",
    description: "Анимированный радужный эффект на нике",
    price: 4000,
    oldPrice: 5000,
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=300&h=300&fit=crop",
    category: "nickcolor",
    popular: true,
    subtype: "animated",
    requiredLevel: null,
    adminOnly: false,
  },
  // Эффекты профиля
  {
    id: 14,
    name: "Эффект конфетти",
    description: "Праздничный эффект для постов",
    price: 1500,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=300&fit=crop",
    category: "effects",
    popular: false,
    subtype: "animated",
    requiredLevel: null,
    adminOnly: false,
  },
  {
    id: 15,
    name: "Эффект Sparkles",
    description: "Искры и блёстки на профиле",
    price: 1200,
    oldPrice: 1500,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=300&fit=crop",
    category: "effects",
    popular: true,
    subtype: "animated",
    requiredLevel: null,
    adminOnly: false,
  },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<number[]>([]);

  // Mock — заменить на реальные данные пользователя
  const userLevel = 42;
  const isAdmin = false;

  // Проверка доступа к товару
  const canAccess = (product: typeof products[0]): boolean => {
    if (product.adminOnly) return isAdmin;
    if (product.requiredLevel !== null && !isAdmin) {
      return userLevel >= product.requiredLevel;
    }
    return true;
  };

  const getAccessLabel = (product: typeof products[0]): string | null => {
    if (product.adminOnly) return "Только Администрация";
    if (product.requiredLevel !== null && !isAdmin && userLevel < product.requiredLevel) {
      return `Доступно с ${product.requiredLevel} уровня`;
    }
    return null;
  };

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const addToCart = (id: number) => {
    if (!cart.includes(id)) {
      setCart([...cart, id]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Магазин</h1>
                <p className="text-muted-foreground">Улучшите свой профиль</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-foreground">12,500 KRX</span>
              </div>
              <button className="relative p-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-3 mb-8">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                    activeCategory === cat.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-card text-muted-foreground hover:bg-muted border border-border"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const locked = !canAccess(product);
              const accessLabel = getAccessLabel(product);
              return (
              <div 
                key={product.id}
                className={cn(
                  "bg-card rounded-xl border overflow-hidden transition-all group",
                  locked ? "border-border opacity-75" : "border-border hover:border-primary/50"
                )}
              >
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className={cn(
                      "w-full h-48 object-cover transition-transform duration-300",
                      locked ? "grayscale" : "group-hover:scale-105"
                    )}
                  />
                  {locked && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                      <Lock className="w-8 h-8 text-white" />
                      <span className="text-white text-xs font-medium text-center px-3">
                        {accessLabel}
                      </span>
                    </div>
                  )}
                  {!locked && product.popular && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Хит
                    </span>
                  )}
                  {product.oldPrice && !locked && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("flex items-center gap-1 text-lg font-bold", locked ? "text-muted-foreground" : "text-primary")}>
                        <Coins className="w-4 h-4" />
                        {product.price.toLocaleString()}
                      </span>
                      {product.oldPrice && !locked && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => !locked && addToCart(product.id)}
                      disabled={locked || cart.includes(product.id)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        locked
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : cart.includes(product.id)
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {locked ? "Закрыто" : cart.includes(product.id) ? "В корзине" : "Купить"}
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
