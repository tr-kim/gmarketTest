let startDateInstance;
let endDateInstance;
let phoneNumInstance;
let companyInstance;
let tableInstance;
let histDataGrid;
let companyValue;
let tableValue;

$(function () {
	const today = new Date();
	
	//조회 기간
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
	
	// 대분류 목록 설정
	const companyArray = [defaultOption];
	const companyNames = ['옥션', 'G마켓', '스마일캐시'];
	
	companyNames.forEach((name, idx) => {
		if (userGrade === 0 || (userGrade === 1 && companyCode === idx)) {
			companyArray.push({ code: idx, name });
		}
	});
	
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
	
	//대분류
	companyInstance = $('#companyCode').dxSelectBox({
		dataSource: companyArray,
		displayExpr: 'name',
		valueExpr: 'code',
		value: companyCode,
		onValueChanged(e) {
			const selectedCode = e.value;
			const newData = tableArray[selectedCode] || [defaultOption];
			tableInstance.option({
				dataSource: newData,
				value: -1
			});
		}
	}).dxSelectBox("instance");
	
	//중분류
	tableInstance = $('#tableCode').dxSelectBox({
		dataSource: tableArray[companyCode] || [defaultOption],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 0
	}).dxSelectBox("instance");
	
	//수신자 번호
	phoneNumInstance = $('#phone-num').dxTextBox({
		placeholder: '번호를 입력하세요.'
	}).dxTextBox("instance");
	
	//엑셀 다운로드 버튼
	$('#excel-btn').dxButton({
		stylingMode: 'contained',
		text: '엑셀 다운로드',
		type: 'success',
		width: 120,
		onClick() {
			const grid = $("#histGrid").dxDataGrid("instance");
			exportGridToExcel(grid);
		}
	}).dxButton('instance');
	
	//조회 버튼
	$('#search-btn').dxButton({
		stylingMode: 'contained',
		text: '조회',
		type: 'default',
		width: 60,
		onClick() {
			const selectedCompany = companyInstance.option("selectedItem");
			const selectedTable = tableInstance.option("selectedItem");
			
			const companyCode = selectedCompany ? selectedCompany.code : -1;
			const tableCode = selectedTable ? selectedTable.code : -1;
			
			if (companyCode == null || companyCode == -1) {
				showDialogCustom("대분류를 선택하세요.");
				return false;
			}
			
			if (tableCode == null || tableCode == -1) {
				showDialogCustom("중분류를 선택하세요.");
				return false;
			}
			
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
			//const companyValue = companyInstance.option("value");
			
			//if(companyValue){
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
			//}
			
			//재조회
			histDataGrid.getDataSource().reload();
		}
	}).dxButton('instance');
	
	//조회 요청
	const histDataSource = new DevExpress.data.CustomStore({
		key: "TRAN_PR",
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
			
			const phoneNumValue = phoneNumInstance.option("value");
			const companyValue = companyInstance.option("value");
			const tableItem = tableInstance.option("selectedItem");
			
			if(tableItem.code === -1) return;
			
			const params = {
				startDate: startDateFormatted,
				endDate: endDateFormatted,
				startTime: startTimeFormatted, // startTimeFormatted + "000000",
				endTime: endTimeFormatted, // endTimeFormatted + "235959",
				phoneNum: phoneNumValue,
				companyCode: companyValue,
				tableName: (tableItem.name == "전체") ? "" : tableItem.name,
				// DevExtreme 조회 옵션
//				filter: loadOptions.filter || [],   // searchPanel 검색
//				group: loadOptions.group || [],     // columns 검색
				skip: loadOptions.skip ?? 0,        // 페이지 시작 위치(offset)
				take: loadOptions.take ?? 50,       // 페이지 크기(limit)
				sort: loadOptions.sort || [],       // 정렬
			};
			
			return fetch('/api/v1/hist/list', {
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
					totalCount: data.totalCount || 0
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
	histDataGrid = $("#histGrid").dxDataGrid({
		dataSource: histDataSource,
		loadMode: "raw", //서버사이드 처리
		remoteOperations: {
			filtering: false, // searchPanel 검색
			grouping: false, // columns 검색
			paging: true,
			sorting: true
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
			{ dataField: "TRAN_PR", caption: "NO", alignment: "center" },
			{ dataField: "TRAN_PHONE", caption: "수신 번호", alignment: "center" },
			{ dataField: "TRAN_CALLBACK", caption: "발신 번호", alignment: "center" },
			{ 
				dataField: "TRAN_DATE", 
				caption: "발송 일시", 
				alignment: "center",
				customizeText: function(cellInfo) {
					const value = (cellInfo.value || '').toString().trim();
					
					// 값이 비어있으면 빈 문자열 반환
					if (!value || value.length < 14) {
						return '';
					}
					
					const yyyy = value.slice(0, 4);
					const mm = value.slice(4, 6);
					const dd = value.slice(6, 8);
					const hh = value.slice(8, 10);
					const mi = value.slice(10, 12);
					const ss   = value.slice(12, 14);
					
					return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
				}
			},
			{ dataField: "TRAN_MSG", caption: "메시지 내용", alignment: "left", width: 450 },
			{ 
				dataField: "TRAN_RSLT", 
				caption: "결과", 
				alignment: "center",
				customizeText: function(cellInfo) {
					const raw = cellInfo.value;
					const value = raw != null ? String(raw).trim() : "";
					
					switch (value) {
						case "-2" : return "결과 대기";
						case "-1" : return "대기";
						case "0" : return "성공";
						case "1" : return "지능형 SMS 전송 API 버전 오류";
						case "2" : return "인증 실패";
						case "3" : return "연결 실패";
						case "4" : return "KT 지능형 시스템 오류";
						case "5" : return "SMS 형식 오류";
						case "6" : return "유효기간 만료";
						case "7" : return "결번";
						case "8" : return "단말기 전원 OFF";
						case "9" : return "단말기 음영 지역";
						case "A" : return "월별 전송 건수 초과";
						case "B" : return "초당 전송 속도 초과";
						case "C" : return "단말기 번호이동 관련 오류";
						case "D" : return "단말기 번호이동 관련 오류";
						case "E" : return "KT 지능형 시스템 호처리 실패";
						case "F" : return "KT Ann 폰 관련 오류";
						case "G" : return "파일 전송 오류";
						case "H" : return "스팸 차단";
						case "I" : return "스팸 차단(내부)";
						case "Y" : return "중복 메시지";
						case "Z" : return "기타 오류";
						default: return "기타";
					}
				} 
			},
			{ dataField: "CORP_RESERVED2", caption: "Flow #", alignment: "center" } // 통신사 코드
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
			openHistMessageInquiry(e.data);
		},
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();	
			$("#totalCount").text(`총 ${totalCount.toLocaleString()}건`);
		}
	}).dxDataGrid("instance");
});

// 상세 보기 모달
function openHistMessageInquiry(data = {}) {
	
	document.getElementById('msg').value = data.TRAN_MSG;
	
	document.getElementById('message_inquiry').classList.add('d-block');
	toggleBodyClass();
}

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

