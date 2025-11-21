let dataGrid;
let companyInstance;
let startDateInstance;
let endDateInstance;
let serviceInstance;

let pageSize;
const period = 30;	// 최대 검색 기간

$(function() {
	
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);
	
	const startYear = startDate.getFullYear(); 
	const startMonth = `${String(startDate.getMonth() + 1).padStart(2, '0')}`; 
	const startDay = `${String(startDate.getDate()).padStart(2, '0')}`;
	
	const endYear = endDate.getFullYear(); 
	const endMonth = `${String(endDate.getMonth() + 1).padStart(2, '0')}`; 
	const endDay = `${String(endDate.getDate()).padStart(2, '0')}`; 
	
	//조회 기간
	startDateInstance = $("#startDate").dxDateBox({
		type: "date",
		value: `${startYear}-${startMonth}-${startDay}`,
		name: "startDate",
		displayFormat: "yyyy-MM-dd",
		pickerType: "calendar",
		calendarOptions: {
			minZoomLevel: "decade"
		}
	}).dxDateBox("instance");
	
	endDateInstance = $("#endDate").dxDateBox({
		type: "date",
		value: `${endYear}-${endMonth}-${endDay}`,
		name: "endDate",
		displayFormat: "yyyy-MM-dd",
		pickerType: "calendar",
		calendarOptions: {
			minZoomLevel: "decade"
		}
	}).dxDateBox("instance");
	
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
	
	const svcArray = {
	    0: [{ name: '선택하세요' }, { name: '전체' }],
	    1: [{ name: '선택하세요' }, { name: '전체' }],
	    2: [{ name: '선택하세요' }, { name: '전체' }]
	};

	nameList.forEach(({ companyCode, name }) => {
	    if (svcArray[companyCode]) svcArray[companyCode].push({ name });
	});
	
	// 대분류
	companyInstance = $('#companyCategory').dxSelectBox({
		dataSource: companyArray,
		displayExpr: 'name',
		valueExpr: 'code',
		value: companyCode,
		name: "companyCode",
		onValueChanged: function(e) {
			//중분류 업데이트
			serviceInstance.option('dataSource', svcArray[e.value] || [{ name: '선택하세요' }]);
			serviceInstance.option('value', '선택하세요'); // 기본값 다시 설정
		}
	}).dxSelectBox("instance");
		
	// 서비스
	serviceInstance = $('#serviceCategory').dxSelectBox({
		dataSource: svcArray[1],
		displayExpr: 'name',
		valueExpr: 'name',
		name: "svcName",
		value: '전체',
		onValueChanged: function(e) {
			
		}
	}).dxSelectBox("instance");

	//조회 그리드
	dataGrid = $("#alarmGrid").dxDataGrid({
		dataSource: {
			load: function(loadOptions) {
				
				const companyCode = companyInstance.option('value');
				const startDate = startDateInstance.option("value");
				const endDate = endDateInstance.option("value");
				const svcName = serviceInstance.option("value");
				
				const param = {
					companyCode: companyCode
					, startDate: startDate
					, endDate: endDate
					, svcName: svcName
					, skip: loadOptions.skip || 0
					, take: loadOptions.take || 50
					, sort: loadOptions.sort || []
				};
				
				return $.ajax({
					url: "/api/v1/alarm/list",
					method: "POST",
					contentType: "application/json",
					data: JSON.stringify(param),
				}).then(function(result) {
					return {
						data: result.list,
						totalCount: result.totalCount
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
		key: "almSeq", //keyExpr
		//행 선택 시
		selection: {
			mode: 'single'
		},
		//행 마우스오버 시
		hoverStateEnabled: true,
		headerFilter: {
			visible: false
		},
		remoteOperations: {
			paging: true //페이징 서버사이드 처리
			, sorting: true
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
				allowSorting: false,   // 정렬 비활성화
				customizeText: function(cellInfo) {
					switch (cellInfo.value) {
						case 0: return "옥션";
						case 1: return "G마켓";
						case 2: return "스마일캐시";
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
				alignment: "center",
				allowSorting: false   // 정렬 비활성화
			},
			{
				dataField: "ALM_COMMENT",
				caption: "알림",
				alignment: "center"
			},
			{
				dataField: "ALM_INFO",
				caption: "상세",
				alignment: "center",
				allowSorting: false   // 정렬 비활성화
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
		onRowClick: function (e) {
			document.getElementById('reset_btn').classList.add('d-none');
			console.log(document.getElementById('reset_btn'));
			e.cancel = true; // 기본 편집 막기
			openCustomModal('edit', e.data); // 수정 모드
		},
		onInitNewRow(e) {
			e.cancel = true; // 기본 추가 막기
			openCustomModal('add'); // 추가 모드
		},
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount.toLocaleString()}건`);
		}
	}).dxDataGrid("instance");
});

// 조회 버튼
$('#search-btn').dxButton({
    stylingMode: 'contained',
    text: '조회',
    type: 'default',
    width: 60,
    onClick() {
		
		const companyCode = companyInstance.option('value');
		const startDate = startDateInstance.option("value");
		const endDate = endDateInstance.option("value");
		let svcName = serviceInstance.option("value");
		
		const diffMs = endDate - startDate;
		const diffDays = diffMs / (1000 * 60 * 60 * 24);
		
		if(startDate > endDate) { showDialogCustom("조회 기간을 다시 입력하세요."); return false; }
		if(diffDays > period) { showDialogCustom(`조회 기간을 다시 입력하세요.(30일 이내)\n\n현재 입력한 조회 기간 : ${diffDays} 일`); return false }
		if(companyCode == -1 || companyCode < 0) { showDialogCustom("대분류를 선택하세요."); return false; }
		if(svcName === '선택하세요') { showDialogCustom("서비스명을 선택하세요."); return false; }
		if(svcName === '전체') svcName = "";
		
		const dataSource = new DevExpress.data.DataSource({
			load: function(loadOptions) {
				
				const param = {
					companyCode: companyCode
					, startDate: startDate
					, endDate: endDate
					, svcName: svcName
					, skip: loadOptions.skip || 0
					, take: loadOptions.take || 50
					, sort: loadOptions.sort || []
				};

				return $.ajax({
					url: "/api/v1/alarm/list",
					method: "POST",
					contentType: "application/json",
					data: JSON.stringify(param),
				}).then(function(result) {
					return {
						data: result.list,
						totalCount: result.totalCount
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
    },
}).dxButton('instance');

// 엑셀 버튼
$('#excel-btn').dxButton({
    stylingMode: 'contained',
    text: '엑셀 다운로드',
    type: 'success',
    width: 120,
    onClick() {
		const grid = $("#alarmGrid").dxDataGrid("instance");
		exportGridToExcel(grid);
    },
}).dxButton('instance');

//엑셀 다운로드
function exportGridToExcel(gridInstance) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('알림 이력 조회');

	DevExpress.excelExporter.exportDataGrid({
		component: gridInstance,
		worksheet: worksheet,
		autoFilterEnabled: true,
	}).then(() => {
		workbook.xlsx.writeBuffer().then((buffer) => {
			saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '알림 이력 조회.xlsx');
		});
	});
}