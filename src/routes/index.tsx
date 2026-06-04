import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap, Layers } from "lucide-react";
import { KrxLogo } from "@/components/KrxLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--gradient-radial)" }}>
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 h-16">
        <KrxLogo />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link to="/login" className="hidden sm:inline-flex h-9 items-center rounded-xl px-4 text-sm text-muted-foreground hover:text-foreground transition">
            {t("auth.login")}
          </Link>
          <Link to="/register" className="inline-flex h-9 items-center rounded-xl bg-foreground px-4 text-sm font-medium text-background hover:opacity-90 transition">
            {t("auth.register")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 md:px-10 pt-20 md:pt-32 pb-24 max-w-6xl mx-auto text-center krx-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
          {t("app.tagline")}
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]">
          KVARON<span className="text-muted-foreground">_</span>X
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          {t("landing.subtitle")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Link to="/register" className="group inline-flex h-12 items-center gap-2 rounded-2xl bg-foreground px-6 text-sm font-medium text-background hover:opacity-90 transition">
            {t("landing.cta")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link to="/login" className="inline-flex h-12 items-center rounded-2xl border border-border px-6 text-sm font-medium hover:bg-accent transition">
            {t("auth.login")}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 md:px-10 pb-24 max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
        {[
          { icon: Sparkles, t: t("landing.feature1.t"), d: t("landing.feature1.d") },
          { icon: Layers, t: t("landing.feature2.t"), d: t("landing.feature2.d") },
          { icon: Zap, t: t("landing.feature3.t"), d: t("landing.feature3.d") },
        ].map((f, i) => (
          <div key={i} className="krx-card krx-card-hover p-6">
            <f.icon className="h-5 w-5 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{f.t}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
          </div>
        ))}
      </section>

      <footer className="relative px-6 md:px-10 py-8 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} KVARON_X — KRX
      </footer>
    </div>
  );
}
