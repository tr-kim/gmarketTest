$(function () {
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);
	
	//조회 그리드
	$("#bulkHistGrid").dxDataGrid({
		dataSource: [
			{ idx: 1, msg_key: "0000001", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 2, msg_key: "0000002", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 3, msg_key: "0000003", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 4, msg_key: "0000004", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 5, msg_key: "0000005", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 6, msg_key: "0000006", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 7, msg_key: "0000007", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 8, msg_key: "0000008", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 9, msg_key: "0000009", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 10, msg_key: "0000010", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 11, msg_key: "0000011", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 12, msg_key: "0000012", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 13, msg_key: "0000001", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 14, msg_key: "0000002", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 15, msg_key: "0000003", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 16, msg_key: "0000004", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 17, msg_key: "0000005", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 18, msg_key: "0000006", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 19, msg_key: "0000007", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 20, msg_key: "0000008", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 21, msg_key: "0000009", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 22, msg_key: "0000010", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 23, msg_key: "0000011", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 24, msg_key: "0000012", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 25, msg_key: "0000001", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 26, msg_key: "0000002", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 27, msg_key: "0000003", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 28, msg_key: "0000004", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 29, msg_key: "0000005", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 30, msg_key: "0000006", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 31, msg_key: "0000007", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 32, msg_key: "0000008", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 33, msg_key: "0000009", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 34, msg_key: "0000010", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 35, msg_key: "0000011", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 36, msg_key: "0000012", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 1, msg_key: "0000001", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 2, msg_key: "0000002", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 3, msg_key: "0000003", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 4, msg_key: "0000004", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 5, msg_key: "0000005", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 6, msg_key: "0000006", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 7, msg_key: "0000007", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 8, msg_key: "0000008", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 9, msg_key: "0000009", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 10, msg_key: "0000010", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 11, msg_key: "0000011", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 12, msg_key: "0000012", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 1, msg_key: "0000001", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 2, msg_key: "0000002", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 3, msg_key: "0000003", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 4, msg_key: "0000004", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 5, msg_key: "0000005", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 6, msg_key: "0000006", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 7, msg_key: "0000007", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 8, msg_key: "0000008", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 9, msg_key: "0000009", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 10, msg_key: "0000010", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 11, msg_key: "0000011", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 12, msg_key: "0000012", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 1, msg_key: "0000001", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 2, msg_key: "0000002", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 3, msg_key: "0000003", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 4, msg_key: "0000004", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 5, msg_key: "0000005", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 6, msg_key: "0000006", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 7, msg_key: "0000007", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 8, msg_key: "0000008", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 9, msg_key: "0000009", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 10, msg_key: "0000010", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 11, msg_key: "0000011", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 12, msg_key: "0000012", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
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
			showNavigationButtons: true,
			showPageSizeSelector: true,
			allowedPageSizes: [50, 100, 200]
		},
		columnAutoWidth: true,
		allowColumnResizing: true,
		columnResizingMode: 'widget',
		columns: [
			{ dataField: "idx", caption: "NO" },
			{ dataField: "", caption: "제목" },
			{ dataField: "msg_body", caption: "내용" },
			{ dataField: "", caption: "전체" },			
			{ dataField: "", caption: "발송ID" },
			{ dataField: "", caption: "TYPE" },
			{ dataField: "status2", caption: "성공/실패" },		
			{ 
				dataField: "", 
				caption: "상세" , 
				type: 'buttons', 
				width: 60,				
				buttons: [{
					icon: 'find',
					onClick(e) {
						alert('test');
					},
				}],
			},				
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

	//달력
	$("#startDate").dxDateBox({
		type: "date",
		value: startDate,
		displayFormat: "yyyy-MM-dd",
		onValueChanged(e) {
			const date = e.value;
			if (date instanceof Date && !isNaN(date)) {
				const yyyy = date.getFullYear();
				const mm = String(date.getMonth() + 1).padStart(2, '0');
				const dd = String(date.getDate()).padStart(2, '0');
				
				console.log(`${yyyy}${mm}${dd}`);
			}
		},
	});

	$("#endDate").dxDateBox({
		type: "date",
		value: endDate,
		displayFormat: "yyyy-MM-dd",
		onValueChanged(e) {
			const date = e.value;
			if (date instanceof Date && !isNaN(date)) {
				const yyyy = date.getFullYear();
				const mm = String(date.getMonth() + 1).padStart(2, '0');
				const dd = String(date.getDate()).padStart(2, '0');
				
				console.log(`${yyyy}${mm}${dd}`);
			}
		},
	});
});

document.getElementById("excel-btn").addEventListener('click',function(e){
	e.preventDefault();
	const grid = $("#bulkHistGrid").dxDataGrid("instance");
	exportGridToExcel(grid);
})

//엑셀 다운로드
function exportGridToExcel(gridInstance){
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('대량 발송 이력조회');
	
	DevExpress.excelExporter.exportDataGrid({
		component: gridInstance,
		worksheet: worksheet,
		autoFilterEnabled: true,
	}).then(() => {
		workbook.xlsx.writeBuffer().then((buffer) => {
			saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '대량 발송 이력조회.xlsx');
		});
	});
}

