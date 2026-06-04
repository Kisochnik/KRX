import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { KrxLogo } from "@/components/KrxLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPage });

type Step = "method" | "code" | "reset";

function ForgotPage() {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>("method");
  const [code, setCode] = useState("");

  const methods = [
    { id: "email", icon: Mail, label: "Email" },
    { id: "phone", icon: Phone, label: "Phone" },
    { id: "tg", icon: Send, label: "Telegram Bot" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-radial)" }}>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 md:px-10 h-16">
          <Link to="/"><KrxLogo /></Link>
          <LanguageSwitcher />
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm krx-fade-in">
            <h1 className="text-3xl font-bold tracking-tight">{t("auth.recover")}</h1>

            {step === "method" && (
              <>
                <p className="mt-2 text-sm text-muted-foreground">{t("auth.choose_method")}</p>
                <div className="mt-8 space-y-2">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setStep("code")}
                      className="w-full flex items-center gap-3 h-12 px-4 rounded-xl border border-border hover:bg-accent transition text-left"
                    >
                      <m.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === "code" && (
              <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setStep("reset"); }}>
                <Label>{t("auth.code")}</Label>
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

            {step === "reset" && (
              <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = "/login"; }}>
                <div className="space-y-1.5">
                  <Label>{t("auth.new_password")}</Label>
                  <Input type="password" className="h-11 rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("auth.confirm_password")}</Label>
                  <Input type="password" className="h-11 rounded-xl" required />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl">{t("common.save")}</Button>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-foreground hover:underline">{t("auth.login")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
