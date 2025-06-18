package com.web.gmarket.common.auth.service;

import java.util.List;
import java.util.Optional;

import com.web.gmarket.user.dto.UserDto;

/**
 * 사용자 정보를 조회해오기 위한 인터페이스입니다.
 */
public interface CustomUserService {
	
	Optional<UserDto> login(UserDto userDto);

    List<UserDto> selectUserList(UserDto userDto);

}
