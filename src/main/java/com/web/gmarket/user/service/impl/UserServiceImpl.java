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

import com.web.gmarket.user.dto.UserDto;
import com.web.gmarket.user.mapper.UserMapper;
import com.web.gmarket.user.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserMapper userMapper;

	@Override
	public UserDto selectUserInfo(String userId, String delFlag) {
		UserDto userDto = new UserDto();
		userDto.setUserId(userId);
		userDto.setDelFlag(delFlag);
		return userMapper.selectUserInfo(userDto);
	}

	@Override
	public List<UserDto> selectUserInfoList(UserDto userDto) {
		return userMapper.selectUserInfoList(userDto);
	}

	@Override
	public int insertUserInfo(UserDto userDto) {
		// 비밀번호 암호화 및 hash 값 넣기

		try {

			PasswordEncoder encoder = new BCryptPasswordEncoder();

			String password = userDto.getUserPwd();

			userDto.setEnc1Pa(createHash(password));
			userDto.setUserPwd(encoder.encode(password));

		} catch (Exception e) {
			e.printStackTrace();
		}

		return userMapper.insertUserInfo(userDto);
	}

	@Override
	public int updateUserInfo(UserDto userDto) {

		try {

			PasswordEncoder encoder = new BCryptPasswordEncoder();

			String password = userDto.getUserPwd();

			userDto.setEnc1Pa(createHash(password));
			userDto.setUserPwd(encoder.encode(password));

		} catch (Exception e) {
			e.printStackTrace();
		}

		return userMapper.updateUserInfo(userDto);
	}

	@Override
	public int deleteUserInfo(String userId) {
		return userMapper.deleteUserInfo(userId);
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

	@Override
	public LinkedHashMap<String, String> validateHandling(Errors errors) {
		LinkedHashMap<String, String> validatorResult = new LinkedHashMap<String, String>();

		for (FieldError error : errors.getFieldErrors()) {
			String validKeyName = String.format("valid_%s", error.getField());
			validatorResult.put(validKeyName, error.getDefaultMessage());
		}

		return validatorResult;
	}
}
