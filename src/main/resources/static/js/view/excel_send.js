let loadPanel;

$(function () {

	loadPanel = $('.loadpanel').dxLoadPanel({
		shadingColor: 'rgba(0,0,0,0.4)',
		position: { of: '#employee' },
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
	
	
	//이미지 등록	
	$('#file-uploader').dxFileUploader({
		dialogTrigger: '#dropzone-external',
		dropZone: '#dropzone-external',
		multiple: true,
		allowedFileExtensions: ['.jpg', '.jpeg', '.gif', '.png'],
		maxFileSize: 100 * 1024,
		uploadMode: 'instantly',
		uploadUrl: 'https://js.devexpress.com/Demos/NetCore/FileUploader/Upload',
		visible: false,
		onDropZoneEnter({ component, dropZoneElement, event }) {
			if (dropZoneElement.id === 'dropzone-external') {
				const items = event.originalEvent.dataTransfer.items;
				
				const allowedFileExtensions = component.option('allowedFileExtensions');
				const draggedFileExtension = `.${items[0].type.replace(/^image\//, '')}`;
				
				const isSingleFileDragged = items.length === 1;
				const isValidFileExtension = allowedFileExtensions.includes(draggedFileExtension);
				
				if (isSingleFileDragged && isValidFileExtension) {
					toggleDropZoneActive(dropZoneElement, true);
				}
			}
		},
		onDropZoneLeave(e) {
			if (e.dropZoneElement.id === 'dropzone-external') {
				toggleDropZoneActive(e.dropZoneElement, false);
			}
		},       
		onUploaded(e) {
			const uploadedCount = document.querySelectorAll('#dropzone-image-list .col-4').length;
			
			if (uploadedCount >= 3) {
				const message = '이미지는 최대 3개까지만 업로드할 수 있습니다.';
				showDialogCustom(message);
				return;
			}
			
			const { file } = e;
			const fileReader = new FileReader();
			
			fileReader.onload = function () {
				toggleDropZoneActive(document.getElementById('dropzone-external'), false);
				
				const colDiv = document.createElement('div');
				colDiv.className = 'col-4 position-relative';
				
				const img = document.createElement('img');
				img.src = fileReader.result;
				img.classList.add('img-fluid', 'rounded');
				
				const deleteBtn = document.createElement('button');
				deleteBtn.innerHTML = '&times;';
				deleteBtn.className = 'btn btn-sm btn-dark position-absolute top-0 end-0 m-1';
				deleteBtn.style.zIndex = '10';
				
				deleteBtn.addEventListener('click', () => {
					colDiv.remove();
					
					const uploader = $("#file-uploader").dxFileUploader("instance");
					const currentFiles = uploader.option("value") || [];
					
					// 삭제할 파일 이름과 비교해서 제외한 새 배열 생성
					const newFiles = currentFiles.filter(f => f.name !== file.name);
					
					uploader.option("value", newFiles);
					
					// 변경된 상태 반영
					handleInput();
				});
				
				colDiv.appendChild(img);
				colDiv.appendChild(deleteBtn);
				document.getElementById('dropzone-image-list').appendChild(colDiv);
			};
			
			fileReader.readAsDataURL(file);
			
			uploadProgressBar.option({
				visible: false,
				value: 0,
			});
		},
		onProgress(e) {
			uploadProgressBar.option('value', (e.bytesLoaded / e.bytesTotal) * 100);
		},
		onUploadStarted() {
			uploadProgressBar.option('visible', true);
		},
		onValueChanged: function (e) {
			const allowedFileExtensions = ['.jpg', '.jpeg', '.gif', '.png'];
			const invalidFiles = [];
			const oversizedFiles = [];

			const validFiles = (e.value || []).filter(file => {
				const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
				const isValidExt = allowedFileExtensions.includes(extension);
				const isValidSize = file.size <= 100 * 1024; // 100KB 이하

				if (!isValidExt) {
					invalidFiles.push(file.name);
				}
				if (!isValidSize) {
					oversizedFiles.push(file.name);
				}

				return isValidExt && isValidSize;
			});

			if (invalidFiles.length > 0) {
				const message = `허용되지 않은 파일 형식입니다:\n${invalidFiles.join(', ')}`;
				showDialogCustom(message);
				console.warn('업로드 불가 파일 있음:', invalidFiles);
			}

			if (oversizedFiles.length > 0) {
				showDialogCustom(`파일 크기가 100KB를 초과합니다:\n${oversizedFiles.join(', ')}`);
				console.warn('크기 초과 파일 있음:', oversizedFiles);
			}

			if (invalidFiles.length > 0 || oversizedFiles.length > 0) {
				// 허용되지 않은 파일 또는 크기 초과 파일 제거
				const uploader = $("#file-uploader").dxFileUploader("instance");
				uploader.option("value", validFiles); // 유효한 파일만 다시 설정
				return;
			}

			handleInput(); // 유효한 경우만 처리
		},

	}).dxFileUploader('instance');
	
	
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
});


let EXCEL_FILE_NAME = "";


//숫자만 입력
function onlyNumber(element){
	element.value = element.value.replace(/[^0-9]/g,'');
}


//문자 발송
function sendMessage(){
	//엑셀파일 유무
	if (!EXCEL_FILE_NAME) {
		showDialogCustom('파일을 선택해주세요.');
		return;
	}
	//시트선택 유무
	if (document.getElementById('sheet').value == "") {
		showDialogCustom('시트를 선택해주세요.');
		return;
	}
	//발신, 수신번호 유무
	const firstTh = document.querySelector('#excelGrid thead th:first-child');
	if (firstTh && firstTh.textContent.trim() !== "발신번호") {
		showDialogCustom('발신번호, 수신번호 설정 후 지정 버튼을 눌러주세요.');
		return;
	}
	//사용자ID 유무
	if(document.getElementById('userId').value == ""){
		showDialogCustom('사용자ID를 입력해주세요.');
		return;
	};
	//메시지 유무
	if(document.getElementById('msgWrite').value == ""){
		showDialogCustom('메시지를 입력해주세요.');
		return;
	};
	//전송대상 유무
	if(document.getElementById('sendInfo').value == ""){
		showDialogCustom('전송대상을 입력해주세요.');
		return;
	};
	//메시지 작성 그리드
	if(document.querySelector('#msgGrid tr.no-data')){
		showDialogCustom('메시지 작성 버튼을 눌러주세요.');
		return;
	};
	//수신거부
	if(document.getElementById('rejectCheckDefault').checked && document.getElementById('rejectNum').value == ""){
		showDialogCustom('수신거부 번호를 입력해주세요.');
		return;
	};	
	//전송범위
	if(document.getElementById('tranCheckDefault').checked 
	&& document.getElementById('tranRangeStart').value == ""
	&& document.getElementById('tranRangeEnd').value == ""){
		showDialogCustom('수신거부 번호를 입력해주세요.');
		return;
	};
	const confirmDialog = DevExpress.ui.dialog.custom({
		showTitle: false,
		messageHtml: "<div style='text-align: center;'>발송하시겠습니까?</div>",
		buttons: [{
			text: "발송",
			type: "default",
			onClick: function(e) {
				//발송 로직 실행
				
				
				
				
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


// 엑셀 파일 업로드
function excelFileUpload(input) {
	const file = input.files[0];
	if (!file) return;

	loadPanel.show();
	
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
		}
	})
	.catch(err => {
		console.error("파일 업로드 실패", err);
		showDialogCustom('error');
	})
	.finally(() => {
		loadPanel.hide();
	});
}


// 엑셀 시트 읽기
function excelReadSheet(option) {
	const sheetName = option.value;
	if (!sheetName) return;
	
	if (!EXCEL_FILE_NAME) {
		showDialogCustom('엑셀 파일을 선택해주세요.');
		return;
	}
	
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
		}else{
			const message = data.message;
			showDialogCustom(message);
		}
	})
	.catch(err => {
		console.error("시트 읽기 실패:", err);
		showDialogCustom('error');
	});
}


// 발신번호, 수신번호 지정
function reserve() {
	if (!EXCEL_FILE_NAME) {
		showDialogCustom('엑셀 파일을 선택해주세요.');
		return;
	}
	
	const sheetName = document.getElementById("sheet").value;
	
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
	});
}


// 메시지 작성
function createSendData() {
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
	
	const sheetName = document.getElementById("sheet").value;
	
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
			messageHtml: "<div style='text-align: center;' class='pt-3'>수신거부가 체크되어 있지 않습니다. 이대로 진행하시겠습니까?</div>",
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
		dataRow[i].forEach(cell => {
			const td = document.createElement("td");
			td.textContent = cell ?? "";
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

