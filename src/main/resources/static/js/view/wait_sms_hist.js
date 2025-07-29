let startDateInstance;
let endDateInstance;
let largeCategoryInstance;
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
	largeCategoryInstance = $('#large-category').dxSelectBox({
		dataSource: [
			{ code: 0, name: '옥션' },
			{ code: 1, name: '지마켓' }
		],
		displayExpr: 'name',
		valueExpr: 'code',
		value: 1
	}).dxSelectBox("instance");

	//제목
	titleInstance = $('#wait_title').dxTextBox({
		placeholder: '제목을 입력하세요.'
	}).dxTextBox("instance");
	
	//조회 요청
	const waitDataSource = new DevExpress.data.CustomStore({
		key: "bulkMsgKey",
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
			
			const params = {
				startDate: startDateFormatted,
				endDate: endDateFormatted,
				startTime: startTimeFormatted + "000000",
				endTime: endTimeFormatted + "235959",
				waitTitle: titleValue,
				//페이징 서버사이드 처리
				skip: loadOptions.skip ?? 0, //offset: 앞에서 건너뛸 레코드 수
				take: loadOptions.take ?? 50, //limit: 가져올 레코드 수
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
				DevExpress.ui.dialog.custom({
					showTitle: false,
					messageHtml: `<div style='text-align: center;' class="pt-3">데이터를 불러오는 중 오류가 발생했습니다.</div>`,
					buttons: [{
						text: "확인",
						onClick: function () {
							return {
								data: [],
								totalCount: 0
							};
						}
					}]
				}).show();
				//alert("데이터를 불러오는 중 오류가 발생했습니다.");
				// return {
				// 	data: [],
				// 	totalCount: 0
				// };
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
			paging: true //페이징 서버사이드 처리
		},
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
		selection: {
			mode: "multiple",
			allowSelectAll: false,
			showCheckBoxesMode: "always",
		},
		selectedRowKeys: [],
		// selection: { //원본
		// 	mode: 'multiple',
		// 	//allowSelectAll: false
		// },
		//행 마우스오버 시
		hoverStateEnabled: true,
		columns: [
			{ type: "selection" },
			{ dataField: "title", caption: "제목", alignment: "left" },
			{ 
				dataField: "reqTime", 
				caption: "전송 일시", 
				alignment: "center",
				customizeText: function(cellInfo) {
					return formatTimestamp(cellInfo.value);
				}
			},
			{ dataField: "msg", caption: "메시지 내용", alignment: "left" },
			{ dataField: "cnt", caption: "전체", alignment: "center" },
			{
				name: "detail",
				caption: "상세",
				type: "buttons",
				buttons: [{
					icon: "find",
					onClick: function(e) {
						DevExpress.ui.dialog.custom({
							showTitle: false,
							messageHtml: "<div style='text-align: center;' class='pt-3'>상세보기</div>",
							buttons: [{
								text: "확인",
								onClick: function () {
									return { result: "ok" }; //done()으로 넘어가는 값
								}
							}]
						}).show();
					}
				}],
			},
			{ dataField: "userID", caption: "발송ID", alignment: "center" },
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
		},
		// onToolbarPreparing: function(e) {
		// 	e.toolbarOptions.items.push({
		// 		location: "center",
		// 		widget: "dxButton",
		// 		options: {
		// 			text: "전체 선택/해제",
		// 			onClick: function() {
		// 				const grid = e.component;
		// 				const nowPlus30 = getAfterTime(30);
		// 				const allItems = grid.getDataSource().items();
		// 				const allowedKeys = allItems
		// 					.filter(row => row.reqTime > nowPlus30)
		// 					.map(row => row.bulkMsgKey);

		// 				const selectedKeys = grid.getSelectedRowKeys();
		// 				const isAlreadySelected =
		// 					allowedKeys.length === selectedKeys.length &&
		// 					allowedKeys.every(key => selectedKeys.includes(key));

		// 				if (isAlreadySelected) {
		// 					grid.clearSelection();
		// 				} else {
		// 					grid.selectRows(allowedKeys, false);
		// 				}
		// 			}
		// 		}
		// 	});
		// },
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
					const allowedKeys = allItems
						.filter(row => row.reqTime > nowPlus30)
						.map(row => row.bulkMsgKey);

					const selectedKeys = grid.getSelectedRowKeys();
					const isAlreadySelected =
						allowedKeys.length === selectedKeys.length &&
						allowedKeys.every(key => selectedKeys.includes(key));

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
						DevExpress.ui.dialog.custom({
							showTitle: false,
							messageHtml: "<div style='text-align: center;' class='pt-3'>삭제할 메시지를 선택하세요.</div>",
							buttons: [{
								text: "확인",
								onClick: function () {
									return { result: "ok" }; //done()으로 넘어가는 값
								}
							}]
						}).show();
						
						return;
					}
					
					const confirmDialog = DevExpress.ui.dialog.custom({
						showTitle: false,
						messageHtml: "<div style='text-align: center;' class='pt-3'>삭제하시겠습니까?</div>",
						buttons: [
							{
								text: "확인",
								type: "default",
								onClick: function(e) {
									const selectedKeys = waitDataGrid.getSelectedRowKeys();
									
									console.log("삭제할 키:", selectedKeys);
									
									//삭제 로직 실행
									
									
									
									
									
									
									
									return { result: "ok" };
								}
							}, {
								text: "취소",
								onClick: function(e) {
									return { result: "cancel" };
								}
							}
						]
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
				if (nowPlus30 < row.reqTime) {
					allowedRows.push(row.bulkMsgKey); //dataSource key
				} else {
					DevExpress.ui.notify("전송 임박 항목은 선택되지 않습니다.", "warning", 2000);
				}
			}
			
			//허용된 행만 다시 선택 처리
			e.component.selectRows(allowedRows, false);
		}
	}).dxDataGrid("instance");
	
});
function getAfterTime(minutes) {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60000);
}

 const searchBtn = $('#search-btn').dxButton({
    stylingMode: 'contained',
    text: '조회',
    type: 'default',
    width: 60,
    onClick() {
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

		if (diffDays < 0) {
			DevExpress.ui.dialog.custom({
				showTitle: false,
				messageHtml: `<div style='text-align: center;' class="pt-3">조회 기간을 다시 입력하세요.</div>`,
				buttons: [{
					text: "확인",
					onClick: function () {
						return false;
						//return { result: "ok" }; 
					}
				}]
			}).show();
			//alert("조회 기간을 다시 입력하세요.");
			
		}

		if (diffDays > 30) {
			DevExpress.ui.dialog.custom({
				showTitle: false,
				messageHtml: `<div style='text-align: center;' class="pt-3">
					조회 기간을 다시 입력하세요. (30일 이내)<br><br>
					<span class="text-black-50">현재 입력한 조회 기간 : ${Math.floor(diffDays)}일</span>
					</div>`,
				buttons: [{
					text: "확인",
					onClick: function () {
						return false;
					}
				}]
			}).show();
			//alert("조회 기간을 다시 입력하세요. (30일 이내)\n\n현재 입력한 조회 기간 : " + Math.floor(diffDays) + "일");
			//return false;
		}		

		//재조회
		waitDataGrid.getDataSource().reload();
    },
  }).dxButton('instance');

//조회 버튼
// document.getElementById("search-btn").addEventListener('click', function(e){
// 	e.preventDefault();
	
// 	const startValue = startDateInstance.option("value");
// 	const endValue = endDateInstance.option("value");
	
// 	let startDateFormatted = "", startTimeFormatted = "";
// 	let endDateFormatted = "", endTimeFormatted = "";
	
// 	// 날짜가 Date 객체인지 확인
// 	if (startValue instanceof Date && !isNaN(startValue)) {
// 		const yyyy = startValue.getFullYear();
// 		const mm = String(startValue.getMonth() + 1).padStart(2, '0');
// 		const dd = String(startValue.getDate()).padStart(2, '0');
// 		startDateFormatted = `${yyyy}${mm}`;
// 		startTimeFormatted = `${yyyy}${mm}${dd}`;
// 	}
	
// 	if (endValue instanceof Date && !isNaN(endValue)) {
// 		const yyyy = endValue.getFullYear();
// 		const mm = String(endValue.getMonth() + 1).padStart(2, '0');
// 		const dd = String(endValue.getDate()).padStart(2, '0');
// 		endDateFormatted = `${yyyy}${mm}`;
// 		endTimeFormatted = `${yyyy}${mm}${dd}`;
// 	}
	
// 	// 조회기간 구하기
// 	let start = new Date(
// 		parseInt(startTimeFormatted.slice(0, 4)),
// 		parseInt(startTimeFormatted.slice(4, 6)) - 1,
// 		parseInt(startTimeFormatted.slice(6, 8))
// 	);

// 	let end = new Date(
// 		parseInt(endTimeFormatted.slice(0, 4)),
// 		parseInt(endTimeFormatted.slice(4, 6)) - 1,
// 		parseInt(endTimeFormatted.slice(6, 8))
// 	);

// 	let diffMs = end - start;
// 	let diffDays = diffMs / (1000 * 60 * 60 * 24);

// 	if (diffDays < 0) {
// 		alert("조회 기간을 다시 입력하세요.");
// 		return false;
// 	}

// 	if (diffDays > 30) {
// 		alert("조회 기간을 다시 입력하세요. (30일 이내)\n\n현재 입력한 조회 기간 : " + Math.floor(diffDays) + "일");
// 		return false;
// 	}		

// 	//재조회
// 	waitDataGrid.getDataSource().reload();
// });

//삭제 버튼
// document.getElementById("del-btn").addEventListener('click', function(e){
// 	e.preventDefault();
	
// 	//선택된 행 체크
// 	const selectedRows = waitDataGrid.getSelectedRowsData();
	
// 	if (selectedRows.length === 0) {
// 		DevExpress.ui.dialog.custom({
// 			showTitle: false,
// 			messageHtml: "<div style='text-align: center;'>삭제할 메시지를 선택하세요.</div>",
// 			buttons: [{
// 				text: "확인",
// 				onClick: function () {
// 					return { result: "ok" }; //done()으로 넘어가는 값
// 				}
// 			}]
// 		}).show();
		
// 		return;
// 	}
	
// 	const confirmDialog = DevExpress.ui.dialog.custom({
// 		showTitle: false,
// 		messageHtml: "<div style='text-align: center;'>삭제하시겠습니까?</div>",
// 		buttons: [
// 			{
// 				text: "확인",
// 				type: "default",
// 				onClick: function(e) {
// 					const selectedKeys = waitDataGrid.getSelectedRowKeys();
					
// 					console.log("삭제할 키:", selectedKeys);
					
// 					//삭제 로직 실행
					
					
					
					
					
					
					
// 					return { result: "ok" };
// 				}
// 			}, {
// 				text: "취소",
// 				onClick: function(e) {
// 					return { result: "cancel" };
// 				}
// 			}
// 		]
// 	});
	
// 	confirmDialog.show().done(function(dialogResult) {
// 		if (dialogResult.result === "ok") {
// 			console.log("삭제 완료");
			
// 		} else {
// 			console.log("취소");
// 		}
// 	});
// });

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
