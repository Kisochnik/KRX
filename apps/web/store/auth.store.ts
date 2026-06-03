import { create } from "zustand";
import { persist } from "zustand/middleware";

type SessionUser = {
  id: string;
  email: string;
  nickname: string;
};

type AuthState = {
  user: SessionUser | null;
  token: string | null;
  setSession: (token: string, user: SessionUser) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: (token, user) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: "krx-auth-store",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
