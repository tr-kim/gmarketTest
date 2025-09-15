// 전체 데이터 건수
let PROCESS_TOTAL = 0; 
let PROCESSED = 0;
let PROGRESS_BAR_STATUS;

window.addEventListener('load', function() {
	//상단메뉴일때
	if (document.querySelector('header')) {
		//메뉴 클릭
		const lis = document.querySelectorAll('header li');
		const sendmenu = document.querySelector('.gnb .sendmenu');
		const sendmenuUl = sendmenu.querySelector('ul');

		lis.forEach(li => {
			li.addEventListener('click', function() {
				lis.forEach(item => {
					item.classList.remove('active');
				});
				li.classList.add('active');
			});
		});
		

		sendmenu.addEventListener('click', function(e) {
			e.stopPropagation(); // 클릭 이벤트 전파 막기
			sendmenuUl.classList.toggle('d-flex');
		});

		// sendmenu 외의 영역 클릭 시 메뉴 닫기
		document.addEventListener('click', function(e) {
			if (!sendmenu.contains(e.target)) {
				sendmenuUl.classList.remove('d-flex');
			}
		});

		//사용자 클릭시 비밀번호 변경 버튼
		const user_profile = document.querySelector('.user_profile');
		const psw_chg_btn = document.querySelector('.psw_chg_btn');
		const passwordChg = document.querySelector('.passwordChg');

		user_profile.addEventListener('click', function(e) {
			e.stopPropagation();
			psw_chg_btn.classList.toggle('d-block');
		})
		document.addEventListener('click', function(e) {
			if (!user_profile.contains(e.target)) {
				psw_chg_btn.classList.remove('d-block');
			}
		});
		psw_chg_btn.addEventListener('click', function() {
			passwordChg.classList.add('d-block');
		});

		// 비밀번호 변겅
		const password_chg_save = document.getElementById("password_chg_save");

		password_chg_save.addEventListener('click', function(e) {
			e.preventDefault();

			const pw1 = document.getElementById('new-psw');
			const pw2 = document.getElementById('new-psw2');
			const reg = /^[A-Za-z0-9_]+$/;

			if (isEmpty(pw1.value)) {
				const message = '비밀번호를 입력해주세요.';
				showDialogCustom(message);
				return;
			}

			if (isEmpty(pw2.value)) {
				const message = '비밀번호를 다시 입력해주세요.';
				showDialogCustom(message);
				return;
			}

			if (!(pw1.value === pw2.value)) {
				const message = '비밀번호가 일치하지 않습니다. 다시 입력해주세요.';
				showDialogCustom(message);
				return;
			}

			if (!(reg.test(pw1.value))) {
				const message = '비밀번호에 허용되지 않는 문자가 포함되었습니다.';
				showDialogCustom(message);
				return;
			}

			let formData = new FormData();
			const param = {};
			postAjax('/api/v1/user/rsa', param, function callback(data) {

				const password = pw1.value;
				const publicKeyModulus = data.RSA_MODULUS;
				const publicKeyExponent = data.RSA_EXPONENT;
				
				if(publicKeyModulus != "" && publicKeyExponent != "") {
					// RSA 암호화
					let rsa = new RSAKey();
					rsa.setPublic(publicKeyModulus, publicKeyExponent);

					const encrypted = rsa.encrypt(password);
					const base64 = hex2b64(encrypted);

					formData.append("userId", $("#pwd_chg_user_id").val());
					formData.append("userPwd", encodeURIComponent(base64));

					putFormAjax("/api/v1/user/passwordChg", formData, function callback(data) {
						const code = data.code;
						const result = data.result;

						if (code == 1000) {
							const message = '비밀번호가 변경되었습니다.';
							showDialogCustom(message, function (){
								pw1.value = '';
								pw2.value = '';
								document.getElementById('psw-ck').textContent = '';
								document.querySelector('.passwordChg').classList.remove('d-block');
							});
							
						} else if (code == 9003) {
							showDialogCustom(result);
							
						} else {
							const message = '비밀번호 변경에 실패했습니다.';
							showDialogCustom(message);
						}
					});
				} else {
					showDialogCustom("암호화 키가 올바르지 않습니다.");
				}
			});
		});
	}
	
	
	//좌측메뉴일때
	if (document.querySelector('aside')) {
		//메뉴 클릭
		const lis = document.querySelectorAll('aside .gnb li');
		lis.forEach(li => {
			li.addEventListener('click', function() {
				lis.forEach(item => {
					item.classList.remove('active');
				})
				li.classList.add('active');
			})
		})
		//사용자 클릭시 비밀번호 변경 버튼
		const user_profile = document.querySelector('.user_profile');
		const psw_chg_btn = document.querySelector('.psw_chg_btn');
		const passwordChg = document.querySelector('.passwordChg');

		user_profile.addEventListener('click', function(e) {
			e.stopPropagation();
			psw_chg_btn.classList.toggle('d-block');
		})
		document.addEventListener('click', function(e) {
			if (!user_profile.contains(e.target)) {
				psw_chg_btn.classList.remove('d-block');
			}
		});
		psw_chg_btn.addEventListener('click', function() {
			passwordChg.classList.add('d-block');
		});

	}
	
	
	if (document.getElementById('gm_login')) {
		document.querySelector('.fixed_btn').addEventListener('click', function() {
			document.getElementById('gm_login').classList.toggle('light_mode');
		})
	}
	
	
	//비밀번호 변경
	const passwordChg = document.querySelector('.passwordChg');
	if (passwordChg) {
		const pw1 = document.getElementById('new-psw');
		const pw2 = document.getElementById('new-psw2');
		const message = document.getElementById('psw-ck');
		const closebtn = document.querySelector('.passwordChg .close_btn');
		const inputs = document.querySelectorAll('.passwordChg input');

		function checkPasswordMatch() {
			if (pw1.value && pw2.value) {
				if (pw1.value === pw2.value) {
					message.textContent = '비밀번호가 일치합니다.';
					message.style.color = '#333';
				} else {
					message.textContent = '비밀번호가 일치하지 않습니다.';
					message.style.color = '#ff6767';
				}
			} else {
				message.textContent = '';
			}
		}

		pw1.addEventListener('input', checkPasswordMatch);
		pw2.addEventListener('input', checkPasswordMatch);

		closebtn.addEventListener('click', function() {
			//inputs.forEach(input => {
			//	input.value = "";
			//});
			
			pw1.value = '';
			pw2.value = '';
			message.textContent = '';

			passwordChg.classList.remove('d-block');
		});
	}
	
	// 0.5초마다 데이터 처리
//	const interval = setInterval(() => {
//		processData();
//		if (processed >= processTotal) {
//			clearInterval(interval);
//		}
//	}, 500);
	
	PROGRESS_BAR_STATUS = $('#progressBarStatus').dxProgressBar({
			min: 0,
			max: 100,
			width: '100%',
			showStatus: true,
			elementAttr: { 'aria-label': 'Progress Bar' },
			statusFormat(ratio) {
				return `Loading: ${Math.round(ratio * 100)}%`;
			}
	}).dxProgressBar('instance');
});

// 데이터 처리하면서 진행률 업데이트
function processData() {

	// processed++;

	// 프로그레스 바 노출
	document.querySelector('.progressBar').classList.replace('d-none', 'd-block');

	const percent = Math.round((PROCESSED / PROCESS_TOTAL) * 100);
	PROGRESS_BAR_STATUS.option('value', percent);

	if (PROCESSED >= PROCESS_TOTAL) {
		console.log("모든 데이터 처리 완료");
		// 프로그레스 바 비노출
		document.querySelector('.progressBar').classList.replace('d-block', 'd-none');
	}
}

function getAjax(url, param, successCallback, errorCallback) {
	$.ajax({
		type: "GET",
		url: url,
		data: JSON.stringify(param),
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			if (successCallback) {
				successCallback(data);
			}
		},
		error: function(xhr, status, error) {
			if (errorCallback) {
				errorCallback(xhr, status, error);
			} else {
				console.error("Ajax 요청 실패:", status, error); // 기본 에러 처리
				showDialogCustom('error');
			}
		}
	});
}

function postAjax(url, param, successCallback, errorCallback) {
	$.ajax({
		type: "POST",
		url: url,
		data: JSON.stringify(param),
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			if (successCallback) {
				successCallback(data);
			}
		},
		error: function(xhr, status, error) {
			if (errorCallback) {
				errorCallback(xhr, status, error);
			} else {
				console.error("Ajax 요청 실패:", status, error); // 기본 에러 처리
				showDialogCustom('error');
			}
		}
	});
}

function putAjax(url, param, successCallback, errorCallback) {
	$.ajax({
		type: "PUT",
		url: url,
		data: JSON.stringify(param),
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			if (successCallback) {
				successCallback(data);
			}
		},
		error: function(xhr, status, error) {
			if (errorCallback) {
				errorCallback(xhr, status, error);
			} else {				
				console.error("Ajax 요청 실패:", status, error); // 기본 에러 처리
				showDialogCustom('error');
			}
		}
	});
}

function deleteAjax(url, param, successCallback, errorCallback) {
	$.ajax({
		type: "DELETE",
		url: url,
		data: JSON.stringify(param),
		dataType: "json",
		contentType: "application/json",
		success: function(data) {
			if (successCallback) {
				successCallback(data);
			}
		},
		error: function(xhr, status, error) {
			if (errorCallback) {
				errorCallback(xhr, status, error);
			} else {
				console.error("Ajax 요청 실패:", status, error); // 기본 에러 처리
				showDialogCustom('error');
			}
		}
	});
}

function postFormAjax(url, formData, successCallback, errorCallback) {
	$.ajax({
		type: "POST",
		url: url,
		data: formData,
		processData: false,
		contentType: false,
		success: function(data) {
			console.log(data)
			if (successCallback) {
				successCallback(data);
			}
		},
		error: function(xhr, status, error) {
			if (errorCallback) {
				errorCallback(xhr, status, error);
			} else {
				console.error("Ajax 요청 실패:", status, error); // 기본 에러 처리
				showDialogCustom('error');
			}
		}
	});
}

function putFormAjax(url, formData, successCallback, errorCallback) {
	$.ajax({
		type: "PUT",
		url: url,
		data: formData,
		processData: false,
		contentType: false,
		success: function(data) {
			if (successCallback) {
				successCallback(data);
			}
		},
		error: function(xhr, status, error) {
			if (errorCallback) {
				errorCallback(xhr, status, error);
			} else {
				console.error("Ajax 요청 실패:", status, error); // 기본 에러 처리
				showDialogCustom('error');
			}
		}
	});
}

const isEmpty = (input) => {
	if (
		typeof input === "undefined" ||
		input === null ||
		input === "" ||
		input === "null" ||
		input.length === 0 ||
		(typeof input === "object" && !Object.keys(input).length)
	) {
		return true;
	}
	else return false;
}


let isDialogOpen = false; 

document.addEventListener('contextmenu', function (e) {
	e.preventDefault();
	
	if (isDialogOpen) return; // 이미 떠 있으면 무시
	
	isDialogOpen = true; // 다이얼로그 띄운 상태로 설정
	
	const message = '마우스 오른쪽 버튼은 사용할 수 없습니다.';
	showDialogCustom(message, function (){
		isDialogOpen = false; // 닫을 때 다시 false로
	});
	
	return;
});

// 공통 알림 팝업
function showDialogCustom(message, onConfirm){
	if (message === 'error') {
		message = '오류가 발생했습니다.<br>관리자에게 문의바랍니다.';
	}
	
	DevExpress.ui.dialog.custom({
		showTitle: false,
		messageHtml: `<div style='text-align: center;' class="pt-3">${message}</div>`,
		buttons: [{
			text: "확인",
			onClick: function () {
				if (typeof onConfirm === 'function') onConfirm();
			}
		}]
	}).show();
}

// 로딩바 표시
function showLoading(loadPanel, target) {
	loadPanel.option("position", { of: target });
	loadPanel.show();
}

// 로딩바 숨김
function hideLoading(loadPanel) {
	loadPanel.hide();
}

// 입력값 체크
function inputValidateRequired(id, message) {
	const el = document.getElementById(id);
	if (!el.value.trim()) {
		// 다이얼로그가 닫힌 뒤 입력칸으로 포커스
		showDialogCustom(message, () => el.focus());
		return false;
	}
	return true;
}

// 특수문자 치환 ex &#40; => (
function decodeHtmlEntities(str) {
  return new DOMParser().parseFromString(str, "text/html").documentElement.textContent;
}
