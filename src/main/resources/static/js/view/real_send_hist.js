const labels = ["전송메시지", "성공메시지", "실패메시지"];
const borderColor = ['rgb(153, 102, 255)', 'rgb(54, 162, 235)', 'rgb(255, 99, 132)'];
const backgroundColor = ['rgba(153, 102, 255, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'];
const totalTimeCnt = 60000;
const timeCnt = 10000;
const maxPoints = 10;

const auctionTableName = [
	'SMSCLI_TBL_CHARGED', 'SMSCLI_TBL_ESCROW', 'SMSCLI_TBL_OUTBID', 'SMSCLI_TBL_API', 'SMSCLI_TBL_BATCH'
	, 'SMSCLI_TBL_MOTORS', 'SMSCLI_TBL_PUMBL', 'SMSCLI_TBL_EVENT', 'SMSCLI_TBL_LARGE', 'LMSCLI_TBL_EVENT'
	, 'LMSCLI_TBL_LARGE', 'MMSCLI_TBL_EVENT', 'MMSCLI_TBL_LARGE', 'IAC_SMSCLI_TBL_LARGE', 'IAC_LMSCLI_TBL_LARGE'
	, 'IAC_MMSCLI_TBL_LARGE'
];

const gmarketTableName = [
	'SMSCLI_TBL_EMG', 'SMSCLI_TBL_ETC', 'SMSCLI_TBL_ORDER', 'SMSCLI_TBL_TRAN', 'SMSCLI_TBL_EVENT'
	, 'SMSCLI_TBL_LARGE', 'LMSCLI_TBL_EVENT', 'LMSCLI_TBL_LARGE', 'MMSCLI_TBL_EVENT', 'MMSCLI_TBL_LARGE'
	, 'GMKT_SMSCLI_TBL_LARGE', 'GMKT_LMSCLI_TBL_LARGE', 'GMKT_MMSCLI_TBL_LARGE', 'SFC_SMSCLI_TBL'
];

// 전체 현황 차트 만들기
function makeChartOne(title, ctx) {

	return new Chart(ctx, {
		type: 'line',
		data: {
			labels: [],
			datasets: [
				{
					label: '옥션'
					, data: []
					, borderColor: borderColor[2]
					, backgroundColor: backgroundColor[2]
					, fill: false
					, tension: 0.1
				},
				{
					label: '지마켓'
					, data: []
					, borderColor: borderColor[1]
					, backgroundColor: backgroundColor[1]
					, fill: false
					, tension: 0.1
				}
			],
			fill: false
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'bottom',
				},
				title: {
					display: true,
					text: title
				}
			}
			, scales: {
				y: {
					min: 0
					, ticks: {
						precision: 0
					}
				}
			}
			, responsive: false // 반응형 끄고,
			, maintainAspectRatio: false // 비율 고정도 끔
		}
	});
}

// 전체 현황 차트
const totalChart = makeChartOne("전체 현황", document.getElementById('total_chart').getContext('2d'));
let totalTimer;
let totalFlag = 0;

// 전체 현황
function total() {
	const param = {};
	postAjax('/api/v1/real/totalList', param, totalCallback);
}

// 전체 현황 성공 함수
function totalCallback(data) {

	totalChart.data.labels.push(data[0].inTime);				// 시간
	totalChart.data.datasets[0].data.push(data[0].sendCnt);	// 옥션
	totalChart.data.datasets[1].data.push(data[1].sendCnt);	// 지마켓

	// 10개 초과 시 기존 데이터 삭제
	if (totalChart.data.labels.length > maxPoints) {
		totalChart.data.labels.shift();
		totalChart.data.datasets[0].data.shift();
		totalChart.data.datasets[1].data.shift();
	}

	totalChart.update();
}

// 전체 현황 차트를 제외한 나머지 차트
function makeChartTwo(title, ctx) {

	return new Chart(ctx, {
		type: 'line',
		data: {
			labels: [],
			datasets: [
				{
					label: labels[0]
					, data: []
					, borderColor: borderColor[0]
					, backgroundColor: backgroundColor[0]
					, fill: false
					, tension: 0.1
				},
				{
					label: labels[1]
					, data: []
					, borderColor: borderColor[1]
					, backgroundColor: backgroundColor[1]
					, fill: false
					, tension: 0.1
				},
				{
					label: labels[2]
					, data: []
					, borderColor: borderColor[2]
					, backgroundColor: backgroundColor[2]
					, fill: false
					, tension: 0.1
				}
			],
			fill: false
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'bottom',
				},
				title: {
					display: true,
					text: title
				}
			}
			, scales: {
				y: {
					min: 0
					, ticks: {
						precision: 0
					}
				}
			}
			, responsive: false // 반응형 끄고,
			, maintainAspectRatio: false // 비율 고정도 끔
		}
	});
}

// 옥션 전체 현황 차트
const auctionTotalChart = makeChartTwo("옥션 전체현황", document.getElementById('auction_total_chart').getContext('2d'));
let auctionTotalTimer;
let auctionTotalFlag = 0;

// 지마켓 전체 현황 차트
const gmarketTotalChart = makeChartTwo("지마켓 전체현황", document.getElementById('gmarket_total_chart').getContext('2d'));
let gmarketTotalTimer;
let gmarketTotalFlag = 0;

// SMSCLI_TBL_EMG (지마켓) 현황 차트
const gmarketChart01 = makeChartTwo(gmarketTableName[0] + ' (G마켓)', document.getElementById('gmarket_chart_01').getContext('2d'));
let gmarketTimer01;
let gmarketFlag01 = 0;

// SMSCLI_TBL_BATCH (옥션) 현황 차트
const auctionChart01 = makeChartTwo(auctionTableName[4] + ' (옥션)', document.getElementById('auction_chart_01').getContext('2d'));
let auctionTimer01;
let auctionFlag01 = 0;

// SMSCLI_TBL_ETC (지마켓) 현황 차트
const gmarketChart02 = makeChartTwo(gmarketTableName[1] + ' (G마켓)', document.getElementById('gmarket_chart_02').getContext('2d'));
let gmarketTimer02;
let gmarketFlag02 = 0;

// SMSCLI_TBL_ESCROW (옥션) 현황 차트
const auctionChart02 = makeChartTwo(auctionTableName[1] + ' (옥션)', document.getElementById('auction_chart_02').getContext('2d'));
let auctionTimer02;
let auctionFlag02 = 0;


// SMSCLI_TBL_ORDER (지마켓) 현황 차트
const gmarketChart03 = makeChartTwo(gmarketTableName[2] + ' (G마켓)', document.getElementById('gmarket_chart_03').getContext('2d'));
let gmarketTimer03;
let gmarketFlag03 = 0;


// SMSCLI_TBL_MOTORS (옥션) 현황 차트
const auctionChart03 = makeChartTwo(auctionTableName[5] + ' (옥션)', document.getElementById('auction_chart_03').getContext('2d'));
let auctionTimer03;
let auctionFlag03 = 0;

// SMSCLI_TBL_TRAN (지마켓) 현황 차트
const gmarketChart04 = makeChartTwo(gmarketTableName[3] + ' (G마켓)', document.getElementById('gmarket_chart_04').getContext('2d'));
let gmarketTimer04;
let gmarketFlag04 = 0;

// SMSCLI_TBL_API (옥션) 현황 차트
const auctionChart04 = makeChartTwo(auctionTableName[3] + ' (옥션)', document.getElementById('auction_chart_04').getContext('2d'));
let auctionTimer04;
let auctionFlag04 = 0;

// 옥션, 지마켓 데이터 조회
function chartData(url, code, chart) {
	const param = { code: code };

	$.ajax({
		type: "POST",
		url: url,
		data: param,
		success: function(data) {
			if (chartDataCallback) {
				chartDataCallback(data, chart);
			}
		},
		error: function(xhr, status, error) {
			console.error("Ajax 요청 실패:", xhr, status, error); // 기본 에러 처리
			//alert("예기치 못한 오류가 발생하였습니다. 관리자에게 문의바랍니다.");
			
			DevExpress.ui.dialog.custom({
				showTitle: false,
				messageHtml: `<div style='text-align: center;' class="pt-3">예기치 못한 오류가 발생하였습니다. 관리자에게 문의바랍니다.</div>`,
				buttons: [{
					text: "확인",
					onClick: function () {
						return;
					}
				}]
			}).show();
		}
	});
};

// // 옥션, 지마켓 데이터 조회 성공 함수
function chartDataCallback(data, chart) {

	chart.data.labels.push(data.inTime);			// 시간
	chart.data.datasets[0].data.push(data.sendCnt);	// 전송메시지
	chart.data.datasets[1].data.push(data.succCnt);	// 성공메시지
	chart.data.datasets[2].data.push(data.failCnt);	// 실패메시지

	// 10개 초과 시 기존 데이터 삭제
	if (chart.data.labels.length > maxPoints) {
		chart.data.labels.shift();
		chart.data.datasets[0].data.shift();
		chart.data.datasets[1].data.shift();
		chart.data.datasets[2].data.shift();
	}

	chart.update();
};

$(document).ready(function() {

	// 전체 현황 시작/중지 이벤트
	$("#total_btn").click(function(e) {
		e.preventDefault();

		if (totalFlag == 0) {
			totalTimer = setInterval(() => total(), totalTimeCnt);
			totalFlag = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(totalTimer);
			totalFlag = 0;
			alert("모니터링 Stop");
		}
	});

	// 지마켓 전체 현황 시작/중지 이벤트
	$("#gmarket_total_btn").click(function(e) {
		e.preventDefault();

		if (gmarketTotalFlag == 0) {
			gmarketTotalTimer = setInterval(() => chartData('/api/v1/real/list', 1, gmarketTotalChart), timeCnt);
			gmarketTotalFlag = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(gmarketTotalTimer);
			gmarketTotalFlag = 0;
			alert("모니터링 Stop");
		}
	});

	// 옥션 전체 현황 시작/중지 이벤트
	$("#auction_total_btn").click(function(e) {
		e.preventDefault();

		if (auctionTotalFlag == 0) {
			auctionTotalTimer = setInterval(() => chartData('/api/v1/real/list', 0, auctionTotalChart), timeCnt);
			auctionTotalFlag = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(auctionTotalTimer);
			auctionTotalFlag = 0;
			alert("모니터링 Stop");
		}
	});

	// SMSCLI_TBL_EMG (지마켓) 현황 시작/중지 이벤트
	$("#gmarket_chart_01_btn").click(function(e) {
		e.preventDefault();

		if (gmarketFlag01 == 0) {
			gmarketTimer01 = setInterval(() => chartData('/api/v1/real/tableList', 11, gmarketChart01), timeCnt);
			gmarketFlag01 = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(gmarketTimer01);
			gmarketFlag01 = 0;
			alert("모니터링 Stop");
		}
	});

	// SMSCLI_TBL_BATCH (옥션) 현황 시작/중지 이벤트
	$("#auction_chart_01_btn").click(function(e) {
		e.preventDefault();

		if (auctionFlag01 == 0) {
			auctionTimer01 = setInterval(() => chartData('/api/v1/real/tableList', 5, auctionChart01), timeCnt);
			auctionFlag01 = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(auctionTimer01);
			auctionFlag01 = 0;
			alert("모니터링 Stop");
		}
	});

	// SMSCLI_TBL_ETC (지마켓) 현황 시작/중지 이벤트
	$("#gmarket_chart_02_btn").click(function(e) {
		e.preventDefault();

		if (gmarketFlag02 == 0) {
			gmarketTimer02 = setInterval(() => chartData('/api/v1/real/tableList', 12, gmarketChart02), timeCnt);
			gmarketFlag02 = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(gmarketTimer02);
			gmarketFlag02 = 0;
			alert("모니터링 Stop");
		}
	});

	// SMSCLI_TBL_ESCROW (옥션) 현황 시작/중지 이벤트
	$("#auction_chart_02_btn").click(function(e) {
		e.preventDefault();

		if (auctionFlag02 == 0) {
			auctionTimer02 = setInterval(() => chartData('/api/v1/real/tableList', 2, auctionChart02), timeCnt);
			auctionFlag02 = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(auctionTimer02);
			auctionFlag02 = 0;
			alert("모니터링 Stop");
		}
	});

	// SMSCLI_TBL_ORDER (지마켓) 현황 시작/중지 이벤트
	$("#gmarket_chart_03_btn").click(function(e) {
		e.preventDefault();

		if (gmarketFlag03 == 0) {
			gmarketTimer03 = setInterval(() => chartData('/api/v1/real/tableList', 13, gmarketChart03), timeCnt);
			gmarketFlag03 = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(gmarketTimer03);
			gmarketFlag03 = 0;
			alert("모니터링 Stop");
		}
	});

	// SMSCLI_TBL_MOTORS (옥션) 현황 시작/중지 이벤트
	$("#auction_chart_03_btn").click(function(e) {
		e.preventDefault();

		if (auctionFlag03 == 0) {
			auctionTimer03 = setInterval(() => chartData('/api/v1/real/tableList', 6, auctionChart03), timeCnt);
			auctionFlag03 = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(auctionTimer03);
			auctionFlag03 = 0;
			alert("모니터링 Stop");
		}
	});

	// SMSCLI_TBL_TRAN (지마켓) 현황 시작/중지 이벤트
	$("#gmarket_chart_04_btn").click(function(e) {
		e.preventDefault();

		if (gmarketFlag04 == 0) {
			gmarketTimer04 = setInterval(() => chartData('/api/v1/real/tableList', 14, gmarketChart04), timeCnt);
			gmarketFlag04 = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(gmarketTimer04);
			gmarketFlag04 = 0;
			alert("모니터링 Stop");
		}
	});

	// SMSCLI_TBL_API (옥션) 현황 시작/중지 이벤트
	$("#auction_chart_04_btn").click(function(e) {
		e.preventDefault();

		if (auctionFlag04 == 0) {
			auctionTimer04 = setInterval(() => chartData('/api/v1/real/tableList', 4, auctionChart04), timeCnt);
			auctionFlag04 = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(auctionTimer04);
			auctionFlag04 = 0;
			alert("모니터링 Stop");
		}
	});
});