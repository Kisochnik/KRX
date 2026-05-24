"use client";

import { AppShell } from "@/layouts";
import { ProfileView } from "@/components/profile";
import { useLanguage } from "@/hooks";

export function ProfilePage() {
  const { t } = useLanguage();

  return (
    <AppShell showRightPanel={false} showMobileHeader title={t.nav.profile}>
      <ProfileView />
    </AppShell>
  );
}
