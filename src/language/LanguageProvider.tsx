"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { APP_CONFIG } from "@/settings/config";
import { getLocaleData } from "./locales";
import type { Locale, TranslationSchema } from "./types";

interface LanguageContextValue {
  locale: Locale;
  t: TranslationSchema;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(APP_CONFIG.defaultLocale);

  useEffect(() => {
    const stored = localStorage.getItem(APP_CONFIG.storageKeys.locale) as Locale;
    if (stored && (stored === "ru" || stored === "en")) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(APP_CONFIG.storageKeys.locale, next);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      t: getLocaleData(locale),
      setLocale,
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }
  return ctx;
}
