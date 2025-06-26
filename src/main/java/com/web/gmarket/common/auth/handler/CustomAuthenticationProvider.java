package com.web.gmarket.common.auth.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.web.gmarket.common.auth.dto.UserDetailsDto;
import com.web.gmarket.common.utils.ConstantsUtils;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 전달받은 사용자의 아이디와 비밀번호를 기반으로 비즈니스 로직을 처리하여 사용자의 ‘인증’에 대해서 검증을 수행하는 클래스입니다.
 * CustomAuthenticationFilter로 부터 생성한 토큰을 통하여 ‘UserDetailsService’를 통해 데이터베이스
 * 내에서 정보를 조회합니다.
 */
@Slf4j
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {
	
	@Autowired
    private UserDetailsService userDetailsService;

    @NonNull
    private BCryptPasswordEncoder passwordEncoder;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		log.debug("2.CustomAuthenticationProvider");

        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication;

        // 'AuthenticationFilter' 에서 생성된 토큰으로부터 아이디와 비밀번호를 조회함
        String userId = token.getName();
        String userPw = (String) token.getCredentials();
        
        // Spring Security - UserDetailsService를 통해 DB에서 아이디로 사용자 조회
        UserDetailsDto userDetailsDto = (UserDetailsDto) userDetailsService.loadUserByUsername(userId);
        
        if(ConstantsUtils.FALG_Y.equals(userDetailsDto.getDelFlag())) {		 			// 계정 삭제 여부			
        	throw new UsernameNotFoundException(ConstantsUtils.NOT_USER);
        } else if(ConstantsUtils.FALG_N.equals(userDetailsDto.getUseYn())) {			// 계정 사용 여부		
        	throw new DisabledException(ConstantsUtils.NOT_USE);
        } else if (!(passwordEncoder.matches(userPw, userDetailsDto.getUserPwd()))) {	// 비밀번호 불일치
            throw new BadCredentialsException(ConstantsUtils.PASSWORD_NOT_MATCH);
        } 
        
        return new UsernamePasswordAuthenticationToken(userDetailsDto, userPw, userDetailsDto.getAuthorities());
	}

	@Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }

}
