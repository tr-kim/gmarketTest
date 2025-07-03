package com.web.gmarket.common.auth.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.gmarket.common.auth.service.CustomUserService;
import com.web.gmarket.user.dto.UserDto;
import com.web.gmarket.user.mapper.UserMapper;

@Service
public class CustomUserServiceImpl implements CustomUserService {
	
	@Autowired
	private UserMapper userMapper;

	@Override
	public Optional<UserDto> login(UserDto userDto) {
		UserDto user  = userMapper.selectUserInfo(userDto);
		
		return Optional.ofNullable(user);
	}

	@Override
	public List<UserDto> selectUserList(UserDto userDto) {
		return null;
	}

}
