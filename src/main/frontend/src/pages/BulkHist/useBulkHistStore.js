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

  // 메시지 팝업
  selectedTitle: '',
  selectedInTime: '',
  selectedReqTime: '',
  selectedUserID: '',
  selectedSendInfo: '',
  selectedCount: '',
  selectedSuccCount: '',
  selectedFailCount: '',
  selectedStandbyCount: '',
  selectedTranCount: '',
  selectedSuccFailCount: '',
  selectedMessage: '',
  isModalOpen: false,

  openMessage: (data) =>
    set({
      selectedTitle: data?.TITLE ?? '',
      selectedInTime: data?.IN_TIME ?? '',
      selectedReqTime: data?.REQ_TIME ?? '',
      selectedUserID: data?.USER_ID ?? '',
      selectedSendInfo: data?.SEND_INFO ?? '',
      selectedCount: data?.CNT ?? '',
      selectedSuccCount: data?.SUCC_CNT ?? '',
      selectedFailCount: data?.FAIL_CNT ?? '',
      selectedStandbyCount: data?.CNT_STANBY ?? '',
      selectedTranCount: data?.CNT_TRAN ?? '',
      selectedSuccFailCount: data 
        ? `${data.CNT_SUCC ?? 0} / ${(data.CNT_DUP ?? 0) + (data.CNT_SENDFAIL ?? 0)}`
        : '',
      selectedMessage: data?.MSG ?? '',
      isModalOpen: true,
    }),

  closeMessage: () =>
    set({
      selectedTitle: '',
      selectedInTime: '',
      selectedReqTime: '',
      selectedUserID: '',
      selectedSendInfo: '',
      selectedCount: '',
      selectedSuccCount: '',
      selectedFailCount: '',
      selectedStandbyCount: '',
      selectedTranCount: '',
      selectedSuccFailCount: '',
      selectedMessage: '',
      isModalOpen: false,
    }),
}));
