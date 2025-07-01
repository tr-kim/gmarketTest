$(function () {
	
    //수신자 탭버튼
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

    //옵션탭버튼
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
     
    //이미지 등록
    $('#file-uploader').dxFileUploader({
        dialogTrigger: '#dropzone-external',
        dropZone: '#dropzone-external',
        multiple: true,
        allowedFileExtensions: ['.jpg', '.jpeg', '.gif', '.png'],
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
            if (e.dropZoneElement.id === 'dropzone-external') { toggleDropZoneActive(e.dropZoneElement, false); }
        },       
        onUploaded(e) {
            const uploadedCount = document.querySelectorAll('#dropzone-image-list .col-4').length;

            if (uploadedCount >= 3) {
                alert('이미지는 최대 3개까지만 업로드할 수 있습니다.');
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
            //toggleImageVisible(false);
            uploadProgressBar.option('visible', true);
        },        
        onValueChanged: function (e) {
            handleInput(); // 이미지 업로드되면 즉시 처리
        },  
    });

    const uploadProgressBar = $('#upload-progress').dxProgressBar({
        min: 0,
        max: 100,
        width: '30%',
        showStatus: false,
        visible: false,
    }).dxProgressBar('instance');

    function toggleDropZoneActive(dropZone, isActive) {
        dropZone.classList.toggle('dropzone-active', isActive);
    }

    // function toggleImageVisible(visible) {
    //     const dropZoneImage = document.getElementById('dropzone-image');
    //     if (dropZoneImage) {
    //     dropZoneImage.hidden = !visible;
    // } else {
    //     console.warn("#dropzone-image 요소가 없습니다.");
    // }
    // }

    document.getElementById('dropzone-image-list').onload = function () { toggleImageVisible(true); };

    //예약 발송 캘린더
    const zoomLevels = ['month', 'year', 'decade', 'century'];
    const weekDays = [
        { id: 0, text: 'Sunday' },
        { id: 1, text: 'Monday' },
        { id: 2, text: 'Tuesday' },
        { id: 3, text: 'Wednesday' },
        { id: 4, text: 'Thursday' },
        { id: 5, text: 'Friday' },
        { id: 6, text: 'Saturday' },
    ];
    const weekNumberRules = ['auto', 'firstDay', 'firstFourDays', 'fullWeek'];

    let reserveDate = "";

    const calendar = $('#calendar').dxCalendar({
        value: new Date(),
        disabled: false,
        firstDayOfWeek: 0,
        showWeekNumbers: false,
        weekNumberRule: 'auto',
        zoomLevel: zoomLevels[0],
        onValueChanged(data) {            
            const date = data.value;
            if (date instanceof Date && !isNaN(date)) {
                const yy = String(date.getFullYear()).slice(2);
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');

                document.querySelector('.reserveSend .date').textContent=`${yy}-${mm}-${dd}`
                console.log(`${yy}${mm}${dd}`);

                reserveDate = `${yy}-${mm}-${dd}`
            }
        },
        onOptionChanged(data) {
            if (data.name === 'zoomLevel') {
                zoomLevel.option('value', data.value);
            }
        },
        disabledDates: function(data) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 시간 초기화

            return data.view === 'month' && data.date < today;
        },
        
    }).dxCalendar('instance');

    const zoomLevel = $('#zoom-level').dxSelectBox({
        dataSource: zoomLevels,
        value: zoomLevels[0],
        inputAttr: { 'aria-label': 'Zoom Level' },
        onValueChanged(data) {
            calendar.option('zoomLevel', data.value);
        },
    }).dxSelectBox('instance');

    const selectedDate = $('#selected-date').dxDateBox({
        value: new Date(),
        inputAttr: { 'aria-label': 'Date' },
        onValueChanged(data) {
            calendar.option('value', data.value);
        },
    }).dxDateBox('instance');

    $('#custom-cell').dxCheckBox({
        text: 'Use custom cell template',
        value: false,
        onValueChanged(data) {
        calendar.option('cellTemplate', data.value ? getCellTemplate : 'cell');
        },
    });

    $('#disabled').dxCheckBox({
        text: 'Disable the calendar',
        onValueChanged(data) {
            calendar.option('disabled', data.value);
        },
    });

    $('#week-numbers').dxCheckBox({
        text: 'Show week numbers',
        onValueChanged(data) {
            calendar.option('showWeekNumbers', data.value);
        },
    });

    $('#first-day-of-week').dxSelectBox({
        dataSource: weekDays,
        value: 0,
        valueExpr: 'id',
        inputAttr: { 'aria-label': 'First Day of Week' },
        displayExpr: 'text',
        onValueChanged(data) {
            calendar.option('firstDayOfWeek', data.value);
        },
    });

    $('#week-number-rule').dxSelectBox({
        dataSource: weekNumberRules,
        value: weekNumberRules[0],
        inputAttr: { 'aria-label': 'Week Number Rule' },
        onValueChanged(data) {
            calendar.option('weekNumberRule', data.value);
        },
    });

    const holidays = [[1, 0], [4, 6], [25, 11]];

    function isWeekend(d) {
        const day = d.getDay();

        return day === 0 || day === 6;
    }

    function getCellTemplate(data) {
        let cssClass = '';

        if (data.view === 'month') {
            if (!data.date) {
                cssClass = 'week-number';
            } else {
                if (isWeekend(data.date)) { cssClass = 'weekend'; }

                $.each(holidays, (_, item) => {
                    if (data.date.getDate() === item[0] && data.date.getMonth() === item[1]) {
                        cssClass = 'holiday';
                        return false;
                    }
                    return true;
                });
            }
        }

        return `<span class='${cssClass}'>${data.text}</span>`;
    }

    //080수신거부
    document.getElementById('checkDefault').addEventListener('change', function () {
        const input = document.getElementById('reject_num');
        input.disabled = !this.checked;
    });


    //예약 발송 모달 열기,닫기
    const reserveModal = document.querySelector('.reserveSend');
    const selects = document.querySelectorAll('.reserveSend select');
    const reserveHour = document.getElementById('hour');
    const reserveMinute = document.getElementById('minute');
    const final_send_btn = document.getElementById('final_send_btn');

    document.getElementById('send_time1').addEventListener('change',function(){
        if (this.checked) {
            document.getElementById('reserveDate').textContent = "";
            final_send_btn.textContent = "즉시발송";
        }
    });

    document.getElementById('send_time2').addEventListener('click', function () {
        if (this.checked) {
            reserveModal.classList.add("d-block");
            final_send_btn.textContent = "예약발송";
        }
    });

    document.querySelector('.reserveSend .close_btn').addEventListener('click', function(){
        reserveModal.classList.remove("d-block");

        document.getElementById('send_time1').checked = true;
        document.getElementById('reserveDate').textContent = "";
        final_send_btn.textContent = "즉시발송";

        document.querySelector('.date').textContent = '날짜를 선택해 주세요.';
        selects.forEach(select => {
            select.value = "00";
        })
    })

    document.querySelector('.reserveSend .modal-ft button').addEventListener('click', function(){
        if(reserveDate == ""){
            alert('날짜를 선택해 주세요.')
            return;
        }
        document.getElementById('reserveDate').textContent = `예약시간: ${reserveDate} ${reserveHour.value}:${reserveMinute.value}`

        reserveModal.classList.remove("d-block");
        document.querySelector('.date').textContent = '날짜를 선택해 주세요.';
    })


    const msgTitle = document.getElementById('msgTitle');
    const msgWrite = document.getElementById('msgWrite');
    const msgTypes = document.querySelector('.msg_type');
    const byte_ck = document.getElementById('byte_ck');
    const byte_type = document.getElementById('byte_type');

    //문자 타입, byte 표시
    function getByteLength(str) {
        let size = 0;
        for(let i = 0; i < str.length; i++){
                const byteSize = new Blob([str.charAt(i)]).size;
                if( byteSize == 3 ) size += 2;
                else if( byteSize == 2 ) size += 2;
                else size += 1;
        }

        return size;
    }

    function setMsgType(idx, byteLength) {
        const types = ['SMS', 'LMS', 'MMS'];
        const classMap = ['sms', 'lms', 'mms'];
        const byteNum = ['80', '2000', '2000'];

        // 기존 sms/lms/mms 클래스만 제거
        classMap.forEach(cls => msgTypes.classList.remove(cls));

        // 유효한 인덱스일 때만 적용
        if (idx >= 0 && idx < types.length) {
            msgTypes.textContent = types[idx];
            msgTypes.classList.add(classMap[idx]);
            byte_type.textContent = byteNum[idx];
        }

        byte_ck.textContent = byteLength;
    }
    
    //이미지 확인
    function hasImage() {
        const uploader = $("#file-uploader").dxFileUploader("instance");
        const files = uploader?.option("value") || [];
        console.log("Current uploader value:", files);
        return files.length > 0;
    }

    //입력 이벤트 핸들링
    function handleInput() {
        const titleContent = msgTitle.value;
        const titleByteLength = getByteLength(titleContent);

        const writeContent = msgWrite.value;
        const writeByteLength = getByteLength(writeContent);

        const hasImg = hasImage();

        console.log("hasImage():", hasImg);
        console.log("title:", titleContent.trim(), "| byte:", writeByteLength);

        if (hasImg) {
            console.log("setMsgType(2) - MMS");
            setMsgType(2, writeByteLength);
        } else if (titleContent.trim() !== '' || writeByteLength > 80) {
            console.log("setMsgType(1) - LMS");
            setMsgType(1, writeByteLength);
        } else {
            console.log("setMsgType(0) - SMS");
            setMsgType(0, writeByteLength);
        }
    }

    msgTitle.addEventListener("input", handleInput); //제목
    msgWrite.addEventListener("input", handleInput); //내용

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
                    if(msgWrite) {
                            insertAtCursor(msgWrite, this.querySelector('span').textContent);
                            msgWrite.dispatchEvent(new Event('input')); //byte 체크 등 다른 input 이벤트
                    }
            });
    });

    //변수추가
    document.querySelectorAll('#tag li button').forEach((btn, idx)=>{
            btn.addEventListener('click',() => {
                    if(msgWrite) {
                            insertAtCursor(msgWrite, `#TAG${idx + 1}#`);
                            msgWrite.dispatchEvent(new Event('input'));
                    }
            })
    });
});
    





