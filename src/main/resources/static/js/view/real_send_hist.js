const labels = ["전송메시지", "성공메시지", "실패메시지"];
const borderColor = ['rgb(153, 102, 255)', 'rgb(54, 162, 235)', 'rgb(255, 99, 132)'];
const backgroundColor = ['rgba(153, 102, 255, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'];

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

	const chart = new Chart(ctx, {
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
					, borderColor: borderColor[0]
					, backgroundColor: backgroundColor[0]
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
					position: 'top',
				},
				title: {
					display: true,
					text: title
				}
			}
			, scales: {
				y: {
					ticks: {
						precision: 0
					}
				}
			}
			, responsive: false // 반응형 끄고,
			, maintainAspectRatio: false // 비율 고정도 끔
		}
	});

	return chart;
}

// 전체 현황 차트
const totalCtx = document.getElementById('total_chart').getContext('2d');
let totalTimer;
let totalflag = 0;
let totalTitle = "전체 현황";
const totalChart = makeChartOne(totalTitle, totalCtx);

// 전체 현황
function total() {
	const param = {};
	postAjax('/api/v1/real/totalList', param, totalCallback);
}

var auction = 1;
var gmarket = 2;
// 전체 현황 성공 함수
function totalCallback() {

	const maxPoints = 10;
	auction += auction;
	gmarket += gmarket;
	data = {
		inTime: "00:00"
		, auction: auction
		, gmarket: gmarket
	}

	totalChart.data.labels.push(data.inTime);				// 시간
	totalChart.data.datasets[0].data.push(data.auction);	// 옥션
	totalChart.data.datasets[1].data.push(data.gmarket);	// 지마켓

	// 10개 초과 시 기존 데이터 삭제
	if (totalChart.data.labels.length > maxPoints) {
		totalChart.data.labels.shift();
		totalChart.data.datasets[0].data.shift();
		totalChart.data.datasets[1].data.shift();
	}

	totalChart.update();
}

// 옥션 전체 현황 차트
const auctionTotalCtx = document.getElementById('auction_total_chart').getContext('2d');
let auctionTotalTimer;
let auctionTotalflag = 0;
let auctionTotalTitle = "옥션 전체현황";
const auctionTotalChart = makeChartTwo(auctionTotalTitle, auctionTotalCtx);

// 옥션 전체 현황
function auctionTotal() {
	const param = { companyCode: 0 };
	postAjax('/api/v1/real/list', param, auctionTotalCallback);
}

// 옥션 전체 현황 성공 함수
function auctionTotalCallback() {

	const maxPoints = 10;

	auction += auction;
	gmarket += gmarket;

	data = {
		inTime: "00:00"
		, auction: auction
		, gmarket: gmarket
	}

	auctionTotalChart.data.labels.push(data.inTime);			// 시간
	auctionTotalChart.data.datasets[0].data.push(data.sendCnt);	// 전송메시지
	auctionTotalChart.data.datasets[1].data.push(data.succCnt);	// 성공메시지
	auctionTotalChart.data.datasets[2].data.push(data.failCnt);	// 실패메시지

	// 10개 초과 시 기존 데이터 삭제
	if (auctionTotalChart.data.labels.length > maxPoints) {
		auctionTotalChart.data.labels.shift();
		auctionTotalChart.data.datasets[0].data.shift();
		auctionTotalChart.data.datasets[1].data.shift();
		auctionTotalChart.data.datasets[2].data.shift();
	}

	auctionTotalChart.update();
}

// 지마켓 전체 현황 차트
const gmarketTotalCtx = document.getElementById('gmarket_total_chart').getContext('2d');
let gmarketTotalTimer;
let gmarketTotalflag = 0;
let gmarketTotalTitle = "지마켓 전체현황";
const gmarketTotalChart = makeChartTwo(gmarketTotalTitle, gmarketTotalCtx);

// 지마켓 전체 현황
function gmarketTotal() {
	const param = { companyCode: 1 };
	postAjax('/api/v1/real/list', param, gmarketTotalCallback);
}

// 지마켓 전체 현황 성공 함수
function gmarketTotalCallback() {

	const maxPoints = 10;

	auction += auction;
	gmarket += gmarket;

	data = {
		inTime: "00:00"
		, auction: auction
		, gmarket: gmarket
	}

	gmarketTotalChart.data.labels.push(data.inTime);			// 시간
	gmarketTotalChart.data.datasets[0].data.push(data.sendCnt);	// 전송메시지
	gmarketTotalChart.data.datasets[1].data.push(data.succCnt);	// 성공메시지
	gmarketTotalChart.data.datasets[2].data.push(data.failCnt);	// 실패메시지

	// 10개 초과 시 기존 데이터 삭제
	if (gmarketTotalChart.data.labels.length > maxPoints) {
		gmarketTotalChart.data.labels.shift();
		gmarketTotalChart.data.datasets[0].data.shift();
		gmarketTotalChart.data.datasets[1].data.shift();
		gmarketTotalChart.data.datasets[2].data.shift();
	}

	gmarketTotalChart.update();
};

// 전체 현황 차트를 제외한 나머지 차트
function makeChartTwo(title, ctx) {

	const chart = new Chart(ctx, {
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
					position: 'top',
				},
				title: {
					display: true,
					text: title
				}
			}
			, scales: {
				y: {
					ticks: {
						precision: 0
					}
				}
			}
			, responsive: false // 반응형 끄고,
			, maintainAspectRatio: false // 비율 고정도 끔
		}
	});
	
	return chart;
}

// SMSCLI_TBL_EMG (지마켓) 현황 차트
const gmarketCtx01 = document.getElementById('gmarket_chart01').getContext('2d');
let gmarketTimer01;
let gmarketflag01 = 0;
let gmarketTitle01 = gmarketTableName[0] + ' (G마켓)';
const gmarketChart01 = makeChartTwo(gmarketTitle01, gmarketCtx01);

// SMSCLI_TBL_BATCH (옥션) 현황 차트
const auctionCtx01 = document.getElementById('auction_chart01').getContext('2d');
let auctionTimer01;
let auctionflag01 = 0;
let auctionTitle01 = auctionTableName[4] + ' (옥션)';
const auctionChart01 = makeChartTwo(auctionTitle01, auctionCtx01);

// SMSCLI_TBL_ETC (지마켓) 현황 차트
const gmarketCtx02 = document.getElementById('gmarket_chart02').getContext('2d');
let gmarketTimer02;
let gmarketflag02 = 0;
let gmarketTitle02 = gmarketTableName[1] + ' (G마켓)';
const gmarketChart02 = makeChartTwo(gmarketTitle02, gmarketCtx02);

// SMSCLI_TBL_ESCROW (옥션) 현황 차트
const auctionCtx02 = document.getElementById('auction_chart02').getContext('2d');
let auctionTimer02;
let auctionflag02 = 0;
let auctionTitle02 = auctionTableName[1] + ' (옥션)';
const auctionChart02 = makeChartTwo(auctionTitle02, auctionCtx02);

// SMSCLI_TBL_ORDER (지마켓) 현황 차트
const gmarketCtx03 = document.getElementById('gmarket_chart03').getContext('2d');
let gmarketTimer03;
let gmarketflag03 = 0;
let gmarketTitle03 = gmarketTableName[2] + ' (G마켓)';
const gmarketChart03 = makeChartTwo(gmarketTitle03, gmarketCtx03);

// SMSCLI_TBL_MOTORS (옥션) 현황 차트
const auctionCtx03 = document.getElementById('auction_chart03').getContext('2d');
let auctionTimer03;
let auctionflag03 = 0;
let auctionTitle03 = auctionTableName[5] + ' (옥션)';
const auctionChart03 = makeChartTwo(auctionTitle03, auctionCtx03);

// SMSCLI_TBL_TRAN (지마켓) 현황 차트
const gmarketCtx04 = document.getElementById('gmarket_chart04').getContext('2d');
let gmarketTimer04;
let gmarketflag04 = 0;
let gmarketTitle04 = gmarketTableName[3] + ' (G마켓)';
const gmarketChart04 = makeChartTwo(gmarketTitle04, gmarketCtx04);

// SMSCLI_TBL_API (옥션) 현황 차트
const auctionCtx04 = document.getElementById('auction_chart04').getContext('2d');
let auctionTimer04;
let auctionflag04 = 0;
let auctionTitle04 = auctionTableName[3] + ' (옥션)';
const auctionChart04 = makeChartTwo(auctionTitle04, auctionCtx04);

// SMSCLI_TBL_EMG (지마켓) 현황
function gmarket01() {
	const param = { tableCode: 11 };
	postAjax('/api/v1/real/list', param, gmarket01Callback);
};

// SMSCLI_TBL_EMG (지마켓) 현황 성공 함수
function gmarket01Callback() {

	const maxPoints = 10;

	auction += auction;
	gmarket += gmarket;

	data = {
		inTime: "00:00"
		, auction: auction
		, gmarket: gmarket
	}

	gmarketChart.data.labels.push(data.inTime);				// 시간
	gmarketChart.data.datasets[0].data.push(data.sendCnt);	// 전송메시지
	gmarketChart.data.datasets[1].data.push(data.succCnt);	// 성공메시지
	gmarketChart.data.datasets[2].data.push(data.failCnt);	// 실패메시지

	// 10개 초과 시 기존 데이터 삭제
	if (gmarketChart.data.labels.length > maxPoints) {
		gmarketChart.data.labels.shift();
		gmarketChart.data.datasets[0].data.shift();
		gmarketChart.data.datasets[1].data.shift();
		gmarketChart.data.datasets[2].data.shift();
	}

	gmarketChart.update();
};

$(document).ready(function() {
	$("#totalToggle").click(function(e) {

		const data = {};

		if (totalflag == 0) {
			totalTimer = setInterval(() => totalCallback(), 10000);
			totalflag = 1;
			alert("모니터링 Start");
		} else {
			clearInterval(totalTimer);
			totalflag = 0;
			alert("모니터링 Stop");
		}
	});
});