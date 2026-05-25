"use client";

import { LanguageProvider } from "@/language";
import { SettingsProvider } from "@/settings";
import { ProfileProvider } from "./ProfileProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </LanguageProvider>
    </SettingsProvider>
  );
}
