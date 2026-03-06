import { create } from 'zustand';

export const useHistStore = create((set) => ({
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

  // 중분류(테이블명)
  codeList: [],
  setCodeList: (list) =>
    set({ codeList: list }),

  // 메시지 팝업
  selectedMessage: '',
  isModalOpen: false,

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
