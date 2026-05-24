"use client";

import { LanguageProvider } from "@/language";
import { SettingsProvider } from "@/settings";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SettingsProvider>
  );
}
