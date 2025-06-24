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

	//직접입력 그리드
	$("#directGrid").dxDataGrid({
		dataSource: [
			{ idx: 1, name: "홍길동", callback_no: "010-0000-0001" },
            { idx: 2, name: "홍길서", callback_no: "010-0000-0002" },
            { idx: 3, name: "홍길남", callback_no: "010-0000-0003" },
            { idx: 4, name: "홍길북", callback_no: "010-0000-0004" },
            { idx: 5, name: "홍길지", callback_no: "010-0000-0005" },
            { idx: 6, name: "홍길마", callback_no: "010-0000-0006" },
            { idx: 7, name: "홍길켓", callback_no: "010-0000-0007" },
            { idx: 8, name: "홍길디", callback_no: "010-0000-0008" },
            { idx: 9, name: "홍길노", callback_no: "010-0000-0009" },
            { idx: 10,name: "홍길밴", callback_no: "010-0000-0010" },
		],
		keyExpr: "idx",
		headerFilter: {
			visible: true
		},
		paging: {
			pageSize: 50
		},
		pager: {
			visible: true,
			showNavigationButtons: true,
			showPageSizeSelector: true,
			allowedPageSizes: [50, 100, 200]
		},
		columnAutoWidth: true,
		allowColumnResizing: true,
		columnResizingMode: 'widget',
		columns: [
			{ dataField: "name", caption: "이름" },
			{ dataField: "callback_no", caption: "전화번호" },						
            { 
				dataField: "", 
				caption: "삭제" , 
				type: 'buttons', 
				width: 60,			
				buttons: [{
					icon: 'trash',
					onClick(e) {
						alert('test');
					},
                    cssClass:'text-body-tertiary',
				}],
			},			
		],		
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();
			$("#direct_wrap .count").text(`총 ${totalCount}건`);
		}		
	}).dxDataGrid("instance");

    //주소록 그리드
    $("#addressGrid").dxDataGrid({
		dataSource: [
			{ idx: 1, name: "홍길동", callback_no: "010-0000-0001" },
            { idx: 2, name: "홍길서", callback_no: "010-0000-0002" },
            { idx: 3, name: "홍길남", callback_no: "010-0000-0003" },
            { idx: 4, name: "홍길북", callback_no: "010-0000-0004" },
            { idx: 5, name: "홍길지", callback_no: "010-0000-0005" },
            { idx: 6, name: "홍길마", callback_no: "010-0000-0006" },
            { idx: 7, name: "홍길켓", callback_no: "010-0000-0007" },
            { idx: 8, name: "홍길디", callback_no: "010-0000-0008" },
            { idx: 9, name: "홍길노", callback_no: "010-0000-0009" },
            { idx: 10,name: "홍길밴", callback_no: "010-0000-0010" },
		],
		keyExpr: "idx",
		headerFilter: {
			visible: true
		},
		paging: {
			pageSize: 50
		},
		pager: {
			visible: true,
			showNavigationButtons: true,
			showPageSizeSelector: true,
			allowedPageSizes: [50, 100, 200]
		},
		columnAutoWidth: true,
		allowColumnResizing: true,
		columnResizingMode: 'widget',
		columns: [
			{ dataField: "name", caption: "이름" },
			{ dataField: "callback_no", caption: "전화번호" },									
		],		
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();
			$("#address_wrap .count").text(`총 ${totalCount}건`);
		}		
	}).dxDataGrid("instance");

    //엑셀등록 그리드
    $("#excelGrid").dxDataGrid({
		dataSource: [
			{ idx: 1, name: "홍길동", tag1: "변수1", tag2: "변수2", tag3: "변수3", tag4: "변수4",  tag5: "변수5",  callback_no: "010-0000-0001" },
            { idx: 2, name: "홍길서", tag1: "변수1", tag2: "변수2", tag3: "변수3", tag4: "변수4",  tag5: "변수5",  callback_no: "010-0000-0002" },
            { idx: 3, name: "홍길남", tag1: "변수1", tag2: "변수2", tag3: "변수3", tag4: "변수4",  tag5: "변수5",  callback_no: "010-0000-0003" },
            { idx: 4, name: "홍길북", tag1: "변수1", tag2: "변수2", tag3: "변수3", tag4: "변수4",  tag5: "변수5",  callback_no: "010-0000-0004" },
            { idx: 5, name: "홍길지", tag1: "변수1", tag2: "변수2", tag3: "변수3", tag4: "변수4",  tag5: "변수5",  callback_no: "010-0000-0005" },
            { idx: 6, name: "홍길마", tag1: "변수1", tag2: "변수2", tag3: "변수3", tag4: "변수4",  tag5: "변수5",  callback_no: "010-0000-0006" },
            { idx: 7, name: "홍길켓", tag1: "변수1", tag2: "변수2", tag3: "변수3", tag4: "변수4",  tag5: "변수5",  callback_no: "010-0000-0007" },
            { idx: 8, name: "홍길디", tag1: "변수1", tag2: "변수2", tag3: "변수3", tag4: "변수4",  tag5: "변수5",  callback_no: "010-0000-0008" },
            { idx: 9, name: "홍길노", tag1: "변수1", tag2: "변수2", tag3: "변수3", tag4: "변수4",  tag5: "변수5",  callback_no: "010-0000-0009" },
            { idx: 10,name: "홍길밴", tag1: "변수1", tag2: "변수2", tag3: "변수3", tag4: "변수4",  tag5: "변수5",  callback_no: "010-0000-0010" },
		],
		keyExpr: "idx",
		headerFilter: {
			visible: true
		},
		paging: {
			pageSize: 50
		},
		pager: {
			visible: true,
			showNavigationButtons: true,
			showPageSizeSelector: true,
			allowedPageSizes: [50, 100, 200]
		},
		columnAutoWidth: true,
		allowColumnResizing: true,
		columnResizingMode: 'widget',
		columns: [
			{ dataField: "name", caption: "이름" },
			{ dataField: "callback_no", caption: "전화번호" },	
            { dataField: "tag1", caption: "변수1" },
            { dataField: "tag2", caption: "변수2" },
            { dataField: "tag3", caption: "변수3" },
            { dataField: "tag4", caption: "변수4" },
            { dataField: "tag5", caption: "변수5" },
		],		
		onContentReady: function(e) {
			const totalCount = e.component.totalCount();
			$("#excel_wrap .count").text(`총 ${totalCount}건`);
		}		
	}).dxDataGrid("instance");
     
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
        onFilesChanged(e) {
            const maxFiles = 3;
            const files = e.component.option('value');

            if (files.length > maxFiles) {
                // 초과한 파일 제거
                const trimmedFiles = files.slice(0, maxFiles);
                e.component.option('value', trimmedFiles);
                alert('이미지는 최대 3개까지만 업로드할 수 있습니다.');
            }
        },
        onUploaded(e) {
            const { file } = e;
            const fileReader = new FileReader();

            fileReader.onload = function () {
                toggleDropZoneActive(document.getElementById('dropzone-external'), false);

                const colDiv = document.createElement('div');
                colDiv.className = 'col-4 position-relative'; // 위치 relative로

                const img = document.createElement('img');
                img.src = fileReader.result;
                img.classList.add('img-fluid', 'rounded');

                // 삭제 버튼
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '&times;';
                deleteBtn.className = 'btn btn-sm btn-dark position-absolute top-0 end-0 m-1';
                deleteBtn.style.zIndex = '10';

                // 삭제 이벤트
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

    document.getElementById('dropzone-image').onload = function () { toggleImageVisible(true); };

    //메세지 플레이스홀더
   

});
    





