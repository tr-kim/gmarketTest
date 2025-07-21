package com.web.gmarket.user.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.web.gmarket.user.dto.UserDto;

@Mapper
public interface UserMapper {
	
	
	/**
	 * 사용자 정보 조회
	 * 
	 * @param userId
	 * @return
	 */
	public UserDto selectUserInfo(UserDto userDto);
	
	/**
	 * 사용자 목록 조회
	 * 
	 * @param userDto
	 * @return
	 */
	public List<UserDto> selectUserInfoList(UserDto userDto);
	
	/**
	 * 사용자 정보 등록
	 * 
	 * @param userDto
	 * @return
	 */
	public int insertUserInfo(UserDto userDto);
	
	/**
	 * 사용자 정보 수정
	 * 
	 * @param userDto
	 * @return
	 */
	public int updateUserInfo(UserDto userDto);
	
	/**
	 * 사용자 정보 삭제
	 * 
	 * @param userId
	 * @return
	 */
	public int deleteUserInfo(String userId);
	
	/**
	 * 사용자 비밀번호 변경
	 * 
	 * @param userDto
	 * @return
	 */
	public int updateUserPassword(UserDto userDto);
}
