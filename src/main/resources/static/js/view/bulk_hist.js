let startDateInstance;
let endDateInstance;
let companyInstance;
let titleInstance;
let bulkHistGrid;

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
		{ code: 1, name: 'G마켓' },
		{ code: 2, name: '스마일캐시' }
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
	titleInstance = $('#bulk-title').dxTextBox({
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
			bulkTitle: titleValue,
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
			url: "/api/v1/bulkHist/list",
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
	bulkHistGrid = $("#bulkHistGrid").dxDataGrid({
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
			mode: 'single',
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
			{ dataField: "MSG", caption: "메시지 내용", alignment: "left", width: 350},
			{ dataField: "CNT", caption: "전체", alignment: "center" },
			/*{
				name: "detail",
				caption: "상세",
				type: "buttons",
				buttons: [{
					icon: "find",
					onClick: function(e) {
						openBulkDetailModal(e.row.data);
					}
				}],
			},*/
			{ dataField: "USER_ID", caption: "발송ID", alignment: "center" },
			{ dataField: "SVC_TYPE", caption: "TYPE", alignment: "center" },
			{ 				
				caption: "성공/실패", 
				alignment: "center",
				minWidth: 100,
				calculateCellValue: function(rowData) {
					return `${rowData.CNT_SUCC}/${rowData.CNT_DUP + rowData.CNT_SENDFAIL}`;
				}
			},
			{
				name: "textBtn",
				caption: "text파일",
				type: "buttons",
				buttons: [{
					icon: "download",
					onClick: function(e) {
						bulkHistTxt(e.row.data);
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
		onRowClick: function (e) {
			openBulkDetailModal(e.data);
		},
	    onContentReady(e) {
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount.toLocaleString()}건`);
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
			bulkHistGrid.refresh();
		}
	}).dxButton('instance');
	
	// 엑셀 버튼
	$('#excel-btn').dxButton({
		stylingMode: 'contained',
		text: '엑셀 다운로드',
		type: 'success',
		width: 120,
		onClick() {
			exportGridToExcel(bulkHistGrid);
		}
	}).dxButton('instance');
	
	// 엑셀 다운로드
	function exportGridToExcel(gridInstance){
		const startValue = startDateInstance.option("value");
		const endValue = endDateInstance.option("value");
		
		// 공통 함수 사용
		const startDateFormatted = formatDate(startValue, "yymmdd");
		const endDateFormatted = formatDate(endValue, "yymmdd");
		
		// 파일명
		const fileName = `대량발송이력(${startDateFormatted}~${endDateFormatted}).xlsx`;
		
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('대량발송이력');
		
		DevExpress.excelExporter.exportDataGrid({
			component: gridInstance,
			worksheet: worksheet,
			autoFilterEnabled: true,
		}).then(() => {
			workbook.xlsx.writeBuffer().then((buffer) => {
				saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
			});
		});
	}
		
	// 상세 보기 모달
	function openBulkDetailModal(data = {}) {
		let inTimeValue = "";
		let reqTimeValue = "";
		
		if (data.IN_TIME) {
			inTimeValue = formatTimestamp(data.IN_TIME);
		}
		
		if (data.REQ_TIME) {
			reqTimeValue = formatTimestamp(data.REQ_TIME);
		}
		
		currentKey = data.B_MSG_KEY; 
		document.getElementById('title').value = data.TITLE;
		document.getElementById('in_time').value = inTimeValue;
		document.getElementById('req_time').value = reqTimeValue;
		document.getElementById('user_id').value = data.USER_ID;
		document.getElementById('send_info').value = data.SEND_INFO;
		document.getElementById('total').value = data.CNT;
		document.getElementById('insert_succ').value = data.SUCC_CNT;
		document.getElementById('insert_fail').value = data.FAIL_CNT;
		document.getElementById('stanby').value = data.CNT_STANBY;
		document.getElementById('tran').value = data.CNT_TRAN;
		document.getElementById('succ_fail').value = `${data.CNT_SUCC}/${data.CNT_DUP + data.CNT_SENDFAIL}`;
		document.getElementById('msg').value = data.MSG;
		
		document.getElementById('bulk_hist_modal').classList.add('d-block');
		toggleBodyClass();
	}
	
	// txt 다운로드
	async function bulkHistTxt(data){
		const companyCode = companyInstance.option("value");
		const startValue = startDateInstance.option("value");
		const endValue = endDateInstance.option("value");
		
		// 공통 함수 사용
		const startDateFormatted = formatDate(startValue, "yyyymm");
		const endDateFormatted = formatDate(endValue, "yyyymm");
		
		const params = {
			bulkMsgKey: data.B_MSG_KEY,
			svcType: data.SVC_TYPE,
			companyCode: companyCode,
			startDate: startDateFormatted,
			endDate: endDateFormatted
		};
		
		try {
	        const response = await fetch('/api/v1/bulkHist/downloadTxt', {
	            method: "POST",
	            headers: { "Content-Type": "application/json" },
	            body: JSON.stringify(params)
	        });
			
			if (!response.ok) throw new Error("파일 다운로드 실패");
			
			// Blob으로 받기
			const blob = await response.blob();
			
			// 브라우저에서 다운로드 처리
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "수신번호목록.txt"; // 서버에서 설정한 파일명과 동일
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
			
	    } catch (error) {
	        console.error("파일 다운로드 오류:", error);
	        showDialogCustom('파일 다운로드 중 오류가 발생했습니다.');
	    }
	}
});