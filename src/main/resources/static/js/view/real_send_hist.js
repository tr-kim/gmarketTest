const ctx1 = document.getElementById('action_chart').getContext('2d');
const myChart1 = new Chart(ctx1, {
	type: 'line',
	data: {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'KT-SME-ENG'
				, data: [65, 59, 80, 81, 56, 55, 40]
				, borderColor: 'rgba(255, 0, 0, 1)'
				, backgroundColor: 'rgba(255, 0, 0, 0.2)'
				, fill: false
				, tension: 0.1
			},
			{
				label: 'KT-SMS-EVENT-GMA'
				, data: [37, 56, 78, 34, 23, 86, 34]
				, borderColor: 'rgba(0, 0, 255, 1)'
				, backgroundColor: 'rgba(0, 0, 255, 0.2)'
				, fill: false
				, tension: 0.1
			},
			{
				label: 'KT-SMS-STATP-GMA'
				, data: [12, 32, 55, 22, 55, 64, 21]
				, borderColor: 'rgba(255, 255, 0, 1)'
				, backgroundColor: 'rgba(255, 255, 0, 0.2)'
				, fill: false
				, tension: 0.1
			},
			{
				label: 'KT-MMS-LARGE-GMA'
				, data: [53, 21, 56, 77, 42, 23, 41]
				, borderColor: 'rgba(0, 255, 255, 1)'
				, backgroundColor: 'rgba(0, 255, 255, 0.2)'
				, fill: false
				, tension: 0.1
			},
			{
				label: 'KT-MMS-EVENT-GMA'
				, data: [75, 87, 34, 65, 78, 44, 12]
				, borderColor: 'rgba(255, 0, 255, 1)'
				, backgroundColor: 'rgba(255, 0, 255, 0.2)'
				, fill: false
				, tension: 0.1
			},
			{
				label: 'KT-SMS-MO4MMS'
				, data: []
				, borderColor: 'rgba(255, 165, 0, 1)'
				, backgroundColor: 'rgba(255, 165, 0, 0.2)'
				, fill: false
				, tension: 0.1
			},
			{
				label: 'KT-MMS-NON-GMA'
				, data: [53, 23, 56, 32, 32, 23, 56]
				, borderColor: 'rgba(255, 255, 255, 1)'
				, backgroundColor: 'rgba(255, 255, 255, 0.2)'
				, fill: false
				, tension: 0.1
			},
			{
				label: 'KT-SMS-STATP-GMA-2CON'
				, data: [43, 54, 23, 12, 54, 76, 97]
				, borderColor: 'rgba(0, 255, 0, 1)'
				, backgroundColor: 'rgba(0, 255, 0, 0.2)'
				, fill: false
				, tension: 0.1
			},
			{
				label: 'KT-MMS-NON-GMA'
				, data: [53, 23, 56, 32, 32, 23, 56]
				, borderColor: 'rgba(255, 255, 255, 1)'
				, backgroundColor: 'rgba(255, 255, 255, 0.2)'
				, fill: false
				, tension: 0.1
			},
			{
				label: 'KT-SMS-STATP-GMA-2CON'
				, data: [43, 54, 23, 12, 54, 76, 97]
				, borderColor: 'rgba(0, 255, 0, 1)'
				, backgroundColor: 'rgba(0, 255, 0, 0.2)'
				, fill: false
				, tension: 0.1
			}
		],
		fill: false
	},
  options: {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    },
	plugins: {
        legend: {
            position: 'top',
        },
		// title: {
		// 	display: true,
		// 	text: 'ACTION'
		// },
    }
  }
});

const ctx2 = document.getElementById('gmarket_chart').getContext('2d');
const myChart2 = new Chart(ctx2, {
  type: 'line',
  data: {
    		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  			datasets: [
  				{
  					label: 'KT-SME-ENG'
  					, data: [65, 59, 80, 81, 56, 55, 40]
  					, borderColor: 'rgba(255, 0, 0, 1)'
  					, backgroundColor: 'rgba(255, 0, 0, 0.2)'
  					, fill: false
  					, tension: 0.1
  				},
  				{
  					label: 'KT-SMS-EVENT-GMA'
  					, data: [37, 56, 78, 34, 23, 86, 34]
  					, borderColor: 'rgba(0, 0, 255, 1)'
  					, backgroundColor: 'rgba(0, 0, 255, 0.2)'
  					, fill: false
  					, tension: 0.1
  				},
  				{
  					label: 'KT-SMS-STATP-GMA'
  					, data: [12, 32, 55, 22, 55, 64, 21]
  					, borderColor: 'rgba(255, 255, 0, 1)'
  					, backgroundColor: 'rgba(255, 255, 0, 0.2)'
  					, fill: false
  					, tension: 0.1
  				},
  				{
  					label: 'KT-MMS-LARGE-GMA'
  					, data: [53, 21, 56, 77, 42, 23, 41]
  					, borderColor: 'rgba(0, 255, 255, 1)'
  					, backgroundColor: 'rgba(0, 255, 255, 0.2)'
  					, fill: false
  					, tension: 0.1
  				},
  				{
  					label: 'KT-MMS-EVENT-GMA'
  					, data: [75, 87, 34, 65, 78, 44, 12]
  					, borderColor: 'rgba(255, 0, 255, 1)'
  					, backgroundColor: 'rgba(255, 0, 255, 0.2)'
  					, fill: false
  					, tension: 0.1
  				},
  				{
  					label: 'KT-SMS-MO4MMS'
  					, data: []
  					, borderColor: 'rgba(255, 165, 0, 1)'
  					, backgroundColor: 'rgba(255, 165, 0, 0.2)'
  					, fill: false
  					, tension: 0.1
  				},
  				{
  					label: 'KT-MMS-NON-GMA'
  					, data: [53, 23, 56, 32, 32, 23, 56]
  					, borderColor: 'rgba(255, 255, 255, 1)'
  					, backgroundColor: 'rgba(255, 255, 255, 0.2)'
  					, fill: false
  					, tension: 0.1
  				},
				{
					label: 'KT-MMS-NON-GMA'
					, data: [53, 23, 56, 32, 32, 23, 56]
					, borderColor: 'rgba(255, 255, 255, 1)'
					, backgroundColor: 'rgba(255, 255, 255, 0.2)'
					, fill: false
					, tension: 0.1
				},
				{
					label: 'KT-SMS-STATP-GMA-2CON'
					, data: [43, 54, 23, 12, 54, 76, 97]
					, borderColor: 'rgba(0, 255, 0, 1)'
					, backgroundColor: 'rgba(0, 255, 0, 0.2)'
					, fill: false
					, tension: 0.1
				},
				{
					label: 'KT-MMS-NON-GMA'
					, data: [53, 23, 56, 32, 32, 23, 56]
					, borderColor: 'rgba(255, 255, 255, 1)'
					, backgroundColor: 'rgba(255, 255, 255, 0.2)'
					, fill: false
					, tension: 0.1
				},
				{
					label: 'KT-SMS-STATP-GMA-2CON'
					, data: [43, 54, 23, 12, 54, 76, 97]
					, borderColor: 'rgba(0, 255, 0, 1)'
					, backgroundColor: 'rgba(0, 255, 0, 0.2)'
					, fill: false
					, tension: 0.1
				}
  			],
  			fill: false
  		},
  options: {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    },
	plugins: {
        legend: {
            position: 'right',
        },
		// title: {
		// 	display: true,
		// 	text: 'GMARKET'
		// },
    }
  }
});

const ctx3 = document.getElementById('smile_cash_chart').getContext('2d');
const myChart3 = new Chart(ctx3, {
  type: 'line',
  data: {
    		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  			datasets: [
  				{
  					label: 'KT-SME-ENG'
  					, data: [65, 59, 80, 81, 56, 55, 40]
  					, borderColor: 'rgba(255, 0, 0, 1)'
  					, backgroundColor: 'rgba(255, 0, 0, 0.2)'
  					, fill: false
  					, tension: 0.1
  				},
  				{
  					label: 'KT-SMS-EVENT-GMA'
  					, data: [37, 56, 78, 34, 23, 86, 34]
  					, borderColor: 'rgba(0, 0, 255, 1)'
  					, backgroundColor: 'rgba(0, 0, 255, 0.2)'
  					, fill: false
  					, tension: 0.1
  				},
  				{
  					label: 'KT-SMS-STATP-GMA'
  					, data: [12, 32, 55, 22, 55, 64, 21]
  					, borderColor: 'rgba(255, 255, 0, 1)'
  					, backgroundColor: 'rgba(255, 255, 0, 0.2)'
  					, fill: false
  					, tension: 0.1
  				},
  				{
  					label: 'KT-MMS-LARGE-GMA'
  					, data: [53, 21, 56, 77, 42, 23, 41]
  					, borderColor: 'rgba(0, 255, 255, 1)'
  					, backgroundColor: 'rgba(0, 255, 255, 0.2)'
  					, fill: false
  					, tension: 0.1
  				}
  			],
  			fill: false
  		},
  options: {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    },
	plugins: {
        legend: {
            position: 'right',
        },
		// title: {
		// 	display: true,
		// 	text: 'SMILE_CASH'
		// },
    }
  }
});

// 상세 버튼 클릭
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

// 버튼에 이벤트 바인딩
document.getElementById('gmarketDetail').addEventListener('click', () => {
	openDetailPage('/view/real/detail/gmarket', 'detailGmarket');
});
document.getElementById('auctionDetail').addEventListener('click', () => {
	openDetailPage('/view/real/detail/auction', 'detailAuction');
});
document.getElementById('smilecashDetail').addEventListener('click', () => {
	openDetailPage('/view/real/detail/smilecash', 'detailSmilecash');
});

// 상세, 요약 토글 버튼
const alignments = [
	{
		text:'요약',
		alignment: '요약',
	},
	{
		text:'상세',
		alignment: '상세',
	},

];
 $('#real_toggle').dxButtonGroup({
	items: alignments,
	keyExpr: 'alignment',
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
	},
});
// $('#real_toggle').dxSwitch({
// 	value: true,
// 	width: 100,
// 	height:42,
// 	switchedOnText: '요약',
// 	switchedOffText: '상세',
// 	onValueChanged(data) {
// 		const real_send_hist = document.getElementById('real_send_hist');
// 		if(data.value) {				
// 			real_send_hist.querySelector(".summery").classList.remove('d-none');							
// 			real_send_hist.querySelector(".detail").classList.add('d-none');
// 		} else {
// 			real_send_hist.querySelector(".summery").classList.add('d-none');
// 			real_send_hist.querySelector(".detail").classList.remove('d-none');
// 		}
// 	},
// });

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

//상세 탭 버튼
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

// 모니터링 라디오 버튼
const priorities = ['10초', '20초', '30초'];
$('#chartRadio').dxRadioGroup({
	width: 100,
	items: priorities,
	value: priorities[0],
});
