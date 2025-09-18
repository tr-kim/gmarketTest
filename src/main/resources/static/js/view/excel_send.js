let LOAD_PANEL;
let EXCEL_FILE_NAME = "";
let IMAGE_FILE_NAME = new Array();
let MAX_ROWS = 0;

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
	
	
	//내용 옵션(이미지, 변수선택, 특수문자)
	const optabButtons = document.querySelectorAll('.option_tab li button');
	const optabs = document.querySelectorAll('.option_tab li');
	const options = document.querySelectorAll('.option_wrap');
	
	optabButtons.forEach((button, index) => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			// .tab li에 on 클래스 조정
			optabs.forEach((li, liIdx) => {
				if (liIdx === index) {
					li.classList.add('on');
				} else {
					li.classList.remove('on');
				}
			});
			
			options.forEach((wrap, wrapIdx) => {
				if (wrapIdx === index) {
					wrap.classList.add('d-block');
				} else {
					wrap.classList.remove('d-block');
				}
			});
		});
	});

	// 이미지 등록
	$('#file-uploader').dxFileUploader({
		multiple: true,
		allowedFileExtensions: ['.jpg'],
		maxFileSize: 100 * 1024,
		uploadMode: 'useButtons',
		uploadMethod: 'POST',
		uploadUrl: '/files/upload/fileUpload',   
		uploadCustomData: {                   
			sendType: 'EXCEL'
		},
		onValueChanged(e) {
			const maxFiles = 2;

			if (e.value.length > maxFiles) {
				const limitedFiles = e.value.slice(0, maxFiles);
				e.component.reset();
				e.component.option('value', limitedFiles);
				IMAGE_FILE_NAME = new Array(); 	// 이미지 이름 저장 목록 초기화
				showDialogCustom(`이미지는 최대 ${maxFiles}개까지만 업로드할 수 있습니다.`);
			}
		},
		onUploadStarted(e) {
			const files = e.component.option('value');
			e.component.option("uploadCustomData", {
				imgNumFlag: files.length,
				fileName1: files[0]?.name || '',
				fileName2: files[1]?.name || '',
				sendType: 'EXCEL'
			});
			console.log("Upload started, data:", e.component.option("uploadCustomData"));
		},
		onUploaded(e) {
			// console.log('Uploaded', e);
			
	        // JSON 응답 처리
	        try {
				
				// XMLHttpRequest 객체
				let xhr = e.request;
	            let json = JSON.parse(xhr.responseText);
				
				IMAGE_FILE_NAME.push(json.fileName);
				console.log("IMAGE_FILE_NAME : ", IMAGE_FILE_NAME);
				
	        } catch (err) {
	            console.warn("Not a JSON response:", xhr.responseText);
	        }
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
		document.querySelector('.reserveSend .date').textContent = reserveDate;
	}
	
	//예약 발송 모달 열기,닫기
	const reserveModal = document.querySelector('.reserveSend');
	const selects = document.querySelectorAll('.reserveSend select');
	const reserveHour = document.getElementById('hour');
	const reserveMinute = document.getElementById('minute');
    const reserveDateLi = document.querySelector('.reserveDateLi');
	
	document.getElementById('send_time1').addEventListener('change',function(){
		if (this.checked) {
			document.getElementById('reserveDate').textContent = "";
			FINAL_SEND_BTN.textContent = "즉시발송";

            if(!reserveDateLi.classList.contains('d-none')) {
                reserveDateLi.classList.add('d-none');
            }
		}
	});
	
	document.getElementById('send_time2').addEventListener('click', function () {
		if (this.checked) {
			reserveModal.classList.add("d-block");			
			FINAL_SEND_BTN.textContent = "예약발송";

             if(reserveDateLi.classList.contains('d-none')) {
                reserveDateLi.classList.remove('d-none');
            }
		}
	});
	
	document.querySelector('.reserveSend .close_btn').addEventListener('click', function(){
		reserveModal.classList.remove("d-block");
		
		document.getElementById('send_time1').checked = true;
		document.getElementById('reserveDate').textContent = "";
		FINAL_SEND_BTN.textContent = "즉시발송";

        if(!reserveDateLi.classList.contains('d-none')) {
            reserveDateLi.classList.add('d-none');
        }
		
		//document.querySelector('.date').textContent = '날짜를 선택해 주세요.';
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
	
	//분할전송 사용, 미사용	
    const splitSendUse = document.getElementById('splitSendUse');
    const splitMinute = document.getElementById('splitMinute');
    const splitNum = document.getElementById('splitNum');

	document.getElementById('split_send1').addEventListener('change',function(){
		if (this.checked) {			
            splitMinute.disabled = true;
            splitNum.disabled = true;
            if(!splitSendUse.classList.contains('disabled')) {
                splitSendUse.classList.add('disabled');
            }
		}
	});
	
	document.getElementById('split_send2').addEventListener('click', function () {
		if (this.checked) {
            splitMinute.disabled = false;
            splitNum.disabled = false;
			if(splitSendUse.classList.contains('disabled')) {
                splitSendUse.classList.remove('disabled');
            }
		}
	});

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

	//전송범위설정
	document.getElementById('tranCheckDefault').addEventListener('change', function () {
		const input1 = document.getElementById('tranRangeStart');
        const input2 = document.getElementById('tranRangeEnd');
		input1.disabled = !this.checked;
        input2.disabled = !this.checked;
	});	

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
	document.getElementById('titleByte').value = titleByteLength;
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
	// function handleInput() {
	// 	const titleContent = MSG_TITLE.value;
	// 	const titleByteLength = getByteLength(titleContent);
		
	// 	const writeContent = MSG_WRITE.value;
	// 	const writeByteLength = getByteLength(writeContent);
		
	// 	const hasImg = hasImage();
		
	// 	//console.log("hasImage():", hasImg);
	// 	//console.log("title:", titleContent.trim(), "| byte:", writeByteLength);
		
	// 	if (hasImg) {
	// 		setMsgType(2, writeByteLength); //MMS
			
	// 	} else if (titleContent.trim() !== '' || writeByteLength > 80) {
	// 		setMsgType(1, writeByteLength); //LMS
			
	// 	} else {
	// 		setMsgType(0, writeByteLength); //SMS
	// 	}
	// }

	const rejectNum = document.getElementById('rejectNum')
	MSG_TITLE.addEventListener("input", handleInput); //제목
	MSG_WRITE.addEventListener("input", handleInput); //내용
	rejectNum.addEventListener("input", handleInput); //080 수신거부 번호
	
	
	//커서 위치에 특수문자 삽입
	function insertAtCursor(textarea, text){
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const before = textarea.value.substring(0, start);
		const after = textarea.value.substring(end);
		
		textarea.value = before + text + after;
		textarea.selectionStart = textarea.selectionEnd = start + text.length;
		textarea.focus();
	}
	
	
	//특수문자
	document.querySelectorAll('#unicode li').forEach(span => {
		span.addEventListener('click', function () {
			if(MSG_WRITE) {
				insertAtCursor(MSG_WRITE, this.querySelector('span').textContent);
				MSG_WRITE.dispatchEvent(new Event('input')); //byte 체크 등 다른 input 이벤트
			}
		});
	});
	
	
	//변수추가
	document.querySelector('#tag').addEventListener('click', (e) => {
		if (e.target.tagName === 'BUTTON') {
			if (MSG_WRITE) {
				insertAtCursor(MSG_WRITE, `[%${e.target.textContent}%]`);
				MSG_WRITE.dispatchEvent(new Event('input'));
			}
		}
	});
	// document.querySelectorAll('#tag li button').forEach((btn, idx)=>{
	// 	btn.addEventListener('click',() => {
	// 		if(MSG_WRITE) {
	// 			insertAtCursor(MSG_WRITE, btn.textContent);
	// 			MSG_WRITE.dispatchEvent(new Event('input'));
	// 		}
	// 	})
	// });
	document.querySelector('.confirmSend .close_btn').addEventListener('click', function(){
		document.querySelector('.confirmSend').classList.remove('d-block');
	})
});

// 문자 발송
function sendMessage() {
	
	if(userExcelUse == "N" || userExcelUse == null || userExcelUse == "") {
		showDialogCustom("현재 계정은 엑셀 발송이 제한되어 있습니다. 자세한 내용은 관리자에게 문의하세요.");
		return;
	}
	
	// 파일 검사
	if (!excelValidateRequired()) return;
	
	// 유효성 검사
	if (!inputValidateRequired("sheet", "시트를 선택하세요.")) return; 
	
	// 엑셀 그리드
	const firstTh = document.querySelector('#excelGrid thead th:first-child');
	if (firstTh && firstTh.textContent.trim() !== "발신번호") {
		const message = '발신번호, 수신번호 설정 후<br>[지정] 버튼을 누르세요.';
		showDialogCustom(message, function (){
			document.getElementById("tranCallback").focus();
		});
		return;
	}
	
	// 메시지 그리드
	if(document.querySelector('#msgGrid tr.no-data')){
		const message = '내용 입력 후<br>[메시지 작성] 버튼을 누르세요.';
		showDialogCustom(message, function (){
			document.getElementById("msgWrite").focus();
		});
		return;
	};
	
	if (!inputValidateRequired("userId", "사용자ID를 입력하세요.") || !inputValidateRequired("sendInfo", "전송대상을 입력하세요.")) return;
	
	// 수신거부
	if(document.getElementById('rejectCheckDefault').checked 
	&& document.getElementById('rejectNum').value == ""){
		const message = '수신거부 번호를 입력하세요.';
		showDialogCustom(message, function (){
			document.getElementById("rejectNum").focus();
		});
		return;
	};
	
	// 전송범위
	let tranRangeStart = document.getElementById('tranRangeStart').value;
	let tranRangeEnd = document.getElementById('tranRangeEnd').value;
	
	if(document.getElementById('tranCheckDefault').checked) {
		if(tranRangeStart == "" && tranRangeEnd == "") {
			const message = '전송범위를 입력하세요.';
			showDialogCustom(message, function (){
				document.getElementById("tranRangeStart").focus();
			});
			return;
		} else if(Number(tranRangeStart) == 0 || Number(tranRangeEnd) == 0) {
			const message = '전송범위는 최소 1행부터 시작됩니다.';
			showDialogCustom(message, function() {
				if(tranRangeStart == 0) {
					document.getElementById("tranRangeStart").focus();
				} else if(tranRangeEnd == 0) {
					document.getElementById("tranRangeEnd").focus();
				}
			});
			
			return;
		} else if(Number(tranRangeStart) > Number(tranRangeEnd)) {
			const message = '전송시작 범위가 잘못 입력되었습니다.';
			showDialogCustom(message, function() {
				document.getElementById("tranRangeStart").focus();
			});
			
			return;
		} else if(Number(MAX_ROWS) < Number(tranRangeEnd)) {
			const message = '전송범위를 초과하였습니다.';
			showDialogCustom(message, function() {
				document.getElementById("tranRangeEnd").focus();
			});
			
			return;
		}
	}
	
	// 메시지 내용 전송
	const func_send = function() {
		
		// 메시지 유형 XXX
		const msgTypeValue = document.querySelector('.msg_type').textContent.trim();
		if(msgTypeValue == "MMS") {
			showDialogCustom("MMS 개발 진행 중입니다.");
			return;
		}
		
		// 시트
		const sheet = document.getElementById("sheet").value;
		
		// 발신번호
		const callbackSelect = document.getElementById("callbackSelect").value;
		const tranCallback = document.getElementById("tranCallback").value.trim();
		
		// 수신번호
		const calleeSelect = document.getElementById("calleeSelect").value;
		const tranCallee = document.getElementById("tranCallee").value.trim();
		
		// 대분류
		const largeCategory = document.getElementById("large-category").value;
		
		// XXX
		if(largeCategory == 0) {
			showDialogCustom("Auction 개발 진행 중입니다.");
			return;
		}
		
		// 사용자 아이디
		const userId = document.getElementById("userId").value.trim();
		
		// 메시지 제목
		const msgTitle = document.getElementById("msgTitle").value.trim();
		
		// 메시지 유형
		const msgType = msgTypeValue === "SMS" ? 'sms' : msgTypeValue === "LMS" ? 'lms' : 'mms';
		
		// 메시지 내용
		const msgWrite = document.getElementById('msgWrite').value.trim();
		
		// 전송대상
		const sendInfo = document.getElementById('sendInfo').value.trim();
		
		// SMS 수신여부
		const reserved = document.getElementById('reserved3').value;
		
		// 수신거부
		const rejectCheckDefault = document.getElementById('rejectCheckDefault').checked;
		const rejectNum = document.getElementById('rejectNum').value.trim();
		
		// 발송시간
		const sendTimeChkValue = $("input[name='send_time']:checked").val();
		const sendTime = parseReservationTime(document.getElementById('reserveDate').textContent);
		
		// 분할전송
		const splitSendChkValue = $("input[name='split_send']:checked").val();
		const splitMinute = document.getElementById('splitMinute').value;
		const splitNum = document.getElementById('splitNum').value;
		
		// 전송 범위 설정
		const tranCheckDefault = document.getElementById('tranCheckDefault').checked;
		const tranRangeStart = document.getElementById('tranRangeStart').value;
		const tranRangeEnd = document.getElementById('tranRangeEnd').value;
		
		const formData = new FormData();
		formData.append("excelFileName", EXCEL_FILE_NAME);												// 엑셀 파일 이름
		formData.append("sheet", sheet);																// 시트 이름
		formData.append("callbackSelect", callbackSelect === "직접입력" ? 0 : 1);							// 발신 번호 유형 0: 직접입력, 1: 시트 선택
		formData.append("callback", callbackSelect === "직접입력" ? tranCallback : callbackSelect);		// 발신 번호
		formData.append("calleeSelect", calleeSelect === "직접입력" ? 0 : 1);								// 수신 번호 유형 0: 직접입력, 1: 시트 선택
		formData.append("callee", calleeSelect === "직접입력" ? tranCallee : calleeSelect);				// 수신 번호
		formData.append("largeCategory", largeCategory);												// 대분류 0: 옥션, 1: 지마켓
		formData.append("userId", userId);																// 사용자 아이디
		formData.append("msgTitle", msgTitle);															// 메시지 제목 LMS, MMS만 적용
		formData.append("msgType", msgType);															// 메시지 유형 SMS, LMS, MMS
		formData.append("msgWrite", msgWrite);															// 메시지 내용
		formData.append("sendInfo", sendInfo);															// 전송 대상
		formData.append("reserved", reserved);															// SMS 수신 여부 확인 0: 확인, 1: 미확인
		formData.append("timeType", sendTimeChkValue);													// 발송 시간 확인 0: 즉시, 1: 예약
		formData.append("splitSend", splitSendChkValue);												// 분할 전송 확인 N: 미사용, Y: 사용
		formData.append("tranCheckDefault", tranCheckDefault);											// 전송 범위 확인 true, false
		formData.append("rejectCheckDefault", rejectCheckDefault);										// 080 수신거부 번호 확인 true, false 
		
		// 수신번호 체크한 경우
		if(rejectCheckDefault) formData.append("rejectNum", rejectNum);									// 수신거부 번호
		
		// 발송 시간 - 예약인 경우
		if(sendTimeChkValue === '1') formData.append("sendTime", sendTime);								// 예약 시간
		
		// 분할 전송 체크한 경우
		if(splitSendChkValue === 'Y') { 
			formData.append("splitMinute", splitMinute);												// 분할 전송 분
			formData.append("splitNum", splitNum);														// 분한 전송 건수
		}
		
		// 전송 범위 체크한 경우
		if(tranCheckDefault) { 
			formData.append("tranRangeStart", tranRangeStart);											// 전송 범위 최솟값
			formData.append("tranRangeEnd", tranRangeEnd); 												// 전송 번위 최댓값
		}
		
		// 이미지 파일 이름
		if(msgType == "mms" && IMAGE_FILE_NAME.length > 0) {
			if(IMAGE_FILE_NAME.length == 1) {
				formData.append("imageName01", IMAGE_FILE_NAME[0]);
			} else if(IMAGE_FILE_NAME.length == 2) {
				formData.append("imageName01", IMAGE_FILE_NAME[1]);
				formData.append("imageName02", IMAGE_FILE_NAME[2]);
			}
		}
		
		fetch("/api/v1/excelSend/insert", {
			method: "POST",
			body: formData
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			
			const code = data.code;
			const result = data.result;
			
			if(code == 1000) uploadStatusCheck(result);
			else showDialogCustom(result);
		})
		.catch(err => {
			console.error("엑셀 발송 실패:", err);
			showDialogCustom('error');
		})
		.finally(() => {
		});
	} 
	
	// 메시지확인 다이얼로
	DevExpress.ui.dialog.custom({
		showTitle: false,
		messageHtml: "<div style='text-align: center;'>미리보기 화면을 보시겠습니까?</div>",
		buttons: [
			{ text: "확인", onClick: () => "ok" },
			{ text: "취소", onClick: () => "cancel"}
		]
	}).show().done(function(dialogResult) {
		if (dialogResult === "ok") {
			
			//메시지 확인팝업창
			const confirmSend = document.querySelector('.confirmSend');
			const confirmMessage = document.getElementById('confirmMessage');	
			confirmSend.classList.add('d-block');
			
			const rejectCheckDefault = document.getElementById('rejectCheckDefault').checked;
			const rejectNum = document.getElementById('rejectNum').value.trim();
			const msgWrite = document.getElementById('msgWrite').value.trim();
			confirmMessage.textContent = rejectCheckDefault ? msgWrite + rejectNum : msgWrite;
			
			confirmSend.querySelector('.send_btn').addEventListener('click', function() {
				confirmSend.classList.remove('d-block');
				func_send(); // 메시지 보내기
			}, { once: true });
			
		} else {
			console.log("메시지 확인취소");
			
			DevExpress.ui.dialog.custom({
				showTitle: false,
				messageHtml: "<div style='text-align: center;'>발송하시겠습니까?</div>",
				buttons: [
					{ text: "발송", onClick: () => "ok" },
					{ text: "취소", onClick: () => "cancel"}
				]
			}).show().done(function(dialogResult) {
				if (dialogResult === "ok") {
					func_send(); // 메시지 보내기
				} else {
					console.log("취소");
				}
			});
		}
	});
}

// 엑셀 발송 상태 체크(프로그레스 바)
function uploadStatusCheck(jobId) {
	const interval = setInterval(() => {
        fetch(`/api/v1/excelSend/uploadStatus/${jobId}`)
            .then(response => response.json())
            .then(data => {
				// console.log(data);
				
				// 에러 처리
				if(data.progress == -1) {
					clearInterval(interval);
					showDialogCustom("엑셀 발송 도중 에러가 발생하였습니다.", function() {
						document.querySelector('.progressBar').classList.replace('d-block', 'd-none');
					});
				}
				
				PROCESS_TOTAL = data.total;
				PROCESSED = data.current; 
				
				processData();
                
				// 상태 체크 중지
                if (data.complete || PROCESSED >= PROCESS_TOTAL) {
					clearInterval(interval);
					showDialogCustom("엑셀 발송이 완료되었습니다.", function() {
						uploadStatuRemove(jobId);
						location.reload(true);	// 페이지 새로고침
					});
					
                }
			}).catch(err => {
				console.error("엑셀 발송 상태 체크:", err);
				clearInterval(interval);
				showDialogCustom("엑셀 발송 도중 에러가 발생하였습니다.", function() {
					document.querySelector('.progressBar').classList.replace('d-block', 'd-none');
				});
				
			});
    }, 1000); // 1초마다 체크
}

// 엑셀 발송 상태 삭제
function uploadStatuRemove(jobId) {
	fetch(`/api/v1/excelSend/uploadStatus/delete/${jobId}`)
    .then(response => response.json())
    .then(data => {
		console.log(data);
	}).catch(err => {
		console.error("엑셀 발송 상태 삭제:", err);
	});
}

// 엑셀 파일 업로드
function excelFileUpload(input) {
	const file = input.files[0];
	if (!file) return;
	
	// 로딩바 표시
	showLoading(LOAD_PANEL, "#excelGrid");
	
	const formData = new FormData();
	formData.append("file", file);
	
	fetch("/api/v1/excelSend/fileUpload", {
		method: "POST",
		body: formData
	})
	.then(res => res.json())
	.then(data => {
		console.log(data);
		
		const status = data.status;
		
		if(status == "success"){
			const retData = data.retData;
			EXCEL_FILE_NAME = retData.excelFile;
			
			// 시트 목록 추가
			const sheet = document.getElementById('sheet');
			sheet.innerHTML = ""; // 기존 내용 제거
			
			const defaultOpt = document.createElement('option');
			defaultOpt.value = "";
			defaultOpt.textContent = "시트를 선택해주세요.";
			sheet.appendChild(defaultOpt);
			
			retData.sheetName.forEach(option => {
				const opt = document.createElement('option');
				opt.value = option;
				opt.textContent = option;
				sheet.appendChild(opt);
			});
		}else{
			const message = data.message;
			showDialogCustom(message);
			resetExcelGrid(input);
		}
	})
	.catch(err => {
		console.error("파일 업로드 실패", err);
		showDialogCustom('error');
		resetExcelGrid(input);
	})
	.finally(() => {
		// 로딩바 숨김
		hideLoading(LOAD_PANEL);
	});
}


// 엑셀 시트 읽기
function excelReadSheet(option) {
	const sheetName = option.value;
	if (!sheetName) return;
	
	// 파일 검사
	if (!excelValidateRequired()) {
		return;
	}
	
	// 로딩바 표시
	showLoading(LOAD_PANEL, "#excelGrid");
	
	const params = new URLSearchParams();
	params.append("excelFile", EXCEL_FILE_NAME);
	params.append("sheetName", sheetName);
	
	fetch("/api/v1/excelSend/readSheet", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params.toString()
	})
	.then(res => res.json())
	.then(data => {
		console.log(data);
		
		const status = data.status;
		
		if(status == "success"){
			// 테이블 그리기
			const retData = data.retData;
			drawTable("excelGrid", retData, "Y");
		
			// 엑셀 ROW 수 저장 헤더 부분 제외
			MAX_ROWS = retData.length - 1;
		}else{
			const message = data.message;
			showDialogCustom(message);
		}
	})
	.catch(err => {
		console.error("시트 읽기 실패:", err);
		showDialogCustom('error');
	})
	.finally(() => {
		// 로딩바 숨김
		hideLoading(LOAD_PANEL);
	});
}


// 발신번호, 수신번호 지정
function reserve() {
	// 파일 검사
	if (!excelValidateRequired()) {
		return;
	}
	
	// 발신번호
	const callbackSelect = document.getElementById("callbackSelect").value;
	const callbackInput = document.getElementById("tranCallback").value.trim();
	const callbackFlag = callbackSelect === "직접입력" ? 1 : 2;

	// 수신번호
	const calleeSelect = document.getElementById("calleeSelect").value;
	const calleeInput = document.getElementById("tranCallee").value.trim();
	const calleeFlag = calleeSelect === "직접입력" ? 1 : 2;
	
	// 발신번호 검증
	if (callbackSelect === "직접입력" && callbackInput === "") {
		const message = '발신번호를 입력하세요.';
		showDialogCustom(message, function (){
			document.getElementById("tranCallback").focus();
		});
		return;
		
	} else if (callbackSelect !== "직접입력" && callbackInput !== "") {
		const message = '직접입력이 아닐 경우<br>발신번호를 입력할 수 없습니다.';
		showDialogCustom(message, function (){
			document.getElementById("tranCallback").value = "";
		});
		return;
	}
	
	// 수신번호 검증
	if (calleeSelect === "직접입력" && calleeInput === "") {
		const message = '수신번호를 입력하세요.';
		showDialogCustom(message, function (){
			document.getElementById("tranCallee").focus();
		});
		return;
		
	} else if (calleeSelect !== "직접입력" && calleeInput !== "") {
		const message = '직접입력이 아닐 경우<br>수신번호를 입력할 수 없습니다.';
		showDialogCustom(message, function (){
			document.getElementById("tranCallee").value = "";
		});
		return;
	}
	
	// 로딩바 표시
	showLoading(LOAD_PANEL, "#excelGrid");
	
	const sheetName = document.getElementById("sheet").value;
	
	const params = new URLSearchParams();
	params.append("excelFile", EXCEL_FILE_NAME);
	params.append("sheetName", sheetName);
	//발신번호
	params.append("callbackFlag", callbackFlag);
	params.append("callbackRow", callbackSelect);
	params.append("tranCallback", callbackInput);
	//수신번호
	params.append("calleeFlag", calleeFlag);
	params.append("calleeRow", calleeSelect);
	params.append("tranCallee", calleeInput);
	
	fetch("/api/v1/excelSend/reserve", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params.toString()
	})
	.then(res => res.json())
	.then(data => {
		console.log(data);
		
		const status = data.status;
		
		if(status == "success"){
			// 테이블 그리기
			const retData = data.retData;
			drawTable("excelGrid", retData, "N");
		}else{
			const message = data.message;
			showDialogCustom(message);
		}
	})
	.catch(err => {
		console.error("번호 지정 실패:", err);
		showDialogCustom('error');
	})
	.finally(() => {
		// 로딩바 숨김
		hideLoading(LOAD_PANEL);
	});
}


// 메시지 작성
function createSendData() {
	// 파일 검사
	if (!excelValidateRequired()) {
		return;
	}
	
	const sheetName = document.getElementById("sheet").value;
	
	const MSG_TITLE = document.getElementById('msgTitle').value.trim();
	const MSG_WRITE = document.getElementById('msgWrite').value.trim();
	const msg_type_value = document.querySelector('.msg_type').textContent.trim();
	const MSG_TYPES = msg_type_value === "SMS" ? 'sms' : msg_type_value === "LMS" ? 'lms' : 'mms';
	const rejectCheckDefault = document.getElementById('rejectCheckDefault');
	const rejectNum = document.getElementById('rejectNum');

	//수신번호 체크 시
	let message = MSG_WRITE;
	if(rejectCheckDefault.checked && !rejectNum.disabled && rejectNum.value){
		message += rejectNum.value;
	}
	
	const params = new URLSearchParams();
	params.append("excelFile", EXCEL_FILE_NAME);
	params.append("sheetName", sheetName);
	params.append("title", MSG_TITLE);
	params.append("message", message);
	params.append("messageType", MSG_TYPES);
	params.append("callbackFlag", document.getElementById("callbackSelect").value === "직접입력" ? 1 : 2);
	params.append("callbackRow", document.getElementById("callbackSelect").value);
	params.append("tranCallback", document.getElementById("tranCallback").value.trim());
	params.append("calleeFlag", document.getElementById("calleeSelect").value === "직접입력" ? 1 : 2);
	params.append("calleeRow", document.getElementById("calleeSelect").value);
	params.append("tranCallee", document.getElementById("tranCallee").value.trim());
	
	// 수신거부 체크 안됐을 때만 다이얼로그 띄우고,
	// 확인 시 fetch 실행, 취소 시 중단
	if (!rejectCheckDefault.checked) {
		DevExpress.ui.dialog.custom({
			showTitle: false,
			messageHtml: "<div style='text-align: center;' class='pt-3'>수신거부가 체크되어 있지 않습니다.<br>이대로 진행하시겠습니까?</div>",
			buttons: [
				{
					text: "확인",
					type: "default",
					onClick: function () {
						return { result: "ok" };
					}
				},
				{
					text: "취소",
					onClick: function () {
						return { result: "cancel" };
					}
				}
			]
		}).show().done(function (dialogResult) {
			if (dialogResult.result === "ok") {
				sendRequest(params);
			}
			// cancel이면 그냥 return (아무것도 안 함)
		});
	} else {
		// 이미 체크돼있으면 바로 실행
		sendRequest(params);
	}
}

// 실제 fetch 부분
function sendRequest(params) {
	// 로딩바 표시
	showLoading(LOAD_PANEL, "#msgGrid");
	
	fetch("/api/v1/excelSend/createSendData", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params.toString()
	})
	.then(res => res.json())
	.then(data => {
		console.log(data);

		const status = data.status;

		if (status == "success") {
			// 테이블 그리기
			const retData = data.retData;
			drawTable("msgGrid", retData, "N");
		} else {
			const message = data.message;
			showDialogCustom(message);
		}
	})
	.catch(err => {
		console.error("메시지 작성 실패:", err);
		showDialogCustom('error');
	})
	.finally(() => {
		// 로딩바 숨김
		hideLoading(LOAD_PANEL);
	});
}


// 실패 시 초기화
function resetExcelGrid(input) {
	// 업로드 input 초기화
	if (input) input.value = "";
	
	// 그리드 초기화
	const excelGrid = document.getElementById("excelGrid");
	if (excelGrid) {
		excelGrid.style.height = "auto";
		const tbody = excelGrid.querySelector("table tbody");
		if (tbody) {
			tbody.innerHTML = `
				<tr class="no-data">
					<td class="py-3" colspan="3">파일을 선택해주세요.</td>
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
		dataRow[i].forEach(cell => {
			const td = document.createElement("td");
			td.textContent = decodeHtmlEntities(cell) ?? "";
			// td.style.whiteSpace = 'pre-line'; // 줄바꿈
			tr.appendChild(td);
		});
		fragment.appendChild(tr);
	}
	tbody.appendChild(fragment);
	
	// translateY로 위치 조정
	tbody.style.transform = `translateY(${startRow * rowHeight}px)`;
}


// 테이블 그리기
function drawTable(containerId, data, init) {
	const container = document.getElementById(containerId);
	const table = container.querySelector("table");
	const spacer = container.querySelector(".spacer");
		
	if (!data || data.length === 0) return;
	
	const headerRow = data[0]; // 첫 번째 행은 열번호
	const dataRow = data.slice(1); // 나머지 행은 데이터
	
	// thead 그리기
	const thead = table.querySelector("thead");
	thead.innerHTML = ""; // 기존 내용 제거
	
	const headtr = document.createElement("tr");
	headerRow.forEach(text => {
		const th = document.createElement("th");
		th.textContent = text;
		headtr.appendChild(th);
	});
	thead.appendChild(headtr);
	
	// tbody 초기화
	const tbody = table.querySelector("tbody");
	tbody.innerHTML = ""; // 기존 내용 제거
	
	// 가상 스크롤 전
	/*dataRow.forEach(rowData => {
		const datatr = document.createElement("tr");
		rowData.forEach(text => {
			const td = document.createElement("td");
			td.textContent = text;
			datatr.appendChild(td);
		});
		tbody.appendChild(datatr);
	});*/
	
	// 가상 스크롤 설정
	const rowHeight = 40; // 기본 행 높이(px)
	const visibleRows = Math.ceil(500 / rowHeight); // 500px 영역에 몇개 보일지 계산
	
	// 스크롤 이벤트 핸들러 등록
	container.removeEventListener('scroll', container._scrollHandler);
	container._scrollHandler = () => renderVisibleRows(container, tbody, spacer, dataRow, rowHeight, visibleRows);
	container.addEventListener('scroll', container._scrollHandler);
	
	// 초기 렌더링
	container.scrollTop = 0;
	renderVisibleRows(container, tbody, spacer, dataRow, rowHeight, visibleRows);
	
	// 초기 로드 시 열번호 할당
	if (init === "Y") {
		// 발신번호
		const callbackSelect = document.getElementById('callbackSelect');
		callbackSelect.innerHTML = "";
		const tranCallbackOpt = document.createElement('option');
		tranCallbackOpt.value = "직접입력";
		tranCallbackOpt.textContent = "직접입력";
		callbackSelect.appendChild(tranCallbackOpt);
		
		// 수신번호
		const calleeSelect = document.getElementById('calleeSelect');
		calleeSelect.innerHTML = "";
		const tranCalleeOpt = document.createElement('option');
		tranCalleeOpt.value = "직접입력";
		tranCalleeOpt.textContent = "직접입력";
		calleeSelect.appendChild(tranCalleeOpt);
		
		// 변수선택
		const tagLi = document.querySelector('#tag ul');
		tagLi.innerHTML = "";
		
		headerRow.forEach(option => {
			const opt = document.createElement('option');
			opt.value = option;
			opt.textContent = option;
			callbackSelect.appendChild(opt); // 발신번호
			calleeSelect.appendChild(opt.cloneNode(true)); // 수신번호(복제)
			
			const tagOpt = document.createElement('li');
			tagOpt.classList.add('col-4', 'text-center', 'mb-3');
			tagOpt.innerHTML = `<button type="button">${option}</button>`;
			tagLi.appendChild(tagOpt); // 변수선택
		});
	}
}


// 엑셀 파일 검사
function excelValidateRequired(){
	if (!EXCEL_FILE_NAME) {
		const message = '파일을 선택하세요.';
		showDialogCustom(message, function (){
			document.getElementById("excelFile").focus();
		});
		return false;
	}
	return true;
}
