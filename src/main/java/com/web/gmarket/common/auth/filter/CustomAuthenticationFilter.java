package com.web.gmarket.common.auth.filter;

import java.security.interfaces.RSAPrivateKey;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.RsaUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;


/**
 * 아이디와 비밀번호 기반의 데이터를 Form 데이터로 전송을 받아 '인증'을 담당하는 필터입니다.
 */
@Slf4j
@Component
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
	
	public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        super.setAuthenticationManager(authenticationManager);
    }
	
	/**
     * 지정된 URL로 form 전송을 하였을 경우 파라미터 정보를 가져온다.
     *
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
    	UsernamePasswordAuthenticationToken authRequest;
        
        try {
            authRequest = getAuthRequest(request);
            setDetails(request, authRequest);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return this.getAuthenticationManager().authenticate(authRequest);
    }
    
    /**
     * Request로 받은 ID와 패스워드 기반으로 토큰을 발급한다.
     * 
     */
    private UsernamePasswordAuthenticationToken getAuthRequest(HttpServletRequest request) throws Exception {
    	
        try {
        	
        	String username = request.getParameter("userId");
        	String userPwd = request.getParameter("userPwd");
        	
            log.debug("1.CustomAuthenticationFilter :: userId:" + username);
            
            // RSA 복호화
            HttpSession session = request.getSession();
            RSAPrivateKey privateKey = (RSAPrivateKey) session.getAttribute(ConstantsUtils.RSA_WEB_KEY);
            String decodePwd = RsaUtil.decryptRsa(privateKey, userPwd);
            
            session.removeAttribute(ConstantsUtils.RSA_WEB_KEY);

            // ID와 암호화된 패스워드를 기반으로 토큰 발급
            return new UsernamePasswordAuthenticationToken(username, decodePwd);
        } catch (UsernameNotFoundException ae) {
            throw new UsernameNotFoundException(ae.getMessage());
        }
    }
}
