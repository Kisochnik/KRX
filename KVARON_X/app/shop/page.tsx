"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";

import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { ShoppingBag, Coins, Star, Sparkles, Frame, User, Image, Play, Type, Lock } from "lucide-react";
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

const products: { id: number; name: string; description: string; price: number; oldPrice: number | null; image: string; category: string; popular: boolean; subtype: string; requiredLevel: number | null; adminOnly: boolean; }[] = [];

export default function ShopPage() {
  const { isAuthenticated, user: shopUser } = useApp();
  const shopRouter = useRouter();
  useEffect(() => { if (!isAuthenticated) shopRouter.replace("/auth"); }, [isAuthenticated]);
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
