"use client";

import { AppShell } from "@/layouts";
import { SettingsView } from "@/components/settings";
import { useLanguage } from "@/hooks";

export function SettingsPage() {
  const { t } = useLanguage();

  return (
    <AppShell showRightPanel={false} showMobileHeader title={t.settings.title}>
      <SettingsView />
    </AppShell>
  );
}
