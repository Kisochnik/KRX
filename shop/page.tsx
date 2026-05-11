"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { ShoppingBag, Coins, Star, ShoppingCart, Sparkles, Crown, Palette, Frame, User, Image, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "Все", icon: ShoppingBag },
  { id: "premium", label: "Премиум", icon: Crown },
  { id: "avatars", label: "Аватары", icon: User },
  { id: "banners", label: "Баннеры", icon: Image },
  { id: "wallpapers", label: "Обои", icon: Play },
  { id: "frames", label: "Рамки", icon: Frame },
  { id: "effects", label: "Эффекты", icon: Sparkles },
];

const products = [
  {
    id: 1,
    name: "VIP Статус",
    description: "Премиум значок и бонусы на 30 дней",
    price: 5000,
    oldPrice: 7500,
    image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=300&h=300&fit=crop",
    category: "premium",
    popular: true,
  },
  {
    id: 2,
    name: "Elite пакет",
    description: "VIP + все темы + анимации",
    price: 15000,
    oldPrice: 25000,
    image: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=300&h=300&fit=crop",
    category: "premium",
    popular: true,
  },
  // Avatars
  {
    id: 3,
    name: "Аватар Cyber Samurai",
    description: "Эксклюзивный киберпанк аватар",
    price: 1500,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&h=300&fit=crop",
    category: "avatars",
    popular: true,
  },
  {
    id: 4,
    name: "Аватар Neon Wolf",
    description: "Неоновый волк с анимацией",
    price: 2000,
    oldPrice: 2500,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop",
    category: "avatars",
    popular: false,
  },
  {
    id: 5,
    name: "Аватар Dark Phoenix",
    description: "Огненный феникс с эффектами",
    price: 3000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop",
    category: "avatars",
    popular: true,
  },
  // Banners
  {
    id: 6,
    name: "Баннер Neon City",
    description: "Неоновый город для профиля",
    price: 1000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=300&h=150&fit=crop",
    category: "banners",
    popular: false,
  },
  {
    id: 7,
    name: "Баннер Fire Storm",
    description: "Анимированный огненный баннер",
    price: 2500,
    oldPrice: 3000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=150&fit=crop",
    category: "banners",
    popular: true,
  },
  {
    id: 8,
    name: "Баннер Space Galaxy",
    description: "Космическая тематика",
    price: 1800,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=150&fit=crop",
    category: "banners",
    popular: false,
  },
  // Wallpapers
  {
    id: 9,
    name: "Живые обои Cyber Wave",
    description: "Анимированные киберпанк волны",
    price: 3500,
    oldPrice: 4500,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop",
    category: "wallpapers",
    popular: true,
  },
  {
    id: 10,
    name: "Живые обои Matrix",
    description: "Падающий код в стиле Matrix",
    price: 3000,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=300&fit=crop",
    category: "wallpapers",
    popular: true,
  },
  {
    id: 11,
    name: "Обои Abstract Red",
    description: "Статичные красные абстракции",
    price: 800,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=300&h=300&fit=crop",
    category: "wallpapers",
    popular: false,
  },
  // Frames
  {
    id: 12,
    name: "Рамка Fire Ring",
    description: "Огненная анимация для аватара",
    price: 3500,
    oldPrice: 4000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    category: "frames",
    popular: true,
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
  },
  // Effects
  {
    id: 14,
    name: "Эффект конфетти",
    description: "Праздничный эффект для постов",
    price: 1500,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=300&fit=crop",
    category: "effects",
    popular: false,
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
  },
];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<number[]>([]);

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
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all group"
              >
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.popular && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Хит
                    </span>
                  )}
                  {product.oldPrice && (
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
                      <span className="flex items-center gap-1 text-lg font-bold text-primary">
                        <Coins className="w-4 h-4" />
                        {product.price.toLocaleString()}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => addToCart(product.id)}
                      disabled={cart.includes(product.id)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        cart.includes(product.id)
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {cart.includes(product.id) ? "В корзине" : "Купить"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
