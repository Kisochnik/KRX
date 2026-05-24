"use client";

import { AppShell } from "@/layouts";
import { NotificationList } from "@/components/notifications";
import { useLanguage } from "@/hooks";

export function NotificationsPage() {
  const { t } = useLanguage();

  return (
    <AppShell showRightPanel showMobileHeader title={t.notifications.title}>
      <NotificationList />
    </AppShell>
  );
}
