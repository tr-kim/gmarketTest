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
			const selected = e.component.option('selectedItemKeys')[0]; 
			const real_send_hist = document.getElementById('real_send_hist');
			
			if (selected === '요약') {
				real_send_hist.querySelector('.summery').classList.remove('d-none');
				real_send_hist.querySelector('.detail').classList.add('d-none');
				
			} else {
				real_send_hist.querySelector('.summery').classList.add('d-none');
				real_send_hist.querySelector('.detail').classList.remove('d-none');
			}
		}
	});
	
	// 요약 탭 버튼
	const summeryBtns = document.querySelectorAll('.summery ul li');
	const sOperate = document.getElementById('s-operate');
	const sDr = document.getElementById('s-dr');

	summeryBtns.forEach((btn, idx) => {
		btn.querySelector("button").addEventListener('click', () => {
			
			if(idx == 1){				
				sOperate.classList.add('d-none');
				sDr.classList.remove('d-none');
				
			}else{
				sDr.classList.add('d-none');
				sOperate.classList.remove('d-none');
			}
			
			summeryBtns.forEach(b => b.querySelector("button").classList.remove('active'));
			btn.querySelector("button").classList.add('active');
		});
	});
	
	// 상세 탭 버튼
	const detailBtns = document.querySelectorAll('.detail ul li');
	const dOperate = document.getElementById('d-operate');
	const dDr = document.getElementById('d-dr');

	detailBtns.forEach((btn, idx) => {
		btn.querySelector("button").addEventListener('click', () => {
			
			if(idx == 1){				
				dOperate.classList.add('d-none');
				dDr.classList.remove('d-none');
				
			}else{
				dDr.classList.add('d-none');
				dOperate.classList.remove('d-none');
			}
			
			detailBtns.forEach(b => b.querySelector("button").classList.remove('active'));
			btn.querySelector("button").classList.add('active');
		});
	});
	
	// 발송량 차트
	const gmarketChart = $("#gmarketChart").dxChart({
		dataSource: [],
		series: []
	}).dxChart("instance");
	
	const actionChart = $("#actionChart").dxChart({
		dataSource: [],
		series: []
	}).dxChart("instance");
	
	const smilecashChart = $("#smilecashChart").dxChart({
		dataSource: [],
		series: []
	}).dxChart("instance");
	
	// 지마켓 서비스 목록
	const gmarketTasks = [
		{ id: 1, name: 'KT-SME-ENG' },
		{ id: 2, name: 'KT-SMS-ETC' },
		{ id: 3, name: 'KT-SMS-EVENT-GMA' },
		{ id: 4, name: 'KT-GMKT-LMS-LARGE' },
		{ id: 5, name: 'KT-GMKT-MMS-LARGE' },
		{ id: 6, name: 'KT-GMKT-SMS-LARGE' },
		{ id: 7, name: 'KT-SMS-LARGE-GMA' },
		{ id: 8, name: 'KT-LMS-EVENT-GMA' },
		{ id: 9, name: 'KT-LMS-LARGE-GMA' },
		{ id: 10, name: 'KT-MEMMON' },
		{ id: 11, name: 'KT-MMS-EVENT-GMA' },
		{ id: 12, name: 'KT-MMS-LARGE-GMA' },
		{ id: 13, name: 'KT-SMS-ORDER' },
		{ id: 14, name: 'KT-SMS-EPLE' },
		{ id: 15, name: 'KT-SMS-STATP-GMA' },
		{ id: 16, name: 'KT-SMS-STATP-GMA-2CON' },
		{ id: 17, name: 'KT-SMS-TRAN' },
		{ id: 18, name: 'KT-SMS-TSP' },
		{ id: 19, name: 'KT-SMS-MO4MMS' },
		{ id: 20, name: 'KT-SFC-SMS' },
		{ id: 21, name: 'KT-SFC-MMS' },
		{ id: 22, name: 'KT-SFC-LMS' },
		{ id: 23, name: 'KT-MMS-NON-GMA' },
		{ id: 24, name: 'KT-LMS-NON-GMA' },
		{ id: 25, name: 'KT-G9-SMS-LARGE' },
		{ id: 26, name: 'KT-G9-MMS-LARGE' },
		{ id: 27, name: 'KT-G9-LMS-LARGE' }
	];
	
	// 옥션 서비스 목록
	const auctionTasks = [
		{ id: 1, name: 'KT-SMS-API' },
		{ id: 2, name: 'KT-SMS-BATCH' },
		{ id: 3, name: 'KT_SMS_CHARGED' },
		{ id: 4, name: 'KT_SMS_ESCROW' },
		{ id: 5, name: 'KT-SMS-EVENT-AUC' },
		{ id: 6, name: 'KT-SMS-LARGE-AUC' },
		{ id: 7, name: 'KT-LMS-EVENT-AUC' },
		{ id: 8, name: 'KT-LMS-LARGE-AUC' },
		{ id: 9, name: 'KT-MMS-EVENT-AUC' },
		{ id: 10, name: 'KT-MMS-LARGE-AUC' },
		{ id: 11, name: 'KT-SMS-MOTORS' },
		{ id: 12, name: 'KT-SMS-OUTBID' },
		{ id: 13, name: 'KT-SMS-PUMBL' },
		{ id: 14, name: 'KT-SMS-STATP-AUC' },
		{ id: 15, name: 'KT-AUC-MEMMON' },
		{ id: 16, name: 'KT-IAC-LMS-LARGE' },
		{ id: 17, name: 'KT-IAC-MMS-LARGE' },
		{ id: 18, name: 'KT-IAC-SMS-LARGE' },
		{ id: 19, name: 'KT-LMS-TIMECHECK-AUC' },
		{ id: 20, name: 'KT-LMS-NEVENT-AUC' },
		{ id: 21, name: 'KT-MMS-TIMECHECK-AUC' },
		{ id: 22, name: 'KT-SMS-MO4MMS' }
	];
	
	// 스마일캐시 서비스 목록
	const smilecashTasks = [
		{ id: 1, name: 'KT-SMS-ADMIN' },
		{ id: 2, name: 'KT-SMS-ALERT' },
		{ id: 3, name: 'KT-SMS-CERT' },
		{ id: 4, name: 'KT_SMS_INFO' }
	];
	
	// 차트 데이터 갱신
	function updateChartData(chartInstance, taskList) {
		const now = new Date();
		const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
		
		// 1시간 단위 시간 배열
		const hours = [];
		for (let h = 0; h <= now.getHours(); h++) {
			// datetime
			// hours.push(new Date(startOfDay.getTime() + h * 60 * 60 * 1000));
			
			// string(YYYYMMDDHH)
			const d = new Date(startOfDay.getTime() + h * 60 * 60 * 1000);
			const yyyy = d.getFullYear();
			const mm = String(d.getMonth() + 1).padStart(2, '0');
			const dd = String(d.getDate()).padStart(2, '0');
			const hh = String(d.getHours()).padStart(2, '0');
			hours.push(`${yyyy}${mm}${dd}${hh}`);
		}
		
		// 랜덤 서비스 4개 (4개 이하인 경우 전체 사용)
		const selectedTasks = taskList.length > 4 ? taskList.sort(() => 0.5 - Math.random()).slice(0, 4) : taskList;
		
		// 랜덤 데이터 생성
		const chartData = [];
		hours.forEach(hour => {
			const item = { date: hour };
			selectedTasks.forEach(task => {
				item[task.name] = Math.floor(Math.random() * 300);
			});
			chartData.push(item);
		});
		
		// 시리즈 정의
		const series = selectedTasks.map(task => ({
			valueField: task.name,
			name: task.name,
			type: "line"
		}));
		
		// 차트 옵션 갱신
		chartInstance.option({
			dataSource: chartData,
			series: series,
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
				argumentType: "string", // datetime
				label: {
				    customizeText(arg) {
				        // arg.value가 YYYYMMDDHH 형태
				        return arg.value.slice(-2); // 마지막 2자리(HH)만 반환
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
		});
	}
	
	// 전체 차트 갱신
	function updateCharts() {
		updateChartData(gmarketChart, gmarketTasks);
		updateChartData(actionChart, auctionTasks);
		updateChartData(smilecashChart, smilecashTasks);
	}
	
	// 차트 갱신 시간 표시
	function updateLastTime() {
		const now = new Date();
		const hh = String(now.getHours()).padStart(2, '0');
		const mm = String(now.getMinutes()).padStart(2, '0');
		const ss = String(now.getSeconds()).padStart(2, '0');
		$('#chartUpdateTime').text(`최종 업데이트 ${hh}:${mm}:${ss}`);
	}
	
	let refreshInterval = 10; // 기본 10초
	let refreshTimer = null;
	
	// 차트 갱신 및 시간 업데이트
	function refreshCharts() {
		updateCharts();
		updateLastTime();
	}
	
	// 인터벌 타이머 재시작
	function restartChartTimer() {
	    if (refreshTimer) clearInterval(refreshTimer);
	    refreshCharts(); // 즉시 한 번 실행
	    refreshTimer = setInterval(refreshCharts, refreshInterval * 1000);
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
	$('#downList').dxPopover({
		target: '#down',
		showEvent: 'dxclick',
		position: 'bottom',
		wrapperAttr: {
			class: "dxPopover"
		},
		onShowing(e) {
			const w = $('#down').outerWidth();
			e.component.option('width', w);
		}
	});
	$('#issueList').dxPopover({
		target: '#issue',
		showEvent: 'dxclick',
		position: 'bottom',
		wrapperAttr: {
			class: "dxPopover"
		},
		onShowing(e) {
			const w = $('#issue').outerWidth();
			e.component.option('width', w);
		}
	});
	$('#delrayList').dxPopover({
		target: '#delray',
		showEvent: 'dxclick',
		position: 'bottom',
		wrapperAttr: {
			class: "dxPopover"
		},
		onShowing(e) {
			const w = $('#delray').outerWidth();
			e.component.option('width', w);
		}
	});
	
	// 발송량 상세 버튼========================================================================
	$('#gmarketDetail').dxButton({
		stylingMode: 'contained',
		text: '상세',
		type: 'default',
		width: 50,
		elementAttr: {
            class: "font-sz-12"
        },
		onClick() {
			openDetailPage('/view/real/detail/gmarket', 'detailGmarket');
		},
	});
	$('#auctionDetail').dxButton({
		stylingMode: 'contained',
		text: '상세',
		type: 'default',
		width: 50,
		elementAttr: {
            class: "font-sz-12"
        },
		onClick() {
			openDetailPage('/view/real/detail/auction', 'detailAuction');
		},
	});
	$('#smilecashDetail').dxButton({
		stylingMode: 'contained',
		text: '상세',
		type: 'default',
		width: 50,
		elementAttr: {
            class: "font-sz-12"
        },
		onClick() {
			openDetailPage('/view/real/detail/smilecash', 'detailSmilecash');
		},
	});
	
	// 발송량 관리 버튼========================================================================
	$('#gmarketManage').dxButton({
		stylingMode: 'outlined',
		text: '관리',
		type: 'default',
		width: 50,
		elementAttr: {
            class: "font-sz-12"
        },
		onClick() {
			openManageModal('manageListGmarket');
		},
	});
	$('#auctionManage').dxButton({
		stylingMode: 'outlined',
		text: '관리',
		type: 'default',
		width: 50,
		elementAttr: {
            class: "font-sz-12"
        },
		onClick() {
			openManageModal('manageListAuction');
		},
	});
	$('#smilecashManage').dxButton({
		stylingMode: 'outlined',
		text: '관리',
		type: 'default',
		width: 50,
		elementAttr: {
            class: "font-sz-12"
        },
		onClick() {
			openManageModal('manageListSmilecash');
		},
	});
	
	// 발송량 관리 목록========================================================================
	const manageListGmarket = $('#manageListGmarket').dxList({
		dataSource: new DevExpress.data.DataSource({
			store: new DevExpress.data.ArrayStore({
				key: 'id',
				data: gmarketTasks,
			}),
		}),
		displayExpr: 'name',
		width: 500,
		height: 600,
		showSelectionControls: true,
		selectByClick: true,
		selectionMode: 'multiple',
		pageLoadMode: 'scrollBottom',
		onSelectionChanged(e) {
			const selectedItems = manageListGmarket.option('selectedItems');
			console.log('Gmarket 선택:', selectedItems);
		},
	}).dxList('instance');
	
	const manageListAuction = $('#manageListAuction').dxList({
		dataSource: new DevExpress.data.DataSource({
			store: new DevExpress.data.ArrayStore({
				key: 'id',
				data: auctionTasks,
			}),
		}),
		displayExpr: 'name',
		width: 500,
		height: 600,
		showSelectionControls: true,
		selectByClick: true,
		selectionMode: 'multiple',
		pageLoadMode: 'scrollBottom',
		onSelectionChanged(e) {
			const selectedItems = manageListAuction.option('selectedItems');
			console.log('Auction 선택:', selectedItems);
		},
	}).dxList('instance');
	
	const manageListSmilecash = $('#manageListSmilecash').dxList({
		dataSource: new DevExpress.data.DataSource({
			store: new DevExpress.data.ArrayStore({
				key: 'id',
				data: smilecashTasks,
			}),
		}),
		displayExpr: 'name',
		width: 500,
		height: 600,
		showSelectionControls: true,
		selectByClick: true,
		selectionMode: 'multiple',
		pageLoadMode: 'scrollBottom',
		onSelectionChanged(e) {
			const selectedItems = manageListSmilecash.option('selectedItems');
			console.log('Smilecash 선택:', selectedItems);
		},
	}).dxList('instance');
	
});

// 발송량 관리 모달
function openManageModal(targetId) {

    document.querySelector('.manage').classList.add('d-block');

    document.querySelectorAll('.manage .modal-con > div')
        .forEach(el => el.style.display = 'none');

    document.querySelector(`#${targetId}`).style.display = 'block'
}

// 발송량 상세 팝업
function openDetailPage(url, winName) {
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

