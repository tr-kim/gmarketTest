import { create } from 'zustand';

export const useBulkHistStore = create((set) => ({
  // DevExtreme CustomStore
  gridStore: null,
  setGridStore: (store) =>
    set({ gridStore: store }),

  // 조회 그리드
  gridInstance: null,
  setGridInstance: (inst) =>
    set({ gridInstance: inst }),

  // 그리드 합계
  totalCount: 0,
  setTotalCount: (count) =>
    set({ totalCount: count }),
}));
