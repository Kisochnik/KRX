import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n, type Lang } from "@/lib/i18n";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

const sections = ["Account", "Security", "Privacy", "Notifications", "Language", "Appearance"] as const;

function SettingsPage() {
  const [active, setActive] = useState<(typeof sections)[number]>("Account");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { lang, setLang } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Settings</h1>
      <div className="grid md:grid-cols-[200px_1fr] gap-6">
        <aside className="flex md:flex-col gap-1 overflow-x-auto">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`text-left px-3 py-2 rounded-xl text-sm shrink-0 transition
                ${active === s ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </aside>

        <section className="krx-card p-6 space-y-5">
          <h2 className="text-lg font-semibold">{active}</h2>

          {active === "Language" && (
            <div className="space-y-2">
              {(["en", "ua", "ru"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition
                    ${lang === l ? "border-foreground/30 bg-accent" : "border-border hover:bg-accent/50"}`}
                >
                  <span className="text-sm">{l === "en" ? "English" : l === "ua" ? "Українська" : "Русский"}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</span>
                </button>
              ))}
            </div>
          )}

          {active === "Appearance" && (
            <div className="grid grid-cols-2 gap-3">
              {(["dark", "light"] as const).map((th) => (
                <button
                  key={th}
                  onClick={() => { setTheme(th); document.documentElement.classList.toggle("light", th === "light"); }}
                  className={`p-4 rounded-xl border text-left transition
                    ${theme === th ? "border-foreground/40" : "border-border hover:bg-accent/40"}`}
                >
                  <div className={`h-16 rounded-lg mb-3 border ${th === "dark" ? "bg-[#0A0A0A]" : "bg-white"}`} />
                  <p className="text-sm font-medium capitalize">{th}</p>
                </button>
              ))}
            </div>
          )}

          {active === "Security" && (
            <div className="space-y-4">
              <Row label="Two-factor authentication (2FA)" desc="Add an extra layer of security to your account." />
              <Row label="Email confirmation" desc="Require email verification on new sign-ins." defaultChecked />
              <Row label="Bot protection" desc="Challenge suspicious activity." defaultChecked />
              <Button variant="outline" className="rounded-xl">Change password</Button>
            </div>
          )}

          {active === "Privacy" && (
            <div className="space-y-4">
              <Row label="Private account" desc="Only approved followers can see your posts." />
              <Row label="Hide online status" desc="Don't show when you're online." />
              <Row label="Allow messages from anyone" desc="Otherwise only friends can DM you." defaultChecked />
            </div>
          )}

          {active === "Notifications" && (
            <div className="space-y-4">
              <Row label="Likes" defaultChecked />
              <Row label="Comments" defaultChecked />
              <Row label="New followers" defaultChecked />
              <Row label="Messages" defaultChecked />
              <Row label="System" defaultChecked />
            </div>
          )}

          {active === "Account" && (
            <div className="space-y-4 text-sm">
              <Field label="Nickname" value="you" />
              <Field label="Email" value="you@krx.app" />
              <Field label="Phone" value="+0 000 000 0000" />
              <Button className="rounded-xl">Save changes</Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Row({ label, desc, defaultChecked = false }: { label: string; desc?: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input defaultValue={value} className="mt-1 w-full h-10 px-3 rounded-xl bg-muted/40 border border-transparent focus:outline-none focus:border-border" />
    </div>
  );
}
