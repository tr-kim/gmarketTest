package com.web.gmarket.common.auth.handler;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * 사용자의 '인증'에 대해 실패하였을떄, 수행하여 사용자에게 응답 값을 제공해주는 Handler입니다.
 */
@Slf4j
@Configuration
public class CustomAuthFailureHandler implements AuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
		log.info("[CustomLoginFailHandler] :: " + exception.getMessage());

		response.sendRedirect("/login");
	}

}
