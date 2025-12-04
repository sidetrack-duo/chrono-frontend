/// <reference types="vite/client" />

declare global {
  interface Window {
    __CHRONO_DEV__?: {
      setMockAuth: () => Promise<void>;
      clearAuth: () => Promise<void>;
    };
  }
}

export {};

