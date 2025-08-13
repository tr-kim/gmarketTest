package com.web.gmarket.user.service.impl;

import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;

import com.web.gmarket.common.config.DynamicDataSourceService;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.user.dto.UserDto;
import com.web.gmarket.user.mapper.UserMapper;
import com.web.gmarket.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private DynamicDataSourceService dynamicDataSourceService;

	@Override
	public UserDto selectUserInfo(String userId, String delFlag) {
		
		UserDto userDto = new UserDto();
		userDto.setUserId(userId);
		userDto.setDelFlag(delFlag);
		
		return getMapper().selectUserInfo(userDto);
	}

	@Override
	public List<UserDto> selectUserInfoList(UserDto userDto) {
		return getMapper().selectUserInfoList(userDto);
	}

	@Override
	public int insertUserInfo(UserDto userDto) {
		// 비밀번호 암호화 및 hash 값 넣기
		passwordEncode(userDto);
		
		return getMapper().insertUserInfo(userDto);
	}

	@Override
	public int updateUserInfo(UserDto userDto) {
		// 비밀번호 암호화 및 hash 값 넣기
		passwordEncode(userDto);
		
		return getMapper().updateUserInfo(userDto);
	}

	@Override
	public int deleteUserInfo(String userId) {
		return getMapper().deleteUserInfo(userId);
	}

	@Override
	public int updateUserPassword(UserDto userDto) {
		// 비밀번호 암호화 및 hash 값 넣기
		passwordEncode(userDto);
		
		return getMapper().updateUserPassword(userDto);
	}

	@Override
	public LinkedHashMap<String, String> validateHandling(Errors errors) {
		LinkedHashMap<String, String> validatorResult = new LinkedHashMap<String, String>();

		for (FieldError error : errors.getFieldErrors()) {
			String validKeyName = String.format("valid_%s", error.getField());
			validatorResult.put(validKeyName, error.getDefaultMessage());
		}

		return validatorResult;
	}

	public static String createHash(String data) throws Exception {
		if (data == null) {
			throw new NullPointerException();
		}

		MessageDigest md = MessageDigest.getInstance("SHA-512");
		byte[] raw = md.digest(data.getBytes("EUC-KR"));

		StringBuffer result = new StringBuffer();
		for (int i = 0; i < raw.length; i++) {
			result.append(Integer.toHexString(raw[i] & 0xff));
		}
		return result.toString();
	}

	public static UserDto passwordEncode(UserDto userDto) {

		try {
			
			PasswordEncoder encoder = new BCryptPasswordEncoder();
			String password = userDto.getUserPwd();

			userDto.setEnc1Pa(createHash(password));
			userDto.setUserPwd(encoder.encode(password));

		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			e.printStackTrace();
		}

		return userDto;
	}
	
	public UserMapper getMapper() {
		return dynamicDataSourceService.getMapper(ConstantsUtils.DB_GMAREKT, UserMapper.class);
	}
}
