package com.web.gmarket.common.auth.handler;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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

		// SecurityContext 설정
	    SecurityContext context = SecurityContextHolder.getContext();
	    context.setAuthentication(authentication);
		
		// 세션에 SecurityContext 저장
	    HttpSession session = request.getSession(true);
	    session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
		
		// 세션 등록
		sessionRegistry.registerNewSession(request.getSession().getId(), authentication.getPrincipal());
		
		response.sendRedirect("/index");
	}

}
