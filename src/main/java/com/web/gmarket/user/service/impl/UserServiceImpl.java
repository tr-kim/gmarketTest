package com.web.gmarket.user.service.impl;

import java.security.MessageDigest;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.RequestBody;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.user.dto.UserDto;
import com.web.gmarket.user.mapper.UserMapper;
import com.web.gmarket.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
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
		passwordEncode(userDto);

		return userMapper.insertUserInfo(userDto);
	}

	@Override
	public int updateUserInfo(UserDto userDto) {
		// 비밀번호 암호화 및 hash 값 넣기
		passwordEncode(userDto);

		return userMapper.updateUserInfo(userDto);
	}

	// public int deleteUserInfo(String userId) {
	// 	return userMapper.deleteUserInfo(userId);
	// }

	@Override
	@Transactional
	public ResponseEntity<?> deleteUserInfo(List<UserDto> userDtoList) {
		Map<String, Object> result = new HashMap<>();

		try {
			if (userDtoList == null || userDtoList.isEmpty()) {
				result.put(ConstantsUtils.CODE, ConstantsUtils.DATA_DOSE_NOT_EXIST);
				result.put(ConstantsUtils.RESULT, "삭제할 항목이 없습니다.");
				return ResponseEntity.badRequest().body(result);
			}

			for (UserDto dto : userDtoList) {
				String userId = dto.getUserId();
				if (userId == null || userId.isEmpty()) continue;

				Map<String, Object> param = new HashMap<>();
				param.put("userId", userId);

				userMapper.deleteUserInfo(param);
			}

			result.put(ConstantsUtils.CODE, ConstantsUtils.SUCCESS_CODE);
			result.put(ConstantsUtils.RESULT, "삭제되었습니다.");
			return ResponseEntity.ok(result);

		} catch (Exception e) {
			e.printStackTrace();
			result.put(ConstantsUtils.CODE, ConstantsUtils.ERROR_CODE);
			result.put(ConstantsUtils.RESULT, "삭제 중 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	}

	@Override
	public int updateUserPassword(UserDto userDto) {
		// 비밀번호 암호화 및 hash 값 넣기
		passwordEncode(userDto);
		
		return userMapper.updateUserPassword(userDto);
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

}
