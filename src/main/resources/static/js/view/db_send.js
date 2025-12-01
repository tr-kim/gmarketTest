let LOAD_PANEL;
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
	
	const MSG_WRITE = document.getElementById('msgWrite');
	const INPUT_BYTE = document.getElementById('input_byte');
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
			sendType: 'DB'
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
				sendType: 'DB'
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
			if(userMmsUse == "N" || userMmsUse == null || userMmsUse == "") {				
				showDialogCustom("발송 권한이 없습니다.<br>관리자에게 문의하세요.");
				fileUploader.reset();	
				return;					
			}
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
			toggleBodyClass();
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
	
	//예약 발송 캘린더
	let reserveDate = "";
	
	$('#calendar').dxCalendar({
		value: new Date(),
		minZoomLevel: "decade",
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
			toggleBodyClass();
		}
	});
	
	document.querySelector('.reserveSend .close_btn').addEventListener('click', function(){
		reserveModal.classList.remove("d-block");
		toggleBodyClass();
		
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
			toggleBodyClass();
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

	/*
	//이미지 확인
	function hasImage() {
		const uploader = $("#file-uploader").dxFileUploader("instance");
		const files = uploader?.option("value") || [];
		//console.log("Current uploader value:", files);
		
		return files.length > 0;
	}
	*/
	
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

	// 문자 byte 표시
	function getByteLength(str, maxByte) {
		let resultStr = "";
		let size = 0;

		for (let i = 0; i < str.length; i++) {
			const ch = str.charAt(i);
			const byteSize = new Blob([ch]).size;
			const addSize = (byteSize === 2 || byteSize === 3) ? 2 : 1;

			if (size + addSize > maxByte) {
				break;
			}

			resultStr += ch;
			size += addSize;
		}

		return { text: resultStr, size };
	}

	// 입력 이벤트 핸들링
	function handleInput() {
		const maxByte = parseInt(document.getElementById("total_byte").textContent, 10) || 2000;

		let rejectNumSize = 0;
		if (!document.getElementById('rejectNum').disabled) {
			const rejectNumContent = document.getElementById('rejectNum').value;
			// 여기서도 getByteLength로 동일하게 처리
			rejectNumSize = getByteLength(rejectNumContent, maxByte).size;
		}

		// MSG_WRITE는 (최대값 - rejectNum 크기) 만큼만 허용
		const allowedByte = maxByte - rejectNumSize;
		const msgResult = getByteLength(MSG_WRITE.value, allowedByte);

		// MSG_WRITE 내용 잘라서 반영
		if (MSG_WRITE.value !== msgResult.text) {
			showDialogCustom(`최대 ${maxByte}byte까지 입력 가능합니다.`);
			MSG_WRITE.value = msgResult.text;
		}

		// 합산 결과
		const totalByteLength = rejectNumSize + msgResult.size;
		INPUT_BYTE.textContent = totalByteLength;
	}

	const rejectNum = document.getElementById('rejectNum')
	MSG_WRITE.addEventListener("input", handleInput); //내용
	rejectNum.addEventListener("input", handleInput); //080 수신거부 번호

	// 대분류에 따른 발신번호, 수신거부 설정
	const companyCode = document.getElementById("companyCode");
    const tranCallback = document.getElementById("tranCallback");

    companyCode.addEventListener("change", function () {		
        if (companyCode.value === "0") {
            tranCallback.value = AUCTION_CALLBACK_NUM;
			rejectNum.value = AUCTION_REJECT_NUM;			
        } else if (companyCode.value === "1") {
            tranCallback.value = GMARKET_CALLBACK_NUM;
			rejectNum.value = GMARKET_REJECT_NUM;
        } else {
            tranCallback.value = "";
			rejectNum.value = "";
        }
		console.log(companyCode.value, tranCallback.value, rejectNum.value);
    });

	// LMS, MMS 권한에 따른 메시지분류 옵션 변경
	const messageType = document.getElementById('messageType');
	if(!(userLmsUse == "N" || userLmsUse == null || userLmsUse == "")) {
		if(!messageType.querySelector('option[value="lms"]')) {
			let opt = document.createElement("option");
			opt.value = "lms";
			opt.text = "LMS";
			messageType.appendChild(opt); 
		}
	} else {
		const opt = messageType.querySelector('option[value="lms"]');
		if(opt) opt.remove();
	}

	if(!(userMmsUse == "N" || userMmsUse == null || userMmsUse == "")) {
		if(!messageType.querySelector('option[value="mms"]')) {
			let opt = document.createElement("option");
			opt.value = "mms";
			opt.text = "MMS";
			messageType.appendChild(opt); 
		}
	} else {
		const opt = messageType.querySelector('option[value="mms"]');
		if(opt) opt.remove();
	}

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
	const companyCode = document.getElementById('companyCode').value.trim();
	
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
		initSend();
	});
}


// 요청번호 지정
function reservedDesign(btn){
	const row = btn.closest("tbody > tr");
	
	const dataReserved4 = row.getAttribute("data-reserved4");
	const reserved4 = document.getElementById("reserved4");
	reserved4.value = dataReserved4.trim();
	
	// 총 건수 저장
	TOTAL_COUNT = row.getAttribute("data-count");

	const resultTable = row.getAttribute("data-result-table").trim();
	
	setMsgType(resultTable);
}

// 요청번호 지정 시 문자 타입 표시
function setMsgType(resultTable) {
	const MSG_TYPES = document.querySelector('.msg_type');
	const TOTAL_BYTE = document.getElementById('total_byte');
	

	let idx = "";

	if(resultTable === "SMSCLI_TBL_LARGE"){
		idx = 0;
	}else if(resultTable === "LMSCLI_TBL_LARGE"){
		idx = 1;
	}else if(resultTable === "MMSCLI_TBL_LARGE"){
		idx = 2;
	}

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
	
}

// 요청번호 삭제
function reservedDelete(btn){
	const row = btn.closest("tbody > tr");
	
	const reserved4 = row.getAttribute("data-reserved4").trim();
	const resultCompany = row.getAttribute("data-result-company").trim();
	const resultTable = row.getAttribute("data-result-table").trim();
	
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

	if(userDbUse == "N" || userDbUse == null || userDbUse == "") {
		showDialogCustom("발송 권한이 없습니다.<br>관리자에게 문의하세요.");
		return;
	}

	const reserved4 = document.getElementById('reserved4');
	const msgType = document.querySelector('.msg_type').textContent.trim();
    const uploader = $('#file-uploader').dxFileUploader('instance');
    const files = uploader.option('value');
	const imgCheck = document.querySelector('.img-check');

	// 유효성 검사
	if(reserved4.value === "미지정" || reserved4.value === ""){
		 const message = '요청번호를 조회 후 지정하세요.';
		 showDialogCustom(message, function (){
		 	document.getElementById("reserved4").focus();
		 });
		 return;
	}

	 // MMS인데 이미지 없으면 경고
    if (msgType === "MMS" && (!files || files.length === 0)) {
        showDialogCustom("이미지를 등록해주세요.");
        return; 
    }

	if (msgType === "MMS" && ((!imgCheck) || imgCheck.textContent.trim() === "이미지 체크 필요")){
		showDialogCustom("이미지를 체크해주세요.");
        return; 
	}

	if (		
		!inputValidateRequired("tranCallback", "발신번호를 입력하세요.") ||
		!inputValidateRequired("userId", "사용자ID를 입력하세요.") ||
		!inputValidateRequired("msgWrite", "내용을 입력하세요.") ||
		!inputValidateRequired("sendInfo", "전송대상을 입력하세요.")
	) {
		return;
	}
	
	const func_send = function() {
		
		// 메시지 유형 XXX
		const msgType = document.getElementById("messageType").value;
//		if(msgType == "mms") {
//			showDialogCustom("MMS 개발 진행 중입니다.");
//			return;
//		}
		
		// 대분류
		const companyCode = document.getElementById("companyCode").value;
		
		// 요청번호
		const reserved4 = document.getElementById("reserved4").value;
		
		// 발신번호
		const tranCallback = document.getElementById("tranCallback").value;
		
		// 사용자 아이디
		const userId = document.getElementById("userId").value;
		
		// 제목
		const msgTitle = document.getElementById("msgTitle").value;
		
		// 메시지 내용
		const msgWrite = document.getElementById('msgWrite').value.trim();
		
		// 전송 대상
		const sendInfo = document.getElementById('sendInfo').value.trim();
		
		// 상태
		//const stat = document.getElementById('stat').value.trim();
		
		// SMS 수신여부 확인
		const reserved3 = document.getElementById('reserved3').value.trim();
		
		// 수신거부
		const rejectCheckDefault = document.getElementById('rejectCheckDefault').checked;
		const rejectNum = document.getElementById('rejectNum').value.trim();
		
		// 발송시간
		const sendTimeChkValue = $("input[name='send_time']:checked").val();
		const sendTime = parseReservationTime(document.getElementById('reserveDate').textContent);
		
		const formData = new FormData();
		formData.append("msgType", msgType);									// 메시지 유형 SMS, LMS, MMS
		formData.append("companyCode", companyCode);							// 대분류 0: 옥션, 1: G마켓
		formData.append("reserved4", reserved4);								// 요청번호
		formData.append("tranCallback", tranCallback);							// 발신번호
		formData.append("userId", userId);										// 사용자 아이디
		formData.append("msgTitle", msgTitle);									// 메시지 제목 LMS, MMS만 적용
		formData.append("msgWrite", msgWrite);									// 메시지 내용
		formData.append("sendInfo", sendInfo);									// 전송 대상
		//formData.append("stat", stat);										// 상태
		formData.append("reserved3", reserved3);								// SMS 수신 여부 확인 0: 확인, 1: 미확인
		formData.append("rejectCheckDefault", rejectCheckDefault);				// 080 수신거부 번호 확인 true, false
		formData.append("timeType", sendTimeChkValue);							// 발송 시간 확인 0: 즉시, 1: 예약
		formData.append("totalCount", TOTAL_COUNT);								// 총 건수
		
		// 수신번호 체크한 경우
		if(rejectCheckDefault) formData.append("rejectNum", rejectNum);			// 수신거부 번호					
		
		// 발송 시간 - 예약인 경우
		if(sendTimeChkValue === '1') formData.append("sendTime", sendTime);		// 예약 시간
		
		// 이미지 파일명
		if(msgType === "mms" && IMAGE_FILE_NAME.length > 0){
			IMAGE_FILE_NAME.forEach((name, idx) => {
				const key = `imageName${String(idx + 1).padStart(2, '0')}`; // imageName01, imageName02 ...
				formData.append(key, name);
			});
		}
		
		showLoading(LOAD_PANEL, window);
		
		fetch("/api/v1/dbSend/insert", {
			method: "POST",
			body: formData
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			
			const code = data.code;
			const result = data.result;
			
			if(code == 1000) {
				const msg = `${msgType.toUpperCase()} 총 ${result} 건을 수정하였습니다.`;
				showDialogCustom(msg, function() {
					location.reload(true);	// 페이지 새로고침
				});
				
			} else showDialogCustom(result);
			
		})
		.catch(err => {
			console.error("DB 발송 실패:", err);
			showDialogCustom('error');
		})
		.finally(() => {
			hideLoading(LOAD_PANEL);
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
			toggleBodyClass();
			
			const rejectCheckDefault = document.getElementById('rejectCheckDefault').checked;
			const rejectNum = document.getElementById('rejectNum').value.trim();
			const msgWrite = document.getElementById('msgWrite').value.trim();
			confirmMessage.textContent = rejectCheckDefault ? msgWrite + rejectNum : msgWrite;
			
			confirmSend.querySelector('.send_btn').addEventListener('click', function() {
				confirmSend.classList.remove('d-block');
				func_send(); // 메시지 보내기
				toggleBodyClass();
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
			<button type="button" class="designBtn" onclick="reservedDesign(this)">
				<i class="dx-icon-check"></i>
				<span class="visually-hidden">지정</span>
			</button>`;
		tr.appendChild(tdSelect);
		
		//삭제
		const tdDel = document.createElement("td");
		tdDel.innerHTML = `
			<button type="button" class="deleteBtn" onclick="reservedDelete(this)">
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

//초기화
function initSend(){
	document.getElementById('msgWrite').value = "";
	document.getElementById('reserved4').value = "미지정";
	document.getElementById('msgTitle').value = "";
	//document.getElementById('tranCallback').value = "";
	document.getElementById('sendInfo').value = "";
	//document.getElementById('stat').value = ""; // 상태

	const uploader = $('#file-uploader').dxFileUploader('instance');
	uploader.reset(); // 파일 목록 초기화

	// img-check 메시지도 초기화
	let imgCheck = document.querySelector('.img-check');
	if (imgCheck) {
		imgCheck.innerHTML = `이미지 체크 필요`;
	}
}