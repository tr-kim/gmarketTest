package com.web.gmarket.common.auth.handler;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class CustomAuthSuccessHandler implements AuthenticationSuccessHandler {
	
	private final SessionRegistry sessionRegistry;

	public CustomAuthSuccessHandler(SessionRegistry sessionRegistry) {
		this.sessionRegistry = sessionRegistry;
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
		
		log.debug("4.onAuthenticationSuccess :: SUCCESS");

		// Spring Security Context Holder 인증 정보 set
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		// 세션 등록
		sessionRegistry.registerNewSession(request.getSession().getId(), authentication.getPrincipal());
		
		response.sendRedirect("/index");
	}

}
