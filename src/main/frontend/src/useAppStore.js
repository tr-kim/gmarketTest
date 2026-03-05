import { create } from 'zustand';

export const useAppStore = create((set) => ({
  session: null,
  sessionReady: false,

  setSession: (session) =>
    set({
      session,
      sessionReady: true,
    }),

  finishSession: () =>
    set({
      sessionReady: true,
    }),
}));
