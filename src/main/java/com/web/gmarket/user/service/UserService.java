package com.web.gmarket.user.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.web.gmarket.user.dto.UserDto;

public interface UserService {
	
	UserDto selectUserInfo(String userId, String delFlag);
	
	int selectUserInfoListCount(UserDto userDto);
	
	List<UserDto> selectUserInfoList(UserDto userDto);
	
	int insertUserInfo(UserDto userDto);
	
	int updateUserInfo(UserDto userDto);
	
	ResponseEntity<?> deleteUserInfo(List<UserDto> userDtoList);

	int updateUserPassword(UserDto userDto);

}
