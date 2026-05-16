"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/krx/sidebar";
import { RightSidebar } from "@/components/krx/right-sidebar";
import { MusicPlayer } from "@/components/krx/music-player";
import { Wallet, Coins, ArrowUpRight, ArrowDownLeft, CreditCard, History, Send, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const packages = [
  { id: 1, amount: 1000, price: "99 ₽", bonus: null },
  { id: 2, amount: 5000, price: "449 ₽", bonus: "+500" },
  { id: 3, amount: 10000, price: "849 ₽", bonus: "+1500", popular: true },
  { id: 4, amount: 25000, price: "1999 ₽", bonus: "+5000" },
];

export default function WalletPage() {
  const { isAuthenticated, user, transactions, sendMoney } = useApp();
  const router = useRouter();
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendMsg, setSendMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/auth");
  }, [isAuthenticated]);

  const handleSend = () => {
    const amount = parseInt(sendAmount);
    if (!sendTo || !amount || amount <= 0) { setSendMsg({ ok: false, text: "Заполните все поля" }); return; }
    const ok = sendMoney(sendTo, amount);
    if (ok) { setSendMsg({ ok: true, text: `Отправлено ${amount} KRX → @${sendTo}` }); setSendTo(""); setSendAmount(""); }
    else setSendMsg({ ok: false, text: "Пользователь не найден или недостаточно средств" });
    setTimeout(() => setSendMsg(null), 4000);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-64 mr-80 p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl"><Wallet className="w-8 h-8 text-primary" /></div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Кошелёк</h1>
              <p className="text-muted-foreground">Управление KRX монетами</p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-primary/20 via-card to-card rounded-2xl border border-primary/30 p-6 mb-8">
            <p className="text-muted-foreground mb-1">Текущий баланс</p>
            <div className="flex items-center gap-3 mb-6">
              <Coins className="w-10 h-10 text-yellow-500" />
              <span className="text-4xl font-bold text-foreground">{(user?.balance ?? 0).toLocaleString()}</span>
              <span className="text-xl text-muted-foreground">KRX</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                <CreditCard className="w-5 h-5" /> Пополнить
              </button>
            </div>
          </div>

          {/* Send Money */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" /> Отправить KRX
            </h2>
            {sendMsg && (
              <div className={cn("flex items-center gap-2 p-3 rounded-lg mb-4 text-sm",
                sendMsg.ok ? "bg-green-500/10 border border-green-500/30 text-green-600" : "bg-destructive/10 border border-destructive/30 text-destructive")}>
                {sendMsg.ok ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {sendMsg.text}
              </div>
            )}
            <div className="flex gap-3">
              <input value={sendTo} onChange={e => setSendTo(e.target.value)} placeholder="Имя пользователя (@username)"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <input value={sendAmount} onChange={e => setSendAmount(e.target.value)} type="number" min="1" placeholder="Сумма KRX"
                className="w-40 px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <button onClick={handleSend} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                Отправить
              </button>
            </div>
          </div>

          {/* Buy KRX */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Купить KRX</h2>
          <div className="grid grid-cols-4 gap-4 mb-10">
            {packages.map(pkg => (
              <button key={pkg.id} className={cn("relative p-4 rounded-xl border transition-all hover:scale-[1.02]",
                pkg.popular ? "bg-primary/10 border-primary" : "bg-card border-border hover:border-primary/50")}>
                {pkg.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">Хит</span>}
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-xl font-bold text-foreground">{pkg.amount.toLocaleString()}</span>
                </div>
                {pkg.bonus && <p className="text-sm text-green-400 mb-2">{pkg.bonus} бонус</p>}
                <p className="text-lg font-medium text-primary">{pkg.price}</p>
              </button>
            ))}
          </div>

          {/* Transactions */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> История транзакций
            </h2>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">История транзакций пуста</div>
            ) : (
              transactions.map((tx, index) => (
                <div key={tx.id} className={cn("flex items-center justify-between p-4", index !== transactions.length - 1 && "border-b border-border")}>
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center",
                      tx.type === "income" ? "bg-green-500/20" : "bg-red-500/20")}>
                      {tx.type === "income" ? <ArrowDownLeft className="w-5 h-5 text-green-500" /> : <ArrowUpRight className="w-5 h-5 text-red-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className={cn("font-semibold", tx.amount > 0 ? "text-green-500" : "text-red-500")}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} KRX
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <RightSidebar />
      <MusicPlayer />
    </div>
  );
}
