import { create } from 'zustand';

export const useWaitStore = create((set) => ({
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

  // 메시지 팝업
  selectedTitle: '',
  selectedInTime: '',
  selectedReqTime: '',
  selectedUserID: '',
  selectedMessage: '',
  isModalOpen: false,

  openMessage: (data) =>
    set({
      selectedTitle: data?.TITLE ?? '',
      selectedInTime: data?.IN_TIME ?? '',
      selectedReqTime: data?.REQ_TIME ?? '',
      selectedUserID: data?.USER_ID ?? '',
      selectedMessage: data?.MSG ?? '',
      isModalOpen: true,
    }),

  closeMessage: () =>
    set({
      selectedTitle: '',
      selectedInTime: '',
      selectedReqTime: '',
      selectedUserID: '',
      selectedMessage: '',
      isModalOpen: false,
    }),
}));
