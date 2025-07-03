let startDateInstance;
let endDateInstance;
let largeCategoryInstance;
let titleInstance;
let bulkHistDataGrid;

$(function () {
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);
	
	//조회 기간
	startDateInstance = $("#startDate").dxDateBox({
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
	}).dxDateBox("instance");
	
	endDateInstance = $("#endDate").dxDateBox({
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
	}).dxDateBox("instance");
	
	const histDataSource = new DevExpress.data.CustomStore({
		
		key: "tranPr",
        load: async function(loadOptions) {

			const startValue = startDateInstance.option("value");
			const endValue = endDateInstance.option("value");
			const titleValue = titleInstance.option("value");
			
			let startDateFormatted = "", startTimeFormatted = "";
			let endDateFormatted = "", endTimeFormatted = "";

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

			const params = {
				startDate: startDateFormatted,
				endDate: endDateFormatted,
				startTime: startTimeFormatted + "000000",
				endTime: endTimeFormatted + "235959",
				title: titleValue,
			};

			try {
				const res = await fetch('/api/v1/hist/list', {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(params)
				});

				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}

				const data = await res.json();

				return {
					data: data
				};
			} catch (error) {
				console.error('데이터 로드 실패:', error);
				alert('데이터를 불러오는 중 오류가 발생했습니다.');
			}
		}
    });

	//조회 그리드
	bulkHistDataGrid = $("#bulkHistGrid").dxDataGrid({
		dataSource: [
			{ b_msg_key: "0000001", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000002", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000003", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000004", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000005", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000006", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000007", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000008", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000009", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000010", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000011", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000012", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000013", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000014", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000015", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000016", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000017", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000018", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000019", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000020", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000021", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000022", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000023", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000024", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000025", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000026", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000027", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000028", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000029", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000030", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000031", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000032", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000033", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000034", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000035", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000036", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000037", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000038", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000039", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000040", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000041", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000042", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000043", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000044", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000045", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000046", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000047", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000048", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000049", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000050", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000051", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000052", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000053", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000054", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000055", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000056", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000057", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000058", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000059", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000060", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000061", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000062", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000063", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000064", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000065", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000066", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000067", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000068", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000069", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
			{ b_msg_key: "0000070", user_id: "admin", title: "SMS 발송 테스트", msg: "SMS 발송 테스트입니다.", req_time: "2025-07-01 09:00:00", cnt: "100", svc_type: "EXCEL", send_cnt: "100/0" },
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
		columnAutoWidth: true,
		columns: [
			{ dataField: "title", caption: "제목", alignment: "left" },
			{ dataField: "req_time", caption: "전송 일시", alignment: "center" },
			{ dataField: "msg", caption: "메시지 내용", alignment: "left" },
			{ dataField: "cnt", caption: "전체", alignment: "center" },
			{
				name: "detailBtn",
				caption: "상세",
				type: "buttons",
				buttons: [{
					icon: "find",
					onClick(e) {
						alert("상세조회");
					},
				}],
			},
			{ dataField: "user_id", caption: "발송ID", alignment: "center" },
			{ dataField: "svc_type", caption: "TYPE", alignment: "center" },
			{ dataField: "send_cnt", caption: "성공/실패", alignment: "center" },
			{
				name: "textBtn",
				caption: "text파일",
				type: "buttons",
				buttons: [{
					icon: "download",
					onClick(e) {
						alert("다운로드");
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

	//대분류
	largeCategoryInstance = $('#large-category').dxSelectBox({
		dataSource: [{
			Code: 0,
			Name: '옥션',
		},{
			Code: 1,
			Name: '지마켓',
		}],
			displayExpr: 'Name',
			valueExpr: 'Code',
			value: 1
	}).dxSelectBox("instance");

	//제목
	titleInstance = $('#bulk-title').dxTextBox({
		placeholder: '제목을 입력하세요.'
	}).dxTextBox("instance");
});

//엑셀 다운로드 버튼
document.getElementById("excel-btn").addEventListener('click',function(e){
	e.preventDefault();
	const grid = $("#bulkHistGrid").dxDataGrid("instance");
	exportGridToExcel(grid);
})

//엑셀 다운로드
function exportGridToExcel(gridInstance){
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('대량발송 이력');
	
	DevExpress.excelExporter.exportDataGrid({
		component: gridInstance,
		worksheet: worksheet,
		autoFilterEnabled: true,
	}).then(() => {
		workbook.xlsx.writeBuffer().then((buffer) => {
			saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '대량발송 이력.xlsx');
		});
	});
}

//조회 버튼
document.getElementById("search-btn").addEventListener('click', function(e){
	e.preventDefault();
	
	const startValue = startDateInstance.option("value");
	const endValue = endDateInstance.option("value");
	const titleValue = titleInstance.option("value");
	
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
		title: titleValue,
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
		// histDataSource = data;
		histDataGrid.option("dataSource", data);
	})
	.catch(error => {
		console.error("데이터 로드 실패:", error);
		alert("데이터를 불러오는 중 오류가 발생했습니다.");
	});
})
