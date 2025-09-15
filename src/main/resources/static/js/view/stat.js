let dataGrid;
let largeCategory;
let largeCategorySelectCode;
let middleCategory;
let middleCategorySelectName;
const period = 3000;	// 최대 검색 기간 

$(function() {

	const middleCategoryData = {
		0: [
			{ code: -1, name: '선택하세요' },
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
			{ code: 72, name: 'IAC_LMSCLI_TBL_LARGE' },
			{ code: 73, name: 'IAC_MMSCLI_TBL_LARGE' }
		],
		1: [
			{ code: -1, name: '선택하세요' },
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
			{ code: 110, name: 'SFC_SMSCLI_TBL' }
		]
	};
	
	// 일주일 기본값 설정
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);

	//라디오
	const radios = document.querySelectorAll('input[name="timeType"]');

	radios.forEach(radio => {
		radio.addEventListener('change', function() {
			//시간
			if (this.value == "1") {
				recreateDateBox("#startDate", {
					type: 'datetime',
					name: "startDate",
					value: startDate,
					onValueChanged(e) {
						const date = e.value;
						if (date instanceof Date && !isNaN(date)) {
							const yyyy = date.getFullYear();
							const mm = String(date.getMonth() + 1).padStart(2, '0');
							const dd = String(date.getDate()).padStart(2, '0');
							const hh = String(date.getHours()).padStart(2, '0');
							const min = String(date.getMinutes()).padStart(2, '0');

							console.log(`${yyyy}${mm}${dd}${hh}${min}`);
						}
					}
				});

				recreateDateBox("#endDate", {
					type: 'datetime',
					name: "endDate",
					value: endDate,
					onValueChanged(e) {
						const date = e.value;
						if (date instanceof Date && !isNaN(date)) {
							const yyyy = date.getFullYear();
							const mm = String(date.getMonth() + 1).padStart(2, '0');
							const dd = String(date.getDate()).padStart(2, '0');
							const hh = String(date.getHours()).padStart(2, '0');
							const min = String(date.getMinutes()).padStart(2, '0');

							console.log(`${yyyy}${mm}${dd}${hh}${min}`);
						}
					}
				});
			} else if (this.value == "2") {
				recreateDateBox("#startDate", {
					type: "date",
					name: "startDate",
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
					}
				});
				recreateDateBox("#endDate", {
					type: "date",
					name: "endDate",
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
					}
				});
			} else if (this.value == "3") {
				recreateDateBox("#startDate", {
					type: "date",
					name: "startDate",
					value: startDate,
					displayFormat: "yyyy-MM",
					onValueChanged(e) {
						const date = e.value;
						if (date instanceof Date && !isNaN(date)) {
							const yyyy = date.getFullYear();
							const mm = String(date.getMonth() + 1).padStart(2, '0');

							console.log(`${yyyy}${mm}`);
						}
					}
				});

				recreateDateBox("#endDate", {
					type: "date",
					name: "endDate",
					value: endDate,
					displayFormat: "yyyy-MM",
					onValueChanged(e) {
						const date = e.value;
						if (date instanceof Date && !isNaN(date)) {
							const yyyy = date.getFullYear();
							const mm = String(date.getMonth() + 1).padStart(2, '0');

							console.log(`${yyyy}${mm}`);
						}
					}
				});
			} else if (this.value == "4") {
				recreateDateBox("#startDate", {
					showClearButton: true,
					useMaskBehavior: true,
					displayFormat: "yyyy '년' ",
					type: 'date',
					name: "startDate",
					value: startDate,
					onValueChanged(e) {
						const date = e.value;
						if (date instanceof Date && !isNaN(date)) {
							const yyyy = date.getFullYear();
							console.log(`${yyyy}`);
						}
					}
				});

				recreateDateBox("#endDate", {
					showClearButton: true,
					useMaskBehavior: true,
					displayFormat: "yyyy '년' ",
					type: 'date',
					name: "endDate",
					value: endDate,
					onValueChanged(e) {
						const date = e.value;
						if (date instanceof Date && !isNaN(date)) {
							const yyyy = date.getFullYear();
							console.log(`${yyyy}`);
						}
					}
				});
			}
		})
	})

	const checkedRadio = document.querySelector('input[name="timeType"]:checked');
	if (checkedRadio) {
		checkedRadio.dispatchEvent(new Event('change'));
	}

	//중분류
	middleCategory = $('#middle-category').dxSelectBox({
		dataSource: middleCategoryData[1],
		displayExpr: 'name',
		valueExpr: 'code',
		value: -1,
		name: "tableCode",
		onValueChanged: function(e) {
			
			// select text 가져오기
			middleCategorySelectName = e.component.option("displayValue");
		}
	}).dxSelectBox("instance");
	
	// 사용자 등급 및 회사 업체에 따라 select box option 설정
	let largeCategoryData = [ { code: -1, name: '선택하세요' } ];
	
	if((userGrade == 0 || (userGrade == 1 && companyCode == 0))) {
		largeCategoryData.push({ code: 0, name: '옥션' });
	} 
	
	if((userGrade == 0 || (userGrade == 1 && companyCode == 1))) {
		largeCategoryData.push({ code: 1, name: '지마켓' });
	}
	
	//대분류
	largeCategory = $('#large-category').dxSelectBox({
		dataSource: largeCategoryData,
		displayExpr: 'name',
		valueExpr: 'code',
		value: companyCode,
		name: "companyCode",
		onValueChanged: function(e) {
			//중분류 업데이트
			largeCategorySelectCode = e.value;
			middleCategory.option('dataSource', middleCategoryData[largeCategorySelectCode] || []);
			middleCategory.option('value', -1); // 기본값 다시 설정
			
		}
	}).dxSelectBox("instance");

	//조회 그리드
	dataGrid = $("#statGrid").dxDataGrid({
		dataSource: [],
		headerFilter: {
			visible: true
		},
		//행 선택 시
		selection: {
			mode: 'single',
		},
		height: 500,
		//행 마우스오버 시
		hoverStateEnabled: true,
		searchPanel: {
			visible: true,
			width: 300
		},
		paging: {
			pageSize: 50
		},
		remoteOperations: {
			paging: true //페이징 서버사이드 처리
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
		columnAutoWidth: true,
		columns: [
			{ dataField: "resultDate", caption: "시간/일자", alignment: "center" },
			{
				dataField: "companyName", caption: "대분류", alignment: "center", calculateCellValue: function(rowData) {
					switch (rowData.companyCode) {
						case 0: return "옥션";
						case 1: return "지마켓";
						default: return "선택하세요";
					}
				}
			},
			{ dataField: "tableName", caption: "중분류", alignment: "center" },
			{ dataField: "tryCnt", caption: "전체", alignment: "center" },
			{ dataField: "succCnt", caption: "성공", alignment: "center" },
			{ dataField: "failCnt", caption: "실패", alignment: "center",	 calculateCellValue: function(rowData) {
					return rowData.tryCnt - rowData.succCnt;
				} 
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
			
			middleCategorySelectName = (middleCategorySelectName == "선택하세요" || middleCategorySelectName === undefined) ? "" : middleCategorySelectName;
			
			const companyName = largeCategorySelectCode == 0 ? "(옥션 " + middleCategorySelectName + " 테이블)" : "(G마켓 " + middleCategorySelectName + " 테이블)"; 
			$("#totalCount").text(`검색된 내용은 총 ${totalCount}건 입니다. ${companyName}`);
			
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
		const formData = new FormData(document.getElementById("statHistForm"));
		
		const searchCompanyCode = formData.get("companyCode");
		const searchTableCode = formData.get("tableCode");
		const searchStartDate = new Date(formData.get("startDate"));
		const searchEndDate = new Date(formData.get("endDate"));
		const diffMs = endDate - startDate;
		
		if(searchStartDate > searchEndDate) { showDialogCustom("조회 기간을 다시 입력하세요."); return false; }
		if(diffMs > period) { showDialogCustom("조회 기간을 다시 입력하세요.(30일 이내)\n\n현재 입력한 조회 기간 : " + diffMs + "일"); return false }
		
		if(searchCompanyCode == -1 || searchCompanyCode < 0) { showDialogCustom("대분류를 선택하세요."); return false; }
		if(searchTableCode == -1 || searchTableCode < 0) { showDialogCustom("중분류를 선택하세요."); return false; }
		
		const dataSource = new DevExpress.data.DataSource({
			load: function(loadOptions) {
				const formData = new FormData(document.getElementById("statHistForm"));
				
				const skip = loadOptions.skip || 0;
				const take = loadOptions.take || 50;

				formData.append("skip", skip);
				formData.append("take", take);

				return $.ajax({
					url: "/api/v1/stat/list",
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

