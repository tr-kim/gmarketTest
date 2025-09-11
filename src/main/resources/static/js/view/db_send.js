let LOAD_PANEL;
let TEXT_FILE_NAME = "";

$(function () {
	// 로딩바 최초 생성 (화면 전체 기준)
	LOAD_PANEL = $('.loadpanel').dxLoadPanel({
		shadingColor: 'rgba(0,0,0,0.4)',
		position: { of: window },
		visible: false,
		showIndicator: true,
		showPane: true,
		shading: true,
		hideOnOutsideClick: false,
	}).dxLoadPanel('instance');
	
	const MSG_TITLE = document.getElementById('msgTitle');
	const MSG_WRITE = document.getElementById('msgWrite');
	const MSG_TYPES = document.querySelector('.msg_type');
	const INPUT_BYTE = document.getElementById('input_byte');
	const TOTAL_BYTE = document.getElementById('total_byte');
	const FINAL_SEND_BTN = document.getElementById('final_send_btn');
	
	MSG_WRITE.placeholder = "내용을 입력해 주세요.\n80byte 초과 시 장문 문자로,\n이미지 추가 시 포토 문자로 자동 전환 됩니다.";	
	
	function toggleDropZoneActive(dropZone, isActive) {
		dropZone.classList.toggle('dropzone-active', isActive);
	}
	
	
	//이미지 업로드 프로그래스바
	const uploadProgressBar = $('#upload-progress').dxProgressBar({
		min: 0,
		max: 100,
		width: '30%',
		showStatus: false,
		visible: false,
	}).dxProgressBar('instance');
	
	
	// 이미지 등록
	$('#file-uploader').dxFileUploader({
		multiple: true,
		allowedFileExtensions: ['.jpg'],
		maxFileSize: 100 * 1024,
		uploadMode: 'useButtons',
		uploadMethod: 'POST', 
		uploadUrl: '/api/v1/dbSend/fileUpload',
		onValueChanged(e) {
			
			const maxFiles = 2;

			if (e.value.length > maxFiles) {
				// 앞 2개만 유지
				const limitedFiles = e.value.slice(0, maxFiles);

				// FileUploader value 리셋 후 다시 세팅 (UI 갱신 강제)
				e.component.reset();
				e.component.option('value', limitedFiles);

				showDialogCustom(`이미지는 최대 ${maxFiles}개까지만 업로드할 수 있습니다.`);
			}
		},
		onUploadStarted(e) {
			// 업로드 전에 커스텀 데이터 추가
			console.log('Upload started', e);
			const files = e.component.option('value');
			const imgNumFlag = files.length;
			const fileName1 = files[0]?.name || '';
			const fileName2 = files[1]?.name || '';

			e.requestData = { 
				imgNumFlag: imgNumFlag,
				fileName1: fileName1,
				fileName2: fileName2
			};
		},
		onUploaded(e) {
			console.log('Uploaded', e);
		}
	});
	
	//예약 발송 캘린더
	let reserveDate = "";
	
	$('#calendar').dxCalendar({
		value: new Date(),
		zoomLevel: "month",
		onValueChanged(data) {
			const date = data.value;
			if (date instanceof Date && !isNaN(date)) {
				const yyyy = String(date.getFullYear());
				//const yy = String(date.getFullYear()).slice(2);
				const mm = String(date.getMonth() + 1).padStart(2, '0');
				const dd = String(date.getDate()).padStart(2, '0');		
				
				reserveDate = `${yyyy}-${mm}-${dd}`

				reserveDateTextContent();
			}
		},
		disabledDates: function(data) {
			const today = new Date();
			today.setHours(0, 0, 0, 0); // 시간 초기화
			return data.view === 'month' && data.date < today;
		},
	}).dxCalendar('instance');
	
	// 초기화 시에도 한 번 실행
	(function initReserveDate() {
		const today = new Date();
		const yyyy = String(today.getFullYear());
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		const dd = String(today.getDate()).padStart(2, '0');
		reserveDate = `${yyyy}-${mm}-${dd}`;
		reserveDateTextContent();
	})();
	
	function reserveDateTextContent(){
		document.querySelector('.reserveSend .date').textContent= reserveDate;
	}
	
	//예약 발송 모달 열기,닫기
	const reserveModal = document.querySelector('.reserveSend');
	const selects = document.querySelectorAll('.reserveSend select');
	const reserveHour = document.getElementById('hour');
	const reserveMinute = document.getElementById('minute');
	
	document.getElementById('send_time1').addEventListener('change',function(){
		if (this.checked) {
			document.getElementById('reserveDate').textContent = "";
			FINAL_SEND_BTN.textContent = "즉시발송";

		}
	});
	
	document.getElementById('send_time2').addEventListener('click', function () {
		if (this.checked) {
			reserveModal.classList.add("d-block");			
			FINAL_SEND_BTN.textContent = "예약발송";
		}
	});
	
	document.querySelector('.reserveSend .close_btn').addEventListener('click', function(){
		reserveModal.classList.remove("d-block");
		
		document.getElementById('send_time1').checked = true;
		document.getElementById('reserveDate').textContent = "";
		FINAL_SEND_BTN.textContent = "즉시발송";
		
		selects.forEach(select => {
			select.value = "00";
		})
	})
	
	document.querySelector('.reserveSend .modal-ft button').addEventListener('click', function(){
		const selectedDate = new Date(reserveDate);
		const hour = parseInt(reserveHour.value, 10);
		const minute = parseInt(reserveMinute.value, 10);

		// 사용자가 선택한 시간을 설정
		selectedDate.setHours(hour);
		selectedDate.setMinutes(minute);
		selectedDate.setSeconds(0);
		selectedDate.setMilliseconds(0);

		const now = new Date();
		const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; // 'YYYY-MM-DD'
		const time = `${String(now.getHours()).padStart(2, '0')}시 ${String(now.getMinutes()).padStart(2, '0')}분`; // 'HH:MM'

		if (selectedDate >= now) {
			// 예약 가능한 시간
			document.getElementById('reserveDate').textContent = 
				`예약 발송 시간 : ${reserveDate} ${reserveHour.value.padStart(2, '0')}시 ${reserveMinute.value.padStart(2, '0')}분`;
			reserveModal.classList.remove("d-block");
		} else {
			// 예약 불가 (지나간 시간)
			document.getElementById('reserveDate').textContent = '';
			
			const message = `<div style='text-align: center;' class="pt-3">
				과거 시간은 예약할 수 없습니다.<br><br><span class="text-666">현재 ${date} ${time}</span>
			</div>`;
			
			showDialogCustom(message);
			return;
		}
	})

	//문자 타입 표시
	function setMsgType(idx, byteLength) {
		const types = ['SMS', 'LMS', 'MMS'];
		const classMap = ['sms', 'lms', 'mms'];
		const byteNum = ['80', '2000', '2000'];
		
		// 기존 클래스 제거
		classMap.forEach(cls => MSG_TYPES.classList.remove(cls));
		
		// 유효한 인덱스일 때만 적용
		if (idx >= 0 && idx < types.length) {
			MSG_TYPES.textContent = types[idx];
			MSG_TYPES.classList.add(classMap[idx]);
			TOTAL_BYTE.textContent = byteNum[idx];
		}
		
		INPUT_BYTE.textContent = byteLength;
	}

	//080 수신거부
	document.getElementById('rejectCheckDefault').addEventListener('change', function () {
		const input = document.getElementById('rejectNum');
		input.disabled = !this.checked;
		 handleInput();
	});	

	//문자 byte 표시
	function getByteLength(str) {
		let resultStr = "";
		let size = 0;

		for (let i = 0; i < str.length; i++) {
			const ch = str.charAt(i);
			const byteSize = new Blob([ch]).size;
			const addSize = (byteSize === 2 || byteSize === 3) ? 2 : 1;

			if (size + addSize > 2000) {
				showDialogCustom(`최대 2000byte까지 입력 가능합니다.`);
				break;
			}

			resultStr += ch;
			size += addSize;
		}

		if (str !== resultStr) {
			
			MSG_WRITE.value = resultStr;
		}

		return size;
	}
	
	//이미지 확인
	function hasImage() {
		const uploader = $("#file-uploader").dxFileUploader("instance");
		const files = uploader?.option("value") || [];
		//console.log("Current uploader value:", files);
		
		return files.length > 0;
	}

	//입력 이벤트 핸들링
	function handleInput() {
    const titleContent = MSG_TITLE.value;
    const titleByteLength = getByteLength(titleContent);

    const writeContent = MSG_WRITE.value;
    const writeByteLength = getByteLength(writeContent);

    let totalByteLength = writeByteLength; // 기본은 내용 바이트 수

    // rejectCheckDefault가 활성화(checked)되어 있고 rejectNum도 입력되면 바이트 합산
    if (!document.getElementById('rejectNum').disabled) {
        const rejectNumContent = document.getElementById('rejectNum').value;
        const rejectNumByteLength = getByteLength(rejectNumContent);
        totalByteLength += rejectNumByteLength;
    }

    const hasImg = hasImage();

    if (hasImg) {
        setMsgType(2, totalByteLength); // MMS
    } else if (titleContent.trim() !== '' || totalByteLength > 80) {
        setMsgType(1, totalByteLength); // LMS
    } else {
        setMsgType(0, totalByteLength); // SMS
    }
}

	const rejectNum = document.getElementById('rejectNum')
	MSG_TITLE.addEventListener("input", handleInput); //제목
	MSG_WRITE.addEventListener("input", handleInput); //내용
	rejectNum.addEventListener("input", handleInput); //080 수신거부 번호
	
});


// 숫자만 입력
function onlyNumber(element){
	element.value = element.value.replace(/[^0-9]/g,'');
}


// 요청번호 조회
function reservedSearch(){
	// 로딩바 표시
	showLoading(LOAD_PANEL, "#dbGrid");
	
	const messageType = document.getElementById('messageType').value.trim();
	const companyCode = document.getElementById('large-category').value.trim();
	
    fetch("/api/v1/dbSend/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
			messageType: messageType,
			companyCode: companyCode
		})
    })
    .then(res => res.json())
    .then(data => {
		console.log(data);
		
		const totalCount = data.totalCount;
		
        if (totalCount !== undefined) {
			// 테이블 그리기
			const retData = data.data;
			drawTable("dbGrid", retData);
        } else {
			const message = data.message;
			showDialogCustom(message);
        }
    })
    .catch(err => {
        console.error("요청번호 조회 실패", err);
		showDialogCustom('error');
    })
	.finally(() => {
		// 로딩바 숨김
		hideLoading(LOAD_PANEL);
	});
}


// 요청번호 삭제
function reservedDelete(btn){
	const row = btn.closest("tbody > tr");
	
	const reserved4 = row.getAttribute("data-reserved4");
	const resultCompany = row.getAttribute("data-result-company");
	const resultTable = row.getAttribute("data-result-table");
	
	const confirmDialog = DevExpress.ui.dialog.custom({
		showTitle: false,
		messageHtml: `
		<div style='text-align: center;'>
			요청번호 ${reserved4}<br>
			삭제하시겠습니까?<br>
		</div>`,
		buttons: [{
			text: "삭제",
			type: "default",
			onClick: function(e) {
				fetch("/api/v1/dbSend/delete", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ 
						reserved4: reserved4,
						resultCompany: resultCompany,
						resultTable: resultTable
					})
				})
				.then(res => res.json())
				.then(data => {
					console.log(data);
					
					const status = data.status;
					
					if (status == "success") {
						//재조회
						reservedSearch();
					} else {
						const message = data.message;
						showDialogCustom(message);
					}
				})
				.catch(err => {
					console.error("요청번호 삭제 실패", err);
					showDialogCustom('error');
				});
				return { result: "ok" };
			}
		}, {
			text: "취소",
			onClick: function(e) {
				return { result: "cancel" };
			}
		}]
	});

	confirmDialog.show().done(function(dialogResult) {
		if (dialogResult.result === "ok") {
			console.log("삭제 완료");
		} else {
			console.log("취소");
		}
	});

}


// 문자 발송
function sendMessage(){
	const reserved4 = document.getElementById('reserved4');
	// 유효성 검사
	if(reserved4.value === "미지정" || reserved4.value === ""){
		 showDialogCustom('요청번호를 조회하여 지정해 주세요.');
		 return;
	}
	if (		
		!inputValidateRequired("tranCallback", "회신번호를 입력하세요.") ||
		!inputValidateRequired("userId", "사용자ID를 입력하세요.") ||
		!inputValidateRequired("msgWrite", "내용을 입력하세요.") ||
		!inputValidateRequired("sendInfo", "전송대상을 입력하세요.")
	) {
		return;
	}
	
	const confirmDialog = DevExpress.ui.dialog.custom({
		showTitle: false,
		messageHtml: "<div style='text-align: center;'>발송하시겠습니까?</div>",
		buttons: [{
			text: "발송",
			type: "default",
			onClick: function(e) {
				// 발송 로직 실행
				
	
				
				return { result: "ok" };
			}
		}, {
			text: "취소",
			onClick: function(e) {
				return { result: "cancel" };
			}
		}]
	});

	confirmDialog.show().done(function(dialogResult) {
		if (dialogResult.result === "ok") {
			console.log("발송 완료");
		} else {
			console.log("취소");
		}
	});
}


// 실패 시 초기화
function resetTextGrid(input) {
	// 업로드 input 초기화
	if (input) input.value = "";
	
	// 그리드 초기화
	const textGrid = document.getElementById("textGrid");
	if (textGrid) {
		textGrid.style.height = "auto";
		const tbody = textGrid.querySelector("table tbody");
		if (tbody) {
			tbody.innerHTML = `
				<tr class="no-data">
					<td class="py-3" colspan="2">파일을 선택해주세요.</td>
				</tr>
			`;
		}
	}
	
	// count 초기화
	const directInputNum = document.querySelector("span.direct_input_num");
	if (directInputNum) {
		directInputNum.textContent = "0";
	}
}


// 가상 스크롤 렌더링 함수
function renderVisibleRows(container, tbody, spacer, dataRow, rowHeight, visibleRows) {
	const rowLength = dataRow.length;
	const scrollTop = container.scrollTop;
	const startRow = Math.floor(scrollTop / rowHeight);
	const endRow = Math.min(startRow + visibleRows + 5, rowLength);
	
	// spacer 높이 = 전체 행 크기
	// spacer.style.height = `${rowLength * rowHeight}px`;
	spacer.style.height = `${rowLength * rowHeight + 40}px`; // 헤더 포함
	
	// tbody 클리어
	while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
	
	// fragment로 필요한 행만 렌더링
	const fragment = document.createDocumentFragment();
	for (let i = startRow; i < endRow; i++) {
		const tr = document.createElement("tr");
		
		// tr에 data-* 속성 지정
		tr.setAttribute('data-result-company', dataRow[i]?.resultCompany ?? ""); // 조회된 대분류
		tr.setAttribute('data-result-table', dataRow[i]?.resultTable ?? ""); // 조회된 테이블명
		tr.setAttribute("data-reserved4", dataRow[i]?.reserved4 ?? ""); // 요청번호
		tr.setAttribute("data-tran-pr", dataRow[i]?.tranPr ?? ""); // 구분
		tr.setAttribute("data-count", dataRow[i]?.cnt ?? ""); // 총건수
		
		// NO(요청번호)
		const tdIdx = document.createElement("td");
		tdIdx.textContent = dataRow[i]?.reserved4 ?? "";
		tr.appendChild(tdIdx);
		
		// 구분
		const tdVal = document.createElement("td");
		tdVal.textContent = dataRow[i]?.tranPr ?? "";
		tr.appendChild(tdVal);
		
		// 총건수
		const tdCnt = document.createElement("td");
		tdCnt.textContent = dataRow[i]?.cnt ?? "";
		tr.appendChild(tdCnt);
		
		// 지정
		const tdSelect = document.createElement("td");
		tdSelect.innerHTML = `
			<button type="button" class="numSelectBtn" onclick="selectBtn(this)">
				<i class="dx-icon-check"></i>
				<span class="visually-hidden">지정</span>
			</button>`;
		tr.appendChild(tdSelect);
		
		//삭제
		const tdDel = document.createElement("td");
		tdDel.innerHTML = `
			<button type="button" class="numDelBtn" onclick="reservedDelete(this)">
				<i class="dx-icon-close"></i>
				<span class="visually-hidden">삭제</span>
			</button>
		`;
		tr.appendChild(tdDel);
		
		fragment.appendChild(tr);
	}
	tbody.appendChild(fragment);
	
	// translateY로 위치 조정
	tbody.style.transform = `translateY(${startRow * rowHeight}px)`;
}


// 테이블 그리기
function drawTable(containerId, data){
	const container = document.getElementById(containerId);
	const table = container.querySelector("table");
	const spacer = container.querySelector(".spacer");
	
	if (!data || data.length === 0) {
		spacer.style.height = `auto`;
		const tbody = table.querySelector("tbody");
		tbody.innerHTML = ""; // 기존 행 제거
		
		const tr = document.createElement("tr");
		tr.classList.add("no-data");
		
		const td = document.createElement("td");
		td.className = "py-3 text-center";
		td.colSpan = 5;
		td.textContent = "조회된 데이터가 없습니다.";
		
		tr.appendChild(td);
		tbody.appendChild(tr);
		
		// 건수 표시 0
		document.querySelector("span.search_num").textContent = "0";
		
		//미지정
		const reserved4 = document.getElementById("reserved4");
		reserved4.value = '미지정';
		return;
	};
	
	const rowLength = data.length;
	
	// 건수 표시
	document.querySelector('span.search_num').textContent = rowLength.toLocaleString();
	
	// 요청번호 목록 표시
	const tbody = table.querySelector("tbody");
	tbody.innerHTML = ""; // 기존 내용 제거
	
	// 가상 스크롤 설정
	let rowHeight = 40; // 기본 행 높이(px)
	const visibleRows = Math.ceil(500 / rowHeight); // 500px 영역에 몇개 보일지 계산
	
	// 스크롤 이벤트 핸들러 등록
	container.removeEventListener('scroll', container._scrollHandler);
	container._scrollHandler = () => renderVisibleRows(container, tbody, spacer, data, rowHeight, visibleRows);
	container.addEventListener('scroll', container._scrollHandler);
	
	// 초기 렌더링
	container.scrollTop = 0;
	renderVisibleRows(container, tbody, spacer, data, rowHeight, visibleRows);
}


//요청번호 지정
function selectBtn(btn){
	const row = btn.closest("tbody > tr");
	const reserved4Value = row.querySelector("td").textContent;
	const reserved4 = document.getElementById("reserved4");
	reserved4.value = reserved4Value.trim();
}

