import { create } from 'zustand';

// Zustand는 React 바깥에 하나의 전역 store 객체 생성
export const useAlarmStore = create((set) => ({
  // DevExtreme CustomStore
  gridStore: null,
  totalCount: 0,

  setGridStore: (store) =>
    set({ gridStore: store }),

  setTotalCount: (count) =>
    set({ totalCount: count }),

}));
