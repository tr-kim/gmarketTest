import { create } from 'zustand';

// Zustand는 React 바깥에 하나의 전역 store 객체 생성
export const useAlarmStore = create((set) => ({
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
