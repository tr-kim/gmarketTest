let startDateInstance;
let endDateInstance;
let phoneNumInstance;
let largeCategoryInstance;
let middleCategoryInstance;
let histDataGrid;

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
	largeCategoryInstance = $('#large-category').dxSelectBox({
		dataSource: [
			{ code: 0, name: '옥션' },
			{ code: 1, name: '지마켓' }
		],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 0,
		onValueChanged: function (e) {
			//중분류 업데이트
			const selectedCode = e.value;
			middleCategoryInstance.option('dataSource', middleCategoryData[selectedCode] || []);
			middleCategoryInstance.option('value', 0); // 기본값 다시 설정
		}
	}).dxSelectBox("instance");
	
	const middleCategoryData = {
		0: [
			{ code: 0, name: '전체' },
			{ code: 1, name: 'SMSCLI_TBL_CHARGED' },
			{ code: 2, name: 'SMSCLI_TBL_ESCROW' },
			{ code: 3, name: 'SMSCLI_TBL_OUTBID' },
			{ code: 4, name: 'SMSCLI_TBL_API' },
			{ code: 5, name: 'SMSCLI_TBL_BATCH' },
			{ code: 6, name: 'SMSCLI_TBL_MOTORS' },
			{ code: 7, name: 'SMSCLI_TBL_PUMBL' },
			{ code: 8, name: 'SMSCLI_TBL_EVENT' },
			{ code: 9, name: 'SMSCLI_TBL_LARGE' },
			{ code: 21, name: 'LMSCLI_TBL_EVENT' },
			{ code: 22, name: 'LMSCLI_TBL_LARGE' },
			{ code: 41, name: 'MMSCLI_TBL_EVENT' },
			{ code: 42, name: 'MMSCLI_TBL_LARGE' },
			{ code: 71, name: 'IAC_SMSCLI_TBL_LARGE' },
			{ code: 72, name: 'IAC_LMSCLI_TBL_LARGE'},
			{ code: 73, name: 'IAC_MMSCLI_TBL_LARGE'}
		],
		1: [
			{ code: 0, name: '전체' },
			{ code: 11, name: 'SMSCLI_TBL_EMG' },
			{ code: 12, name: 'SMSCLI_TBL_ETC' },
			{ code: 13, name: 'SMSCLI_TBL_ORDER' },
			{ code: 14, name: 'SMSCLI_TBL_TRAN' },
			{ code: 15, name: 'SMSCLI_TBL_EVENT' },
			{ code: 16, name: 'SMSCLI_TBL_LARGE' },
			{ code: 31, name: 'LMSCLI_TBL_EVENT' },
			{ code: 32, name: 'LMSCLI_TBL_LARGE' },
			{ code: 51, name: 'MMSCLI_TBL_EVENT' },
			{ code: 52, name: 'MMSCLI_TBL_LARGE' },
			{ code: 61, name: 'GMKT_SMSCLI_TBL_LARGE' },
			{ code: 62, name: 'GMKT_LMSCLI_TBL_LARGE' },
			{ code: 63, name: 'GMKT_MMSCLI_TBL_LARGE' },
			{ code: 110, name: 'SFC_SMSCLI_TBL'}
		]
	};

	//중분류
	middleCategoryInstance = $('#middle-category').dxSelectBox({
		dataSource: middleCategoryData[0],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 0
	}).dxSelectBox("instance");
	
	//수신자 번호
	phoneNumInstance = $('#phone-num').dxTextBox({
		placeholder: '번호를 입력하세요.'
	}).dxTextBox("instance");
	
	//조회 요청
	const histDataSource = new DevExpress.data.CustomStore({
		key: "tranPr",
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
			const middleItem = middleCategoryInstance.option("selectedItem");
			
			const params = {
				startDate: startDateFormatted,
				endDate: endDateFormatted,
				startTime: startTimeFormatted + "000000",
				endTime: endTimeFormatted + "235959",
				phoneNum: phoneNumValue,
				//테스트 중. 전체 시 테이블명 수정 필요
				tableName: (middleItem.name == "전체") ? "SMSCLI_TBL_EVENT" : middleItem.name,
				//페이징 서버사이드 처리
				skip: loadOptions.skip ?? 0, //offset: 앞에서 건너뛸 레코드 수
				take: loadOptions.take ?? 50, //limit: 가져올 레코드 수
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
					totalCount: data.totalCount
				};
			})
			.catch(error => {
				console.error("데이터 로드 실패:", error);
				alert("데이터를 불러오는 중 오류가 발생했습니다.");
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
		//페이징 서버사이드 처리
		remoteOperations: {
			paging: true
		},
		//remoteOperations: true, //paging, sorting, filtering 등 전체
		loadMode: "raw", //processed: 클라이언트 처리, raw: 서버 처리
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
			{ dataField: "tranPr", caption: "NO", alignment: "center" },
			{ dataField: "tranPhone", caption: "수신 번호", alignment: "center" },
			{ dataField: "tranCallback", caption: "발신 번호", alignment: "center" },
			{ 
				dataField: "tranDate", 
				caption: "발송 일시", 
				alignment: "center" ,
				customizeText: function(cellInfo) {
					const value = cellInfo.value.trim();
					
					const yyyy = value.slice(0, 4);
					const mm = value.slice(4, 6);
					const dd = value.slice(6, 8);
					const hh = value.slice(8, 10);
					const mi = value.slice(10, 12);
					const ss   = value.slice(12, 14);
					
					return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
				}
			},
			{ dataField: "tranMsg", caption: "문자 내용", alignment: "left" },
			{ 
				dataField: "tranRslt", 
				caption: "결과", 
				alignment: "center" ,
				customizeText: function(cellInfo) {
					const value = String(cellInfo.value.trim());
					
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
			{ dataField: "corpReserved2", caption: "Flow #", alignment: "center" }
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
	const largeCategoryValue = largeCategoryInstance.option("value");
	
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
	histDataGrid.getDataSource().reload();
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

