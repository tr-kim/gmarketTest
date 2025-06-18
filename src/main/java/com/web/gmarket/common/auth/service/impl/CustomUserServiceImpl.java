package com.web.gmarket.common.auth.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.web.gmarket.common.auth.service.CustomUserService;
import com.web.gmarket.user.dto.UserDto;

@Service
public class CustomUserServiceImpl implements CustomUserService {

	@Override
	public Optional<UserDto> login(UserDto userDto) {
		return Optional.empty();
	}

	@Override
	public List<UserDto> selectUserList(UserDto userDto) {
		return null;
	}

}
