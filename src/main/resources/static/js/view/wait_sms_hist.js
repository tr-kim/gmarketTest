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
				alert("데이터를 불러오는 중 오류가 발생했습니다.");
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
			mode: "multiple"
		},
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
						alert('상세보기')
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
		}
	}).dxDataGrid("instance");
	
});

//조회 버튼
document.getElementById("search-btn").addEventListener('click', function(e){
	e.preventDefault();
	
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
		alert("조회 기간을 다시 입력하세요.");
		return false;
	}

	if (diffDays > 30) {
		alert("조회 기간을 다시 입력하세요. (30일 이내)\n\n현재 입력한 조회 기간 : " + Math.floor(diffDays) + "일");
		return false;
	}		

	//재조회
	waitDataGrid.getDataSource().reload();
})