$(function () {
	
	const MSG_TITLE = document.getElementById('msgTitle');
	const MSG_WRITE = document.getElementById('msgWrite');
	const MSG_TYPES = document.querySelector('.msg_type');
	const INPUT_BYTE = document.getElementById('input_byte');
	const TOTAL_BYTE = document.getElementById('total_byte');
	const FINAL_SEND_BTN = document.getElementById('final_send_btn');
	
	MSG_WRITE.placeholder = "내용을 입력해 주세요.\n80byte 초과 시 장문 문자로,\n이미지 추가 시 포토 문자로 자동 전환 됩니다.";
	
	
	//수신번호 옵션(직접입력, 주소록, 엑셀파일)
	const tabButtons = document.querySelectorAll('.tab li button');
	const tabs = document.querySelectorAll('.tab li');
	const callbacks = document.querySelectorAll('.callback_wrap');
	
	tabButtons.forEach((button, index) => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			// .tab li에 on 클래스 조정
			tabs.forEach((li, liIdx) => {
				if (liIdx === index) {
					li.classList.add('on');
				} else {
					li.classList.remove('on');
				}
			});
			
			// .callback_wrap에 d-block 클래스 조정
			callbacks.forEach((wrap, wrapIdx) => {
				if (wrapIdx === index) {
					wrap.classList.add('d-block');
				} else {
					wrap.classList.remove('d-block');
				}
			});
		});
	});
	
	
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
		// onValueChanged: function (e) {

		// 	const allowedFileExtensions = ['.jpg', '.jpeg', '.gif', '.png'];
		// 	const invalidFiles = []; 

		// 	const validFiles = (e.value || []).filter(file => {
		// 		const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
		// 		const isValid = allowedFileExtensions.includes(extension);
		// 		if (!isValid) {
		// 			invalidFiles.push(file.name);
		// 		}
		// 		return isValid;
		// 	});

		// 	if (invalidFiles.length > 0) {
		// 		const message = `허용되지 않은 파일 형식입니다:\n${invalidFiles.join(', ')}`;
		// 		showDialogCustom(message);
		// 		console.warn('업로드 불가 파일 있음:', invalidFiles);

		// 		// 허용되지 않은 파일 제거
		// 		const uploader = $("#file-uploader").dxFileUploader("instance");
		// 		uploader.option("value", validFiles); // 유효한 파일만 다시 설정
		// 		return;
		// 	}

		// 	handleInput(); // 유효한 경우만 처리
		// },

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
	document.getElementById('checkDefault').addEventListener('change', function () {
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

    // checkDefault가 활성화(checked)되어 있고 rejectNum도 입력되면 바이트 합산
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
	document.querySelectorAll('#tag li button').forEach((btn, idx)=>{
		btn.addEventListener('click',() => {
			if(MSG_WRITE) {
				insertAtCursor(MSG_WRITE, `#TAG${idx + 1}#`);
				MSG_WRITE.dispatchEvent(new Event('input'));
			}
		})
	});
	
	
	//내 문자함    
	const bookmarkMsg = document.querySelector('.bookmarkMsg');
	document.getElementById('bookmark_btn').addEventListener('click', function(){
		bookmarkMsg.classList.add('d-block');
		document.querySelector('body').classList.add('on');
	});
	
	const close_btns = document.querySelectorAll('.bookmarkMsg .close_btn');
	close_btns.forEach(close_btn => {
		close_btn.addEventListener('click', function() {
			bookmarkMsg.classList.remove('d-block');
			document.querySelector('body').classList.remove('on');
		})
	})

	//내 문자함 레이아웃
	const store = [
		{ b_msg_key: "0000001", msg: "1자일리톨스톤레몬향캔디 과량 섭취 시 설사를 일으킬 수 잇씁니다." },
		{ b_msg_key: "0000002", msg: "2흠,,,( •̀ ω •́ )✧" },
		{ b_msg_key: "0000003", msg: "3자일리톨스톤레몬향캔디 과량 섭취 시 설사를 일으킬 수 잇씁니다. 제품이 단단하므로 섭취 시 치아손상에 주의하세요. 제품을 삼킬 경우 질식 또는 식도 손상의 위험이 있습니다. 동물에게 먹이지 마세요. 부정, 불량 식품신고는 국번없이 1399, 본 제품은 공정거래위원회 고시 소비자분쟁해결 기준에 의거 교환 또는 보상을 받을 수 있습니다." },
		{ b_msg_key: "0000004", msg: "4메가커피" },
		{ b_msg_key: "0000005", msg: "5완료 할당량에 도달했습니다." },
		{ b_msg_key: "0000006", msg: "6제품이 단단하므로 섭취 시 치아손상에 주의하세요. 제품을 삼킬 경우 질식 또는 식도 손상의 위험이 있습니다. 동물에게 먹이지 마세요. 부정, 불량 식품신고는 국번없이 1399, 본 제품은 공정거래위원회 고시 소비자분쟁해결 기준에 의거 교환 또는 보상을 받을 수 있습니다." },
		{ b_msg_key: "0000007", msg: "7완료 할당량에 도달했습니다." },
		{ b_msg_key: "0000008", msg: "8완료 할당량에 도달했습니다." },
		{ b_msg_key: "0000009", msg: "9제품이 단단하므로 섭취 시 치아손상에 주의하세요. 제품을 삼킬 경우 질식 또는 식도 손상의 위험이 있습니다. 동물에게 먹이지 마세요. 부정, 불량 식품신고는 국번없이 1399, 본 제품은 공정거래위원회 고시 소비자분쟁해결 기준에 의거 교환 또는 보상을 받을 수 있습니다." },
	]
	$('#msg-card-view').dxCardView({
		dataSource: store,
		keyExpr: "b_msg_key",
		remoteOperations: false,
		cardsPerRow: '3',
		cardMinWidth: 200,
		cardHeight:200,
		wordWrapEnabled: true,				
		editing: {			
			allowDeleting: true,
			popup: {
				width: 700,
				height: 400,
			},
			form: {
				items: [{
					dataField: 'msg',
					editorType: 'dxSelectBox',
					editorOptions: {
						dataSource: ['Low', 'Normal', 'High', 'Urgent'],
					},
				}]
			},
			texts: {
				confirmDeleteMessage: '정말 삭제하시겠습니까?', 
			}
		},
		columns: [			
			{
				dataField: 'msg',	
				caption: "",
				label: {
					visible: false
				},			 				
			},			
		],
		searchPanel: {
			visible: true,
			width: 250,
			placeholder:'찾을 내용을 입력하세요.',
		},
		toolbar: {
			items: [
				{
					location: "before",
					template: function() {
					return $("<div>")
						.attr("id", "totalCount")
						.css({ fontSize: "17px", color: "#333", padding: "0 5px" });
					}
				},
				"searchPanel"
			]
		},
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();
			$("#totalCount").text(`총 ${totalCount}건`);
		}
		
	});
	//내 문자 선택
	document.addEventListener('click', function (e) {
		// 카드(content) 내부 클릭인지 확인
		const card = e.target.closest('.dx-cardview-card-content');
		if (card) {
			const content = card.querySelector('.dx-cardview-field-value');
			if (content) {
				MSG_WRITE.value="";
				insertAtCursor(MSG_WRITE, content.textContent.trim() );
				MSG_WRITE.dispatchEvent(new Event('input'));
			}
			bookmarkMsg.classList.remove('d-block');
			document.querySelector('body').classList.remove('on');
		}
	});

	// const bookmarkMsgtext = document.querySelectorAll('.bookmarkMsg ul li textarea');
	// bookmarkMsgtext.forEach( text => {
	// 	text.addEventListener('click', function(){
	// 		const msg = text.textContent;
	// 		if(MSG_WRITE) {
	// 			MSG_WRITE.value="";
	// 			insertAtCursor(MSG_WRITE, msg );
	// 			MSG_WRITE.dispatchEvent(new Event('input')); //byte 체크 등 다른 input 이벤트
	// 		}	
	// 		bookmarkMsg.classList.remove('d-block');
	// 	})
	// })

	//내 문자 삭제
	// const bookmarkDelBtns = document.querySelectorAll('.bookmarkMsg .x_btn');
	// bookmarkDelBtns.forEach( btn =>{
	// 	btn.addEventListener('click',function(){
	// 		const confirmDialog = DevExpress.ui.dialog.custom({
	// 			showTitle: false,
	// 			messageHtml: "<div style='text-align: center;' class='pt-3'>삭제하시겠습니까?</div>",
	// 			buttons: [{
	// 				text: "확인",
	// 				type: "default",
	// 				onClick: function(e) {
	// 					return { result: "ok" };
	// 				}					
	// 			}, {
	// 				text: "취소",
	// 				onClick: function(e) {
	// 					return { result: "cancel" };
	// 				}
	// 			}]
	// 		}).show();
			
	// 		confirmDialog.show().done(function(dialogResult) {
	// 			if (dialogResult.result === "ok") {
	// 				console.log("삭제 완료");
					
	// 			} else {
	// 				console.log("취소");
	// 			}
	// 		});
	// 	})
	// })
	
});


//숫자만 입력
function onlyNumber(element){
	element.value = element.value.replace(/[^0-9]/g,'');
}


//직접입력 추가
function addDirectNumber(){
	const nameInput = document.getElementById("directName");
	const directName = nameInput.value.trim();
	
	const numberInput = document.getElementById("directNumber");
	const directNumber = numberInput.value.trim();
	
	if(directName == ""){
		const message = '이름을 입력하세요.';
		showDialogCustom(message);
		return;
	}
	
	if(directNumber == ""){
		const message = '번호를 입력하세요.';
		showDialogCustom(message);
		return;
	}
	
	const tbody = document.querySelector("#directGrid tbody");
	
	const emptyTr = tbody.querySelector('tr td[colspan]');
	if (emptyTr){
		tbody.innerHTML = '';
	}
	
	const newTr = document.createElement('tr');
	newTr.innerHTML = `
		<td>${directName}</td>
		<td class="phoneNum">${directNumber}</td>
		<td>
			<button type="button" class="numDelBtn" onclick="delDirectNumber(this)">
			<i class="dx-icon-close"></i>
			<span class="visually-hidden">삭제</span>
			</button>
		</td>
	`;
	
	tbody.appendChild(newTr);
	
	//입력란 초기화
	nameInput.value = '';
	numberInput.value = '';
	
	updateDirectNumberStats();
}


//직접입력 삭제
function delDirectNumber(element){
	const confirmDialog = DevExpress.ui.dialog.custom({
		showTitle: false,
		messageHtml: "<div style='text-align: center;'>삭제하시겠습니까?</div>",
		buttons: [{
			text: "확인",
			type: "default",
			onClick: function(e) {
				const tr = element.closest('tr');
				tr.remove();
				
				const tbody = document.querySelector("#directGrid tbody");
				
				if (tbody.children.length == 0){
					tbody.innerHTML = `
						<tr class="no-data">
							<td class="py-3" colspan="3">직접입력한 번호가 없습니다.</td>
						</tr>
					`
				}
				
				updateDirectNumberStats();
				
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


//직접입력 중복 수 계산
function updateDirectNumberStats() {
	const tbody = document.querySelector("#directGrid tbody");
	const rows = tbody.querySelectorAll("tr:not(.no-data)");
	const numbers = [];
	const numberCounts = {};
	
	rows.forEach(row => {
		const number = row.children[1]?.textContent?.trim(); //2번째 td가 번호
		if (number) {
			numbers.push(number);
			numberCounts[number] = (numberCounts[number] || 0) + 1;
		}
	});
	
	const totalCount = numbers.length;
	const dupCount = Object.values(numberCounts).filter(count => count > 1).reduce((a, b) => a + b - 1, 0);
	
	document.querySelector(".direct_input_num").textContent = totalCount;
	document.querySelector(".direct_dup_num").textContent = dupCount;
}


//문자 발송
function sendMessage(){
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


