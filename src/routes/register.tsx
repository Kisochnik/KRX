import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { KrxLogo } from "@/components/KrxLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const { t } = useI18n();
  const [step, setStep] = useState<"form" | "code">("form");
  const [code, setCode] = useState("");

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-radial)" }}>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 md:px-10 h-16">
          <Link to="/"><KrxLogo /></Link>
          <LanguageSwitcher />
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm krx-fade-in">
            <h1 className="text-3xl font-bold tracking-tight">{t("auth.register")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("app.tagline")}</p>

            {step === "form" ? (
              <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setStep("code"); }}>
                <Field label={t("auth.nickname")} type="text" />
                <Field label={t("auth.email")} type="email" />
                <Field label={t("auth.phone")} type="tel" />
                <Field label={t("auth.password")} type="password" />
                <Field label={t("auth.birthday")} type="date" />
                <Button type="submit" className="w-full h-11 rounded-xl">{t("auth.continue")}</Button>

                <div className="my-2 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <div className="flex-1 h-px bg-border" />{t("auth.or")}<div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Email", "Telegram", "Discord"].map((p) => (
                    <button key={p} type="button" className="h-10 rounded-xl border border-border text-xs hover:bg-accent transition">{p}</button>
                  ))}
                </div>
              </form>
            ) : (
              <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/feed"; }}>
                <p className="text-sm text-muted-foreground">{t("auth.code")}</p>
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="h-14 text-center text-2xl tracking-[0.5em] rounded-xl"
                  placeholder="••••••"
                />
                <Button type="submit" className="w-full h-11 rounded-xl" disabled={code.length !== 6}>
                  {t("auth.continue")}
                </Button>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {t("auth.have_account")}{" "}
              <Link to="/login" className="text-foreground hover:underline">{t("auth.login")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} className="h-11 rounded-xl" required />
    </div>
  );
}
