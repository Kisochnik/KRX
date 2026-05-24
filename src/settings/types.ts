export interface AppSettings {
  animationsEnabled: boolean;
  reducedMotion: boolean;
  sidebarCollapsed: boolean;
  showRightPanel: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  animationsEnabled: true,
  reducedMotion: false,
  sidebarCollapsed: false,
  showRightPanel: true,
};
