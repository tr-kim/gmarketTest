$(function () {
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);
	
	//조회 그리드
	$("#waitHistGrid").dxDataGrid({
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
			{ idx: 13, msg_key: "0000013", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 14, msg_key: "0000014", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 15, msg_key: "0000015", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 16, msg_key: "0000016", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 17, msg_key: "0000017", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 18, msg_key: "0000018", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 19, msg_key: "0000019", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 20, msg_key: "0000020", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 21, msg_key: "0000021", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 22, msg_key: "0000022", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 23, msg_key: "0000023", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 24, msg_key: "0000024", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 25, msg_key: "0000025", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 26, msg_key: "0000026", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 27, msg_key: "0000027", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 28, msg_key: "0000028", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 29, msg_key: "0000029", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 30, msg_key: "0000030", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 31, msg_key: "0000031", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 32, msg_key: "0000032", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 33, msg_key: "0000033", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 34, msg_key: "0000034", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 35, msg_key: "0000035", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 36, msg_key: "0000036", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 1, msg_key: "0000037", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 2, msg_key: "0000038", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 3, msg_key: "0000039", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 4, msg_key: "0000040", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 5, msg_key: "0000041", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 6, msg_key: "0000042", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 7, msg_key: "0000043", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 8, msg_key: "0000044", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 9, msg_key: "0000045", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 10, msg_key: "0000046", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 11, msg_key: "0000047", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 12, msg_key: "0000048", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 1, msg_key: "0000049", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 2, msg_key: "0000050", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 3, msg_key: "0000051", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 4, msg_key: "0000052", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 5, msg_key: "0000053", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 6, msg_key: "0000054", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 7, msg_key: "0000055", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 8, msg_key: "0000056", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 9, msg_key: "0000057", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 10, msg_key: "0000058", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 11, msg_key: "0000059", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 12, msg_key: "0000060", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 1, msg_key: "0000061", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 2, msg_key: "0000062", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 3, msg_key: "0000063", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 4, msg_key: "0000064", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 5, msg_key: "0000065", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 6, msg_key: "0000066", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 7, msg_key: "0000067", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 8, msg_key: "0000068", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 9, msg_key: "0000069", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 10, msg_key: "0000070", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 11, msg_key: "0000071", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
			{ idx: 12, msg_key: "0000072", msg_type: "SMS", callback_no: "010-1234-5678", caller_no: "010-8765-4321", gubun1: "LG", gubun2: "LG", status1: "완료", status2: "기타오류(999)", msg_body: "SMS 발송 테스트입니다." },
		],
		keyExpr: "msg_key",
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
		selection: {
			mode: "multiple"
		},
		columns: [
			{ dataField: "idx", caption: "NO" },
			{ dataField: "", caption: "제목" },
			{ dataField: "", caption: "전송일시" },	
			{ dataField: "msg_body", caption: "내용" },
			{ dataField: "", caption: "전체" },		
			{ dataField: "", caption: "상세" },		
			{ dataField: "", caption: "발송ID" },			
			{ 
				type: "selection", 
      			width: 50
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

