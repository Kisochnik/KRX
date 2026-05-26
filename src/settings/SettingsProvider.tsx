"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { APP_CONFIG } from "./config";
import { DEFAULT_SETTINGS, type AppSettings } from "./types";

interface SettingsContextValue extends AppSettings {
  updateSettings: (patch: Partial<AppSettings>) => void;
  toggleSidebar: () => void;
  toggleAnimations: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(APP_CONFIG.storageKeys.settings);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(
      APP_CONFIG.storageKeys.settings,
      JSON.stringify(settings)
    );
  }, [settings]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  }, []);

  const toggleAnimations = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      animationsEnabled: !prev.animationsEnabled,
    }));
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      updateSettings,
      toggleSidebar,
      toggleAnimations,
    }),
    [settings, updateSettings, toggleSidebar, toggleAnimations]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettingsContext must be used within SettingsProvider");
  }
  return ctx;
}
