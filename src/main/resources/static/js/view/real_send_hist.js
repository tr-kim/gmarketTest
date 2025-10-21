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
	
	// 발송량 라디오 버튼
	const priorities = ['10초', '20초', '30초'];
	$('#chartRadio').dxRadioGroup({
		// width: 100,
		items: priorities,
		value: priorities[0],
		layout: 'horizontal',
	});
	
	// 지마켓 차트
	const gmarketChart = $("#gmarketChart").dxChart({
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
			argumentType: "string", // datetime
			label: {
			    customizeText(arg) {
			        // arg.value가 YYYYMMDDHH 형태라고 가정
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
	}).dxChart("instance");
	
	// 옥션 차트
	const actionChart = $("#actionChart").dxChart({
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
			argumentType: "string", // datetime
			label: {
			    customizeText(arg) {
			        // arg.value가 YYYYMMDDHH 형태라고 가정
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
	}).dxChart("instance");
	
	// 스마일캐시 차트
	const smilecashChart = $("#smilecashChart").dxChart({
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
			argumentType: "string", // datetime
			label: {
			    customizeText(arg) {
			        // arg.value가 YYYYMMDDHH 형태라고 가정
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
			
			// string (YYYYMMDDHH)
			const d = new Date(startOfDay.getTime() + h * 60 * 60 * 1000);
			const yyyy = d.getFullYear();
			const mm = String(d.getMonth() + 1).padStart(2, '0');
			const dd = String(d.getDate()).padStart(2, '0');
			const hh = String(d.getHours()).padStart(2, '0');
			hours.push(`${yyyy}${mm}${dd}${hh}`);
		}
		
		// 서비스 랜덤 4개 (4개 이하인 경우 전체 사용)
		const selectedTasks = taskList.length > 4 ? taskList.sort(() => 0.5 - Math.random()).slice(0, 4) : taskList;
		
		// 데이터 구성
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
		
		// 데이터 갱신
		chartInstance.option({
			dataSource: chartData,
			series: series
		});
	}
	
	// 전체 차트 갱신
	function updateCharts() {
		updateChartData(gmarketChart, gmarketTasks);
		updateChartData(actionChart, auctionTasks);
		updateChartData(smilecashChart, smilecashTasks);
	}
	
	// 페이지 로드 시 호출
	updateCharts();
	
	// 자동 갱신 (1분마다)
	// setInterval(updateCharts, 60 * 1000);
	
	// 발송량 상세 버튼
	document.getElementById('gmarketDetail').addEventListener('click', () => {
		openDetailPage('/view/real/detail/gmarket', 'detailGmarket');
	});
	document.getElementById('auctionDetail').addEventListener('click', () => {
		openDetailPage('/view/real/detail/auction', 'detailAuction');
	});
	document.getElementById('smilecashDetail').addEventListener('click', () => {
		openDetailPage('/view/real/detail/smilecash', 'detailSmilecash');
	});
});


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

