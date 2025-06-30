$(function () {
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);
	
	//조회 기간
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
	
	//조회 그리드
	$("#waitHistGrid").dxDataGrid({
		dataSource: [
			{ b_msg_key: "0000001", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000002", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000003", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000004", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000005", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000006", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000007", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000008", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000009", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000010", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000011", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000012", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000013", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000014", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000015", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000016", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000017", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000018", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000019", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000020", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000021", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000022", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000023", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000024", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000025", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000026", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000027", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000028", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000029", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000030", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000031", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000032", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000033", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000034", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000035", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000036", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000037", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000038", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000039", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000040", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000041", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000042", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000043", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000044", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000045", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000046", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000047", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000048", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000049", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000050", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000051", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000052", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000053", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000054", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000055", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000056", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000057", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000058", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000059", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000060", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000061", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000062", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000063", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000064", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000065", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000066", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000067", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000068", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000069", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
			{ b_msg_key: "0000070", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL" },
		],
		keyExpr: "b_msg_key",
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
		columnAutoWidth: true,
		selection: {
			mode: "multiple"
		},
		columns: [
			{ type: "selection" },
			{ dataField: "title", caption: "제목", alignment: "left" },
			{ dataField: "req_time", caption: "전송 일시", alignment: "center" },
			{ dataField: "msg", caption: "메시지 내용", alignment: "left" },
			{ dataField: "cnt", caption: "전체", alignment: "center" },
			{ dataField: "svc_type", caption: "상세", alignment: "center" },
			{ dataField: "user_id", caption: "발송ID", alignment: "center" },
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

	//대분류
	$('#large-category').dxSelectBox({
		dataSource: [{
			Code: 0,
			Name: '지마켓',
		},{
			Code: 1,
			Name: '옥션',
		}],
			displayExpr: 'Name',
			valueExpr: 'Code',
			value: 0
	});

	//수신자 번호
	$('#wait_title').dxTextBox({
		placeholder: '번호를 입력하세요.'
	});
});

