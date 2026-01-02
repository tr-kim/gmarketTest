let startDateInstance;
let endDateInstance;
let companyInstance;
let titleInstance;
let waitHistGrid;

$(function () {
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
		{ code: 1, name: 'G마켓' }
	];

	// userGrade 적용
	companyList.forEach(company => {
		if (userGrade === 0 || (userGrade === 1 && companyCode === company.code)) {
			companyArray.push(company);
		}
	});
	
	// 대분류
	companyInstance = $('#companyCode').dxSelectBox({
		dataSource: companyArray,
		displayExpr: 'name',
		valueExpr: 'code',
		value: companyCode
	}).dxSelectBox("instance");
	
	// 제목
	titleInstance = $('#wait_title').dxTextBox({
		placeholder: '제목을 입력하세요.',
		maxLength: 60
	}).dxTextBox("instance");
	
	// 조회 파라미터 생성 함수
	function buildSearchParams(loadOptions = {}) {
		const startValue = startDateInstance.option("value");
		const endValue = endDateInstance.option("value");
		const companyValue = companyInstance.option("value");
		const titleValue = titleInstance.option("value");
		
		return {
			startDate: formatDate(startValue, "yyyymm"),
			endDate: formatDate(endValue, "yyyymm"),
			startTime: formatDate(startValue, "yyyymmdd"),
			endTime: formatDate(endValue, "yyyymmdd"),
			companyCode: companyValue,
			waitTitle: titleValue,
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
		const startValue = startDateInstance.option("value");
		const endValue = endDateInstance.option("value");
		
		const diffMs = endValue - startValue;
		const diffDays = diffMs / (1000 * 60 * 60 * 24);
		
		if (companyCode === -1) {
			showDialogCustom("대분류를 선택하세요.");
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
			url: "/api/v1/wait/list",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(param)
		})
		.then(result => ({
			data: result.data,
			totalCount: result.totalCount
		}))
		.catch(() => {
			showDialogCustom("error");
			return { data: [], totalCount: 0 };
		});
	}
	
	// 조회 그리드
	waitHistGrid = $("#waitHistGrid").dxDataGrid({
		dataSource: {
			key: "B_MSG_KEY",
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
			mode: "multiple",
			allowSelectAll: false, // 전체선택 체크박스 방지
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
			{ type: "selection" },
			{ dataField: "", caption: "대분류", alignment: "center",
				customizeText: function() {
					return companyInstance.option("selectedItem").name;
				}
			},
			{ dataField: "TITLE", caption: "제목", alignment: "left", width: 200},
			{
				dataField: "REQ_TIME",
				caption: "전송 일시",
				alignment: "center",
				customizeText: function(cellInfo) {
					if (cellInfo && cellInfo.value) {
						return formatTimestamp(cellInfo.value);
					} else {
						return '-';
					}
				}
			},
			{ dataField: "MSG", caption: "메시지 내용", alignment: "left", width: 350 },
			{ dataField: "CNT", caption: "전체", alignment: "center" },
			{ dataField: "SVC_TYPE", caption: "상세", alignment: "center" },
			{ dataField: "USER_ID", caption: "발송ID", alignment: "center" },
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
			openWaitMsgInquiry(e.data);
		},
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount.toLocaleString()}건`);
		},
		onToolbarPreparing: function (e) {
			const toolbarItems = e.toolbarOptions.items;
			
			// SearchPanel 항목 찾기
			const searchIndex = toolbarItems.findIndex(item => item.name === "searchPanel");
			
			if (searchIndex !== -1) {
				// "전체 선택/해제" 버튼
				const selectAllToggleBtn = {
					location: "after",
					widget: "dxButton",
					options: {
						text: "전체 선택/해제",
						stylingMode: 'outlined',
						type: 'danger',
						onClick: function () {
							const grid = e.component;
							const nowPlus30 = getAfterTime(30);
							const allItems = grid.getDataSource().items();
							const allowedKeys = allItems.filter(row => row.REQ_TIME > nowPlus30).map(row => row.B_MSG_KEY);
							
							const selectedKeys = grid.getSelectedRowKeys();
							const isAlreadySelected = allowedKeys.length === selectedKeys.length && allowedKeys.every(key => selectedKeys.includes(key));
							
							if (isAlreadySelected) {
								grid.clearSelection();
							} else {
								grid.selectRows(allowedKeys, false);
							}
						}
					}
				};
				
				// "선택 삭제" 버튼
				const deleteBtn = {
					location: "after",
					widget: "dxButton",
					options: {
						text: "선택 삭제",
						stylingMode: 'contained',
						type: 'danger',
						elementAttr: {
							id: "del-btn"
						},
						onClick:function (){
							// 선택된 행 체크
							const selectedRows = waitHistGrid.getSelectedRowsData();
							
							if (selectedRows.length === 0) {
								const message = '삭제할 메시지를 선택하세요.';
								showDialogCustom(message);
								return;
							}
							
							const confirmDialog = DevExpress.ui.dialog.custom({
								showTitle: false,
								messageHtml: `<div style='text-align: center;' class='pt-3'>
									<b>${selectedRows.length}건</b>을 삭제하시겠습니까?
								</div>`,
								buttons: [{
									text: "확인",
									type: "default",
									onClick: function() {
										const grid = e.component;
										const selectedRowsData = grid.getSelectedRowsData();
										const companyValue = companyInstance.option("value");
										
										const param = selectedRowsData.map(row => ({
											bulkMsgKey: row.B_MSG_KEY,
											svcType: row.SVC_TYPE,
											companyCode: companyValue
										}));
										
										deleteAjax('/api/v1/wait/delete', param, function callback(data) {
											const code = data.code;
											const result = data.result;
											
											if (code == 1000) {
												showDialogCustom(result, function (){
													waitHistGrid.getDataSource().reload(); // 재조회
												});
											} else {
												showDialogCustom(result);
											}
										});
										return { result: "ok" };
									}
								}, {
									text: "취소",
									onClick: function(e) {
										return { result: "cancel" };
									}
								}]
							});
							
							confirmDialog.show().done(function(dialogResult) {
								if (dialogResult.result === "ok") {
									console.log("삭제 완료");
								} else {
									console.log("취소");
								}
							});
						}
					}
				};
				
				// "전체 선택/해제" 먼저, 그다음 "선택 삭제"
				toolbarItems.splice(searchIndex, 0, deleteBtn);
				toolbarItems.splice(searchIndex, 0, selectAllToggleBtn);
			}
		},
		onSelectionChanged: function(e) { // 원본
			const allowedRows = [];
			const nowPlus30 = getAfterTime(30); // 현재시간+30분
			
			for (const row of e.selectedRowsData) {
				if (nowPlus30 < row.REQ_TIME) {
					allowedRows.push(row.B_MSG_KEY); // dataSource key
				} else {
					const message = '전송 임박 항목은 선택되지 않습니다.';
					showDialogCustom(message);
				}
			}
			
			// 허용된 행만 다시 선택 처리
			e.component.selectRows(allowedRows, false);
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
			waitHistGrid.refresh();
		}
	}).dxButton('instance');
	
	// 상세 보기 모달
	function openWaitMsgInquiry(data = {}) {
		let inTimeValue = "";
		let reqTimeValue = "";
		
		if (data.IN_TIME) {
			inTimeValue = formatTimestamp(data.IN_TIME);
		}
		
		if (data.REQ_TIME) {
			reqTimeValue = formatTimestamp(data.REQ_TIME);
		}
		
		document.getElementById('title').value = data.TITLE;
		document.getElementById('in_time').value = inTimeValue;
		document.getElementById('req_time').value = reqTimeValue;
		document.getElementById('user_id').value = data.USER_ID;	
		document.getElementById('msg').value = data.MSG;
		
		document.getElementById('message_inquiry').classList.add('d-block');
		toggleBodyClass();
	}
	
	// 시간 구하기
	function getAfterTime(minute) {
		const now = new Date();
		now.setMinutes(now.getMinutes() + minute);
		
		const yyyy = now.getFullYear();
		const MM = String(now.getMonth() + 1).padStart(2, '0');
		const dd = String(now.getDate()).padStart(2, '0');
		const HH = String(now.getHours()).padStart(2, '0');
		const mm = String(now.getMinutes()).padStart(2, '0');
		const ss = String(now.getSeconds()).padStart(2, '0');
		
		return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
	}
});