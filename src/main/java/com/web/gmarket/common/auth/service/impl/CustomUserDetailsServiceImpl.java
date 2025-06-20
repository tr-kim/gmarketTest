package com.web.gmarket.common.auth.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.auth.dto.UserDetailsDto;
import com.web.gmarket.common.auth.service.CustomUserService;
import com.web.gmarket.user.dto.UserDto;

/**
 * UserDetailsService 구현체
 * 사용자 인증 정보를 로드하고 UserDetails 객체를 생성하는 역할을 담당
 * 
 */
@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {
	
	@Autowired
	private CustomUserService userService;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		// [STEP1] 사용자 아이디를 조회하여 존재하지 않는 경우 오류를 반환합니다.
        if (username == null || username.isEmpty()) {
            throw new UsernameNotFoundException("사용자 ID가 비어있습니다.");
        }
        
        // [STEP2] 서비스를 호출하여 실제 데이터베이스 조회를 통해서 사용자 정보를 조회합니다.
        return userService.login(UserDto.builder().userId(username).build())
                .map(user -> new UserDetailsDto(user))
                .orElseThrow(() -> new BadCredentialsException("사용자 정보가 올바르지 않습니다: " + username));
	}

}
