let dataGrid;
let companyInstance;
let companyValue;
let tableInstance;
let tableValue;
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

	//라디오
	const radios = document.querySelectorAll('input[name="timeType"]');

	radios.forEach(radio => {
		radio.addEventListener('change', function() {
			//시간
			if (this.value == "1") {
				recreateDateBox("#startDate", {
					type: 'date',
					name: "startDate",
					value: startDate,
					displayFormat: "yyyy-MM-dd",
					pickerType: "calendar",
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
				
				// 시작일 시
				recreateDateBox("#startHour", {
					type: 'time',
					name: "startHour",
					value: startDate.getHours(),
					displayFormat: "HH시",
					pickerType: "list",
					interval: 60,			// 분 선택 없애기 (1시간 단위)
					width: 120,
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
					type: 'date',
					name: "endDate",
					value: endDate,
					displayFormat: "yyyy-MM-dd",
					pickerType: "calendar",
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
				
				// 종료일 시
				recreateDateBox("#endHour", {
					type: 'time',
					name: "endHour",
					value: endDate.getHours(),
					displayFormat: "HH시",
					pickerType: "list",
					interval: 60,			// 분 선택 없애기 (1시간 단위)
					width: 120,
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
				
				// 값이 없을 경우 숨김 처리
				recreateDateBox("#startHour", {
					onInitialized(e) {
				        const instance = e.component;
				        if (!instance.option("value")) {
				            instance.option("visible", false);
				        }
				    }
				});
				recreateDateBox("#endHour", {
					onInitialized(e) {
				        const instance = e.component;
				        if (!instance.option("value")) {
				            instance.option("visible", false);
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
				
				// 값이 없을 경우 숨김 처리
				recreateDateBox("#startHour", {
					onInitialized(e) {
				        const instance = e.component;
				        if (!instance.option("value")) {
				            instance.option("visible", false);
				        }
				    }
				});
				recreateDateBox("#endHour", {
					onInitialized(e) {
				        const instance = e.component;
				        if (!instance.option("value")) {
				            instance.option("visible", false);
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
				
				// 값이 없을 경우 숨김 처리
				recreateDateBox("#startHour", {
					onInitialized(e) {
				        const instance = e.component;
				        if (!instance.option("value")) {
				            instance.option("visible", false);
				        }
				    }
				});
				recreateDateBox("#endHour", {
					onInitialized(e) {
				        const instance = e.component;
				        if (!instance.option("value")) {
				            instance.option("visible", false);
				        }
				    }
				});
			}
		})
	})

	const checkedRadio = document.querySelector('input[name="timeType"]:checked');
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
		},
		headerFilter: {
			visible: true
		},
		//행 선택 시
		selection: {
			mode: 'single',
		},
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
						case 1: return "G마켓";
						case 2: return "스마일캐시";
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
			
			tableValue = (tableValue == "선택하세요" || tableValue === undefined) ? "" : tableValue;
			
//			var companyName;
//			switch(companyValue) {
//				case 0 : companyName = `(옥션 ${tableValue} 테이블)`; break;
//				case 1 :  companyName = `(G마켓 ${tableValue} 테이블)`; break;
//				case 2 :  companyName = `(스마일캐시 ${tableValue} 테이블)`; break;
//				default :  companyName = `(G마켓 ${tableValue} 테이블)`; break;
//			}
			
//			$("#totalCount").text(`검색된 내용은 총 ${totalCount}건 입니다. ${companyName}`);
			$("#totalCount").text(`총 ${totalCount}건`);
			
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
		const diffMs = searchEndDate - searchStartDate;
		const diffDays = diffMs / (1000 * 60 * 60 * 24);
		
		if(searchStartDate > searchEndDate) { showDialogCustom("조회 기간을 다시 입력하세요."); return false; }
		if(diffDays > period) { showDialogCustom(`조회 기간을 다시 입력하세요.(30일 이내)\n\n현재 입력한 조회 기간 : ${diffDays} 일`); return false }

		if(searchCompanyCode == -1 || searchCompanyCode < 0) { showDialogCustom("대분류를 선택하세요."); return false; }
		if(searchTableCode == -1 || searchTableCode < 0) { showDialogCustom("중분류를 선택하세요."); return false; }

		const dataSource = new DevExpress.data.DataSource({
			load: function(loadOptions) {
				
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

