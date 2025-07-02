let startDateInstance;
let endDateInstance;
let tranPhoneInstance;
let largeCategoryInstance;
let middleCategoryInstance;

$(function () {
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);
	
	//조회 기간
	startDateInstance = $("#startDate").dxDateBox({
		type: "date",
		value: startDate,
		displayFormat: "yyyy-MM-dd",
		pickerType: "calendar",
		calendarOptions: {
			minZoomLevel: "year"
		}
	}).dxDateBox("instance");
	
	endDateInstance = $("#endDate").dxDateBox({
		type: "date",
		value: endDate,
		displayFormat: "yyyy-MM-dd",
		pickerType: "calendar",
		calendarOptions: {
			minZoomLevel: "year"
		}
	}).dxDateBox("instance");
	
	//대분류
	largeCategoryInstance = $('#large-category').dxSelectBox({
		dataSource: [
			{ code: 0, name: '옥션' },
			{ code: 1, name: '지마켓' }
		],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 0,
		onValueChanged: function (e) {
			const selectedCode = e.value;
			// middle-category 내용 업데이트
			middleCategoryInstance.option('dataSource', middleCategoryData[selectedCode] || []);
			middleCategoryInstance.option('value', 0); // 기본값 다시 설정
		}
	}).dxSelectBox("instance");
	
	const middleCategoryData = {
		0: [
			{ code: 0, name: '전체' },
			{ code: 1, name: 'SMSCLI_TBL_CHARGED' },
			{ code: 2, name: 'SMSCLI_TBL_ESCROW' },
			{ code: 3, name: 'SMSCLI_TBL_OUTBID' },
			{ code: 4, name: 'SMSCLI_TBL_API' },
			{ code: 5, name: 'SMSCLI_TBL_BATCH' },
			{ code: 6, name: 'SMSCLI_TBL_MOTORS' },
			{ code: 7, name: 'SMSCLI_TBL_PUMBL' },
			{ code: 8, name: 'SMSCLI_TBL_EVENT' },
			{ code: 9, name: 'SMSCLI_TBL_LARGE' },
			{ code: 21, name: 'LMSCLI_TBL_EVENT' },
			{ code: 22, name: 'LMSCLI_TBL_LARGE' },
			{ code: 41, name: 'MMSCLI_TBL_EVENT' },
			{ code: 42, name: 'MMSCLI_TBL_LARGE' },
			{ code: 71, name: 'IAC_SMSCLI_TBL_LARGE' },
			{ code: 72, name: 'IAC_LMSCLI_TBL_LARGE'},
			{ code: 73, name: 'IAC_MMSCLI_TBL_LARGE'}
		],
		1: [
			{ code: 0, name: '전체' },
			{ code: 11, name: 'SMSCLI_TBL_EMG' },
			{ code: 12, name: 'SMSCLI_TBL_ETC' },
			{ code: 13, name: 'SMSCLI_TBL_ORDER' },
			{ code: 14, name: 'SMSCLI_TBL_TRAN' },
			{ code: 15, name: 'SMSCLI_TBL_EVENT' },
			{ code: 16, name: 'SMSCLI_TBL_LARGE' },
			{ code: 31, name: 'LMSCLI_TBL_EVENT' },
			{ code: 32, name: 'LMSCLI_TBL_LARGE' },
			{ code: 51, name: 'MMSCLI_TBL_EVENT' },
			{ code: 52, name: 'MMSCLI_TBL_LARGE' },
			{ code: 61, name: 'GMKT_SMSCLI_TBL_LARGE' },
			{ code: 62, name: 'GMKT_LMSCLI_TBL_LARGE' },
			{ code: 63, name: 'GMKT_MMSCLI_TBL_LARGE' },
			{ code: 110, name: 'SFC_SMSCLI_TBL'}
		]
	};

	//중분류
	middleCategoryInstance = $('#middle-category').dxSelectBox({
		dataSource: middleCategoryData[0],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 0
	}).dxSelectBox("instance");
	
	//수신자 번호
	tranPhoneInstance = $('#receive-num').dxTextBox({
		placeholder: '번호를 입력하세요.'
	}).dxTextBox("instance");
	
	//조회 그리드
	$("#histGrid").dxDataGrid({
		dataSource: [
			{ tran_pr: 1, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 2, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 3, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 4, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 5, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 6, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 7, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 8, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 9, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 10, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 11, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 12, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 13, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 14, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 15, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 16, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 17, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 18, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 19, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 20, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 21, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 22, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 23, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 24, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 25, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 26, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 27, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 28, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 29, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 30, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 31, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 32, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 33, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 34, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 35, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 36, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 37, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 38, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 39, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 40, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 41, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 42, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 43, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 44, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 45, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 46, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 47, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 48, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 49, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 50, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 51, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 52, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 53, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 54, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 55, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 56, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 57, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 58, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 59, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 60, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 61, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 62, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 63, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 64, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 65, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 66, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 67, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 68, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 69, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
			{ tran_pr: 70, tran_callback: "010-1111-2222", tran_phone: "010-1234-5678", tran_date: "2025-07-01 09:00:00", corp_reserved2: "KT", tran_rslt: "성공", tran_msg: "SMS 발송 테스트입니다." },
		],
		headerFilter: {
			visible: true
		},
		searchPanel: {
			visible: true,
			width: 300
		},
		paging: {
			pageSize: 50
		},
		pager: {
			visible: true,
			showInfo: true,
			showNavigationButtons: true,
			showPageSizeSelector: true,
			allowedPageSizes: [50, 100, 200]
		},
		columnAutoWidth: true,
		allowColumnResizing: true,
		columnResizingMode: 'widget',
		columnAutoWidth: true,
		columns: [
			{ dataField: "tran_pr", caption: "NO", alignment: "center" },
			{ dataField: "tran_phone", caption: "수신 번호", alignment: "center" },
			{ dataField: "tran_callback", caption: "발신 번호", alignment: "center" },
			{ dataField: "tran_date", caption: "발송 일시", alignment: "center" },
			{ dataField: "tran_msg", caption: "문자 내용", alignment: "left" },
			{ dataField: "tran_rslt", caption: "결과", alignment: "center" },
			{ dataField: "corp_reserved2", caption: "Flow #", alignment: "center" }
		],
		toolbar: {
			items: [
				{
					location: "before",
					template: function() {
					return $("<div>")
						.attr("id", "totalCount")
						.css({ fontSize: "17px", color: "#333", padding: "0 5px" });
					}
				},
				"searchPanel"
			]
		},
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount}건`);
		}
	}).dxDataGrid("instance");
});

//엑셀 다운로드 버튼
document.getElementById("excel-btn").addEventListener('click', function(e){
	e.preventDefault();
	const grid = $("#histGrid").dxDataGrid("instance");
	exportGridToExcel(grid);
})

//조회 버튼
document.getElementById("search-btn").addEventListener('click', function(e){
	e.preventDefault();
	
	const startValue = startDateInstance.option("value");
	const endValue = endDateInstance.option("value");
	const tranPhoneValue = tranPhoneInstance.option("value");
	const largeCategoryValue = largeCategoryInstance.option("value");
	
	let startDateFormatted = "", startTimeFormatted = "";
	let endDateFormatted = "", endTimeFormatted = "";
	
	// 날짜가 Date 객체인지 확인
	if (startValue instanceof Date && !isNaN(startValue)) {
		const yyyy = startValue.getFullYear();
		const mm = String(startValue.getMonth() + 1).padStart(2, '0');
		const dd = String(startValue.getDate()).padStart(2, '0');
		startDateFormatted = `${yyyy}${mm}`;
		startTimeFormatted = `${yyyy}${mm}${dd}`;
	}
	
	if (endValue instanceof Date && !isNaN(endValue)) {
		const yyyy = endValue.getFullYear();
		const mm = String(endValue.getMonth() + 1).padStart(2, '0');
		const dd = String(endValue.getDate()).padStart(2, '0');
		endDateFormatted = `${yyyy}${mm}`;
		endTimeFormatted = `${yyyy}${mm}${dd}`;
	}
	
	// 조회기간 구하기
	console.log('largeCategoryValue', largeCategoryValue);
	if(largeCategoryValue != 0){
		let start = new Date(
			parseInt(startTimeFormatted.slice(0, 4)),
			parseInt(startTimeFormatted.slice(4, 6)) - 1,
			parseInt(startTimeFormatted.slice(6, 8))
		);

		let end = new Date(
			parseInt(endTimeFormatted.slice(0, 4)),
			parseInt(endTimeFormatted.slice(4, 6)) - 1,
			parseInt(endTimeFormatted.slice(6, 8))
		);

		let diffMs = end - start;
		let diffDays = diffMs / (1000 * 60 * 60 * 24);

		if (diffDays < 0) {
			alert("조회 기간을 다시 입력하세요.");
			return false;
		}

		if (diffDays > 30) {
			alert("조회 기간을 다시 입력하세요. (30일 이내)\n\n현재 입력한 조회 기간 : " + Math.floor(diffDays) + "일");
			return false;
		}
	}	
	
	const params = {
		startDate: startDateFormatted,
		endDate: endDateFormatted,
		startTime: startTimeFormatted+"000000",
		endTime: endTimeFormatted+"235959",
		phoneNum: tranPhoneValue
	};
	
	//console.log(params);
	
	fetch('/api/v1/hist/list', {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(params)
	})
	.then(res => res.json())
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.error("데이터 로드 실패:", error);
		alert("데이터를 불러오는 중 오류가 발생했습니다.");
	});
})

//엑셀 다운로드
function exportGridToExcel(gridInstance){
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('이력조회');
	
	DevExpress.excelExporter.exportDataGrid({
		component: gridInstance,
		worksheet: worksheet,
		autoFilterEnabled: true,
	}).then(() => {
		workbook.xlsx.writeBuffer().then((buffer) => {
			saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '이력조회.xlsx');
		});
	});
}

