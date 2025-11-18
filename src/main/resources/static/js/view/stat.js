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
	
	const tableArray = {
	    0: [{ code: -1, name: '선택하세요' }, { code: 0, name: '전체' }],
	    1: [{ code: -1, name: '선택하세요' }, { code: 0, name: '전체' }],
	    2: [{ code: -1, name: '선택하세요' }, { code: 0, name: '전체' }]
	};

	codeList.forEach(item => {
	    const { companyCode, code, name } = item;
	    if (tableArray[companyCode]) tableArray[companyCode].push({ code, name });
	});
	
	// 일주일 기본값 설정
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);
	
	const startYear = startDate.getFullYear(); 
	const startMonth = `${String(startDate.getMonth() + 1).padStart(2, '0')}`; 
	const startDay = `${String(startDate.getDate()).padStart(2, '0')}`;
	
	const endYear = endDate.getFullYear(); 
	const endMonth = `${String(endDate.getMonth() + 1).padStart(2, '0')}`; 
	const endDay = `${String(endDate.getDate()).padStart(2, '0')}`; 

	//라디오
	const radios = document.querySelectorAll('input[name="timeType"]');
	
	// 시작일
	startDateInstance = $("#startDate")	.dxDateBox({
		type: "date",
	    name: "startDate",
		displayFormat: "yyyy-MM-dd"
	}).dxDateBox("instance");
	
	// 종료일
	endDateInstance = $("#endDate").dxDateBox({
		type: "date",
	    name: "endDate",
		displayFormat: "yyyy-MM-dd"
	}).dxDateBox("instance");
	
	radios.forEach(radio => {
		radio.addEventListener('change', function() {
			//시간
			if (this.value == "1") {
				
				// 시작일
				startDateInstance.option("displayFormat", "yyyy-MM-dd");
				startDateInstance.option("value", `${startYear}-${startMonth}-${startDay}`);
				
				// 종료일	
				endDateInstance.option("displayFormat", "yyyy-MM-dd");
				endDateInstance.option("value", `${endYear}-${endMonth}-${endDay}`);
				
				// 사작 시간
				startHourInstance = $("#startHour")	.dxDateBox({
					type: 'time',
					name: "startHour",
					value: new Date(2025, 0, 1, startDate.getHours(), 0, 0),	// type이 time이면 날짜는 아무거나 넣어도 상관없음
					displayFormat: "HH시",
					pickerType: "list",
					interval: 60,			// 분 선택 없애기 (1시간 단위)
					width: 120,
				}).dxDateBox("instance");
				
				// 종료 시간
				endHourInstance = $("#endHour")	.dxDateBox({
					type: 'time',
					name: "endHour",
					value: new Date(2025, 0, 1, startDate.getHours(), 0, 0),	// type이 time이면 날짜는 아무거나 넣어도 상관없음
					displayFormat: "HH시",
					pickerType: "list",
					interval: 60,			// 분 선택 없애기 (1시간 단위)
					width: 120,
				}).dxDateBox("instance");
			
			} else if (this.value == "2") {
				
				// 시작일
				startDateInstance.option("displayFormat", "yyyy-MM-dd");
				startDateInstance.option("value", `${startYear}-${startMonth}-${startDay}`);
				
				// 종료일	
				endDateInstance.option("displayFormat", "yyyy-MM-dd");
				endDateInstance.option("value", `${endYear}-${endMonth}-${endDay}`);
				
				// 숨김 처리
				if(startHourInstance && endHourInstance) {
					startHourInstance.option("value", "");
					endHourInstance.option("value", "");
					
					startHourInstance.option("visible", false);
					endHourInstance.option("visible", false);
				}
				
			} else if (this.value == "3") {
				
				// 시작일
				startDateInstance.option("displayFormat", "yyyy-MM");
				startDateInstance.option("value", `${startYear}-${startMonth}`);
				
				// 종료일	
				endDateInstance.option("displayFormat", "yyyy-MM");
				endDateInstance.option("value", `${endYear}-${endMonth}`);
				
				// 숨김 처리
				if(startHourInstance && endHourInstance) {
					startHourInstance.option("value", "");
					endHourInstance.option("value", "");
					
					startHourInstance.option("visible", false);
					endHourInstance.option("visible", false);
				}
				
			} else if (this.value == "4") {
				
				// 시작일
				startDateInstance.option("displayFormat", "yyyy '년' ");
				startDateInstance.option("showClearButton", true);
				startDateInstance.option("useMaskBehavior", true);
				startDateInstance.option("value", `${startYear}`);
				
				// 종료일
				endDateInstance.option("displayFormat", "yyyy '년' ");
				endDateInstance.option("showClearButton", true);
				endDateInstance.option("useMaskBehavior", true);
				endDateInstance.option("value", `${endYear}`);
				
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

	//중분류
	tableInstance = $('#tableCategory').dxSelectBox({
		dataSource: tableArray[1],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 0,
		name: "tableCode",
		onValueChanged: function(e) {
			
			// select text 가져오기
			tableValue = e.component.option("displayValue");
		}
	}).dxSelectBox("instance");
	
	// 사용자 등급 및 회사 업체에 따라 select box option 설정
	const companyList = [
	    { code: 0, name: '옥션' },
	    { code: 1, name: 'G마켓' },
	    { code: 2, name: '스마일캐시' }
	];

	let companyArray = [{ code: -1, name: '선택하세요' }];

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
			tableInstance.option('dataSource', tableArray[companyValue] || [{ name: '선택하세요' }]);
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
					, sort: loadOptions.sort || []
				};
				
				if(timeType == 1) {
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
		headerFilter: {
			visible: false
		},
		//행 선택 시
		selection: {
			mode: 'single',
		},
		//행 마우스오버 시
		hoverStateEnabled: true,
		searchPanel: {
			visible: false,
			width: 300
		},
		paging: {
			pageSize: 50
		},
		remoteOperations: {
			paging: true //페이징 서버사이드 처리
			, sorting: true
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
			{ dataField: "RESULT_DATE", caption: "시간/일자", alignment: "center" },
			{
				dataField: "", caption: "대분류", alignment: "center", allowSorting: false, calculateCellValue: function(rowData) {
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
	    onContentReady(e) {
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount.toLocaleString()}건`);
			
			tableValue = (tableValue == "선택하세요" || tableValue === undefined) ? "" : tableValue;
	    }
	}).dxDataGrid("instance");
});

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
		
		// 구분값이 시간일 경우
		const startHour = timeType === "1" ? String(startHourInstance.option("value").getHours()).padStart(2, "0") : "";
		const endHour = timeType === "1" ? String( endHourInstance.option("value").getHours()).padStart(2, "0") : "";
		
		// 조회 기간 확인
		const searchStartDate = timeType === "1" ? new Date(`${startDate}T${startHour}:00:00`) : new Date(`${startDate}`);
		const searchEndDate = timeType === "1" ? new Date(`${endDate}T${endHour}:00:00`) : new Date(`${endDate}`);
		const diffMs = searchEndDate - searchStartDate;
		const diffDays = diffMs / (1000 * 60 * 60 * 24);
		
		if(searchStartDate > searchEndDate) { showDialogCustom("조회 기간을 다시 입력하세요."); return false; }
		if(diffDays > period) { showDialogCustom(`조회 기간을 다시 입력하세요.(30일 이내)\n\n현재 입력한 조회 기간 : ${diffDays} 일`); return false }

		if(companyCode == -1 || companyCode < 0) { showDialogCustom("대분류를 선택하세요."); return false; }
		if(tableCode == -1 || tableCode < 0) { showDialogCustom("중분류를 선택하세요."); return false; }

		const dataSource = new DevExpress.data.DataSource({
			load: function(loadOptions) {
				
				const param = {
					companyCode: companyCode
					, tableCode: tableCode
					, timeType: timeType
					, startDate: startDate
					, endDate: endDate
					, skip: loadOptions.skip || 0
					, take: loadOptions.take || 50
					, sort: loadOptions.sort || []
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

