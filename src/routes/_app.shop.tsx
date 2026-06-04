import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/shop")({ component: ShopPage });

const tiers = [
  { name: "Free", price: "0", desc: "The essentials.", features: ["Feed & messages", "Standard quality media", "Basic profile"] },
  { name: "Premium", price: "4.99", desc: "Personal pro.", features: ["Ad-free", "HD media", "Profile themes", "Custom badges"], featured: true },
  { name: "KRX+", price: "9.99", desc: "For creators.", features: ["Everything in Premium", "Live streaming", "Analytics", "Priority support"] },
];

const cosmetics = [
  { type: "Theme", name: "Pure Noir" },
  { type: "Theme", name: "Static" },
  { type: "Avatar", name: "Glyph 01" },
  { type: "Badge", name: "Pioneer" },
  { type: "Badge", name: "Founder" },
  { type: "Avatar", name: "Cube" },
];

function ShopPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-4">Subscriptions</h1>
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div key={t.name} className={`krx-card p-6 relative ${t.featured ? "border-foreground/40" : ""}`}>
              {t.featured && <span className="absolute -top-2 left-6 text-[10px] uppercase tracking-wider bg-foreground text-background px-2 py-0.5 rounded-full">Popular</span>}
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
              <p className="mt-4 text-3xl font-bold tracking-tight">${t.price}<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
              <ul className="mt-4 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> {f}</li>
                ))}
              </ul>
              <Button className="w-full mt-6 rounded-xl" variant={t.featured ? "default" : "outline"}>Choose</Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Themes, avatars & badges</h2>
        <div className="grid sm:grid-cols-3 md:grid-cols-6 gap-3">
          {cosmetics.map((c) => (
            <div key={c.name} className="krx-card krx-card-hover p-3 text-center">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-foreground/30 to-foreground/5 border border-border mb-2" />
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.type}</p>
              <p className="text-sm font-medium">{c.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
