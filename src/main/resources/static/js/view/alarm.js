let startDateInstance;
let endDateInstance;
let companyInstance;
let serverIdInstance;
let serviceInstance;
let alarmGrid;

$(function() {
	const today = new Date();
	
	// 조회 기간
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
	
	// 기본 옵션
	const defaultOption = { code: -1, name: '선택하세요' };
	
	// 대분류 옵션 생성
	let companyArray = [defaultOption];
	const companyList = [
		{ code: 0, name: '옥션' },
		{ code: 1, name: 'G마켓' },
		// { code: 2, name: '스마일캐시' }
	];
	
	// userGrade 적용
	companyList.forEach(company => {
		if (userGrade === 0 || (userGrade === 1 && companyCode === company.code)) {
			companyArray.push(company);
		}
	});
	
	// 서비스 옵션 생성
	let svcArray = {
		0: [defaultOption, { code: 0, name: '전체' }],
		1: [defaultOption, { code: 0, name: '전체' }],
		// 2: [defaultOption, { code: 0, name: '전체' }]
	};

	// nameList 병합
	nameList.forEach(({ companyCode, code, name }) => {
		if (svcArray[companyCode]) {
			svcArray[companyCode].push({ code, name });
		}
	});
	
	// 대분류
	companyInstance = $('#companyCategory').dxSelectBox({
		dataSource: companyArray,
		displayExpr: 'name',
		valueExpr: 'code',
		value: companyCode,
		onValueChanged: function(e) {
			const selectedCompany = e.value;
			
			// 서비스 옵션 갱신
			serviceInstance.option({
				dataSource: svcArray[selectedCompany] || [defaultOption],
				value: -1 // 초기화
			});
		}
	}).dxSelectBox("instance");

	// 서버 옵션
	const serverIdList = [
		{ code: -1, name: '전체' },
		{ code: 1, name: '1번' },
		{ code: 2, name: '2번' }
	];

	// 서버
	serverIdInstance = $('#serverIdCategory').dxSelectBox({
		dataSource: serverIdList,
		displayExpr: 'name',
		valueExpr: 'code',
		value: -1,
	}).dxSelectBox("instance");
	
	// 서비스
	serviceInstance = $('#serviceCategory').dxSelectBox({
		dataSource: svcArray[companyCode] || [defaultOption],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 0, // 기본 전체
	}).dxSelectBox("instance");
	
	// 조회 파라미터 생성 함수
	function buildSearchParams(loadOptions = {}) {
		const startValue = startDateInstance.option("value");
		const endValue = endDateInstance.option("value");
		const companyValue = companyInstance.option('value');
		const serviceItem = serviceInstance.option("selectedItem");
		const serverId = serverIdInstance.option("value");
		
		return {
			startDate: formatDate(startValue, "yyyy-mm-dd"),
			endDate: formatDate(endValue, "yyyy-mm-dd"),
			companyCode: companyValue,
			serverId: serverId,
			svcName: (serviceItem.name === "전체") ? "" : serviceItem.name,
			// DevExtreme 조회 옵션
			// filter: loadOptions.filter || [],   // searchPanel 검색
			// group: loadOptions.group || [],     // columns 검색
			skip: loadOptions.skip ?? 0,        // 페이지 시작 위치(offset)
			take: loadOptions.take ?? 50,       // 페이지 크기(limit)
			sort: loadOptions.sort || [],       // 정렬
		};
	}
	
	// 조회 조건 검증 함수
	function validateSearch() {
		const companyCode = companyInstance.option('value');
		const svcCode = serviceInstance.option("value");
		const startValue = startDateInstance.option("value");
		const endValue = endDateInstance.option("value");
		
		const diffMs = endValue - startValue;
		const diffDays = diffMs / (1000 * 60 * 60 * 24);
		
		if (companyCode === -1) {
			showDialogCustom("대분류를 선택하세요.");
			return false;
		}
		
		if (svcCode === -1) {
			showDialogCustom("서비스를 선택하세요.");
			return false;
		}
		
		if (startValue > endValue) {
			showDialogCustom("조회 기간을 다시 입력하세요.");
			return false;
		}
		
		if (diffDays > 30) {
			showDialogCustom(`조회 기간을 다시 입력하세요.(30일 이내)</br>현재 입력한 조회 기간 : ${diffDays} 일`);
			return false;
		}
		
		return true;
	}
	
	// 데이터 조회 함수
	function fetchGridList(loadOptions) {
		const param = buildSearchParams(loadOptions);
		
		return $.ajax({
			url: "/api/v1/alarm/list",
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
	alarmGrid = $("#alarmGrid").dxDataGrid({
		dataSource: {
			key: "ALM_SEQ",
			load: fetchGridList
		},
		loadMode: "raw", // 서버사이드 처리
		remoteOperations: {
			filtering: false, // searchPanel 검색
			grouping: false, // columns 검색
			paging: true,
			sorting: true
		},
		// 행 선택 시
		selection: {
			mode: 'single'
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
				dataField: "COMPANY_CODE",
				caption: "대분류",
				alignment: "center",
				customizeText: function(cellInfo) {
					switch (cellInfo.value) {
						case 0: return "옥션";
						case 1: return "G마켓";
						// case 2: return "스마일캐시";
						default: return "-";
					}
				}
			},
			{
				dataField: "SERVER_ID",
				caption: "서버",
				alignment: "center",
				customizeText: function(cellInfo) {
					switch (cellInfo.value) {
						case 1: return "1번";
						case 2: return "2번";
						default: return "-";
					}
				}
			},
			{
				dataField: "SVC_NAME",
				caption: "서비스",
				alignment: "center"
			},
			{
				dataField: "PROC_NAME",
				caption: "프로세스",
				alignment: "center"
			},
			{
				dataField: "MON_COMMENT",
				caption: "오류",
				alignment: "center"
			},
			{
				dataField: "ALM_COMMENT",
				caption: "알림",
				alignment: "center"
			},
			{
				dataField: "ALM_INFO",
				caption: "상세",
				alignment: "center"
			},
			{
				dataField: "ALM_DATE",
				caption: "알림 발생 시간",
				alignment: "center",
			}
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
			alarmGrid.refresh();
	    },
	}).dxButton('instance');
	
	// 엑셀 버튼
	$('#excel-btn').dxButton({
	    stylingMode: 'contained',
	    text: '엑셀 다운로드',
	    type: 'success',
	    width: 120,
	    onClick() {
			exportGridToExcel(alarmGrid);
	    },
	}).dxButton('instance');
	
	// 엑셀 다운로드
	function exportGridToExcel(gridInstance) {
		const startValue = startDateInstance.option("value");
		const endValue = endDateInstance.option("value");
		
		// 공통 함수 사용
		const startDateFormatted = formatDate(startValue, "yymmdd");
		const endDateFormatted = formatDate(endValue, "yymmdd");
		
		// 파일명
		const fileName = `알림이력조회(${startDateFormatted}~${endDateFormatted}).xlsx`;
		
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('알림이력조회');
		
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
});