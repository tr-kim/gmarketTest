let startDateInstance;
let endDateInstance;
let companyInstance;
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
	companyInstance = $('#companyCode').dxSelectBox({
		dataSource: [
			{ code: 0, name: '옥션' },
			{ code: 1, name: '지마켓' },
			{ code: 2, name: '스마일캐시' }
		],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 0
	}).dxSelectBox("instance");
	
	//제목
	titleInstance = $('#bulk-title').dxTextBox({
		placeholder: '제목을 입력하세요.'
	}).dxTextBox("instance");
	
	//엑셀 다운로드 버튼
	$('#excel-btn').dxButton({
		stylingMode: 'contained',
		text: '엑셀 다운로드',
		type: 'success',
		width: 120,
		onClick() {
			const grid = $("#bulkHistGrid").dxDataGrid("instance");
			exportGridToExcel(grid);
		}
	}).dxButton('instance');
	
	//조회 요청
	const bulkHistDataSource = new DevExpress.data.CustomStore({
		key: "bulkMsgKey",
        load: (loadOptions) => {
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
			
			const titleValue = titleInstance.option("value");
			const companyValue = companyInstance.option("value");
			
			const params = {
				startDate: startDateFormatted,
				endDate: endDateFormatted,
				startTime: startTimeFormatted + "000000",
				endTime: endTimeFormatted + "235959",
				bulkTitle: titleValue,
				companyCode: companyValue,
				//페이징 서버사이드 처리
				skip: loadOptions.skip ?? 0, //offset: 앞에서 건너뛸 레코드 수
				take: loadOptions.take ?? 50, //limit: 가져올 레코드 수
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
			.then(data => {
				return {
					data: data.data,
					totalCount: data.totalCount
				};
			})
			.catch(error => {
				console.error("데이터 로드 실패:", error);
				showDialogCustom('error');
				
				return {
				 	data: [],
				 	totalCount: 0
				};
			});
		}
    });
	
	//조회 그리드
	bulkHistDataGrid = $("#bulkHistGrid").dxDataGrid({
		dataSource: bulkHistDataSource,
		loadMode: "raw", //서버사이드 처리
		remoteOperations: {
			paging: true //페이징 서버사이드 처리
		},
		//행 선택 시
		selection: {
			mode: 'single',
		},
		//행 마우스오버 시
		hoverStateEnabled: true,
		headerFilter: {
			visible: true
		},
		height: 500,
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
				caption: "성공/실패", 
				alignment: "center",
				calculateCellValue: function(rowData) {
					return `${rowData.cntSucc}/${rowData.cntDup + rowData.cntSendFail}`;
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

//조회 버튼
$('#search-btn').dxButton({
	stylingMode: 'contained',
	text: '조회',
	type: 'default',
	width: 60,
	onClick() {
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
		const companyValue = companyInstance.option("value");
		
		if(companyValue != 0){
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
			
			let errorMessage = "";

			if (diffDays < 0) {
				errorMessage = `<div style='text-align: center;' class="pt-3">조회 기간을 다시 입력하세요.</div>`;
			} else if (diffDays > 30) {
				errorMessage = `<div style='text-align: center;' class="pt-3">조회 기간을 다시 입력하세요. (30일 이내)
				<br><br><span class="text-black-50">현재 입력한 조회 기간 : ${Math.floor(diffDays)}일</span></div>`;
			}

			if (errorMessage) {
				showDialogCustom(errorMessage);
				return;
			}
		}
		
		//재조회
		bulkHistDataGrid.getDataSource().reload();
	}
}).dxButton('instance');


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

// 상세 보기 모달
function openBulkDetailModal(data = {}) {
	let inTimeValue = "";
	let reqTimeValue = "";
	
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
	document.getElementById('total').value = data.cnt;
	document.getElementById('insert_succ').value = data.succCnt;
	document.getElementById('insert_fail').value = data.failCnt;
	document.getElementById('stanby').value = data.cntStanby;
	document.getElementById('tran').value = data.cntTran;
	document.getElementById('succ_fail').value = `${data.cntSucc}/${data.cntDup + data.cntSendFail}`;
	document.getElementById('msg').value = data.msg;
	
	document.getElementById('bulk_hist_modal').classList.add('d-block');
}

// 상세 보기 모달 - 닫기 버튼
document.getElementById('close_btn').addEventListener('click', function() {
	document.getElementById('bulk_hist_modal').classList.remove('d-block');
})

