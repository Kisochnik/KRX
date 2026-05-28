"use client";

import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Zap,
  Moon,
  Volume2,
} from "lucide-react";
import { PageHeader, GlassPanel, Switch } from "@/ui";
import { useLanguage, useSettings } from "@/hooks";
import type { Locale } from "@/language/types";

const sections = [
  { id: "account", icon: User },
  { id: "appearance", icon: Palette },
  { id: "notifications", icon: Bell },
  { id: "privacy", icon: Shield },
  { id: "language", icon: Globe },
] as const;

export function SettingsView() {
  const { t, locale, setLocale } = useLanguage();
  const {
    animationsEnabled,
    reducedMotion,
    toggleAnimations,
    updateSettings,
  } = useSettings();

  const labels: Record<string, string> = {
    account: t.settings.sections.account,
    appearance: t.settings.sections.appearance,
    notifications: t.settings.sections.notifications,
    privacy: t.settings.sections.privacy,
    language: t.settings.sections.language,
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassPanel padding="md" className="space-y-4">
                <h2 className="flex items-center gap-2 text-sm font-bold text-white/90">
                  <section.icon className="h-4 w-4 text-white/50" />
                  {labels[section.id]}
                </h2>

                {section.id === "appearance" && (
                  <div className="space-y-4">
                    <SettingRow
                      icon={Moon}
                      label={t.settings.darkMode}
                      description={t.settings.darkModeDesc}
                      action={<span className="rounded-full bg-white/10 px-3 py-1 text-xs">Вкл</span>}
                    />
                    <SettingRow
                      icon={Zap}
                      label={t.settings.animations}
                      description={t.settings.animationsDesc}
                      action={
                        <Switch
                          checked={animationsEnabled}
                          onChange={() => toggleAnimations()}
                        />
                      }
                    />
                    <SettingRow
                      icon={Palette}
                      label={t.settings.reducedMotion}
                      description={t.settings.reducedMotionDesc}
                      action={
                        <Switch
                          checked={reducedMotion}
                          onChange={(v) => updateSettings({ reducedMotion: v })}
                        />
                      }
                    />
                  </div>
                )}

                {section.id === "language" && (
                  <div className="flex flex-wrap gap-2">
                    {([
                      { value: "ru" as Locale, label: "🇷🇺 Русский" },
                      { value: "en" as Locale, label: "🇬🇧 English" },
                      { value: "uk" as Locale, label: "🇺🇦 Українська" },
                    ]).map(({ value: loc, label: locLabel }) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setLocale(loc)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                          locale === loc
                            ? "bg-white text-black premium-shadow"
                            : "bg-white/[0.05] text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {locLabel}
                      </button>
                    ))}
                  </div>
                )}

                {section.id === "notifications" && (
                  <div className="space-y-4">
                    <SettingRow
                      icon={Bell}
                      label={t.settings.pushNotif}
                      action={<Switch checked onChange={() => {}} />}
                    />
                    <SettingRow
                      icon={Volume2}
                      label={t.settings.sounds}
                      action={<Switch checked onChange={() => {}} />}
                    />
                  </div>
                )}

                {(section.id === "account" || section.id === "privacy") && (
                  <p className="text-sm text-white/45">{t.settings.comingSoon}</p>
                )}
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl p-2 transition-colors hover:bg-white/[0.03]">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
          <Icon className="h-4 w-4 text-white/60" />
        </span>
        <div>
          <p className="text-sm font-medium text-white/90">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-white/40">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
