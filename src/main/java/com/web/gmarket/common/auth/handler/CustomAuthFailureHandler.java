package com.web.gmarket.common.auth.handler;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.web.gmarket.common.utils.ConstantsUtils;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

/**
 * 사용자의 '인증'에 대해 실패하였을떄, 수행하여 사용자에게 응답 값을 제공해주는 Handler입니다.
 */
@Slf4j
@Configuration
public class CustomAuthFailureHandler implements AuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
		String message = exception.getMessage();
		
		log.info("[CustomLoginFailHandler] :: " + exception.getMessage());
		
		HttpSession session = request.getSession();
		
		if(ConstantsUtils.NOT_USER.equals(message)) {								// 계정 삭제 여부
			session.setAttribute(ConstantsUtils.NOT_USER, true);
		} else if(ConstantsUtils.NOT_USE.equals(message)) {							// 계정 사용 여부
			session.setAttribute(ConstantsUtils.NOT_USE, true);
		} else if(ConstantsUtils.PASSWORD_NOT_MATCH.equals(message)) {				// 비밀번호 불일치
			session.setAttribute(ConstantsUtils.PASSWORD_NOT_MATCH, true);
		}

		response.sendRedirect("/login");
	}

}
