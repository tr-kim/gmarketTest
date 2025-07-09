package com.web.gmarket.user.service;

import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.validation.Errors;

import com.web.gmarket.user.dto.UserDto;

public interface UserService {
	
	UserDto selectUserInfo(String userId, String delFlag);
	
	List<UserDto> selectUserInfoList(UserDto userDto);
	
	int insertUserInfo(UserDto userDto);
	
	int updateUserInfo(UserDto userDto);
	
	int deleteUserInfo(String userId);
	
	int updateUserPassword(UserDto userDto);
	
	public LinkedHashMap<String, String> validateHandling(Errors errors);
	
}
