let dataGrid;
let companyInstance;
let companyValue;
let tableInstance;
let tableValue;
let startDateInstance;
let endDateInstance;
let startHourInstance;
let endHourInstance;
let checkedRadio;
const period = 30;	// 최대 검색 기간

$(function() {
	
	// 일주일 기본값 설정
	const today = new Date();
	
	const startYear = today.getFullYear(); 
	const startMonth = `${String(today.getMonth() + 1).padStart(2, '0')}`; 
	const startDay = `${String(today.getDate()).padStart(2, '0')}`;
	
	const endYear = today.getFullYear(); 
	const endMonth = `${String(today.getMonth() + 1).padStart(2, '0')}`; 
	const endDay = `${String(today.getDate()).padStart(2, '0')}`; 

	//라디오
	const radios = document.querySelectorAll('input[name="timeType"]');
	
	// 시작일
	startDateInstance = $("#startDate").dxDateBox({
		type: "date",
	    name: "startDate",
		displayFormat: "yyyy-MM-dd",
		pickerType: "calendar",
		calendarOptions: {
			minZoomLevel: "decade"
		}
	}).dxDateBox("instance");
	
	// 종료일
	endDateInstance = $("#endDate").dxDateBox({
		type: "date",
	    name: "endDate",
		displayFormat: "yyyy-MM-dd",
		pickerType: "calendar",
		calendarOptions: {
			minZoomLevel: "decade"
		}
	}).dxDateBox("instance");
	
	radios.forEach(radio => {
		radio.addEventListener('change', function() {
			//시간
			if (this.value == "1") {
				
				// 시작일
				startDateInstance.option("value", `${startYear}-${startMonth}-${startDay}`);
				startDateInstance.option("displayFormat", "yyyy-MM-dd");
				
				// 종료일	
				endDateInstance.option("value", `${endYear}-${endMonth}-${endDay}`);
				endDateInstance.option("displayFormat", "yyyy-MM-dd");
				
				// 시작 시간
				startHourInstance = $("#startHour")	.dxDateBox({
					type: 'time',
					name: "startHour",
					value: new Date(2025, 0, 1, 0, 0, 0),	// type이 time이면 날짜는 아무거나 넣어도 상관없음
					displayFormat: "HH시",
					pickerType: "list",
					interval: 60,			// 분 선택 없애기 (1시간 단위)
					width: 135,
				}).dxDateBox("instance");
				
				// 종료 시간
				endHourInstance = $("#endHour")	.dxDateBox({
					type: 'time',
					name: "endHour",
					value: new Date(2025, 0, 1, 23, 0, 0),	// type이 time이면 날짜는 아무거나 넣어도 상관없음
					displayFormat: "HH시",
					pickerType: "list",
					interval: 60,			// 분 선택 없애기 (1시간 단위)
					width: 135,
				}).dxDateBox("instance");
				
				startHourInstance.option("visible", true);
				endHourInstance.option("visible", true);
			
			} else if (this.value == "2") {
				
				// 시작일
				startDateInstance.option("value", `${startYear}-${startMonth}-${startDay}`);
				startDateInstance.option("displayFormat", "yyyy-MM-dd");
			
				// 종료일
				endDateInstance.option("value", `${endYear}-${endMonth}-${endDay}`);
				endDateInstance.option("displayFormat", "yyyy-MM-dd");
				
				// 숨김 처리
				if(startHourInstance && endHourInstance) {
					startHourInstance.option("value", "");
					endHourInstance.option("value", "");
					
					startHourInstance.option("visible", false);
					endHourInstance.option("visible", false);
				}
				
			} else if (this.value == "3") {
				
				// 시작일
				startDateInstance.option("value", new Date(startYear, startMonth - 1, 1));
				startDateInstance.option("displayFormat", "yyyy-MM");
				
				// 종료일	
				endDateInstance.option("value", new Date(endYear, endMonth - 1, 1));
				endDateInstance.option("displayFormat", "yyyy-MM");
				
				// 숨김 처리
				if(startHourInstance && endHourInstance) {
					startHourInstance.option("value", "");
					endHourInstance.option("value", "");
					
					startHourInstance.option("visible", false);
					endHourInstance.option("visible", false);
				}
				
			} else if (this.value == "4") {
				
				// 시작일
				startDateInstance.option("value", new Date(startYear, 0, 1));
				startDateInstance.option("displayFormat", "yyyy");
				
				// 종료일
				endDateInstance.option("value", new Date(endYear, 0, 1));
				endDateInstance.option("displayFormat", "yyyy");
				
				// 숨김 처리
				if(startHourInstance && endHourInstance) {
					startHourInstance.option("value", "");
					endHourInstance.option("value", "");
					
					startHourInstance.option("visible", false);
					endHourInstance.option("visible", false);
				}
			}
		})
	});

	checkedRadio = document.querySelector('input[name="timeType"]:checked');
	if (checkedRadio) checkedRadio.dispatchEvent(new Event('change'));
	
	// 기본 옵션
	const defaultOption = { code: -1, name: '선택하세요' };
	
	// 중분류 목록 설정
	const tableArray = [0, 1, 2].reduce((acc, idx) => {
		acc[idx] = [defaultOption, { code: 0, name: '전체' }];
		return acc;
	}, {});
	
	// codeList 병합
	codeList.forEach(({ companyCode, code, name }) => {
		if (tableArray[companyCode]) {
			tableArray[companyCode].push({ code, name });
		}
	});
	
	//중분류
	tableInstance = $('#tableCategory').dxSelectBox({
		dataSource: tableArray[companyCode] || [defaultOption],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 0,
		name: "tableCode",
		onValueChanged: function(e) {
			
			// select text 가져오기
			tableValue = e.component.option("displayValue");
		}
	}).dxSelectBox("instance");
	
	// 계정 구분에 따른 option 설정
	let companyArray = [{ code: -1, name: '선택하세요' }];
	
	const companyList = [
	    { code: 0, name: '옥션' },
	    { code: 1, name: 'G마켓' },
	    { code: 2, name: '스마일캐시' }
	];
	
	companyList.forEach(company => {
	    if (userGrade === 0 || (userGrade === 1 && companyCode === company.code)) companyArray.push(company);
	});
	
	//대분류
	companyInstance = $('#companyCategory').dxSelectBox({
		dataSource: companyArray,
		displayExpr: 'name',
		valueExpr: 'code',
		value: companyCode,
		name: "companyCode",
		onValueChanged: function(e) {
			//중분류 업데이트
			companyValue = e.value;
			tableInstance.option('dataSource', tableArray[companyValue] || [defaultOption]);
			tableInstance.option('value', -1); // 기본값 다시 설정
			
		}
	}).dxSelectBox("instance");

	//조회 그리드
	dataGrid = $("#statGrid").dxDataGrid({
		dataSource: {
			load: function(loadOptions) {
				
				const companyCode = companyInstance.option('value');
				const tableCode = tableInstance.option('value');
				const timeType = checkedRadio.value;
				const startDate = startDateInstance.option("value");
				const endDate = endDateInstance.option("value");
				
				const param = {
					companyCode: companyCode
					, tableCode: tableCode
					, timeType: timeType
					, startDate: startDate
					, endDate: endDate
					, skip: loadOptions.skip || 0
					, take: loadOptions.take || 50
					// , sort: loadOptions.sort || []
				};
				
				// 구분값이 시간일 경우
				if(timeType === "1") {
					param.startHour = String(startHourInstance.option("value").getHours()).padStart(2, "0");
					param.endHour = String( endHourInstance.option("value").getHours()).padStart(2, "0");
				}
				
				return $.ajax({
					url: "/api/v1/stat/list",
					type: "POST",
					contentType: "application/json",
					data: JSON.stringify(param),
				}).then(function(result) {
					return {
						data: result.list || [],
						totalCount: result.totalCount || 0
					};
				}).catch(function() {
					showDialogCustom("error");
					return {
						data: [],
						totalCount: 0
					};
				});
			}
		},
		loadMode: "raw", //서버사이드 처리
		remoteOperations: {
			filtering: false, // searchPanel 검색
			grouping: false, // columns 검색
			paging: true,
			sorting: false // G마켓만 TABLE_NAME 정렬 가능. 옥션은 SQLServerException 발생하여 false로 변경.
		},
		//행 선택 시
		selection: {
			mode: 'single',
		},
		//행 마우스오버 시
		hoverStateEnabled: true,
		headerFilter: {
			visible: false
		},
		searchPanel: {
			visible: false,
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
		columns: [
			{
				dataField: "RESULT_DATE", 
				caption: "시간/일자", 
				alignment: "center",
				customizeText: function(cellInfo) {
					return formatTimestamp(cellInfo.value);
				}
			},
			{
				dataField: "",
				caption: "대분류",
				alignment: "center",
				calculateCellValue: function(rowData) {
					switch (companyInstance.option('value')) {
						case 0: return "옥션";
						case 1: return "G마켓";
						case 2: return "스마일캐시";
					}
				}
			},
			{ dataField: "TABLE_NAME", caption: "중분류", alignment: "center" },
			{ dataField: "TRY_CNT", caption: "전체", alignment: "center" },
			{ dataField: "SUCC_CNT", caption: "성공", alignment: "center" },
			{ dataField: "FAIL_CNT", caption: "실패", alignment: "center" },
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
		onRowClick: function (e) {
			openStatFailDetail(e.data);
		},
	    onContentReady(e) {
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount.toLocaleString()}건`);
			
			tableValue = (tableValue == "선택하세요" || tableValue === undefined) ? "" : tableValue;
	    }
	}).dxDataGrid("instance");
});

//날짜 포맷팅
function formatTimestamp(str) {
    if (!str) return "";
    str = String(str).trim();

    const len = str.length;
    const yyyy = str.slice(0, 4);
    const mm = str.slice(4, 6);
    const dd = str.slice(6, 8);
    const hh = str.slice(8, 10);

    switch (len) {
        case 4: 
            return yyyy;

        case 6: 
            return `${yyyy}-${mm}`;

        case 8: 
            return `${yyyy}-${mm}-${dd}`;

        case 10: 
            return `${yyyy}-${mm}-${dd} ${hh}:00`;

        default:
            return str; 
    }
}

// 실패 상세 보기 모달
function openStatFailDetail(data = {}) {
	document.getElementById('fail00').value = data.FAIL_00;
	document.getElementById('fail01').value = data.FAIL_01;
	document.getElementById('fail02').value = data.FAIL_02;
	document.getElementById('fail03').value = data.FAIL_03;
	document.getElementById('fail04').value = data.FAIL_04;
	document.getElementById('fail05').value = data.FAIL_05;
	document.getElementById('fail06').value = data.FAIL_06;
	document.getElementById('fail07').value = data.FAIL_07;
	document.getElementById('fail08').value = data.FAIL_08;
	document.getElementById('fail09').value = data.FAIL_09;
	
	document.getElementById('stat_modal').classList.add('d-block');
	toggleBodyClass();
}

// 검색
$('#search-btn').dxButton({
	stylingMode: 'contained',
	text: '조회',
	type: 'default',
	width: 60,
	onClick() {
		const companyCode = companyInstance.option('value');
		const tableCode = tableInstance.option('value');
		const timeType = document.querySelector('input[name="timeType"]:checked').value;
		const startDate = startDateInstance.option("value");
		const endDate = endDateInstance.option("value");
		
		let searchStartDate, searchEndDate;
		
		if(companyCode == -1 || companyCode < 0) { showDialogCustom("대분류를 선택하세요."); return false; }
		if(tableCode == -1 || tableCode < 0) { showDialogCustom("중분류를 선택하세요."); return false; }
		
		if(timeType === "1") {
			
			const startHour = String(startHourInstance.option("value").getHours()).padStart(2, "0");
			const endHour = String( endHourInstance.option("value").getHours()).padStart(2, "0");
			const tempStartDate = new Date(`${startDate}T${startHour}:00:00`);
			const tempEndDate = new Date(`${endDate}T${endHour}:00:00`);
			const diffMs = tempEndDate - tempStartDate;
			const diffDays = diffMs / (1000 * 60 * 60 * 24);
			
			if(tempStartDate > tempEndDate) { showDialogCustom("조회 기간을 다시 입력하세요."); return false; }
			if(diffDays > period) { showDialogCustom(`조회 기간을 다시 입력하세요.(30일 이내)\n\n현재 입력한 조회 기간 : ${diffDays} 일`); return false; }
			
			searchStartDate = startDate;
			searchEndDate = endDate;
			
		} else if(timeType === "2") {
			
			const tempStartDate = new Date(`${startDate}`);
			const tempEndDate = new Date(`${endDate}`);
			const diffMs = tempEndDate - tempStartDate;
			const diffDays = diffMs / (1000 * 60 * 60 * 24);
			
			if(tempStartDate > tempEndDate) { showDialogCustom("조회 기간을 다시 입력하세요."); return false; }
			if(diffDays > period) { showDialogCustom(`조회 기간을 다시 입력하세요.(30일 이내)\n\n현재 입력한 조회 기간 : ${diffDays} 일`); return false; }
			
			searchStartDate = startDate;
			searchEndDate = endDate;
			
		} else if(timeType === "3") {
			
			const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
			const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
			const diffMs = endMonth - startMonth;
			
			if(startMonth > endMonth) { showDialogCustom("조회 기간을 다시 입력하세요."); return false; }
			if(diffMs > 1) { showDialogCustom(`조회 기간을 다시 입력하세요.(1달 이내)\n\n현재 입력한 조회 기간 : ${diffMs} 달`); return false; }
			
			searchStartDate = `${startDate.getFullYear()}-${startMonth}`;
			searchEndDate = `${endDate.getFullYear()}-${endMonth}`;
			
		} else if(timeType === "4") {
			
			const startYear = startDate.getFullYear();
			const endYear = endDate.getFullYear();
			const diffMs = endYear - startYear;
						
			if(startYear > endYear) { showDialogCustom("조회 기간을 다시 입력하세요."); return false; }
			if(diffMs > 1) { showDialogCustom(`조회 기간을 다시 입력하세요.(1년 이내)\n\n현재 입력한 조회 기간 : ${diffMs} 년`); return false; }
			
			searchStartDate = startYear;
			searchEndDate = endYear;
		} else {
			console.log('timeType:', timeType, ', type:', typeof timeType);
			return false;
		}
		
		const dataSource = new DevExpress.data.DataSource({
			load: function(loadOptions) {
				
				const param = {
					companyCode: companyCode
					, tableCode: tableCode
					, timeType: timeType
					, startDate: searchStartDate
					, endDate: searchEndDate
					, skip: loadOptions.skip || 0
					, take: loadOptions.take || 50
					// , sort: loadOptions.sort || []
				};
				
				// 구분값이 시간일 경우
				if(timeType === "1") {
					param.startHour = String(startHourInstance.option("value").getHours()).padStart(2, "0");
					param.endHour = String( endHourInstance.option("value").getHours()).padStart(2, "0");
				}
				
				return $.ajax({
					url: "/api/v1/stat/list",
					type: "POST",
					contentType: "application/json",
					data: JSON.stringify(param),
				}).then(function(result) {
					return {
						data: result.list || [],
						totalCount: result.totalCount || 0
					};
				}).catch(function() {
					showDialogCustom("error");
					return {
						data: [],
						totalCount: 0
					};
				});
			}
		});
		
		//재조회
		dataGrid.option("dataSource", dataSource);
		dataGrid.refresh(); 
	}
}).dxButton('instance');

//엑셀 다운로드 버튼
const excelBtn = $('#excel-btn').dxButton({
	stylingMode: 'contained',
	text: '엑셀 다운로드',
	type: 'success',
	width: 120,
	onClick() {
		const grid = $("#statGrid").dxDataGrid("instance");
		exportGridToExcel(grid);
	},
}).dxButton('instance');

//엑셀 다운로드
function exportGridToExcel(gridInstance) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('정산_통계 조회');

	DevExpress.excelExporter.exportDataGrid({
		component: gridInstance,
		worksheet: worksheet,
		autoFilterEnabled: true,
	}).then(() => {
		workbook.xlsx.writeBuffer().then((buffer) => {
			saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '정산_통계 조회.xlsx');
		});
	});
}

//라디오 버튼클릭시 초기화
function recreateDateBox(selector, options) {
	const $el = $(selector);
	if ($el.data("dxDateBox")) {
		$el.dxDateBox("dispose"); //기존 제거
		$el.empty(); //DOM 비우기
	}
	$el.dxDateBox(options); //새로 생성
}

