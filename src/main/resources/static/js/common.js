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
			console.log(passwordChg)
			passwordChg.classList.add('d-block');
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
			inputs.forEach(input => {
				input.value = "";
			});
			passwordChg.classList.remove('d-block');
		});
	}
})

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
				alert("예기치 못한 오류가 발생하였습니다. 관리자에게 문의바랍니다.");
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
				alert("예기치 못한 오류가 발생하였습니다. 관리자에게 문의바랍니다.");
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
				alert("예기치 못한 오류가 발생하였습니다. 관리자에게 문의바랍니다.");
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
				alert("예기치 못한 오류가 발생하였습니다. 관리자에게 문의바랍니다.");
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
				alert("예기치 못한 오류가 발생하였습니다. 관리자에게 문의바랍니다.");
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
				alert("예기치 못한 오류가 발생하였습니다. 관리자에게 문의바랍니다.");
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