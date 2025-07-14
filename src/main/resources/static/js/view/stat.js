$(function () {
	const startDate = new Date();
	const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
	
	//라디오
	const radios = document.querySelectorAll('input[name="stat-radio"]');
	
	radios.forEach(radio => {
		radio.addEventListener('change', function () {
			//시간
	        if(this.value == "1"){
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
	            });
	        }
	        if(this.value == "2"){
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
	                },
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
	                },
	            });
	        }
	        if(this.value == "3"){
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
	                },
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
	                },
	            });
	        }
	        if(this.value == "4"){
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
	                },
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
					},
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
		dataSource: [
			{ b_msg_key: "0000001", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000002", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000003", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000004", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000005", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000006", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000007", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000008", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000009", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000010", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000011", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000012", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000013", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000014", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000015", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000016", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000017", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000018", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000019", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000020", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000021", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000022", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000023", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000024", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000025", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000026", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000027", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000028", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000029", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000030", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000031", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000032", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000033", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000034", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000035", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000036", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000037", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000038", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000039", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000040", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000041", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000042", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000043", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000044", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000045", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000046", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000047", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000048", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000049", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000050", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000051", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000052", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000053", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000054", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000055", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000056", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000057", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000058", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000059", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000060", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000061", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000062", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000063", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000064", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000065", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000066", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000067", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000068", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000069", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
			{ b_msg_key: "0000070", company_name: "지마켓", table_name: "SMSCLI_TBL_EVENT", result_date: "2025070109", try_cnt: "100", succ_cnt: "100", fail_cnt: "0" },
		],
		keyExpr: "b_msg_key",
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
			{ dataField: "result_date", caption: "시간/일자", alignment: "center" },
			{ dataField: "company_name", caption: "대분류", alignment: "center" },	
			{ dataField: "table_name", caption: "중분류", alignment: "center" },
			{ dataField: "try_cnt", caption: "전체", alignment: "center" },		
			{ dataField: "succ_cnt", caption: "성공", alignment: "center" },		
			{ dataField: "fail_cnt", caption: "실패", alignment: "center" },						
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
		},{
			Code: 1,
			Name: '지마켓',
		}],
			displayExpr: 'Name',
			valueExpr: 'Code',
			value: 1
	});

	//중분류
	$('#middle-category').dxSelectBox({
		dataSource: [{
			Code: 0,
			Name: '전체',
		}, {
			Code: 11,
			Name: 'SMSCLI_TBL_EMG',
		}, {
			Code: 12,
			Name: 'SMSCLI_TBL_ETC',
		}, {
			Code: 13,
			Name: 'SMSCLI_TBL_ORDER',
		}, {
			Code: 14,
			Name: 'SMSCLI_TBL_TRAN',
		}, {
			Code: 15,
			Name: 'SMSCLI_TBL_EVENT',
		}, {
			Code: 16,
			Name: 'SMSCLI_TBL_LARGE',
		}, {
			Code: 31,
			Name: 'LMSCLI_TBL_EVENT',
		}, {
			Code: 32,
			Name: 'LMSCLI_TBL_LARGE',
		}, {
			Code: 51,
			Name: 'MMSCLI_TBL_EVENT',
		}, {
			Code: 52,
			Name: 'MMSCLI_TBL_LARGE',
		}, {
			Code: 61,
			Name: 'GMKT_SMSCLI_TBL_LARGE',
		}, {
			Code: 62,
			Name: 'GMKT_LMSCLI_TBL_LARGE',
		}, {
			Code: 63,
			Name: 'GMKT_MMSCLI_TBL_LARGE',
		}, {
			Code: 110,
			Name: 'SFC_SMSCLI_TBL',
		}],
			displayExpr: 'Name',
			valueExpr: 'Code',
			value: 0
	});


});

//엑셀 다운로드 버튼
document.getElementById("excel-btn").addEventListener('click',function(e){
	e.preventDefault();
	const grid = $("#statGrid").dxDataGrid("instance");
	exportGridToExcel(grid);
})

//엑셀 다운로드
function exportGridToExcel(gridInstance){
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

//라디오 버튼클릭시 초기화
function recreateDateBox(selector, options) {
	const $el = $(selector);
	if ($el.data("dxDateBox")) {
		$el.dxDateBox("dispose"); //기존 제거
		$el.empty(); //DOM 비우기
	}
	$el.dxDateBox(options); //새로 생성
}

