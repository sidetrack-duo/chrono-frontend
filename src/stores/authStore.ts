import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/api";
import { login as loginApi, logout as logoutApi } from "@/lib/api/auth";
import { LoginRequest } from "@/types/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (credentials: LoginRequest) => {
        try {
          const response = await loginApi(credentials);
          // persist 미들웨어가 auth-storage에 자동 저장
          // 인터셉터는 Zustand 스토어에서 직접 읽으므로 중복 저장 불필요
          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        // persist 미들웨어가 auth-storage를 자동 제거
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
        // API 호출 (서버 측 세션 정리 등)
        logoutApi();
      },

      setUser: (user: User) => {
        // persist 미들웨어가 auth-storage에 자동 저장
        set({ user });
      },

      setToken: (token: string) => {
        // persist 미들웨어가 auth-storage에 자동 저장
        set({ accessToken: token, isAuthenticated: true });
      },
    }),
    {
      name: "auth-storage",
      // persist에서 user와 accessToken만 저장 (isAuthenticated는 computed)
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
      // 저장된 데이터에서 isAuthenticated 계산
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.accessToken;
        }
      },
    }
  )
);

