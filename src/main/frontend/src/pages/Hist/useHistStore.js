import { create } from 'zustand';

// Zustand는 React 바깥에 하나의 전역 store 객체 생성
export const useHistStore = create((set) => ({
  // DevExtreme CustomStore
  gridStore: null,
  totalCount: 0,

  // 메시지 팝업
  selectedMessage: '',
  isModalOpen: false,

  setGridStore: (store) =>
    set({ gridStore: store }),

  setTotalCount: (count) =>
    set({ totalCount: count }),

  openMessage: (msg) =>
    set({
      selectedMessage: msg ?? '',
      isModalOpen: true,
    }),

  closeMessage: () =>
    set({
      selectedMessage: '',
      isModalOpen: false,
    }),
}));
