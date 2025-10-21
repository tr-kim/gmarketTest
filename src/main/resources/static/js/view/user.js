let dataGrid;
let companyInstance;
let userGradeInstance;
let userIdInstance;

let currentMode = ''; // 전역 변수로 모드 추적
let currentKey = null;

let pageSize;

$(function() {

	let companyArray;
	let companyValue;

	if (userGrade == 0) {
		companyArray = [{ Code: 0, Name: '옥션', }, { Code: 1, Name: 'G마켓' }, { Code: 2, Name: '스마일캐시' }];
		companyValue = 1;
	} else if (userGrade == 1 && companyCode == 0) {
		companyArray = [{ Code: 0, Name: '옥션' }];
		companyValue = 0;
	} else if (userGrade == 1 && companyCode == 1) {
		companyArray = [{ Code: 1, Name: 'G마켓' }];
		companyValue = 1;
	} else if (userGrade == 1 && companyCode == 2) {
		companyArray = [{ Code: 2, Name: '스마일캐시' }];
		companyValue = 2;
	}

	//구분
	companyInstance = $('#companyCode').dxSelectBox({
		dataSource: companyArray,
		displayExpr: 'Name',
		valueExpr: 'Code',
		value: companyValue
		, inputAttr: { name: "companyCode" }
		// , onValueChanged: function(e) {
		// 	dataGrid.option('editing.refreshMode', e.value);
		// }
	}).dxSelectBox("instance");

	let userGradeData;
	let userGradeValue;

	if (userGrade == 0) {
		userGradeData = [{
			Grade: -1,
			Name: '전체',
		},{
			Grade: 0,
			Name: '슈퍼관리자',
		}, {
			Grade: 1,
			Name: '관리자',
		}, {
			Grade: 2,
			Name: '사용자',
		}, {
			Grade: 3,
			Name: '운영자',
		}];
		userGradeValue = -1;
	} else {
		userGradeData = [{
			Grade: -1,
			Name: '전체',
		},{
			Grade: 1,
			Name: '관리자',
		}, {
			Grade: 2,
			Name: '사용자',
		}, {
			Grade: 3,
			Name: '운영자',
		}];
		userGradeValue = -1;
	};

	//사용자등급
	 userGradeInstance = $('#user_grade').dxSelectBox({
		dataSource: userGradeData,
		displayExpr: 'Name',
		valueExpr: 'Grade',
		value: userGradeValue
		, inputAttr: { name: "userGrade" }
		// , onValueChanged: function(e) {
		// 	dataGrid.option('editing.refreshMode', e.value);
		// }
	}).dxSelectBox("instance");

	//사용자ID
	userIdInstance = $('#user_id').dxTextBox({
		placeholder: '아이디를 입력하세요.'
		, inputAttr: { name: "userId" }
	}).dxTextBox("instance");
	
	//조회 그리드
	dataGrid = $("#userGrid").dxDataGrid({
		dataSource: {
			load: function(loadOptions) {
				
				const formData = new FormData(document.getElementById("userForm"));
								
				const skip = loadOptions.skip || 0;
				const take = loadOptions.take || 50;
	
				formData.append("skip", skip);
				formData.append("take", take);
				
				return $.ajax({
					url: "/api/v1/user/list",
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
			visible: true
		},
		// editing: {
		// 	allowUpdating: true,
		// 	allowDeleting: true,
		// 	allowAdding: true
		// },
		remoteOperations: {
			paging: true //페이징 서버사이드 처리
		},
		height: 500,
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
			{
				dataField: "no"
				, caption: "NO"
				, alignment: "center"
				, cellTemplate: function(container, options) {
					const pageIndex = options.component.pageIndex();
					const pageSize = options.component.pageSize();
					const globalIndex = pageIndex * pageSize + options.rowIndex + 1;

					container.text(globalIndex);
				}
			},
			{ dataField: "userId", caption: "사용자 ID", alignment: "center" },
			{ dataField: "userName", caption: "이름", alignment: "center" },
			{
				dataField: "companyCode",
				caption: "구분",
				alignment: "center",
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
				dataField: "userGrade",
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
				dataField: "useYn",
				caption: "사용 여부",
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
				dataField: "regDate",
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
				dataField: "chgDate",
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
			// {
			// 	name: "edit_btn",
			// 	caption: "수정",
			// 	type: "buttons",
			// 	buttons: [{
			// 		icon: "edit",
			// 		name: "edit",
			// 		text: '',
			// 	}, {
			// 		icon: "remove",
			// 		name: "delete",
			// 		text: '',
			// 		onClick: function(e) {
			// 			const rowData = e.row.data;
						
			// 			const confirmDialog = DevExpress.ui.dialog.custom({
			// 				showTitle: false,
			// 				messageHtml: "<div style='text-align: center;' class='pt-3'>삭제하시겠습니까?</div>",
			// 				buttons: [{
			// 					text: "확인",
			// 					type: "default",
			// 					onClick: function(e) {
			// 						const param = { userId: rowData.userId };
									
			// 						deleteAjax('/api/v1/user/delete', param, function callback(data) {
			// 							const code = data.code;
			// 							const result = data.result;
										
			// 							if (code == 1000) {
			// 								const message = '삭제되었습니다.';
			// 								showDialogCustom(message, function (){
			// 									search();
			// 								});
											
			// 							} else if (code == 9003) {
			// 								showDialogCustom(result);
											
			// 							} else {
			// 								const message = '삭제에 실패했습니다.';
			// 								showDialogCustom(message);
			// 							}
			// 						});
			// 						return { result: "ok" };
			// 					}
			// 				}, {
			// 					text: "취소",
			// 					onClick: function(e) {
			// 						return { result: "cancel" };
			// 					}
			// 				}]
			// 			});

			// 			confirmDialog.show().done(function(dialogResult) {
			// 				if (dialogResult.result === "ok") {
			// 					console.log("삭제 완료");
			// 				} else {
			// 					console.log("취소");
			// 				}
			// 			});
			// 		}
			// 	}],
			// },
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
			console.log(document.getElementById('reset_btn'));
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
												userId: row.userId
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
								if (dialogResult.result === "ok") {
									console.log("삭제 완료");
								} else {
									console.log("취소");
								}
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
			const today = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
			$("#totalCount").text(`검색된 내용은 총 ${totalCount}건 입니다. (검색시간 : ${today})`);
		},
		onOptionChanged: function(e) {
	   		if (e.fullName === "paging.pageSize") {
				pageSize = e.value;
    		}
	  	}
	}).dxDataGrid("instance");
});

// 사용자 등록 모달 - 초기화
function userModalReset() {
	document.querySelectorAll('#user_add_modal input').forEach(input => {
		input.value = "";
	});

	document.querySelectorAll('#user_add_modal select.select_Y').forEach(select => {
		select.value = "Y";
	});

	document.querySelectorAll('#user_add_modal select.select_N').forEach(select => {
		select.value = "N";
	});

	document.querySelectorAll('#user_add_modal select.select_0').forEach(select => {
		select.value = "0";
	});

	document.querySelectorAll('#user_add_modal select.select_2').forEach(select => {
		select.value = "2";
	});
}

// 등록 팝업창 및 수정 팝업창
function openCustomModal(mode, data = {}) {
	currentMode = mode;

	const param = {};
	postAjax('/api/v1/user/rsa', param, rsaCallback);

	if (mode === 'edit') {
		document.querySelector('#user_add_modal .modal-hd > span').textContent = '사용자 수정';
		document.getElementById('reset_btn').classList.add('d-block');
		toggleBodyClass();

		currentKey = data.userSeq; // keyExpr 기준
		document.getElementById('user_grade_data').value = data.userGrade;
		document.getElementById('company_code_data').value = data.companyCode;
		document.getElementById('user_id_data').value = data.userId;
		document.getElementById('user_psw_data').value = '';
		document.getElementById('user_name_data').value = data.userName;
		document.getElementById('user_phone1_data').value = data.hpNo;
		document.getElementById('user_phone2_data').value = data.telNo;
		document.getElementById('user_sms_data').value = data.smsYn;
		document.getElementById('user_excel_data').value = data.excelYn;
		document.getElementById('user_file_data').value = data.fileYn;
		document.getElementById('user_db_data').value = data.dbYn;
		document.getElementById('user_lms_data').value = data.lmsYn;
		document.getElementById('user_mms_data').value = data.mmsYn;
		document.getElementById('use_yn_data').value = data.useYn;

		document.getElementById('user_id_data').readOnly = true;
	} else {
		document.querySelector('#user_add_modal .modal-hd > span').textContent = '사용자 등록';

		currentKey = null;
		document.getElementById('user_grade_data').value = "2";
		document.getElementById('company_code_data').value = "0";
		document.getElementById('user_id_data').value = '';
		document.getElementById('user_psw_data').value = '';
		document.getElementById('user_name_data').value = '';
		document.getElementById('user_phone1_data').value = '';
		document.getElementById('user_phone2_data').value = '';
		document.getElementById('user_sms_data').value = 'Y';
		document.getElementById('user_excel_data').value = 'N';
		document.getElementById('user_file_data').value = 'N';
		document.getElementById('user_db_data').value = 'N';
		document.getElementById('user_lms_data').value = 'N';
		document.getElementById('user_mms_data').value = 'N';
		document.getElementById('use_yn_data').value = 'Y';

		document.getElementById('user_id_data').readOnly = false;
	}

	document.getElementById('user_add_modal').classList.add('d-block');
	toggleBodyClass();
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
		const formData = new FormData(document.getElementById("userForm"));
		
		const skip = 0;
		const take = pageSize || 50;

		formData.append("skip", skip);
		formData.append("take", take);
	
		//재조회
		dataGrid.getDataSource().reload();
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
		if(document.getElementById('reset_btn').classList.contains('d-none')){
			document.getElementById('reset_btn').classList.remove('d-none');
		}		
		toggleBodyClass();
    },
}).dxButton('instance');

// 사용자 등록 모달 - 닫기 버튼
document.getElementById('close_btn').addEventListener('click', function(e) {
	e.preventDefault();
	
	document.getElementById('user_add_modal').classList.remove('d-block');
	userModalReset();
	toggleBodyClass();
});

// 사용자 등록 모달 - 초기화 버튼
$('#reset_btn').dxButton({
    stylingMode: 'outlined',
    text: '초기화',
    type: 'default',
    width: 65,
    onClick() {
		userModalReset();
    },
}).dxButton('instance');

// 사용자 등록 모달 - 저장 버튼
$('#save_btn').dxButton({
    stylingMode: 'default',
    text: '저장',
    type: 'default',
    width: 60,
    onClick() {
		const password = $("#user_psw_data").val();
		const publicKeyModulus = $("#publicKeyModulus").val();
		const publicKeyExponent = $("#publicKeyExponent").val();

		// RSA 암호화
		let rsa = new RSAKey();
		rsa.setPublic(publicKeyModulus, publicKeyExponent);

		const encrypted = rsa.encrypt(password);
		const base64 = hex2b64(encrypted);

		let formData = new FormData();
		formData.append("userId", $("#user_id_data").val());
		formData.append("userPwd", encodeURIComponent(base64));
		formData.append("userName", $("#user_name_data").val());
		formData.append("userGrade", $("#user_grade_data").val());
		formData.append("companyCode", $("#company_code_data").val());
		formData.append("hpNo", $("#user_phone1_data").val());
		formData.append("telNo", $("#user_phone2_data").val());
		formData.append("email", $("#user_email_data").val());
		formData.append("smsYn", $("#user_sms_data").val());
		formData.append("excelYn", $("#user_excel_data").val());
		formData.append("fileYn", $("#user_file_data").val());
		formData.append("dbYn", $("#user_db_data").val());
		formData.append("lmsYn", $("#user_lms_data").val());
		formData.append("mmsYn", $("#user_mms_data").val());
		formData.append("useYn", $("#use_yn_data").val());

		if (currentMode === 'edit') {
			putFormAjax("/api/v1/user/update", formData, successCallback);
		} else if (currentMode === 'add') {
			postFormAjax("/api/v1/user/insert", formData, successCallback);
		}

		const grid = $('#userGrid').dxDataGrid('instance');
		grid.saveEditData();
		toggleBodyClass();
    },
}).dxButton('instance');

// 성공 함수
function successCallback(data) {
	let code = data.code;
	let result = data.result;

	if (code == 1000) {
		const message = currentMode === 'edit' ? "수정되었습니다." : "등록되었습니다.";
		showDialogCustom(message, function (){
			document.getElementById('user_add_modal').classList.remove('d-block');
			userModalReset();
			dataGrid.getDataSource().reload();
			toggleBodyClass();
		});
		
	} else if (code == 9001 || code == 9100 || code == 9101 || code == 9002) {
		showDialogCustom(result);
		
	} else {
		const message = currentMode === 'edit' ? "수정에 실패했습니다." : "등록에 실패했습니다.";
		showDialogCustom(message);		
	}
}

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