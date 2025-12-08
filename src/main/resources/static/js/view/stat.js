let checkedRadio;
let startDateInstance;
let endDateInstance;
let startHourInstance;
let endHourInstance;
let companyInstance;
let tableInstance;
let statGrid;

$(function() {
	/* ================================
	   구분, 조회기간 설정
	================================ */
	const today = new Date();
	
	// 공통 날짜
	const year  = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day   = String(today.getDate()).padStart(2, '0');
	
	// 날짜 DateBox
	startDateInstance = $("#startDate").dxDateBox({
		type: "date",
		value: today,
		displayFormat: "yyyy-MM-dd",
		pickerType: "calendar",
		calendarOptions: {
			minZoomLevel: "decade"
		}
	}).dxDateBox("instance");
	
	endDateInstance = $("#endDate").dxDateBox({
		type: "date",
	    value: today,
		displayFormat: "yyyy-MM-dd",
		pickerType: "calendar",
		calendarOptions: {
			minZoomLevel: "decade"
		}
	}).dxDateBox("instance");
	
	// 시간 DateBox
	function initHourBoxes() {
		startHourInstance = $("#startHour").dxDateBox({
			type: 'time',
			value: new Date(2025, 0, 1, 0, 0), // type이 time이면 날짜는 아무거나 넣어도 상관없음
			displayFormat: "HH시",
			pickerType: "list",
			interval: 60, // 분 선택 없애기 (1시간 단위)
			width: 135,
			visible: true
		}).dxDateBox("instance");
		
		endHourInstance = $("#endHour").dxDateBox({
			type: 'time',
			value: new Date(2025, 0, 1, 23, 0), // type이 time이면 날짜는 아무거나 넣어도 상관없음
			displayFormat: "HH시",
			pickerType: "list",
			interval: 60, // 분 선택 없애기 (1시간 단위)
			width: 135,
			visible: true
		}).dxDateBox("instance");
	}
	
	// 시간 DateBox 숨김
	function hideHourBoxes() {
		if (!startHourInstance || !endHourInstance) return;
		
		startHourInstance.option({ value: "", visible: false });
		endHourInstance.option({ value: "", visible: false });
	}
	
	// 타입별 설정 핸들러
	const timeTypeHandlers = {
		"1": () => { // 시간
			startDateInstance.option({
				value: `${year}-${month}-${day}`,
				displayFormat: "yyyy-MM-dd"
			});
			
			endDateInstance.option({
				value: `${year}-${month}-${day}`,
				displayFormat: "yyyy-MM-dd"
			});
			
			initHourBoxes();
		},
		
		"2": () => { // 일
			startDateInstance.option({
				value: `${year}-${month}-${day}`,
				displayFormat: "yyyy-MM-dd"
			});
			
			endDateInstance.option({
				value: `${year}-${month}-${day}`,
				displayFormat: "yyyy-MM-dd"
			});
			
			hideHourBoxes();
		},
		
		"3": () => { // 월
			startDateInstance.option({
				value: new Date(year, month - 1, 1),
				displayFormat: "yyyy-MM"
			});
			
			endDateInstance.option({
				value: new Date(year, month - 1, 1),
				displayFormat: "yyyy-MM"
			});
			
			hideHourBoxes();
		},
		
		"4": () => { // 년
			startDateInstance.option({
				value: new Date(year, 0, 1),
				displayFormat: "yyyy"
			});
			
			endDateInstance.option({
				value: new Date(year, 0, 1),
				displayFormat: "yyyy"
			});
			
			hideHourBoxes();
		}
	};
	
	// 라디오 이벤트 등록
	document.querySelectorAll('input[name="timeType"]').forEach(radio => {
		radio.addEventListener('change', function() {
			const handler = timeTypeHandlers[this.value];
			if (handler) handler();
		});
	});
	
	// 페이지 로드 시 체크된 라디오 강제 실행
	const checkedRadio = document.querySelector('input[name="timeType"]:checked');
	if (checkedRadio) checkedRadio.dispatchEvent(new Event('change'));
	
	
	/* ================================
	   대분류, 중분류 설정
	================================ */
	// 기본 옵션
	const defaultOption = { code: -1, name: '선택하세요' };
	
	// 대분류 옵션 생성
	let companyArray = [defaultOption];
	const companyList = [
		{ code: 0, name: '옥션' },
		{ code: 1, name: 'G마켓' },
		{ code: 2, name: '스마일캐시' }
	];
	
	// userGrade 적용
	companyList.forEach(company => {
		if (userGrade === 0 || (userGrade === 1 && companyCode === company.code)) {
			companyArray.push(company);
		}
	});
	
	// 중분류 옵션 생성
	let tableArray = {
		0: [defaultOption, { code: 0, name: '전체' }],
		1: [defaultOption, { code: 0, name: '전체' }],
		2: [defaultOption, { code: 0, name: '전체' }]
	};
	
	// codeList 병합
	codeList.forEach(({ companyCode, code, name }) => {
		if (tableArray[companyCode]) {
			tableArray[companyCode].push({ code, name });
		}
	});
	
	// 대분류
	companyInstance = $('#companyCode').dxSelectBox({
		dataSource: companyArray,
		displayExpr: 'name',
		valueExpr: 'code',
		value: companyCode,
		onValueChanged(e) {
			const selectedCode = e.value;
			
			// 중분류 옵션 갱신
			tableInstance.option({
				dataSource: tableArray[selectedCode] || [defaultOption],
				value: -1 // 초기화
			});
		}
	}).dxSelectBox("instance");
	
	// 중분류
	tableInstance = $('#tableCode').dxSelectBox({
		dataSource: tableArray[companyCode] || [defaultOption],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 0, // 기본 전체
	}).dxSelectBox("instance");
	
	
	/* ================================
	   조회 그리드 설정
	================================ */
	// 조회 파라미터 생성 함수
	function buildSearchParams(loadOptions = {}) {
		const companyCode = companyInstance.option("value");
		const tableCode = tableInstance.option('value');
		const timeType = document.querySelector('input[name="timeType"]:checked').value;
		const startDate = startDateInstance.option("value");
		const endDate = endDateInstance.option("value");
		
		let params = {
			companyCode: companyCode,
			tableCode: tableCode,
			timeType: timeType,
			// DevExtreme 조회 옵션
			// filter: loadOptions.filter || [],   // searchPanel 검색
			// group: loadOptions.group || [],     // columns 검색
			skip: loadOptions.skip ?? 0,        // 페이지 시작 위치(offset)
			take: loadOptions.take ?? 50,       // 페이지 크기(limit)
			// sort: loadOptions.sort || [],       // G마켓만 TABLE_NAME 정렬 가능. 옥션은 SQLServerException 발생하여 false로 변경.
		};
		
		switch (timeType) {
			case "1": { // 시간
				const startHour = String(startHourInstance.option("value").getHours()).padStart(2, "0");
				const endHour = String(endHourInstance.option("value").getHours()).padStart(2, "0");
				
				params.startDate = startDate;
				params.endDate = endDate;
				params.startHour = startHour;
				params.endHour = endHour;
				break;
			}
			
			case "2": { // 일
				params.startDate = startDate;
				params.endDate = endDate;
				break;
			}
			
			case "3": { // 월
				const sm = String(startDate.getMonth() + 1).padStart(2, "0");
				const em = String(endDate.getMonth() + 1).padStart(2, "0");
				
				params.startDate = `${startDate.getFullYear()}-${sm}`;
				params.endDate = `${endDate.getFullYear()}-${em}`;
				break;
			}
			
			case "4": { // 년
				params.startDate = startDate.getFullYear();
				params.endDate = endDate.getFullYear();
				break;
			}
			
			default:
				console.error("Invalid timeType:", timeType);
				return {};
		}
		
		return params;
	}
	
	// 조회 조건 검증 함수
	function validateSearch() {
		const companyCode = companyInstance.option("value");
		const tableCode = tableInstance.option('value');
		const timeType = document.querySelector('input[name="timeType"]:checked').value;
		
		const startDate = startDateInstance.option("value");
		const endDate = endDateInstance.option("value");
		
		if (companyCode === -1) {
			showDialogCustom("대분류를 선택하세요.");
			return false;
		}
		
		if (tableCode === -1) {
			showDialogCustom("중분류를 선택하세요.");
			return false;
		}
		
		// 시간
		if (timeType === "1") {
			const startHour = startHourInstance.option("value").getHours();
			const endHour = endHourInstance.option("value").getHours();
			
			const s = new Date(startDate);
			s.setHours(startHour);
			
			const e = new Date(endDate);
			e.setHours(endHour);
			
			if (s > e) {
				showDialogCustom("조회 기간을 다시 입력하세요.");
				return false;
			}
			
			const diffDays = (e - s) / (1000 * 60 * 60 * 24);
			if (diffDays > 30) {
				//showDialogCustom(`조회 기간을 다시 입력하세요.(30일 이내)</br>현재 입력한 조회 기간 : ${diffDays} 일`);
				showDialogCustom(`조회 기간을 다시 입력하세요.(30일 이내)</br>현재 입력한 조회 기간 : ${diffDays.toFixed(2)} 일`);
				return false;
			}
			
			return true;
		}
		
		// 일
		if (timeType === "2") {
			const s = new Date(startDate);
			const e = new Date(endDate);
			
			if (s > e) {
				showDialogCustom("조회 기간을 다시 입력하세요.");
				return false;
			}
			
			const diffDays = (e - s) / (1000 * 60 * 60 * 24);
			
			if (diffDays > 30) {
				showDialogCustom(`조회 기간을 다시 입력하세요.(30일 이내)</br>현재 입력한 조회 기간 : ${diffDays} 일`);
				return false;
			}
			
			return true;
		}
		
		// 월
		if (timeType === "3") {
			const sm = startDate.getMonth() + 1;
			const em = endDate.getMonth() + 1;
			
			const sy = startDate.getFullYear();
			const ey = endDate.getFullYear();
			
			const diffMonths = (ey - sy) * 12 + (em - sm);
			
			if (diffMonths < 0) {
				showDialogCustom("조회 기간을 다시 입력하세요.");
				return false;
			}
			
			if (diffMonths > 1) {
				showDialogCustom(`조회 기간을 다시 입력하세요.(1달 이내)</br>현재 입력한 조회 기간 : ${diffMonths} 달`);
				return false;
			}
			
			return true;
		}
		
		// 년
		if (timeType === "4") {
			const startYear = startDate.getFullYear();
			const endYear = endDate.getFullYear();
			
			const diffYears = endYear - startYear;
			
			if (diffYears < 0) {
				showDialogCustom("조회 기간을 다시 입력하세요.");
				return false;
			}
			
			if (diffYears > 1) {
				showDialogCustom(`조회 기간을 다시 입력하세요.(1년 이내)</br>현재 입력한 조회 기간 : ${diffYears} 년`);
				return false;
			}
			
			return true;
		}
		
		showDialogCustom("조회 유형을 확인하세요.");
		return false;
	}
	
	// 데이터 조회 함수
	function fetchGridList(loadOptions) {
		const param = buildSearchParams(loadOptions);
		
		return $.ajax({
			url: "/api/v1/stat/list",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(param)
		})
		.then(result => ({
			data: result.list || [],
			totalCount: result.totalCount || 0
		}))
		.catch(() => {
			showDialogCustom("error");
			return { data: [], totalCount: 0 };
		});
	}
	
	// 조회 그리드
	statGrid = $("#statGrid").dxDataGrid({
		dataSource: {
			key: "",
			load: fetchGridList
		},
		loadMode: "raw", // 서버사이드 처리
		remoteOperations: {
			filtering: false, // searchPanel 검색
			grouping: false, // columns 검색
			paging: true,
			sorting: false // G마켓만 TABLE_NAME 정렬 가능. 옥션은 SQLServerException 발생하여 false로 변경.
		},
		// 행 선택 시
		selection: {
			mode: 'single',
		},
		// 행 마우스오버 시
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
					if (cellInfo && cellInfo.value) {
						return parseDateString(cellInfo.value);
					} else {
						return '-';
					}
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
	    }
	}).dxDataGrid("instance");
	
	// 조회 버튼
	$('#search-btn').dxButton({
		stylingMode: 'contained',
		text: '조회',
		type: 'default',
		width: 60,
		onClick() {
			if (!validateSearch()) return;
			
			// dataGrid 데이터 재바인딩
			statGrid.refresh();
		}
	}).dxButton('instance');
	
	// 엑셀 버튼
	$('#excel-btn').dxButton({
		stylingMode: 'contained',
		text: '엑셀 다운로드',
		type: 'success',
		width: 120,
		onClick() {
			exportGridToExcel(statGrid);
		},
	}).dxButton('instance');
	
	// 엑셀 다운로드
	function exportGridToExcel(gridInstance) {
		const timeType = document.querySelector('input[name="timeType"]:checked').value;
		const startDate = startDateInstance.option("value");
		const endDate = endDateInstance.option("value");
		
		let startDateFormatted = "";
		let endDateFormatted = "";
		
		// 타입별 날짜 포맷
		switch (timeType) {
			case "1": // 시간
			case "2": // 일
				startDateFormatted = formatDate(startDate, "yymmdd");
				endDateFormatted = formatDate(endDate, "yymmdd");
				break;
			
			case "3": // 월
				startDateFormatted = formatDate(startDate, "yyyymm");
				endDateFormatted = formatDate(endDate, "yyyymm");
				break;
			
			case "4": // 년
				startDateFormatted = formatDate(startDate, "yyyy");
				endDateFormatted = formatDate(endDate, "yyyy");
				break;
		}
		
		// 파일명
		const fileName = `정산통계조회(${startDateFormatted}~${endDateFormatted}).xlsx`;
		
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('정산통계조회');
		
		DevExpress.excelExporter.exportDataGrid({
			component: gridInstance,
			worksheet: worksheet,
			autoFilterEnabled: true,
		}).then(() => {
			workbook.xlsx.writeBuffer().then((buffer) => {
				saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
			});
		});
	}
	
	// 날짜 포맷팅
	function parseDateString(str) {
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
});

// 라디오 버튼 클릭 시 초기화
function recreateDateBox(selector, options) {
	const $el = $(selector);
	if ($el.data("dxDateBox")) {
		$el.dxDateBox("dispose"); //기존 제거
		$el.empty(); //DOM 비우기
	}
	$el.dxDateBox(options); //새로 생성
};