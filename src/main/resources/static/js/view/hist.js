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

