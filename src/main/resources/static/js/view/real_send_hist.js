let refreshTimer = null;	// 타이머
let refreshInterval = 10;	// 기본 10초

// 지마켓, 옥션, 스마일캐시 서비스 목록
const gmarketTasks = [], auctionTasks = [], smilecashTasks = [];
const companyTaskMap = { 0: auctionTasks, 1: gmarketTasks, 2: smilecashTasks };

// 회사별 코드
const gmarketCode = 1;
const auctionCode = 0;
const smilecashCode = 2;

$(function () {
	
	// 요약, 상세 탭 버튼
	 $('#real_toggle').dxButtonGroup({
		items: [{
			text:'요약'
		}, {
			text:'상세'
		}],
		keyExpr: 'text',
		stylingMode: 'outlined',
		selectedItemKeys: ['요약'],
		onItemClick(e) {
			const real_send_hist = document.getElementById('real_send_hist');
			const isSummary = e.component.option('selectedItemKeys')[0] === '요약';

			real_send_hist.querySelector('.summery').classList.toggle('d-none', !isSummary);
			real_send_hist.querySelector('.detail').classList.toggle('d-none', isSummary);
		}
	});
	
	// 요약 탭 버튼
	const summeryBtns = document.querySelectorAll('.summery ul li');
	const summeryActive = document.getElementById('summery-active');
	const summeryStandby = document.getElementById('summery-standby');
	
	summeryBtns.forEach((btn, idx) => {
		btn.querySelector("button").addEventListener('click', () => {
			const isDr = idx == 1;

			summeryActive.classList.toggle('d-none', isDr);
			summeryStandby.classList.toggle('d-none', !isDr);
			
			summeryBtns.forEach(b => b.querySelector("button").classList.remove('active'));
			btn.querySelector("button").classList.add('active');
		});
	});
	
	// 상세 탭 버튼
	const detailBtns = document.querySelectorAll('.detail ul li');
	const detailActive = document.getElementById('detail-active');
	const detailStandby = document.getElementById('detail-standby');
	
	detailBtns.forEach((btn, idx) => {
		btn.querySelector("button").addEventListener('click', () => {
			
			const isDr = idx == 1;

			detailActive.classList.toggle('d-none', isDr);
			detailStandby.classList.toggle('d-none', !isDr);
			
			detailBtns.forEach(b => b.querySelector("button").classList.remove('active'));
			btn.querySelector("button").classList.add('active');
		});
	});
	
	// 발송량 차트
	makeChart('gmarketChart');
	makeChart('auctionChart');
	makeChart('smilecashChart');
	
	if (Array.isArray(nameList) && nameList.length > 0) {
	    nameList.forEach(({ companyCode, svcName, tableCode, sortNum }) => {
	        const obj = { tableCode, svcName, sortNum: Number(sortNum) }; // 숫자로 변환
	        const list = companyTaskMap[Number(companyCode)];
	        if (list) list.push(obj);
	        else console.log("회사 코드가 존재하지 않습니다. : ", companyCode);
	    });
	} else {
		console.log("서비스명이 존재하지 않습니다.");
	}
	
	// 전체 차트 갱신
	function updateCharts() {
		updateChartData(gmarketCode, "gmarketChart", gmarketTasks, 'manageListGmarket');
		updateChartData(auctionCode, "auctionChart", auctionTasks, 'manageListAuction');
		updateChartData(smilecashCode, "smilecashChart", smilecashTasks, 'manageListSmilecash');
	}
	
	// 차트 갱신 시간 표시
	function updateLastTime() {
		const now = new Date();
		const hh = String(now.getHours()).padStart(2, '0');
		const mm = String(now.getMinutes()).padStart(2, '0');
		const ss = String(now.getSeconds()).padStart(2, '0');
		$('#chartUpdateTime').text(`최종 업데이트 ${hh}:${mm}:${ss}`);
	}
	
	// 차트 갱신 및 시간 업데이트
	function refreshCharts() {
		updateCharts();
		updateLastTime();
	}
	
	// 인터벌 타이머 재시작
	function restartChartTimer() {
	    if (refreshTimer) clearInterval(refreshTimer);
	    refreshCharts(); // 즉시 한 번 실행
		refreshTimer = setInterval(() => refreshCharts(), refreshInterval * 1000);
	}
	
	// 차트 갱신 주기
	const chartTimes = ['10초', '20초', '30초'];
	$('#chartInterval').dxRadioGroup({
		items: chartTimes,
		value: chartTimes[0],
		layout: 'horizontal',
		onValueChanged(e) {
			// 선택한 값에서 숫자만 추출 (10, 20, 30)
			refreshInterval = parseInt(e.value);
			restartChartTimer();
		}
	});
	
	// 페이지 로드 시 인터벌 시작
	restartChartTimer();
	
	// 상단 팝오버============================================================================
	fn_topPopover('#downList', '#down');
	fn_topPopover('#issueList', '#issue');
	fn_topPopover('#delrayList', '#delray');
	
	// 발송량 상세 버튼========================================================================
	fn_detailButton('#gmarketDetail', 'gmarket', 'detailGmarket');
	fn_detailButton('#auctionDetail', 'auction', 'detaidetailAuctionGmarket');
	fn_detailButton('#smilecashDetail', 'smilecash', 'detailSmilecash');
	
	// 발송량 관리 버튼========================================================================
	fn_manageButton('#gmarketManage', 'manageListGmarket');
	fn_manageButton('#auctionManage', 'manageListAuction');
	fn_manageButton('#smilecashManage', 'manageListSmilecash');
});

// 차트 기본 생성
function makeChart(chartId) {
	$(`#${chartId}`).dxChart({
		dataSource: [],
		series: [],
		commonSeriesSettings: {
		    argumentField: "date",
		    type: "line"
		},
		legend: {
		    visible: true,
		    orientation: "horizontal",
		    horizontalAlignment: "center", // 좌우
		    verticalAlignment: "top", // 상하
		    itemTextPosition: "right",
		},
		argumentAxis: {
		    type: 'discrete',       // 불규칙 x값 허용
		    argumentType: 'string', // 날짜/숫자 그대로 표시
		    label: {
		        customizeText(arg) {
		            return arg.value; // 마지막 2자리(HH)만
		        }
		    }
		},
		tooltip: {
			enabled: true,
			customizeTooltip(arg) {
				return {
					text: `${arg.seriesName}\n${arg.argumentText.slice(-2)}시\n${arg.valueText}건`
				};
			}
		}
	}).dxChart("instance");
}

// 차트 데이터 갱신
function updateChartData(companyCode, chartId, taskList, cookieId) {
	
	const cookieValue = getCookie(cookieId);	// 쿠키에 있는 값 가져오기
	let selectedTasks;
	if(Array.isArray(cookieValue) && cookieValue.length > 0) {
		selectedTasks = cookieValue;
	} else if(taskList.length > 6) {
		selectedTasks = taskList.sort(() => 0.5 - Math.random()).slice(0, 6);
		setCookie(cookieId, selectedTasks);
	} else {
		selectedTasks = taskList;
	}
	const tableCodeList = selectedTasks.map(({ tableCode }) => tableCode);	// 테이블 코드 목록
	
	fn_getChartData(companyCode, tableCodeList, function(result) {
		
		// 현재 날짜 생성
		const day = new Date();
	    const hh = String(day.getHours()).padStart(2, '0');
		const mi = String(day.getMinutes()).padStart(2, '0');
		const ss = String(day.getSeconds()).padStart(2, '0');
		
		// 데이터
		const item = { date: `${hh}${mi}${ss}` };
		
		if(Array.isArray(result) && result.length > 0) {
			result.forEach(({ tableCode, sendCnt }) => {
				const name = (selectedTasks.find(item => item.tableCode == tableCode) || {}).svcName || '';
				item[name] = Number(sendCnt || 0);
			});
		}
		
		// 시리즈 정의
		const series = selectedTasks.map(task => ({
			valueField: task.svcName,
			name: task.svcName,
			type: "line"
		}));
		
		// 누락 필드 0으로 채움
		series.map(s => s.valueField).forEach(field => {
			if (item[field.trim()] === undefined || item[field.trim()] === null) item[field.trim()] = 0;
		});
		
		// 차트 생성
		const chart = $(`#${chartId}`).dxChart("instance");
		
		// 기존 데이터 가져오기
		let dataSource = chart.option("dataSource") || [];

		// 데이터 개수 제한 (10개 초과 시 앞에서 제거)
		if (dataSource.length >= 10) dataSource.shift();
		
		// 차트 갱신
		chart.option("series", series);
		chart.option("dataSource").push(item);
		chart.refresh();
	});
}

// 상단 팝오버
function fn_topPopover(id, targetId) {
	$(id).dxPopover({
		target: targetId,
		showEvent: 'dxclick',
		position: 'bottom',
		wrapperAttr: {
			class: "dxPopover"
		},
		onShowing(e) {
			const w = $(targetId).outerWidth();
			e.component.option('width', w);
		}
	});
}

// 상세 버튼
function fn_detailButton(id, url, name) {
	$(id).dxButton({
		stylingMode: 'contained',
		text: '상세',
		type: 'default',
		width: 50,
		elementAttr: {
            class: "font-sz-12"
        },
		onClick() {
			fn_openDetailPage(`/view/real/detail/${url}`, name);
		},
	});
}

// 발송량 상세 팝업
function fn_openDetailPage(url, winName) {
	const width = 1200;
	const height = 800;
	
	// 화면 중앙 좌표 계산 (브라우저 창 기준)
	const left = window.screenX + Math.max(0, Math.floor((window.outerWidth - width) / 2));
	const top  = window.screenY + Math.max(0, Math.floor((window.outerHeight - height) / 2));
	
	const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
	
	const win = window.open(url, winName, features);
	if (win) win.focus();
	else alert('팝업이 차단되었습니다. 브라우저 설정을 확인하세요.');
}

// 발송량 관리 모달
function fn_openManageModal(targetId) {

    document.querySelector('.manage').classList.add('d-block');
	toggleBodyClass()
    document.querySelectorAll('.manage .modal-con > div').forEach(el => el.style.display = 'none');

    document.querySelector(`#${targetId}`).style.display = 'block';
    document.getElementById("setManageId").value = targetId;
}

// 발송량 관리 버튼
function fn_manageButton(id, name) {
	$(id).dxButton({
		stylingMode: 'outlined',
		text: '관리',
		type: 'default',
		width: 50,
		elementAttr: {
            class: "font-sz-12"
        },
		onClick() {
			fn_openManageModal(name);
			
			// 발송량 관리 목록========================================================================
			switch(name) {
				case "manageListGmarket":
					fn_manageList('manageListGmarket', gmarketTasks);
					break;
				case "manageListAuction":
					fn_manageList('manageListAuction', auctionTasks);
					break;
				case "manageListSmilecash":
					fn_manageList('manageListSmilecash', smilecashTasks);
					break;
				default:
					break;
			}	
		},
	});
}

// 발송량 관리 목록
function fn_manageList(id, tasks) {
	
	const list = $(`#${id}`).dxList({
		dataSource: new DevExpress.data.DataSource({
			store: new DevExpress.data.ArrayStore({
				key: 'tableCode',
				data: tasks,
			}),
			sort: { getter: "sortNum", desc: false }	// 정렬
		}),
		displayExpr: 'svcName',
		width: 500,
		height: 600,
		showSelectionControls: true,
		selectByClick: true,
		selectionMode: 'multiple',
		pageLoadMode: 'scrollBottom',
		onSelectionChanged(e) {
	        const selected = e.component.option("selectedItems");
			
			// 선택한 항목 제한(최대 6개)
			if (selected.length > 6) {
		        showDialogCustom('최대 6개까지 선택할 수 있습니다.');
				
				// 마지막에 선택된 항목 제거
				const lastAdded = e.addedItems[0];
		        if (lastAdded) list.unselectItem(lastAdded);
		    }
		},
	}).dxList('instance');
	
	// 쿠키에 있는 값 가져오기
	const cookieValue = getCookie(id);
	if (Array.isArray(cookieValue) && cookieValue.length > 0) {
	    const selectedIds = cookieValue.map(item => item.tableCode);
	    list.option("selectedItemKeys", selectedIds);
	}
}

// 관리 목록 쿠키에 저장
const manageSaveBtn = document.getElementById('manageSaveBtn');
manageSaveBtn.addEventListener('click', () => {
	const id = document.getElementById("setManageId").value;
	const list = $(`#${id}`).dxList('instance').option("selectedItems");
	
	setCookie(id, list);
	
	switch(id) {
		case "manageListGmarket":
			updateChartData(gmarketCode, 'gmarketChart', list, 'manageListGmarket');
			break;
		case "manageListAuction":
			updateChartData(auctionCode, 'auctionChart', list, "manageListAuction");
			break;
		case "manageListSmilecash":
			updateChartData(smilecashCode, 'smilecashChart', list, 'manageListSmilecash');
			break;
		default:
			break;
	}
	
	// 닫기
	closeModal('manage');		
});

// 차트 데이터 가져오기
function fn_getChartData(code, list, successCallbock) {
	
	const formData = new FormData();
	formData.append("companyCode", code);
	formData.append("codeList", list);
	
	$.ajax({
		type: "POST",
		url: '/api/v1/real/tableList',
		data: formData,
		processData: false,
		contentType: false,
		success: function(data) {
			if (typeof successCallbock === 'function') {
				successCallbock(data);
			}
		},
		error: function(xhr, status, error) {
			console.error("차트 데이터 요청 실패:", xhr, status, error); // 기본 에러 처리
			showDialogCustom('error');
		}
	});
}

// 쿠키 저장
function setCookie(name, value) {
    const date = new Date();
    date.setTime(date.getTime() + (3650 * 24 * 60 * 60 * 1000)); // 유효기간 10년
	
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
}

// 쿠키 가져오기
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for(let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) return JSON.parse(decodeURIComponent(cookie.substring(nameEQ.length)));
    }
    return null;
}
