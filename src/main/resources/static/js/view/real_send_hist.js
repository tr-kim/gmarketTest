// 타이머
let PROC_TIMER = null; // 프로세스 상태
let CHART_TIMER = null; // 발송량 차트
let STATUS_TIMER = null; // 서버 상태
let PROC_SUM_TIMER = null; // 프로세스 합계
let CHART_SUM_TIMER = null; // 발송량 합계

// 인터벌
const PROC_ITV_SEC = 10; // 10초(고정)
let CHART_ITV_SEC = 10; // 10초(가변)
const STATUS_ITV_SEC = 60;  // 1분(고정)

// 실패 횟수
const MAX_FAIL_COUNT = 3;
let PROC_FAIL_COUNT = 0;
let CHART_FAIL_COUNT = 0;
let STATUS_FAIL_COUNT = 0;
let PROC_SUM_FAIL_COUNT = 0;
let CHART_SUM_FAIL_COUNT = 0;

// 회사별 코드
const auctionCode = 0;
const gmarketCode = 1;
//const smilecashCode = 2;

// 회사별 서비스 목록
const auctionTasks = [], gmarketTasks = []; //smilecashTasks = []
const companyTaskMap = { 0: auctionTasks, 1: gmarketTasks }; //2: smilecashTasks

// 뷰 전환: 요약(summary), 상세(detail)
let CURRENT_VIEW = 'summary';

// 탭 전환: 1번서버(1), 2번서버(2)
let CURRENT_TAB = {
	summary: '1',
	detail: '1'
};

$(function () {
	// 서비스 목록
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
	
	
	// 위젯 선언================================================================================================================
	// =======================================================================================================================
	// 요약뷰, 상세뷰
	 $('#real_toggle').dxButtonGroup({
		items: [{ text:'요약' }, { text:'상세' }],
		keyExpr: 'text',
		stylingMode: 'outlined',
		selectedItemKeys: ['요약'],
		onItemClick(e) {
			const real_send_hist = document.getElementById('real_send_hist');
			const isSummary = e.component.option('selectedItemKeys')[0] === '요약';
			
			real_send_hist.querySelector('.summery').classList.toggle('d-none', !isSummary);
			real_send_hist.querySelector('.detail').classList.toggle('d-none', isSummary);
			
			CURRENT_VIEW = isSummary ? 'summary' : 'detail';
			
			// 전환 시 재조회
			startProcAutoRefresh();
		}
	}).dxButtonGroup("instance");
	
	// 요약뷰 운영/DR
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
			
			CURRENT_TAB.summary = isDr ? '2' : '1';
			
			// 전환 시 재조회
			startProcAutoRefresh();
		});
	});
	
	// 상세뷰 운영/DR
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
			
			CURRENT_TAB.detail = isDr ? '2' : '1';
			
			// 전환 시 재조회
			startProcAutoRefresh();
		});
	});
	
	// 상단 팝오버
	function makePopover(id, targetId, status) {
		$(id).dxPopover({
			target: targetId,
			showEvent: 'dxclick',
			position: 'bottom',
			wrapperAttr: {
				class: "dxPopover"
			},
			maxHeight:500,
			onShown(e) {
				// 상태별 서비스명 조회
				summaryProcName(status);
				
				const w = $(targetId).outerWidth();
				e.component.option('width', w);
			}
		}).dxPopover("instance");
	}
	
	makePopover('#downList', '#down', 'DOWN');
	makePopover('#issueList', '#issue', 'ISSUE');
	makePopover('#delayList', '#delay', 'DELAY');
	
	// 상단 총 발송량
	$('#completion').click(function(){
		$('.realCompletion').addClass('d-block');
		toggleBodyClass();
	});
	
	// 발송량 차트
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
	
	makeChart('gmarketChart');
	makeChart('auctionChart');
	//makeChart('smilecashChart');
	
	// 차트 갱신 주기
	const chartTimes = ['10초', '20초', '30초'];
	$('#chartInterval').dxRadioGroup({
		items: chartTimes,
		value: chartTimes[0],
		layout: 'horizontal',
		onValueChanged(e) {
			// 선택한 값에서 숫자만 추출 (10, 20, 30)
			CHART_ITV_SEC = parseInt(e.value);
			startChartAutoRefresh();
			startChartSumAutoRefresh();
		}
	}).dxRadioGroup("instance");
	
	// 차트 상세 버튼
	function makeDetailButton(id, url, name) {
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
			}
		}).dxButton("instance");
	}
	
	makeDetailButton('#gmarketDetail', 'gmarket', 'detailGmarket');
	makeDetailButton('#auctionDetail', 'auction', 'detailAuction');
	//makeDetailButton('#smilecashDetail', 'smilecash', 'detailSmilecash');
	
	// 차트 관리 버튼
	const taskMap = {
		manageListGmarket: gmarketTasks,
		manageListAuction: auctionTasks,
		//manageListSmilecash: smilecashTasks,
	};
	
	function makeManageButton(id, name) {
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
				
				if (taskMap[name]) fn_manageList(name, taskMap[name]);
			}
		}).dxButton("instance");
	}
	
	makeManageButton('#gmarketManage', 'manageListGmarket');
	makeManageButton('#auctionManage', 'manageListAuction');
	//makeManageButton('#smilecashManage', 'manageListSmilecash');
	
	
	// 함수 선언================================================================================================================
	// =======================================================================================================================
	// 차트 데이터 갱신
	function updateChartData(companyCode, chartId, taskList, cookieId) {
		const cookieValue = getCookie(cookieId); // 쿠키에 있는 값 가져오기
		
		let selectedTasks;
		if(Array.isArray(cookieValue) && cookieValue.length > 0) {
			selectedTasks = cookieValue;
		} else if(taskList.length > 6) {
			selectedTasks = taskList.sort(() => 0.5 - Math.random()).slice(0, 6);
			setCookie(cookieId, selectedTasks);
		} else {
			selectedTasks = taskList;
		}
		
		const tableCodeList = selectedTasks.map(({ tableCode }) => tableCode); // 테이블 코드 목록
		
		fn_getChartData(
			companyCode,
			tableCodeList,
			function success(result) {
				CHART_FAIL_COUNT = 0; // 성공 시 실패 카운트 초기화
				
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
				
				// 시간 갱신
				$('#chartUpdateTime').text("최종 업데이트 " + formatDate(new Date(), "hh:mi:ss"));
			},
			function fail(err) {
				CHART_FAIL_COUNT++;
				// console.error('차트 데이터 로드 실패:', err);
				
				if (CHART_FAIL_COUNT >= MAX_FAIL_COUNT) {
					if (CHART_TIMER) {
						clearInterval(CHART_TIMER);
						CHART_TIMER = null;
						
						console.error('차트 자동 갱신 중지');
						showDialogCustom('error');
					}
				}
			}
		);
	}
	
	// 전체 차트 갱신
	function fetchChartData() {
		updateChartData(auctionCode, "auctionChart", auctionTasks, 'manageListAuction');
		updateChartData(gmarketCode, "gmarketChart", gmarketTasks, 'manageListGmarket');
		//updateChartData(smilecashCode, "smilecashChart", smilecashTasks, 'manageListSmilecash');
	}
	
	// 차트 타이머 재시작
	function startChartAutoRefresh() {
		if (CHART_TIMER) clearInterval(CHART_TIMER);

		fetchChartData(); // 즉시 1회 실행
		CHART_TIMER = setInterval(() => {
			fetchChartData();
		}, CHART_ITV_SEC * 1000);
	}
	
	// 차트 상세 팝업
	function fn_openDetailPage(url, winName) {
		const width = 1200;
		const height = 800;
		
		// 화면 중앙 좌표 계산 (브라우저 창 기준)
		const left = window.screenX + Math.max(0, Math.floor((window.outerWidth - width) / 2));
		const top  = window.screenY + Math.max(0, Math.floor((window.outerHeight - height) / 2));
		
		const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
		
		const win = window.open(url, winName, features);
		if (win) win.focus();
		else showDialogCustom('팝업이 차단되었습니다. 브라우저 설정을 확인하세요.');
	}
	
	// 차트 관리 모달
	function fn_openManageModal(targetId) {
	    document.querySelector('.manage').classList.add('d-block');
		toggleBodyClass();
	    document.querySelectorAll('.manage .modal-con > div').forEach(el => el.style.display = 'none');
		
	    document.querySelector(`#${targetId}`).style.display = 'block';
	    document.getElementById("setManageId").value = targetId;
	}
	
	// 차트 관리 목록
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
				
				// 선택한 서비스명
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
	
	// 관리 목록 이벤트
	const manageSaveBtn = document.getElementById('manageSaveBtn');
	manageSaveBtn.addEventListener('click', () => {
		const id = document.getElementById("setManageId").value;
		const list = $(`#${id}`).dxList('instance').option("selectedItems");
		
		// 쿠키 저장
		setCookie(id, list);
		
		// 차트 업데이트
		const chartMap = {
		    manageListGmarket: { code: gmarketCode, chartId: 'gmarketChart' },
		    manageListAuction: { code: auctionCode, chartId: 'auctionChart' },
		    //manageListSmilecash: { code: smilecashCode, chartId: 'smilecashChart' }
		};
		
		if (chartMap[id]) {
		    const { code, chartId } = chartMap[id];
		    updateChartData(code, chartId, list, id);
		}
		
		// 닫기
		closeModal('manage');		
	});
	
	// 차트 데이터 가져오기
	function fn_getChartData(code, list, successCallback, errorCallback) {
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
				if (typeof successCallback === 'function') {
					successCallback(data);
				}
			},
			error: function(xhr, status, error) {
				if (typeof errorCallback === 'function') {
					errorCallback({ xhr, status, error });
				}
			}
		});
	}
	
	// 상세뷰 렌더링
	function renderProcStatusDetail(datas, tab) {
		// 데이터 구조 변경
		// [] => dataId: [{}]
		const obj = {};
		
		datas.forEach(item => {
			const { companyCode, svcName, procType } = item;
			const typeName = companyCode == auctionCode ? 'AU' : companyCode == gmarketCode ? 'GM' : 'SC';
			const serviceName = `${typeName}_${svcName}_${procType}`.replace(/-/gi, '_');
			
			// 값이 없는 경우 초기화
			obj[serviceName] ??= [];

		    // 공통 필드
		    const base = {
				procChk: item.swDownChk,
		      	procSts: item.swDownSts,
		      	procDelay: item.swUpdateDelay,
				procDown: item.swUpdateDown
		    };

		    // procType 별로 다른 필드 추가
		    let filteredItem;
		    if (procType === "DBP") {
				filteredItem = {
					dbChk: item.dbSeshChk,
		        	dbSts: item.dbSeshSts,
					dbDelay: item.dbUpdateDelay,
					dbDown: item.dbUpdateDown,
		        	...base
		      };
		    } else if (procType === "IFP") {
				filteredItem = {
					dbChk: item.ktSeshChk,
		        	dbSts: item.ktSeshSts,
		        	dbDelay: item.ktUpdateDelay,
					dbDown: item.ktUpdateDown,
		        	...base
		      };
		    } else {
				filteredItem = {...base }
			}

		    obj[serviceName].push(filteredItem);
  		});
		
		let focus = "";
		
		// 1번서버(1), 2번서버(2)
		if(tab == '1') {
			focus = document.getElementById("detail-active");
		} else if(tab == '2') {
			focus = document.getElementById("detail-standby");
		}
		
		focus.querySelectorAll('tr.pro > td').forEach(item => {
			const dataId = item.getAttribute('data-id');
			const result = obj[dataId];
			
			// dataId 확인 및 값 확인
			if (!dataId || !result) return;
			
			const spans = item.querySelectorAll('span');
			
			// 헬퍼 함수: 색상 초기화
			spans.forEach(el => el.classList.remove('red', 'green', 'gray'));
			
			// 헬퍼 함수: 상태별 클래스 반환
			const getClass = (status, delay, down) => {
				if (down == 1) return 'gray';       // DOWN (5분 이상)
				if (delay == 1) return 'red';       // DELAY (1~4분)
				if (status == 0) return 'red';      // ISSUE
				return 'green';                     // NORMAL
			};
			
			// 추후 변경 예정
			// STATP, MEMMON
			if (dataId.includes('SAP') || dataId.includes('MON')) {
				spans[0].classList.add(getClass(result[0].procSts, result[0].procDelay, result[0].procDown));
			} else {
				result.forEach((r, i) => {
				  spans[i * 2].classList.add(getClass(r.dbSts, r.dbDelay, r.dbDown));
				  spans[i * 2 + 1].classList.add(getClass(r.procSts, r.procDelay, r.procDown));
				});
			}
		});
	}

	// 요약뷰 렌더링
	function renderProcStatusSummary(datas, tab) {
		let focus = "";
		
		// 1번서버(1), 2번서버(2)
		if(tab == '1') {
			focus = document.getElementById("summery-active");
		} else if(tab == '2') {
			focus = document.getElementById("summery-standby");
		}
		
		const tds = focus.querySelectorAll('tr > td');
		const typeMap = { DBP: 'db', IFP: 'ifp', SAP: 'sap', MON: 'mon' };
		const statusMap = { NL: 'NormalCount', WR: 'WarnCount', DW: 'DownCount' };
		
		// dbNormalCount, dbWarnCount, dbDownCount		DBP
		// ifpNormalCount, ifpWarnCount, ifpDownCount	IFP
		// sapNormalCount, sapWarnCount, sapDownCount	STATP
		// monNormalCount, monWarnCount, monDownCount	MEMMON
		
		// 데이터 구조 변경
		// [{}, {}, {}] => AU: {}, GM: {}, SC: {}
		const dataMap = {};
		datas.forEach(d => {
		    const prefix = d.companyCode === auctionCode ? 'AU' : d.companyCode === gmarketCode ? 'GM' : 'SC';
		    dataMap[prefix] = d;
		});
		
		tds.forEach(td => {
		    const dataId = td.getAttribute('data-id');
		    if (!dataId) return;

		    const [prefix, type, status] = dataId.split('_');
		    const data = dataMap[prefix];
		    if (!data) return;
			
		    const typeKey = typeMap[type];
		    const statusKey = statusMap[status];
		    if (typeKey && statusKey) td.textContent = data[typeKey + statusKey];
		});
	}
	
	// 프로세스 데이터 조회
	async function fetchProcStatusData(viewParam, tabParam) {
		try {
			const res = await fetch(`/api/v1/real/procStatusList`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					view: viewParam,
					tab: tabParam
				})
			});
			
			if (!res.ok) throw new Error(res.status);
			
			const data = await res.json();
			if (!data || data.length === 0) {
				throw new Error('데이터가 존재하지 않습니다. : ' + tabParam);
			}
			
			PROC_FAIL_COUNT = 0; // 성공 시 실패 카운트 초기화
			
			// 데이터 렌더링
			if (viewParam === 'detail') renderProcStatusDetail(data, tabParam);
			else renderProcStatusSummary(data, tabParam);
			
			// 시간 갱신
			$('#procUpdateTime').text("최종 업데이트 " + formatDate(new Date(), "yyyy-mm-dd hh:mi:ss"));
			
		} catch (err) {
			PROC_FAIL_COUNT++;
			// console.error('프로세스 데이터 로드 실패:', err);
			
			if (PROC_FAIL_COUNT >= MAX_FAIL_COUNT) {
				if (PROC_TIMER) {
					clearInterval(PROC_TIMER);
					PROC_TIMER = null;
					
					console.error('프로세스 자동 갱신 중지');
					showDialogCustom('error');
				}
			}
		}
	}
	
	// 프로세스 타이머 재시작
	function startProcAutoRefresh() {
		if (PROC_TIMER) clearInterval(PROC_TIMER);

		fetchProcStatusData(CURRENT_VIEW, CURRENT_TAB[CURRENT_VIEW]); // 즉시 1회 실행
		PROC_TIMER = setInterval(() => {
			fetchProcStatusData(CURRENT_VIEW, CURRENT_TAB[CURRENT_VIEW]);
		}, PROC_ITV_SEC * 1000);
	}
	
	
	// 서버 상태 관리============================================================================================================
	// 1번 수동 절체=============================================================================================================
	// =======================================================================================================================
	// 옥션
	const acutionSwitch1 = $('#acutionSwitch1').dxSwitch({
		onValueChanged(data) {
			// 최초 인입 시 무시, 실제 클릭 시 동작
			if (!data.event) return;

			console.log('옥션1번 스위치 변경 :', data);
			updateServerFlag( 0, 1, data);
		},
	}).dxSwitch('instance');
	
	// G마켓
	const gmarketSwitch1 = $('#gmarketSwitch1').dxSwitch({
		onValueChanged(data) {
			// 최초 인입 시 무시, 실제 클릭 시 동작
			if (!data.event) return;

			console.log('G마켓1번 스위치 변경 :', data);
			updateServerFlag( 1, 1, data);
		},
	}).dxSwitch('instance');
	
	// 스마일캐시
	//const smilecashSwitch1 = $('#smilecashSwitch1').dxSwitch({
	//	onValueChanged(data) {
	//		// 최초 인입 시 무시, 실제 클릭 시 동작
	//		if (!data.event) return;
	//
	//		console.log('스마일캐시1번 스위치 변경 :', data);
	//		updateServerFlag( 2, 1, data);
	//	},
	//}).dxSwitch('instance');	
	
	// 2번 수동 절체=============================================================================================================
	// =======================================================================================================================
	// 옥션
	const acutionSwitch2 = $('#acutionSwitch2').dxSwitch({
		onValueChanged(data) {
			// 최초 인입 시 무시, 실제 클릭 시 동작
			if (!data.event) return;

			console.log('옥션2번 스위치 변경 :', data);
			updateServerFlag( 0, 2, data);
		},
	}).dxSwitch('instance');
	
	// G마켓
	const gmarketSwitch2 = $('#gmarketSwitch2').dxSwitch({
		onValueChanged(data) {
			// 최초 인입 시 무시, 실제 클릭 시 동작
			if (!data.event) return;

			console.log('G마켓2번 스위치 변경 :', data);
			updateServerFlag( 1, 2, data);
		},
	}).dxSwitch('instance');
	
	// 스마일캐시
	//const smilecashSwitch2 = $('#smilecashSwitch2').dxSwitch({
	//	onValueChanged(data) {
	//		// 최초 인입 시 무시, 실제 클릭 시 동작
	//		if (!data.event) return;
	//
	//		console.log('스마일캐시2번 스위치 변경 :', data);
	//		updateServerFlag( 2, 2, data);
	//	},
	//}).dxSwitch('instance');
	
	// 서버 상태 데이터 조회
	function fetchStatusData() {
		return $.ajax({
			url: "/api/v1/real/serverStatusList",
			method: "POST"
		})
		.then(res => {
			STATUS_FAIL_COUNT = 0; // 성공 시 실패 카운트 초기화
			
			// 서버 상태 텍스트 매핑
			const serverStatText = {
				'A': 'active',
				'S': 'standby',
				'D': 'shutdown'
			};

			// 상태 / 스위치 매핑
			const serverConfigMap = {
				'0_1': {
					statusId: 'acutionStatus1',
					switchId: '#acutionSwitch1'
				},
				'0_2': {
					statusId: 'acutionStatus2',
					switchId: '#acutionSwitch2'
				},
				'1_1': {
					statusId: 'gmarketStatus1',
					switchId: '#gmarketSwitch1'
				},
				'1_2': {
					statusId: 'gmarketStatus2',
					switchId: '#gmarketSwitch2'
				},
				//'2_1': {
				//	statusId: 'smilecashStatus1',
				//	switchId: '#smilecashSwitch1'
				//},
				//'2_2': {
				//	statusId: 'smilecashStatus2',
				//	switchId: '#smilecashSwitch2'
				//}
			};

			res.forEach(row => {
				const key = `${row.companyCode}_${row.serverId}`;
				const config = serverConfigMap[key];
				if (!config) return;

				// 서버 상태 텍스트 바인딩
				if (config.statusId) {
					const statusEl = document.getElementById(config.statusId);
					if (statusEl) {
						statusEl.textContent = serverStatText[row.serverStat] || 'shutdown';
					}
				}

				// 수동 절체 스위치 바인딩
				if (config.switchId) {
					const instance = $(config.switchId).dxSwitch('instance');
					if (instance) {
						instance.option('value', row.manualFlag === 'ON');
					}
				}
			});
		})
		.catch(() => {
			STATUS_FAIL_COUNT++;
			// console.error('서버 상태 조회 실패:', err);
			
			if (STATUS_FAIL_COUNT >= MAX_FAIL_COUNT) {
				if (STATUS_TIMER) {
					clearInterval(STATUS_TIMER);
					STATUS_TIMER = null;
					
					console.error('서버 상태 갱신 중지');
					showDialogCustom('error');
				}
			}
		});
	}

	//수동 절체 FLAG 업데이트
	function updateServerFlag(companyCode, serverId, data) {
		const switchMap = {
			'0_1': '#acutionSwitch1',
			'0_2': '#acutionSwitch2',
			'1_1': '#gmarketSwitch1',
			'1_2': '#gmarketSwitch2',
			//'2_1': '#smilecashSwitch1',
			//'2_2': '#smilecashSwitch2'
		};

		const key = `${companyCode}_${serverId}`;
		const switchName = switchMap[key];
		const pairMap = {
			'0_1': () => acutionSwitch2.option('value', data.value),
			'0_2': () => acutionSwitch1.option('value', data.value),
			'1_1': () => gmarketSwitch2.option('value', data.value),
			'1_2': () => gmarketSwitch1.option('value', data.value),
			//'2_1': () => smilecashSwitch2.option('value', data.value),
			//'2_2': () => smilecashSwitch1.option('value', data.value),
		};
		pairMap[key]?.();

		const instance = $(switchName).dxSwitch('instance');
		if (!instance) return;

		const beforeValue = instance.option('value');

    	const manualFlag = beforeValue ? 'ON' : 'OFF';

		const param = {
			companyCode: companyCode,
			serverId: serverId,
			manualFlag: manualFlag
		}

		return $.ajax({
			url: "/api/v1/real/flagUpdate",
			method: "PUT",
			contentType: "application/json",
			data: JSON.stringify(param)
		})
		.then(response => {
			// console.log(response);

			if (!response.success) {
				showDialogCustom("상대 서버가 shutdown 상태이므로<br>수동 절체를 수행할 수 없습니다.");
				//return;
			}

			return fetchStatusData(); // 재조회
		})
		.catch(() => {
			showDialogCustom("error");
			return { data: [] };
		})
	}
	
	// 서버 상태 타이머 재시작
	function startStatusAutoRefresh() {
		if (STATUS_TIMER) clearInterval(STATUS_TIMER);

		fetchStatusData();// 즉시 1회 실행
		STATUS_TIMER = setInterval(() => {
			fetchStatusData();
		}, STATUS_ITV_SEC * 1000); // 1분마다 실행
	}
	
	
	// 상단 Summary=============================================================================================================
	// =======================================================================================================================
	// Summary 프로세스 상태별 서비스명 조회
	function summaryProcName(status) {
		const param = {
			status : status
		}
		
		return $.ajax({
			url: "/api/v1/real/summaryProcName",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(param)
		})
		.then(response => {
			const map = {
				DOWN:  "#downListUl",
				ISSUE: "#issueListUl",
				DELAY: "#delayListUl"
			};
			
			const ul = document.querySelector(map[status]);
			if (!ul) return;
			ul.innerHTML = "";
			
			response.forEach(({ svcName }) => {
				const li = document.createElement("li");
				li.textContent = svcName;
				ul.appendChild(li);
			});
		})
		.catch(() => {
			showDialogCustom("error");
			return { data: [] };
		})
	}
	
	// Summary 프로세스 상태별 카운트 조회
	function fetchProcSumtData() {
		return $.ajax({
			url: "/api/v1/real/summaryProcCount",
			method: "POST"
		})
		.then(res => {
			PROC_SUM_FAIL_COUNT = 0; // 성공 시 실패 카운트 초기화
			
			const row = res[0];
			if (!row) return;
			
			$('#total .count').text(row.totalCount);
			$('#normal .count').text(row.normalCount);
			$('#down .count').text(row.downCount);
			$('#issue .count').text(row.issueCount);
			$('#delay .count').text(row.delayCount);
		})
		.catch(() => {
			PROC_SUM_FAIL_COUNT++;
			
			if (PROC_SUM_FAIL_COUNT >= MAX_FAIL_COUNT) {
				if (PROC_SUM_TIMER) {
					clearInterval(PROC_SUM_TIMER);
					PROC_SUM_TIMER = null;
					
					console.error('상태별 카운트 갱신 중지');
					showDialogCustom('error');
				}
			}
		});
	}
	
	// Summary 프로세스 상태별 카운트 타이머 재시작
	function startProcSumAutoRefresh() {
		if (PROC_SUM_TIMER) clearInterval(PROC_SUM_TIMER);
		
		fetchProcSumtData(); // 즉시 1회 실행
		PROC_SUM_TIMER = setInterval(() => {
			fetchProcSumtData();
		}, PROC_ITV_SEC * 1000);
	}
	
	// Summary 발송량 합계 조회
	function fetchChartSumtData() {
		console.log("발송량 합계 조회")
	}
	
	// Summary 발송량 합계 타이머 재시작
	function startChartSumAutoRefresh() {
		if (CHART_SUM_TIMER) clearInterval(CHART_SUM_TIMER);
		
		fetchChartSumtData(); // 즉시 1회 실행
		CHART_SUM_TIMER = setInterval(() => {
			fetchChartSumtData();
		}, CHART_ITV_SEC * 1000);
	}
	
	
	// 인입 시작================================================================================================================
	// =======================================================================================================================
	// 차트 인터벌 시작
	startChartAutoRefresh();
	
	// 프로세스 인터벌 시작
	startProcAutoRefresh();
	
	// 서버 상태 인터벌 시작
	startStatusAutoRefresh();
	
	// Summary 프로세스 상태별 카운트 인터벌 시작
	startProcSumAutoRefresh();
	
	// Summary 발송량 합계 인터벌 시작
	startChartSumAutoRefresh();

});

