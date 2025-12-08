package com.web.gmarket.common.utils;

import org.springframework.stereotype.Component;
import org.springframework.ui.Model;

import jakarta.servlet.http.HttpSession;

@Component
public class LoginErrorHelper {
	
	/**
	 * 로그인 시 에러 체크
	 * 
	 * @param session
	 * @param model
	 */
	public void loginErrorChk(HttpSession session, Model model) {

		Boolean duplicated = (Boolean) session.getAttribute(ConstantsUtils.DUPLICATE_LOGIN);
		if (Boolean.TRUE.equals(duplicated)) {
			model.addAttribute(ConstantsUtils.DUPLICATE_LOGIN, true);
			session.removeAttribute(ConstantsUtils.DUPLICATE_LOGIN); // 1회성 메시지
		}

		Boolean notUse = (Boolean) session.getAttribute(ConstantsUtils.NOT_USE);
		if (Boolean.TRUE.equals(notUse)) {
			model.addAttribute(ConstantsUtils.NOT_USE, true);
			session.removeAttribute(ConstantsUtils.NOT_USE);
		}
		
		Boolean notMatch = (Boolean) session.getAttribute(ConstantsUtils.PASSWORD_NOT_MATCH);
		if (Boolean.TRUE.equals(notMatch)) {
			model.addAttribute(ConstantsUtils.PASSWORD_NOT_MATCH, true);
			session.removeAttribute(ConstantsUtils.PASSWORD_NOT_MATCH);
		}

		Boolean empty = (Boolean) session.getAttribute(ConstantsUtils.USER_ID_EMPTY);
		if (Boolean.TRUE.equals(empty)) {
			model.addAttribute(ConstantsUtils.USER_ID_EMPTY, true);
			session.removeAttribute(ConstantsUtils.USER_ID_EMPTY);
		}

		Boolean incorrect = (Boolean) session.getAttribute(ConstantsUtils.USER_INFO_INCORRECT);
		if (Boolean.TRUE.equals(incorrect)) {
			model.addAttribute(ConstantsUtils.USER_INFO_INCORRECT, true);
			session.removeAttribute(ConstantsUtils.USER_INFO_INCORRECT);
		}
		
		Boolean faild = (Boolean) session.getAttribute(ConstantsUtils.USER_FAILD);
		if (Boolean.TRUE.equals(faild)) {
			model.addAttribute(ConstantsUtils.USER_FAILD, true);
			session.removeAttribute(ConstantsUtils.USER_FAILD);
		}
	}
}
