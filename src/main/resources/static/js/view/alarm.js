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
	
	//조회 기간
	startDateInstance = $("#startDate").dxDateBox({
		type: "date",
		value: startDate,
		name: "startDate",
		displayFormat: "yyyy-MM-dd",
		pickerType: "calendar",
		calendarOptions: {
			minZoomLevel: "year"
		}
	}).dxDateBox("instance");
	
	endDateInstance = $("#endDate").dxDateBox({
		type: "date",
		value: endDate,
		name: "endDate",
		displayFormat: "yyyy-MM-dd",
		pickerType: "calendar",
		calendarOptions: {
			minZoomLevel: "year"
		}
	}).dxDateBox("instance");
	
	// 사용자 등급 및 회사 업체에 따라 select box option 설정
	let companyArray = [ { code: -1, name: '선택하세요' } ];
	
	if((userGrade == 0 || (userGrade == 1 && companyCode == 0))) {
		companyArray.push({ code: 0, name: '옥션' });
	} 
	
	if((userGrade == 0 || (userGrade == 1 && companyCode == 1))) {
		companyArray.push({ code: 1, name: 'G마켓' });
	}
	
	if((userGrade == 0 || (userGrade == 1 && companyCode == 2))) {
		companyArray.push({ code: 2, name: '스마일캐시' });
	}
	
	const svcArray = {
		0: [
			{ name: '선택하세요' },
			{ name: '전체' }
		],
		1: [
			{ name: '선택하세요' },
			{ name: '전체' }
		],
		2: [
			{ name: '선택하세요' },
			{ name: '전체' }
		]
	};
	
	for(var i = 0; i < nameList.length; i++) {
		const { companyCode, name } = nameList[i];
		
		switch (companyCode) {
			case 0:
				svcArray[0].push({ name: name });
				break;
			case 1:
				svcArray[1].push({ name: name });
				break;
			case 2:
				svcArray[2].push({ name: name });
				break;
		}
	}
	
	// 대분류
	companyInstance = $('#companyCategory').dxSelectBox({
		dataSource: companyArray,
		displayExpr: 'name',
		valueExpr: 'code',
		value: companyCode,
		name: "companyCode",
		onValueChanged: function(e) {
			//중분류 업데이트
			serviceInstance.option('dataSource', svcArray[e.value] || []);
			serviceInstance.option('value', '선택하세요'); // 기본값 다시 설정
		}
	}).dxSelectBox("instance");
		
	// 서비스
	serviceInstance = $('#serviceCategory').dxSelectBox({
		dataSource: svcArray[1],
		displayExpr: 'name',
		valueExpr: 'name',
		name: "svcName",
		value: '선택하세요',
		onValueChanged: function(e) {
			
		}
	}).dxSelectBox("instance");

	//조회 그리드
	dataGrid = $("#alarmGrid").dxDataGrid({
		dataSource: [],
		key: "almSeq", //keyExpr
		//행 선택 시
		selection: {
			mode: 'single'
		},
		//행 마우스오버 시
		hoverStateEnabled: true,
		headerFilter: {
			visible: true
		},
		remoteOperations: {
			paging: true //페이징 서버사이드 처리
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
			{
				dataField: "companyCode",
				caption: "대분류",
				alignment: "center",
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
				dataField: "svcName",
				caption: "서비스",
				alignment: "center"
			},
			{
				dataField: "procName",
				caption: "프로세스",
				alignment: "center"
			},
			{
				dataField: "monComment",
				caption: "오류",
				alignment: "center"
			},
			{
				dataField: "almComment",
				caption: "알림",
				alignment: "center"
			},
			{
				dataField: "almInfo",
				caption: "상세",
				alignment: "center",
				allowHeaderFiltering: false,  // 헤더 필터 비활성화
			},
			{
				dataField: "almDate",
				caption: "알림 발생 시간",
				alignment: "center",
				allowHeaderFiltering: false,  // 헤더 필터 비활성화
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
			
			$("#totalCount").text(`검색된 내용은 총 ${totalCount}건 입니다.`);
		},
		onOptionChanged: function(e) {
	   		if (e.fullName === "paging.pageSize") {
				pageSize = e.value;
    		}
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
		
		const formData = new FormData(document.getElementById("alarmForm"));
		
		const searchCompanyCode = formData.get("companyCode");
		const svcName = formData.get("svcName");
		const searchStartDate = new Date(formData.get("startDate"));
		const searchEndDate = new Date(formData.get("endDate"));
		const diffMs = searchEndDate - searchStartDate;
		const diffDays = diffMs / (1000 * 60 * 60 * 24);
		
		if(searchStartDate > searchEndDate) { showDialogCustom("조회 기간을 다시 입력하세요."); return false; }
		if(diffDays > period) { showDialogCustom("조회 기간을 다시 입력하세요.(30일 이내)\n\n현재 입력한 조회 기간 : " + diffMs + "일"); return false }
		if(searchCompanyCode == -1 || searchCompanyCode < 0) { showDialogCustom("대분류를 선택하세요."); return false; }
		if(svcName === '선택하세요') { showDialogCustom("서비스명을 선택하세요."); return false; }
		if(svcName === '전체') { formData.set("svcName", ''); }
		
		const dataSource = new DevExpress.data.DataSource({
			load: function(loadOptions) {
				
				const skip = loadOptions.skip || 0;
				const take = loadOptions.take || 50;

				formData.append("skip", skip);
				formData.append("take", take);

				return $.ajax({
					url: "/api/v1/alarm/list",
					method: "POST",
					data: formData,
					processData: false,
					contentType: false
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