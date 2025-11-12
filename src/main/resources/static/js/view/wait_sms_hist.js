let startDateInstance;
let endDateInstance;
let companyInstance;
let titleInstance;
let waitDataGrid;

$(function () {
	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);
	
	//조회 기간
	startDateInstance = $("#startDate").dxDateBox({
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
	}).dxDateBox("instance");

	endDateInstance = $("#endDate").dxDateBox({
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
	}).dxDateBox("instance");

	//대분류
	companyInstance = $('#companyCode').dxSelectBox({
		dataSource: [
			{ code: -1, name: '선택하세요' },
			{ code: 0, name: '옥션' },
			{ code: 1, name: 'G마켓' },
			{ code: 2, name: '스마일캐시' }
		],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 1
	}).dxSelectBox("instance");

	//제목
	titleInstance = $('#wait_title').dxTextBox({
		placeholder: '제목을 입력하세요.'
	}).dxTextBox("instance");
	
	//조회 버튼
	$('#search-btn').dxButton({
		stylingMode: 'contained',
		text: '조회',
		type: 'default',
		width: 60,
		onClick() {
			const selectedCompany = companyInstance.option("selectedItem");

			const companyCode = selectedCompany ? selectedCompany.code : -1;
			if (companyCode == null || companyCode == -1) {
				showDialogCustom("대분류를 선택하세요.");
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
				return false;
			}
			
			//재조회
			waitDataGrid.getDataSource().reload();
		}
	}).dxButton('instance');
	
	//조회 요청
	const waitDataSource = new DevExpress.data.CustomStore({
		key: "B_MSG_KEY",
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
			
			const titleValue = titleInstance.option("value");
			const companyValue = companyInstance.option("value");
			
			const params = {
				startDate: startDateFormatted,
				endDate: endDateFormatted,
				startTime: startTimeFormatted + "000000",
				endTime: endTimeFormatted + "235959",
				waitTitle: titleValue,
				companyCode: companyValue,
				// DevExtreme 조회 옵션
				filter: loadOptions.filter || [],   // searchPanel 검색
				group: loadOptions.group || [],     // columns 검색
				skip: loadOptions.skip ?? 0,        // 페이지 시작 위치(offset)
				take: loadOptions.take ?? 50,       // 페이지 크기(limit)
				sort: loadOptions.sort || [],       // 정렬
			};
			
			return fetch('/api/v1/wait/list', {
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
				showDialogCustom('error');
				
				return {
					data: [],
					totalCount: 0
				};
			});
		}
    });

	//날짜 포맷팅
	function formatTimestamp(str) {
		str = str.trim();
		const yyyy = str.slice(0, 4);
		const mm = str.slice(4, 6);
		const dd = str.slice(6, 8);
		const hh = str.slice(8, 10);
		const mi = str.slice(10, 12);
		const ss = str.slice(12, 14);
		return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
	}

	//조회 그리드
	waitDataGrid = $("#waitHistGrid").dxDataGrid({
		dataSource: waitDataSource,
		loadMode: "raw", //서버사이드 처리
		remoteOperations: {
			filtering: false, // searchPanel 검색
			grouping: false, // columns 검색
			paging: true,
			sorting: true
		},
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
		columnAutoWidth: true,
		selection: {
			mode: "multiple",
			allowSelectAll: false, //전체선택 체크박스 방지
		},
		//행 마우스오버 시
		hoverStateEnabled: true,
		columns: [
			{ type: "selection" },
			{ dataField: "TITLE", caption: "제목", alignment: "left" },
			{ 
				dataField: "REQ_TIME", 
				caption: "전송 일시", 
				alignment: "center",
				customizeText: function(cellInfo) {
					return formatTimestamp(cellInfo.value);
				}
			},
			{ dataField: "MSG", caption: "메시지 내용", alignment: "left" },
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
		onOptionChanged(e) {
			// 페이징 클릭 시 loadPanel 삭제
			// if (e.fullName === "paging.pageSize") e.component.option("loadPanel.enabled", false);
	    },
		onContentReady: function(e) {
			// 데이터 로드가 끝났을 때 복구
			// const grid = e.component;
			// if (!grid.option("loadPanel.enabled")) grid.option("loadPanel.enabled", true);
			
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount}건`);
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
							//선택된 행 체크
							const selectedRows = waitDataGrid.getSelectedRowsData();
							
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
													waitDataGrid.getDataSource().reload(); //재조회
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
		onSelectionChanged: function(e) { //원본
			const allowedRows = [];
			const nowPlus30 = getAfterTime(30); //현재시간+30분
			
			for (const row of e.selectedRowsData) {
				if (nowPlus30 < row.REQ_TIME) {
					allowedRows.push(row.B_MSG_KEY); //dataSource key
				} else {
					const message = '전송 임박 항목은 선택되지 않습니다.';
					showDialogCustom(message);
				}
			}
			
			//허용된 행만 다시 선택 처리
			e.component.selectRows(allowedRows, false);
		}
	}).dxDataGrid("instance");
});


//시간 구하기
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

