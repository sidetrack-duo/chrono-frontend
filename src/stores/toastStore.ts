import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  timers: Map<string, number>;
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  timers: new Map(),
  showToast: (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    const timerId = setTimeout(() => {
      set((state) => {
        const newTimers = new Map(state.timers);
        newTimers.delete(id);
        return {
          toasts: state.toasts.filter((toast) => toast.id !== id),
          timers: newTimers,
        };
      });
    }, 3000);

    set((state) => {
      const newTimers = new Map(state.timers);
      newTimers.set(id, timerId);
      return {
        toasts: [...state.toasts, { id, message, type }],
        timers: newTimers,
      };
    });
  },
  removeToast: (id: string) => {
    set((state) => {
      const timer = state.timers.get(id);
      if (timer) {
        clearTimeout(timer);
      }
      const newTimers = new Map(state.timers);
      newTimers.delete(id);
      return {
        toasts: state.toasts.filter((toast) => toast.id !== id),
        timers: newTimers,
      };
    });
  },
}));
