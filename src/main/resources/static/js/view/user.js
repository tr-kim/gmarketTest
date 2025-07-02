$(function () {
	//조회 그리드
	$("#userGrid").dxDataGrid({
		dataSource: [
			{ user_seq: "0000001", user_id: "admin1", user_name: "관리자1", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000002", user_id: "admin2", user_name: "관리자2", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000003", user_id: "admin3", user_name: "관리자3", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000004", user_id: "admin4", user_name: "관리자4", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000005", user_id: "admin5", user_name: "관리자5", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000006", user_id: "admin6", user_name: "관리자6", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000007", user_id: "admin7", user_name: "관리자7", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000008", user_id: "admin8", user_name: "관리자8", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000009", user_id: "admin9", user_name: "관리자9", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000010", user_id: "admin10", user_name: "관리자10", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000011", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000012", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000013", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000014", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000015", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000016", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000017", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000018", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000019", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000020", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000021", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000022", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000023", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000024", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000025", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000026", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000027", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000028", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000029", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000030", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000031", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000032", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000033", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000034", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000035", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000036", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000037", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000038", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000039", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000040", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000041", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000042", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000043", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000044", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000045", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000046", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000047", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000048", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000049", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000050", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000051", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000052", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000053", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000054", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000055", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000056", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000057", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000058", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000059", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000060", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000061", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000062", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000063", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000064", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000065", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000066", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000067", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000068", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000069", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000070", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
		],
		keyExpr: "user_seq",
		headerFilter: {
			visible: true
		},
		editing: {			
			allowUpdating: true,
  			allowAdding: true
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
			showNavigationButtons: true,
			showPageSizeSelector: true,
			allowedPageSizes: [50, 100, 200]
		},
		columnAutoWidth: true,
		allowColumnResizing: true,
		columnResizingMode: 'widget',
		columnAutoWidth: true,
		columns: [
			{ dataField: "user_seq", caption: "NO", alignment: "center"	},
			{ dataField: "user_id", caption: "사용자 ID", alignment: "center" },
			{ dataField: "user_name", caption: "이름", alignment: "center" },
			{ 
				dataField: "company_code", 
				caption: "구분", 
				alignment: "center",
				customizeText: function(cellInfo) {
					switch (cellInfo.value) {
						case "0" : return "옥션";
						case "1" : return "지마켓";
						default: return "";
					}
				} 
			},			
			{ 
				dataField: "user_grade", 
				caption: "등급", 
				alignment: "center" ,
				customizeText: function(cellInfo) {
					switch (cellInfo.value) {
						case "0" : return "슈퍼관리자";
						case "1" : return "관리자";
						case "2" : return "사용자";
						case "3" : return "운영자";
						default: return "";
					}
				} 
			},
			{ 
				dataField: "use_yn", 
				caption: "사용 여부", 
				alignment: "center" ,
				customizeText: function(cellInfo) {
					switch (cellInfo.value) {
						case "Y" : return "사용";
						case "N" : return "일시정지";
						default: return "";
					}
				} 
			},
			{				
				caption: "수정" ,
				type: "buttons",
				buttons: [{
					icon: "edit",
					name: "edit",	
					text: '',				
				}],
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
		onEditingStart(e) {
			e.cancel = true; // 기본 편집 막기
			openCustomModal('edit', e.data); // 수정 모드
		},
		onInitNewRow(e) {
			e.cancel = true; // 기본 추가 막기
			openCustomModal('add'); // 추가 모드
		},
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount}건`);
		}		
	}).dxDataGrid("instance");

	//구분
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
	}).dxSelectBox("instance");

	//사용자등급
	$('#user_grade').dxSelectBox({
		dataSource: [{
			Grade: 0,
			Name: '슈퍼관리자',
		},{
			Grade: 1,
			Name: '관리자',
		},{
			Grade: 2,
			Name: '사용자',
		},{
			Grade: 3,
			Name: '운영자',
		}],
			displayExpr: 'Name',
			valueExpr: 'Grade',
			value: 0
	}).dxSelectBox("instance");

	//사용자ID
	$('#user_id').dxTextBox({
		placeholder: '아이디를 입력하세요.'
	}).dxTextBox("instance");
});

//사용자 등록 모달
const addUser = document.querySelector('.addUser');
const inputs = document.querySelectorAll('.addUser input');
const selects = document.querySelectorAll('.addUser select');

let currentMode = ''; // 전역 변수로 모드 추적
let currentKey = null;

function openCustomModal(mode, data = {}) {
  currentMode = mode;

  if (mode === 'edit') {
	document.querySelector('.modal-hd > span').textContent = '사용자 수정';
	document.querySelector('.clear_btn').classList.add('d-block');

    currentKey = data.user_seq; // keyExpr 기준
    document.getElementById('user_grade_data').value = data.user_grade;
    document.getElementById('company_code_data').value = data.company_code;
	document.getElementById('user_id_data').value = data.user_id;
    document.getElementById('user_psw_data').value = '';
	document.getElementById('user_name_data').value = data.user_name;
    document.getElementById('user_phone1_data').value = '';
	document.getElementById('user_phone2_data').value = '';
    document.getElementById('user_excel_data').value = '0';
	document.getElementById('user_file_data').value = '0';
    document.getElementById('user_DB_data').value = '0';
	document.getElementById('user_LMS_data').value = '0';
    document.getElementById('user_MMS_data').value = '0';
	document.getElementById('user_yn_data').value = data.use_yn;
  } else {
	document.querySelector('.modal-hd > span').textContent = '사용자 등록';

    currentKey = null;
    document.getElementById('user_grade_data').value = '0';
    document.getElementById('company_code_data').value = '0';
	document.getElementById('user_id_data').value = '';
    document.getElementById('user_psw_data').value = '';
	document.getElementById('user_name_data').value = '';
    document.getElementById('user_phone1_data').value = '';
	document.getElementById('user_phone2_data').value = '';
    document.getElementById('user_excel_data').value = '0';
	document.getElementById('user_file_data').value = '0';
    document.getElementById('user_DB_data').value = '0';
	document.getElementById('user_LMS_data').value = '0';
    document.getElementById('user_MMS_data').value = '0';
	document.getElementById('user_yn_data').value = 'Y';
  }

  addUser.classList.add('d-block');
}

//등록 버튼
document.getElementById('add-btn').addEventListener('click', function(e){
	e.preventDefault();
	openCustomModal('add');
});

function addUserClear() {
	inputs.forEach(input => {
		input.value = "";
	})
	selects.forEach(select=> {
		select.value = "0";
	})
	document.getElementById('user_yn_data').value = 'Y';
}

//사용자 등록 모달 - 닫기 버튼
document.querySelector('.addUser .close_btn').addEventListener('click', function(e){
	e.preventDefault();
	addUser.classList.remove('d-block');
	addUserClear();
});

//사용자 등록 모달 - 초기화 버튼
document.querySelector('.clear_btn').addEventListener('click', function(e){
	e.preventDefault();
	addUserClear();
});

$('.add_btn').on('click', function(){
	const grid = $('#userGrid').dxDataGrid('instance');
 	grid.saveEditData();
});

