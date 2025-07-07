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
	
	//조회 요청
	const bulkHistDataSource = new DevExpress.data.CustomStore({
		key: "bulkMsgKey",
        load: (loadOptions) => {
			const startValue = startDateInstance.option("value");
			const endValue = endDateInstance.option("value");
			
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
			
			const titleValue = titleInstance.option("value");
			
			const params = {
				startDate: startDateFormatted,
				endDate: endDateFormatted,
				startTime: startTimeFormatted + "000000",
				endTime: endTimeFormatted + "235959",
				bulkTitle: titleValue,
			};
			
			return fetch('/api/v1/bulkHist/list', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(params)
			})
			.then(response => {
				if (!response.ok) throw new Error("서버 오류");
				return response.json();
			})
			.catch(error => {
				console.error("데이터 로드 실패:", error);
				alert("데이터를 불러오는 중 오류가 발생했습니다.");
			});
		}
    });
	
	//조회 그리드
	bulkHistDataGrid = $("#bulkHistGrid").dxDataGrid({
		dataSource: bulkHistDataSource ,
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
			{ dataField: "title", caption: "제목", alignment: "left" },
			{ 
				dataField: "reqTime", 
				caption: "전송 일시", 
				alignment: "center",
				customizeText: function(cellInfo) {
					return formatTimestamp(cellInfo.value);
				}
			},
			{ dataField: "msg", caption: "메시지 내용", alignment: "left" },
			{ dataField: "cnt", caption: "전체", alignment: "center" },
			{
				name: "detail",
				caption: "상세",
				type: "buttons",
				buttons: [{
					icon: "find",
					onClick: function(e) {
                    openBulkDetailModal(e.row.data);
                }					
				}],
			},
			{ dataField: "userID", caption: "발송ID", alignment: "center" },
			{ dataField: "svcType", caption: "TYPE", alignment: "center" },
			{ 
				dataField: "status", 
				caption: "성공/실패", 
				alignment: "center",
				customizeText: function(cellInfo) {
					const value = String(cellInfo.value.trim());
					
					switch (value) {						
						case "0" : return "성공";
						case "1" : return "실패";
						default: return "기타";
					}
				} 
			},
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
		},
	}).dxDataGrid("instance");

});

//엑셀 다운로드 버튼
document.getElementById("excel-btn").addEventListener('click',function(e){
	e.preventDefault();
	const grid = $("#bulkHistGrid").dxDataGrid("instance");
	exportGridToExcel(grid);
})

//조회 버튼
document.getElementById("search-btn").addEventListener('click', function(e){
	e.preventDefault();
	
	const startValue = startDateInstance.option("value");
	const endValue = endDateInstance.option("value");
	
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
	const largeCategoryValue = largeCategoryInstance;
	
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
	
	//재조회
	bulkHistDataGrid.getDataSource().reload();
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

// 상세보기
let inTimeValue = "";
let reqTimeValue = "";

function formatTimestamp(str) {
	str = str.trim();
	const yyyy = str.slice(0, 4);
	const mm = str.slice(4, 6);
	const dd = str.slice(6, 8);
	const hh = str.slice(8, 10);
	const mi = str.slice(10, 12);
	const ss = str.slice(12, 14);
	return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function openBulkDetailModal(data = {}) {

	// const param = {};
	// postAjax('/api/v1/bulkHist', param, rsaCallback);
	
	if (data.inTime) {
		inTimeValue = formatTimestamp(data.inTime);
	}

	if (data.reqTime) {
		reqTimeValue = formatTimestamp(data.reqTime);
	}

	currentKey = data.bulkMsgKey; 
	document.getElementById('title').value = data.title;
	document.getElementById('in_time').value = inTimeValue;
	document.getElementById('req_time').value = reqTimeValue;
	document.getElementById('user_id').value = data.userID;
	document.getElementById('send_info').value = '전송 대상';
	document.getElementById('total').value = '전체';
	document.getElementById('insert_succ').value = '등록 성공';
	document.getElementById('insert_fail').value = '등록 실패';
	document.getElementById('stanby').value = '대기중';
	document.getElementById('tran').value = '전송중';
	document.getElementById('succ_fail').value = '성공/실패';
	document.getElementById('msg').value = data.msg;

	document.getElementById('bulk_hist_modal').classList.add('d-block');
}

// 상세 보기 모달 - 닫기 버튼
const close_btns = document.querySelectorAll('.close_btn');
close_btns.forEach(close_btn => {
	close_btn.addEventListener('click', function() {
		document.getElementById('bulk_hist_modal').classList.remove('d-block');
	})
})
