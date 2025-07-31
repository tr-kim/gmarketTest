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
		{ code: 72, name: 'IAC_LMSCLI_TBL_LARGE' },
		{ code: 73, name: 'IAC_MMSCLI_TBL_LARGE' }
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
		{ code: 110, name: 'SFC_SMSCLI_TBL' }
	]
};

$(function() {
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);

	//라디오
	const radios = document.querySelectorAll('input[name="stat-radio"]');

	radios.forEach(radio => {
		radio.addEventListener('change', function() {
			//시간
			if (this.value == "1") {
				recreateDateBox("#startDate", {
					type: 'datetime',
					//displayFormat: "yyyy-MM-dd a h:mm",
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
					, inputAttr: { name: "startDate" }
				});

				recreateDateBox("#endDate", {
					type: 'datetime',
					//displayFormat: "yyyy-MM-dd a h:mm",
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
					, inputAttr: { name: "endDate" }
				});
			}
			if (this.value == "2") {
				recreateDateBox("#startDate", {
					type: "date",
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
					, inputAttr: { name: "startDate" }
				});
				recreateDateBox("#endDate", {
					type: "date",
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
					, inputAttr: { name: "endDate" }
				});
			}
			if (this.value == "3") {
				recreateDateBox("#startDate", {
					type: "date",
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
					, inputAttr: { name: "startDate" }
				});

				recreateDateBox("#endDate", {
					type: "date",
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
					, inputAttr: { name: "endDate" }
				});
			}
			if (this.value == "4") {
				recreateDateBox("#startDate", {
					showClearButton: true,
					useMaskBehavior: true,
					displayFormat: "yyyy '년' ",
					type: 'date',
					value: startDate,
					onValueChanged(e) {
						const date = e.value;
						if (date instanceof Date && !isNaN(date)) {
							const yyyy = date.getFullYear();
							console.log(`${yyyy}`);
						}
					}
					, inputAttr: { name: "startDate" }
				});

				recreateDateBox("#endDate", {
					showClearButton: true,
					useMaskBehavior: true,
					displayFormat: "yyyy '년' ",
					type: 'date',
					value: endDate,
					onValueChanged(e) {
						const date = e.value;
						if (date instanceof Date && !isNaN(date)) {
							const yyyy = date.getFullYear();
							console.log(`${yyyy}`);
						}
					}
					, inputAttr: { name: "endDate" }
				});
			}
		})
	})

	const checkedRadio = document.querySelector('input[name="stat-radio"]:checked');
	if (checkedRadio) {
		checkedRadio.dispatchEvent(new Event('change'));
	}

	//조회 그리드
	$("#statGrid").dxDataGrid({
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
				});
			}
		},
		keyExpr: ["resultDate", "tableCode", "telSect"],
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
						default: return "-";
					}
				}
			},
			{ dataField: "tableName", caption: "중분류", alignment: "center" },
			{ dataField: "tryCnt", caption: "전체", alignment: "center" },
			{ dataField: "succCnt", caption: "성공", alignment: "center" },
			{ dataField: "failCnt", caption: "실패", alignment: "center" },
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

	//대분류
	$('#large-category').dxSelectBox({
		dataSource: [{
			Code: 0,
			Name: '옥션',
		}, {
			Code: 1,
			Name: '지마켓',
		}],
		displayExpr: 'Name',
		valueExpr: 'Code',
		value: 1,
		onValueChanged: function(e) {
			//중분류 업데이트
			const selectedCode = e.value;
			$('#middle-category').dxSelectBox('option', 'dataSource', middleCategoryData[selectedCode] || []);
			$('#middle-category').dxSelectBox('option', 'value', 1); // 기본값 다시 설정
		}
		, inputAttr: { name: "companyCode" }
	});

	//중분류
	$('#middle-category').dxSelectBox({
		dataSource: middleCategoryData[1],
		displayExpr: 'Name',
		valueExpr: 'Code',
		value: 1
		, inputAttr: { name: "tableCode" }
	}).dxSelectBox("instance");
});

// 검색
function search() {
	const formData = new FormData(document.getElementById("statHistForm"));
	const skip = loadOptions.skip || 0;
	const take = loadOptions.take || 50;
	
	postFormAjax("/api/v1/stat/list", formData, listCallback);
}

// 성공 함수
function listCallback(data) {
	dataGrid.option("dataSource", data);
}

//엑셀 다운로드 버튼
document.getElementById("excel-btn").addEventListener('click', function(e) {
	e.preventDefault();
	const grid = $("#statGrid").dxDataGrid("instance");
	exportGridToExcel(grid);
})

//엑셀 다운로드
function exportGridToExcel(gridInstance) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('정산/통계 조회');

	DevExpress.excelExporter.exportDataGrid({
		component: gridInstance,
		worksheet: worksheet,
		autoFilterEnabled: true,
	}).then(() => {
		workbook.xlsx.writeBuffer().then((buffer) => {
			saveAs(new Blob([buffer], { type: 'application/octet-stream' }), '정산/통계 조회.xlsx');
		});
	});
}

// 검색 버튼 이벤트
document.getElementById('search_btn').addEventListener('click', function(e) {
	e.preventDefault();
	search();
});

//라디오 버튼클릭시 초기화
function recreateDateBox(selector, options) {
	const $el = $(selector);
	if ($el.data("dxDateBox")) {
		$el.dxDateBox("dispose"); //기존 제거
		$el.empty(); //DOM 비우기
	}
	$el.dxDateBox(options); //새로 생성
}

