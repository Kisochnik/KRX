"use client";

import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Wallet, Coins, ArrowUpRight, ArrowDownLeft, CreditCard, History, TrendingUp, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  { id: 1, type: "income", description: "Награда за турнир", amount: 5000, date: "Сегодня, 14:30" },
  { id: 2, type: "expense", description: "Покупка VIP статуса", amount: -3000, date: "Сегодня, 12:15" },
  { id: 3, type: "income", description: "Бонус за активность", amount: 500, date: "Вчера, 18:00" },
  { id: 4, type: "income", description: "Донат от @Alex_Pro", amount: 1000, date: "Вчера, 15:30" },
  { id: 5, type: "expense", description: "Покупка темы Neon", amount: -2000, date: "3 дня назад" },
];

const packages = [
  { id: 1, amount: 1000, price: "99 ₽", bonus: null },
  { id: 2, amount: 5000, price: "449 ₽", bonus: "+500" },
  { id: 3, amount: 10000, price: "849 ₽", bonus: "+1500", popular: true },
  { id: 4, amount: 25000, price: "1999 ₽", bonus: "+5000" },
];

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Кошелёк</h1>
              <p className="text-muted-foreground">Управление KRX монетами</p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-primary/20 via-card to-card rounded-2xl border border-primary/30 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-muted-foreground mb-1">Текущий баланс</p>
                <div className="flex items-center gap-3">
                  <Coins className="w-10 h-10 text-yellow-500" />
                  <span className="text-4xl font-bold text-foreground">12,500</span>
                  <span className="text-xl text-muted-foreground">KRX</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm">
                <TrendingUp className="w-4 h-4" />
                +2,500 за неделю
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                <CreditCard className="w-5 h-5" />
                Пополнить
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-card border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors">
                <Gift className="w-5 h-5" />
                Отправить
              </button>
            </div>
          </div>

          {/* Buy KRX */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Купить KRX</h2>
          <div className="grid grid-cols-4 gap-4 mb-10">
            {packages.map(pkg => (
              <button
                key={pkg.id}
                className={cn(
                  "relative p-4 rounded-xl border transition-all hover:scale-[1.02]",
                  pkg.popular 
                    ? "bg-primary/10 border-primary" 
                    : "bg-card border-border hover:border-primary/50"
                )}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                    Популярный
                  </span>
                )}
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-xl font-bold text-foreground">{pkg.amount.toLocaleString()}</span>
                </div>
                {pkg.bonus && (
                  <p className="text-sm text-green-400 mb-2">+{pkg.bonus} бонус</p>
                )}
                <p className="text-lg font-medium text-primary">{pkg.price}</p>
              </button>
            ))}
          </div>

          {/* Transactions */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              История транзакций
            </h2>
            <button className="text-sm text-primary hover:underline">Показать все</button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {transactions.map((tx, index) => (
              <div 
                key={tx.id}
                className={cn(
                  "flex items-center justify-between p-4",
                  index !== transactions.length - 1 && "border-b border-border"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    tx.type === "income" ? "bg-green-500/20" : "bg-red-500/20"
                  )}>
                    {tx.type === "income" ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <span className={cn(
                  "font-semibold",
                  tx.amount > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} KRX
                </span>
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
