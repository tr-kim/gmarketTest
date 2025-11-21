let dataGrid;
let companyInstance;
let userGradeInstance;
let userIdInstance;

let currentMode = ''; // 전역 변수로 모드 추적
let currentKey = null;

let pageSize;

$(function() {

	let companyArray;
	const allCompanies = [{ Code: 0, Name: '옥션' }, { Code: 1, Name: 'G마켓' }, { Code: 2, Name: '스마일캐시' }];

	if (userGrade == 0) {
		// 슈퍼관리자는 모든 회사 선택 가능
		companyArray = allCompanies;
	} else if (userGrade == 1) {
		// 일반 관리자는 자신이 속한 회사만 선택 가능
		companyArray = allCompanies.filter(c => c.Code === companyCode);
	}

	//구분
	companyInstance = $('#companyCode').dxSelectBox({
		dataSource: companyArray,
		displayExpr: 'Name',
		valueExpr: 'Code',
		value: userGrade == 0 ? 1 : companyCode
		, inputAttr: { name: "companyCode" }
		// , onValueChanged: function(e) {
		// 	dataGrid.option('editing.refreshMode', e.value);
		// }
	}).dxSelectBox("instance");

	let userGradeData = [{ Grade: -1, Name: '전체' }];
	
	if (userGrade == 0) userGradeData.push({ Grade: 0, Name: '슈퍼관리자' });
	
	userGradeData.push(
	    { Grade: 1, Name: '관리자' },
	    { Grade: 2, Name: '사용자' },
	    { Grade: 3, Name: '운영자' }
	);

	//사용자등급
	 userGradeInstance = $('#user_grade').dxSelectBox({
		dataSource: userGradeData,
		displayExpr: 'Name',
		valueExpr: 'Grade',
		value: -1
		, inputAttr: { name: "userGrade" }
		// , onValueChanged: function(e) {
		// 	dataGrid.option('editing.refreshMode', e.value);
		// }
	}).dxSelectBox("instance");

	//사용자ID
	userIdInstance = $('#user_id').dxTextBox({
		placeholder: 'ID를 입력하세요.'
		, inputAttr: { name: "userId" }
	}).dxTextBox("instance");
	
	//조회 그리드
	dataGrid = $("#userGrid").dxDataGrid({
		dataSource: {
			load: function(loadOptions) {
				
				const companyCode = companyInstance.option('value');
				const userGrade = userGradeInstance.option('value');
				const userId = userIdInstance.option('value');
				
				const param = {
					companyCode: companyCode
					, userGrade: userGrade
					, userId: userId
					, skip: loadOptions.skip || 0
					, take: loadOptions.take || 50
					, sort: loadOptions.sort || []
				};
				
				return $.ajax({
					url: "/api/v1/user/list",
					method: "POST",
					contentType: "application/json",
					data: JSON.stringify(param),
				}).then(function(result) {
					return {
						data: result.list || [],
						totalCount: result.totalCount || 0
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
		key: "userSeq", //keyExpr
		//행 선택 시
		selection: {
			mode: "multiple",
			allowSelectAll: false, //전체선택 체크박스 방지
		},
		// selection: {
		// 	mode: 'single',
		// },
		//행 마우스오버 시
		hoverStateEnabled: true,
		headerFilter: {
			visible: false
		},
		// editing: {
		// 	allowUpdating: true,
		// 	allowDeleting: true,
		// 	allowAdding: true
		// },
		remoteOperations: {
			paging: true //페이징 서버사이드 처리
			, sorting: true
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
			/*{
				dataField: "NO"
				, caption: "NO"
				, alignment: "center"
				, allowSorting: false
				, cellTemplate: function(container, options) {
					const pageIndex = options.component.pageIndex();
					const pageSize = options.component.pageSize();
					const globalIndex = pageIndex * pageSize + options.rowIndex + 1;

					container.text(globalIndex);
				}
			},*/
			{ dataField: "USER_ID", caption: "ID", alignment: "center" },
			{ dataField: "USER_NAME", caption: "이름", alignment: "center" },
			{
				dataField: "COMPANY_CODE",
				caption: "구분",
				alignment: "center",
				allowSorting: false,
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
				dataField: "USER_GRADE",
				caption: "등급",
				alignment: "center",
				customizeText: function(cellInfo) {
					switch (cellInfo.value) {
						case 0: return "슈퍼관리자";
						case 1: return "관리자";
						case 2: return "사용자";
						case 3: return "운영자";
						default: return "일반";
					}
				}
			},
			{
				dataField: "USE_YN",
				caption: "계정 상태",
				alignment: "center",
				customizeText: function(cellInfo) {
					switch (cellInfo.value) {
						case "Y": return "사용";
						case "N": return "일시정지";
						default: return "-";
					}
				}
			},
			{
				dataField: "REG_DATE",
				caption: "최초 등록일",
				alignment: "center",
				customizeText: function(cellInfo) {
					if(cellInfo && cellInfo.value){
						return formatTimestamp(cellInfo.value);
					} else {
						return '-';
					}
				}
			},
			{
				dataField: "CHG_DATE",
				caption: "최종 수정일",
				alignment: "center",
				customizeText: function(cellInfo) {
					if(cellInfo && cellInfo.value){
						return formatTimestamp(cellInfo.value);
					} else {
						return '-';
					}
				}
			},
			/*{
				name: "edit_btn",
				caption: "수정",
				type: "buttons",
				buttons: [{
					icon: "edit",
					name: "edit",
					text: '',
				}, {
					icon: "remove",
					name: "delete",
					text: '',
					onClick: function(e) {
						const rowData = e.row.data;
						
						const confirmDialog = DevExpress.ui.dialog.custom({
							showTitle: false,
							messageHtml: "<div style='text-align: center;' class='pt-3'>삭제하시겠습니까?</div>",
							buttons: [{
								text: "확인",
								type: "default",
								onClick: function(e) {
									const param = { userId: rowData.userId };
									
									deleteAjax('/api/v1/user/delete', param, function callback(data) {
										const code = data.code;
										const result = data.result;
										
										if (code == 1000) {
											const message = '삭제되었습니다.';
											showDialogCustom(message, function (){
												search();
											});
											
										} else if (code == 9003) {
											showDialogCustom(result);
											
										} else {
											const message = '삭제에 실패했습니다.';
											showDialogCustom(message);
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
				}],
			},*/
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
			e.cancel = true; // 기본 편집 막기
			openCustomModal('edit', e.data); // 수정 모드
		},
		// onEditingStart(e) {
		// 	document.getElementById('reset_btn').classList.add('d-none');
		// 	console.log(document.getElementById('reset_btn'));
		// 	e.cancel = true; // 기본 편집 막기
		// 	openCustomModal('edit', e.data); // 수정 모드
		// },
	
		onToolbarPreparing: function (e) {
			const toolbarItems = e.toolbarOptions.items;

			// searchPanel 위치 찾기
			const searchIndex = toolbarItems.findIndex(item => item.name === "searchPanel");

			if (searchIndex !== -1) {
				const selectAllToggleBtn = {
					location: 'after',
					widget: 'dxButton',
					options: {
						text: "전체 선택/해제",
						stylingMode: 'outlined',
						type: 'danger',
						onClick: function () {
							const grid = $('#userGrid').dxDataGrid('instance');
							const selected = grid.getSelectedRowKeys();
							if (selected.length === grid.totalCount()) {
								grid.clearSelection();
							} else {
								grid.selectAll();
							}
						}
					}
				};

				const deleteBtn = {
					location: 'after',
					widget: 'dxButton',
					options: {
						text: "선택 삭제",
						stylingMode: 'contained',
						type: 'danger',
						onClick: function () {
							const grid = $('#userGrid').dxDataGrid('instance');
							const selectedRows = grid.getSelectedRowsData();

							if (selectedRows.length === 0) {
								showDialogCustom('삭제할 사용자를 선택하세요.');
								return;
							}

							const confirmDialog = DevExpress.ui.dialog.custom({
								showTitle: false,
								messageHtml: `<div style='text-align: center;' class='pt-3'>
									선택한 <b>${selectedRows.length}건</b>을 삭제하시겠습니까?
								</div>`,
								buttons: [
									{
										text: "확인",
										type: "default",
										onClick: function () {
											const grid = e.component;
											const selectedRowsData = grid.getSelectedRowsData();
											
											const param = selectedRowsData.map(row => ({
												userId: row.USER_ID
											}));
											
											deleteAjax('/api/v1/user/delete', param, function callback(data) {
												const code = data.code;
												const result = data.result;
												
												if (code == 1000) {
													showDialogCustom(result, function (){
														dataGrid.getDataSource().reload(); //재조회
													});
												} else {
													showDialogCustom(result);
												}
											});
											return { result: "ok" };
											// const result = selectedRows.map(row => ({
											// 	bulkMsgKey: row.bulkMsgKey,
											// 	svcType: row.svcType
											// }));
											// console.log(result);

											// // 삭제 로직 실행

											// return { result: "ok" };
										}
									},
									{
										text: "취소",
										onClick: function () {
											return { result: "cancel" };
										}
									}
								]
							});

							confirmDialog.show().done(function (dialogResult) {
								if (dialogResult.result === "ok") console.log("삭제 완료");
								else console.log("취소");
							});
						}
					}
				};

				// searchPanel 바로 왼쪽에 삽입 (삭제 버튼이 더 오른쪽에 오게)
				toolbarItems.splice(searchIndex, 0, deleteBtn);
				toolbarItems.splice(searchIndex, 0, selectAllToggleBtn);
			}
		},
		onInitNewRow(e) {
			e.cancel = true; // 기본 추가 막기
			openCustomModal('add'); // 추가 모드
		},
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount.toLocaleString()}건`);
		},
	}).dxDataGrid("instance");
});

// 등록 팝업창 및 수정 팝업창
function openCustomModal(mode, data = {}) {
	currentMode = mode;

	postAjax('/api/v1/user/rsa', {}, rsaCallback);
	
	if (mode === 'edit') {
		document.getElementById('user_detail_modal').classList.add('d-block');
		toggleBodyClass();

		currentKey = data.userSeq; // keyExpr 기준
		document.getElementById('user_grade_detail').value = data.USER_GRADE;
		document.getElementById('company_code_detail').value = data.COMPANY_CODE;
		document.getElementById('company_code_name_detail').value = data.COMPANY_CODE == 0 ? "옥션" : data.COMPANY_CODE == 1 ? "G마켓" : "스마일캐시";
		document.getElementById('user_id_detail').value = data.USER_ID;
		document.getElementById('password_detail').value = '';
		document.getElementById('user_name_detail').value = data.USER_NAME;
		document.getElementById('user_phone1_detail').value = data.HP_NO;
		document.getElementById('user_phone2_detail').value = data.TEL_NO;
		document.getElementById('user_sms_detail').value = data.SMS_YN;
		document.getElementById('user_excel_detail').value = data.EXCEL_YN;
		document.getElementById('user_file_detail').value = data.FILE_YN;
		document.getElementById('user_db_detail').value = data.DB_YN;
		document.getElementById('user_lms_detail').value = data.LMS_YN;
		document.getElementById('user_mms_detail').value = data.MMS_YN;
		document.getElementById('use_yn_detail').value = data.USE_YN;

	} else {
		currentKey = null;
		
		document.getElementById('user_add_modal').classList.add('d-block');
		toggleBodyClass();
	}
}

// 비밀번호 암호화 성공 함수
function rsaCallback(data) {
	$("#publicKeyModulus").val(data.RSA_MODULUS);
	$("#publicKeyExponent").val(data.RSA_EXPONENT);
}

// 조회 버튼
$('#search-btn').dxButton({
    stylingMode: 'contained',
    text: '조회',
    type: 'default',
    width: 60,
    onClick() {
		
		const dataSource = new DevExpress.data.DataSource({
			load: function(loadOptions) {
				
				const param = {
					companyCode: companyInstance.option('value')
					, userGrade: userGradeInstance.option('value')
					, userId: userIdInstance.option('value')
					, skip: loadOptions.skip || 0
					, take: loadOptions.take || 50
					, sort: loadOptions.sort || []
				};
				
				return $.ajax({
					url: "/api/v1/user/list",
					type: "POST",
					contentType: "application/json",
					data: JSON.stringify(param),
				}).then(function(result) {
					return {
						data: result.list || [],
						totalCount: result.totalCount || 0
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

// 성공 함수
function listCallback(data) {
	dataGrid.option("dataSource", data);
}

// 등록 버튼
$('#add_btn').dxButton({
    stylingMode: 'outlined',
    text: '등록',
    type: 'default',
    width: 60,
    onClick() {
		openCustomModal('add');
		const reset_btn = document.getElementById('reset_btn');
		if(reset_btn.classList.contains('d-none')) reset_btn.classList.remove('d-none');
		toggleBodyClass();
    },
}).dxButton('instance');

// 성공 함수
function successCallback(data) {
	let code = data.code;
	let result = data.result;

	// 등록 및 수정 성공
	if (code == 1000) {
		const message = currentMode === 'edit' ? "수정되었습니다." : "등록되었습니다.";
		showDialogCustom(message, function (){
			const className = currentMode === 'edit' ? "user_detail_modal" : "user_add_modal";
			document.getElementById(className).classList.remove('d-block');
			userModalReset();
			dataGrid.getDataSource().reload();
			toggleBodyClass();
		});
	
	// 등록 및 수정 오류
	} else if (code == 9001 || code == 9100 || code == 9101 || code == 9002) {
		showDialogCustom(result);
	
	// 그 이외의 오류
	} else {
		const message = currentMode === 'edit' ? "수정에 실패했습니다." : "등록에 실패했습니다.";
		showDialogCustom(message);		
	}
}

// 날짜 포맷 변환
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