import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { KrxLogo } from "@/components/KrxLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { t } = useI18n();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-radial)" }}>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 md:px-10 h-16">
          <Link to="/"><KrxLogo /></Link>
          <LanguageSwitcher />
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm krx-fade-in">
            <h1 className="text-3xl font-bold tracking-tight">{t("auth.login")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("app.tagline")}</p>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => { e.preventDefault(); /* mock */ window.location.href = "/feed"; }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="id">{t("auth.email_or_nick")}</Label>
                <Input id="id" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pw">{t("auth.password")}</Label>
                <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl" required />
              </div>
              <Link to="/forgot-password" className="block text-xs text-muted-foreground hover:text-foreground text-right">
                {t("auth.forgot")}
              </Link>
              <Button type="submit" className="w-full h-11 rounded-xl">{t("auth.login")}</Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
              <div className="flex-1 h-px bg-border" />{t("auth.or")}<div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["Email", "Telegram", "Discord"].map((p) => (
                <button key={p} className="h-10 rounded-xl border border-border text-xs hover:bg-accent transition">{p}</button>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {t("auth.no_account")}{" "}
              <Link to="/register" className="text-foreground hover:underline">{t("auth.register")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
