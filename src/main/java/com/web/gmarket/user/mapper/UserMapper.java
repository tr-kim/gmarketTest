package com.web.gmarket.user.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.user.dto.UserDto;

@Mapper
public interface UserMapper {
	
	public UserDto selectUserInfo(String userId);

}
