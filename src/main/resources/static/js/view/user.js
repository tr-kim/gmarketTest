$(function () {
	//조회 그리드
	$("#userGrid").dxDataGrid({
		dataSource: [
			{ user_seq: "0000001", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000002", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000003", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000004", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000005", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000006", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000007", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000008", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000009", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
			{ user_seq: "0000010", user_id: "admin", user_name: "관리자", company_code: "1", user_grade: "1", use_yn: "Y" },
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
			{ dataField: "user_seq", caption: "NO", alignment: "center" },
			{ dataField: "user_id", caption: "사용자 ID", alignment: "center" },
			{ dataField: "user_name", caption: "이름", alignment: "center" },
			{ dataField: "company_code", caption: "구분", alignment: "center" },			
			{ dataField: "user_grade", caption: "등급", alignment: "center" },
			{ dataField: "use_yn", caption: "사용 여부", alignment: "center" },
			{
				name: "editBtn",
				caption: "수정" ,
				type: "buttons",
				buttons: [{
					icon: "edit",
					onClick(e) {
						alert("수정하기");
					},
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
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount}건`);
		}		
	}).dxDataGrid("instance");
});

//사용자 등록 모달
const addUser = document.querySelector('.addUser');
const inputs = document.querySelectorAll('.addUser input');
const selects = document.querySelectorAll('.addUser select');

//등록 버튼
document.getElementById('add-btn').addEventListener('click', function(e){
	e.preventDefault();
	addUser.classList.add('d-block');
});

function addUserClear() {
	inputs.forEach(input => {
		input.value = "";
	})
	selects.forEach(select=> {
		select.value = "0";
	})
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

