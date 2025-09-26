let LOAD_PANEL;
let TEXT_FILE_NAME = "";
let IMAGE_FILE_NAME = new Array();
let TOTAL_COUNT = 0;

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
	
	// 이미지 등록
	let updatingFiles = false;
	const fileUploader = $('#file-uploader').dxFileUploader({
		multiple: true,
		allowedFileExtensions: ['.jpg'],
		maxFileSize: 100 * 1024, // 100KB
		uploadMode: 'useButtons',
		uploadMethod: 'POST',
		uploadUrl: '/files/upload/fileUpload',   
		uploadCustomData: {                   
			sendType: 'FILE'
		},
		onContentReady(e) {
			// 내부 업로드 버튼 숨김
			const uploadButton = e.element.find(".dx-fileuploader-upload-button");
			uploadButton.hide();
		},
		onValueChanged(e) {
			// 기존 파일 초기화 후 선택한 파일로 재설정(썸네일, 파일명 리턴 등 문제)
			if (updatingFiles) return; // 재진입 방지
			updatingFiles = true;
			
			// 미리보기 초기화
			const previewArea = document.getElementById('preview-area');
			previewArea.innerHTML = "";
			
			// 현재 선택된 파일 저장
			IMAGE_FILE_NAME = [];
			const files = e.value || [];
			const maxCount = 2;
			
			// 기존 파일 초기화
			e.component.reset();
			
			// 최대 개수 제한 적용
			const limitedFiles = files.slice(0, maxCount);
			if (files.length > maxCount) {
				showDialogCustom(`이미지는 최대 ${maxCount}장까지 등록 가능합니다.`);
			}
			
			// 현재 선택한 파일만 다시 세팅
			e.component.option('value', limitedFiles);
			
			// 이미지 체크 표시
			const inputWrapper = document.getElementById('file-uploader');
			const exist = document.querySelectorAll('.dx-fileuploader-file-container');
			let imgCheck = document.querySelector('.img-check');
			
			if (exist.length > 0) {
				if (!imgCheck) {
					// 처음 한 번만 생성
					imgCheck = document.createElement('div');
					imgCheck.classList.add('img-check');
					inputWrapper.appendChild(imgCheck);
				}
				// 내용과 스타일은 매번 갱신
				imgCheck.innerHTML = `이미지 체크 필요`;
				imgCheck.style.color = 'red';
			} else {
				if (imgCheck) {
					imgCheck.remove();
				}
			}
			
			updatingFiles = false;
		},
		onUploadStarted(e) {
			const files = e.component.option('value');
			e.component.option("uploadCustomData", {
				imgNumFlag: files.length,
				fileName1: files[0]?.name || '',
				fileName2: files[1]?.name || '',
				sendType: 'FILE'
			});
		},
		onUploaded(e) {
			// 응답 JSON
			const response = JSON.parse(e.request.response);
			console.log("이미지 업로드 결과:", response);
			
			if (response.status === "success") {
				IMAGE_FILE_NAME.push(response.fileName);
				console.log("누적 파일명:", IMAGE_FILE_NAME);
				
				// 이미지 체크 표시
				let imgCheck = document.querySelector('.img-check');
				imgCheck.innerHTML = ``;
				imgCheck.innerHTML = `이미지 체크 완료`;
				imgCheck.style.color = 'green';
				
				// 이미지 미리보기
				const file = e.file;
				const reader = new FileReader();
				reader.onload = function() {
					const previewArea = document.getElementById('preview-area');
					const img = document.createElement('img');
					img.src = reader.result;
					img.style.width = "100px"; // 썸네일 크기
					previewArea.appendChild(img);
				};
				reader.readAsDataURL(file);
			}
		}
	}).dxFileUploader('instance');

	//이미지 체크
	$('#imgCheckBtn').dxButton({
		text: '이미지 체크',
		type: 'danger',
		onClick() {
			if (fileUploader.option('value').length === 0) {
				showDialogCustom('이미지 파일을 선택하세요.');
				return;
			}
			
			fileUploader.upload(); // 업로드 실행
		}
	}).dxButton('instance');

	//이미지 미리보기
	$('#imgPreviewBtn').dxButton({
		text: '미리보기',
		type: 'danger',
		stylingMode: 'outlined',
		onClick() {
			const exist = document.querySelectorAll('.dx-fileuploader-file-container');
			const imgCheck = document.querySelector('.img-check');
			if (exist.length == 0 || imgCheck.textContent.trim() === "이미지 체크 필요") {
				showDialogCustom('이미지를 체크해주세요.');
				return;
			}
			document.querySelector('.imgPreview').classList.add("d-block");
		}
	}).dxButton('instance');

	//이미지 초기화
	$('#imgResetBtn').dxButton({
		text: '초기화',
		type: 'default',
		stylingMode: 'outlined',
		onClick() {
			const confirmDialog = DevExpress.ui.dialog.custom({
				showTitle: false,
				messageHtml: "<div style='text-align: center;'>초기화하시겠습니까?</div>",
				buttons: [{
					text: "확인",
					type: "default",
					onClick: function(e) {
						IMAGE_FILE_NAME = [];
						fileUploader.reset();
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
					console.log("초기화 완료");
				} else {
					console.log("취소");
				}
			});
		}
	}).dxButton('instance');

	document.querySelector('.imgPreview .close_btn').addEventListener('click', function(){
		document.querySelector('.imgPreview').classList.remove("d-block");
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
	const rejectCheck = document.getElementById('rejectCheckDefault');
	const input = document.getElementById('rejectNum');

	// DOM 로드될 때 상태 반영
	input.disabled = !rejectCheck.checked;
	handleInput();

	// 체크박스 상태 변경될 때 반영
	rejectCheck.addEventListener('change', function () {
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
	document.querySelectorAll('#tag li button').forEach((btn, idx)=>{
		btn.addEventListener('click',() => {
			if(MSG_WRITE) {
				insertAtCursor(MSG_WRITE, `#TAG${idx + 1}#`);
				MSG_WRITE.dispatchEvent(new Event('input'));
			}
		})
	});
});

// 문자 발송
function sendMessage(){
	// 파일선택
	if (!TEXT_FILE_NAME) {
		const message = '파일을 선택하세요.';
		showDialogCustom(message, function (){
			document.getElementById("textFile").focus();
		});
		return;
	}
	
	// 유효성 검사
	if (
		!inputValidateRequired("callbackNo", "발신번호를 입력하세요.") ||
		!inputValidateRequired("userId", "사용자ID를 입력하세요.") ||
		!inputValidateRequired("msgWrite", "내용을 입력하세요.") ||
		!inputValidateRequired("sendInfo", "전송대상을 입력하세요.")
	) {
		return;
	}
	
	// 메시지 내용 전송
	const func_send = function() {
		
		// 메시지 유형 XXX
		const msgTypeValue = document.querySelector('.msg_type').textContent.trim();
		if(msgTypeValue == "MMS") {
			showDialogCustom("MMS 개발 진행 중입니다.");
			return;
		}
		
		// 발신번호
		const callbackNo = document.getElementById("callbackNo").value;
		
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
		
		const formData = new FormData();
		formData.append("textFileName", TEXT_FILE_NAME);												// 텍스트 파일 이름
		formData.append("callbackNo", callbackNo);														// 발신 번호
		formData.append("largeCategory", largeCategory);												// 대분류 0: 옥션, 1: 지마켓
		formData.append("userId", userId);																// 사용자 아이디
		formData.append("msgTitle", msgTitle);															// 메시지 제목 LMS, MMS만 적용
		formData.append("msgType", msgType);															// 메시지 유형 SMS, LMS, MMS
		formData.append("msgWrite", msgWrite);															// 메시지 내용
		formData.append("sendInfo", sendInfo);															// 전송 대상
		formData.append("reserved", reserved);															// SMS 수신 여부 확인 0: 확인, 1: 미확인
		formData.append("timeType", sendTimeChkValue);													// 발송 시간 확인 0: 즉시, 1: 예약
		formData.append("rejectCheckDefault", rejectCheckDefault);										// 080 수신거부 번호 확인 true, false 
		formData.append("totalCount", TOTAL_COUNT);														// 수신번호 갯수
		
		// 수신번호 체크한 경우
		if(rejectCheckDefault) formData.append("rejectNum", rejectNum);									// 수신거부 번호
		
		// 발송 시간 - 예약인 경우
		if(sendTimeChkValue === '1') formData.append("sendTime", sendTime);								// 예약 시간
		
		// 이미지 파일명
		if(msgType === "mms" && IMAGE_FILE_NAME.length > 0){
			IMAGE_FILE_NAME.forEach((name, idx) => {
				const key = `imageName${String(idx + 1).padStart(2, '0')}`; // imageName01, imageName02 ...
				formData.append(key, name);
			});
		}
		
		fetch("/api/v1/fileSend/insert", {
			method: "POST",
			body: formData
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			
			const code = data.code;
			const result = data.result;
			
			if(code == 1000) {
				const totalCnt = result.totalCount;
				const succCnt = result.successCount;
				const failCnt = result.faildCount;
				
				const msg = msgTypeValue+" 총 "+ totalCnt +" 건 완료되었습니다. (성공 : "+ succCnt +" 건, 실패 : "+ failCnt +" 건)";
				showDialogCustom(msg, function() {
					location.reload(true);	// 페이지 새로고침
				});
				
			} else showDialogCustom(result);
		})
		.catch(err => {
			console.error("파일 발송 실패:", err);
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
	}).show().done(function(result) {
		if (result === "ok") {
			
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

// 발송 상태 체크(프로그레스 바)
function uploadStatusCheck(jobId) {
	const interval = setInterval(() => {
        fetch(`/api/v1/fileSend/uploadStatus/${jobId}`)
            .then(response => response.json())
            .then(data => {
				// console.log(data);
				
				// 에러 처리
				if(data.progress == -1) {
					clearInterval(interval);
					showDialogCustom("발송 도중 에러가 발생하였습니다.", function() {
						document.querySelector('.progressBar').classList.replace('d-block', 'd-none');
					});
				}
				
				PROCESS_TOTAL = data.total;
				PROCESSED = data.current; 
				
				processData();
                
				// 상태 체크 중지
                if (data.complete || PROCESSED >= PROCESS_TOTAL) {
					clearInterval(interval);
					showDialogCustom("발송이 완료되었습니다.", function() {
						uploadStatuRemove(jobId);
						location.reload(true);	// 페이지 새로고침
					});
					
                }
			}).catch(err => {
				console.error("발송 상태 체크:", err);
				clearInterval(interval);
				showDialogCustom("발송 도중 에러가 발생하였습니다.", function() {
					document.querySelector('.progressBar').classList.replace('d-block', 'd-none');
				});
				
			});
    }, 1000); // 1초마다 체크
}

// 발송 상태 삭제
function uploadStatuRemove(jobId) {
	fetch(`/api/v1/fileSend/uploadStatus/delete/${jobId}`)
    .then(response => response.json())
    .then(data => {
		console.log(data);
	}).catch(err => {
		console.error("발송 상태 삭제:", err);
	});
}

// 텍스트 파일 업로드
function textFileUpload(input) {
	const file = input.files[0];
	if (!file) return;
	
	// 로딩바 표시
	showLoading(LOAD_PANEL, "#textGrid");
	
	const formData = new FormData();
	formData.append("file", file);
	
	fetch("/api/v1/fileSend/txtUpload", {
		method: "POST",
		body: formData
	})
	.then(res => res.json())
	.then(data => {
		console.log(data);
		
		const status = data.status;
		
		if(status == "success"){
			const retData = data.retData;
			TEXT_FILE_NAME = retData.txtFile;
			TOTAL_COUNT = retData.count;
			
			// 테이블 그리기
			drawTable("textGrid", retData);
		}else{
			const message = data.message;
			showDialogCustom(message);
			resetTextGrid(input);
		}
	})
	.catch(err => {
		console.error("파일 업로드 실패", err);
		showDialogCustom('error');
		resetTextGrid(input);
	})
	.finally(() => {
		// 로딩바 숨김
		hideLoading(LOAD_PANEL);
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
		
		// 행번호
		const tdIdx = document.createElement("td");
		tdIdx.textContent = dataRow[i]?.idx ?? "";
		// tdIdx.style.whiteSpace = 'pre-line'; // 줄바꿈	
		tr.appendChild(tdIdx);
		
		// 수신번호
		const tdVal = document.createElement("td");
		tdVal.textContent = dataRow[i]?.value ?? "";
		// tdVal.style.whiteSpace = 'pre-line'; // 줄바꿈
		tr.appendChild(tdVal);
		
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
	
	if (!data || data.length === 0) return;
	
	const rowLength = data.count;
	const dataRow = data.textNumber;
	
	// 건수 표시
	document.querySelector('span.direct_input_num').textContent = rowLength.toLocaleString();
	
	// 전화번호 목록 표시
	const tbody = table.querySelector("tbody");
	tbody.innerHTML = ""; // 기존 내용 제거
	
	// 가상 스크롤 전
	/*textNumber.forEach(num => {
		const tr = document.createElement("tr");
		const td = document.createElement("td");
		td.textContent = num;
		tr.appendChild(td);
		tbody.appendChild(tr);
	});*/
	
	// 가상 스크롤 설정
	let rowHeight = 40; // 기본 행 높이(px)
	const visibleRows = Math.ceil(500 / rowHeight); // 500px 영역에 몇개 보일지 계산
	
	// 스크롤 이벤트 핸들러 등록
	container.removeEventListener('scroll', container._scrollHandler);
	container._scrollHandler = () => renderVisibleRows(container, tbody, spacer, dataRow, rowHeight, visibleRows);
	container.addEventListener('scroll', container._scrollHandler);
	
	// 초기 렌더링
	container.scrollTop = 0;
	renderVisibleRows(container, tbody, spacer, dataRow, rowHeight, visibleRows);
}

