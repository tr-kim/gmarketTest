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
            toggleImageVisible(false);
            uploadProgressBar.option('visible', true);
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

    function toggleImageVisible(visible) {
        const dropZoneImage = document.getElementById('dropzone-image');
        dropZoneImage.hidden = !visible;
    }

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

    //예약 발송 모달 열기,닫기
    const reserveModal = document.querySelector('.reserveSend');
    const selects = document.querySelectorAll('select');
    const reserveHour = document.getElementById('hour');
    const reserveMinute = document.getElementById('minute');

    document.getElementById('send_time1').addEventListener('change',function(){
        if (this.checked) {
            document.getElementById('reserveDate').textContent = "";
        }
    });

    document.getElementById('send_time2').addEventListener('click', function () {
        if (this.checked) {
            reserveModal.classList.add("d-block");
        }
    });

    document.querySelector('.reserveSend .close_btn').addEventListener('click', function(){
        reserveModal.classList.remove("d-block");

        document.getElementById('send_time1').checked = true;

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
});
    





