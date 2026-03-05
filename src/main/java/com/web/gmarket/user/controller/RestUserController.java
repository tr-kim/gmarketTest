package com.web.gmarket.user.controller;

import java.beans.PropertyEditorSupport;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.common.auth.dto.UserDetailsDto;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.RsaUtil;
import com.web.gmarket.common.utils.ValidateHandingUtils;
import com.web.gmarket.common.validation.ValidationSequence;
import com.web.gmarket.user.dto.UserDto;
import com.web.gmarket.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/user")
public class RestUserController {

	@Autowired
	private UserService userService;

	/**
	 * 사용자 등록 시 비밀번호가 암호화된 상태로 넘어오기 떄문에 검증(@Validated)하기 전 복호화 작업 검증 진행
	 * 
	 */
	@InitBinder
	public void initBinder(WebDataBinder binder, HttpServletRequest request) {
		binder.registerCustomEditor(String.class, "userPwd", new PropertyEditorSupport() {
			@Override
			public void setAsText(String encryptedPassword) {

				try {
					
					HttpSession session = request.getSession();
	
					if (session == null) {
						setValue(encryptedPassword); // 복호화 못하면 원본 그대로
						return;
					}
	
					RSAPrivateKey privateKey = (RSAPrivateKey) session.getAttribute(ConstantsUtils.RSA_WEB_KEY);
	
					if (privateKey == null) {
						setValue(encryptedPassword);
						return;
					}

					String decrypted = RsaUtil.decryptRsa(privateKey, encryptedPassword);
					setValue(decrypted);
					
				} catch (Exception e) {
					log.error(e.getLocalizedMessage());
					e.printStackTrace();
					throw new IllegalArgumentException("비밀번호 복호화 실패", e);
				}
			}
		});
	}

	/**
	 * 사용자 목록 조회
	 * 
	 * @param authentication
	 * @param userDto
	 * @return
	 */
	@ResponseBody
	@PostMapping("/list")
	public ResponseEntity<?> list(Authentication authentication, @RequestBody UserDto userDto) {

		Map<String, Object> result = new HashMap<>();
		
		try {
			
			// 로그인한 사용자의 등급 저장
			UserDetailsDto auth = (UserDetailsDto) authentication.getPrincipal();
			userDto.setCurrentUsesrGrade(auth.getUserGrade());
			
			result.put(ConstantsUtils.LIST, userService.selectUserInfoList(userDto));
			result.put(ConstantsUtils.TOTAL_COUNT, userService.selectUserInfoListCount(userDto));
			
			return new ResponseEntity<>(result, HttpStatus.OK);
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			e.printStackTrace();
			
			result.put(ConstantsUtils.LIST, Collections.emptyList());
			result.put(ConstantsUtils.TOTAL_COUNT, 0);
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	}

	/**
	 * 사용자 정보 등록
	 * 
	 * @param authentication
	 * @param userDto
	 * @return
	 */
	@ResponseBody
	@PostMapping("/insert")
	public ResponseEntity<?> insert(Authentication authentication, @Validated(ValidationSequence.class) UserDto userDto, Errors errors) {

		Map<String, Object> result = new HashMap<>();
		
		try {
			
			if(ValidateHandingUtils.validateHandling(errors) != null) return ValidateHandingUtils.validateHandling(errors);

			UserDto info = userService.selectUserInfo(userDto.getUserId(), null);

			if (info == null) {
				int cnt = userService.insertUserInfo(userDto);
				result.put(ConstantsUtils.CODE, cnt > 0 ? ConstantsUtils.SUCCESS_CODE : ConstantsUtils.ERROR_CODE);
			} else {
				result.put(ConstantsUtils.CODE, ConstantsUtils.USER_DUPLICATION);
				result.put(ConstantsUtils.RESULT, "동일한 사용자 정보가 존재합니다.");
			}

			return ResponseEntity.status(HttpStatus.OK).body(result);
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			e.printStackTrace();
			result.put(ConstantsUtils.CODE, ConstantsUtils.ERROR_CODE);
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}

		
	}

	/**
	 * 사용자 정보 수정
	 * 
	 * @param authentication
	 * @param userDto
	 * @param errors
	 * @return
	 */
	@ResponseBody
	@PutMapping("/update")
	public ResponseEntity<?> update(Authentication authentication, @Validated(ValidationSequence.class) UserDto userDto, Errors errors) {

		Map<String, Object> result = new HashMap<>();
		
		try {
			
			if(ValidateHandingUtils.validateHandling(errors) != null) return ValidateHandingUtils.validateHandling(errors);

			UserDto info = userService.selectUserInfo(userDto.getUserId(), null);

			if (info != null) {
				int cnt = userService.updateUserInfo(userDto);
				result.put(ConstantsUtils.CODE, cnt > 0 ? ConstantsUtils.SUCCESS_CODE : ConstantsUtils.ERROR_CODE);
			} else {
				result.put(ConstantsUtils.CODE, ConstantsUtils.USER_NON_EXISTENCE);
				result.put(ConstantsUtils.RESULT, "사용자 정보가 존재하지 않습니다");
			}

			return ResponseEntity.status(HttpStatus.OK).body(result);
			
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			e.printStackTrace();
			result.put(ConstantsUtils.CODE, ConstantsUtils.ERROR_CODE);
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}

		
	}

	/**
	 * 사용자 정보 삭제
	 *
	 * @param userDtoList
	 * @return
	 */
	@DeleteMapping("/delete")
	public ResponseEntity<?> delete(@RequestBody List<UserDto> userDtoList) {
		return userService.deleteUserInfo(userDtoList);
	}

	/**
	 * 사용자 비밀번호 변경
	 * 
	 * @param authentication
	 * @param request
	 * @param userDto
	 * @return
	 */
	@ResponseBody
	@PutMapping("/passwordChg")
	public ResponseEntity<?> passwordChg(Authentication authentication, HttpServletRequest request, UserDto userDto) {

		Map<String, Object> result = new HashMap<>();

		try {

			UserDto info = userService.selectUserInfo(userDto.getUserId(), ConstantsUtils.FLAG_N);

			if (info != null) {
				int cnt = userService.updateUserPassword(userDto);
				result.put(ConstantsUtils.CODE, cnt > 0 ? ConstantsUtils.SUCCESS_CODE : ConstantsUtils.ERROR_CODE);
			} else {
				result.put(ConstantsUtils.CODE, ConstantsUtils.USER_NON_EXISTENCE);
				result.put(ConstantsUtils.RESULT, "사용자 정보가 존재하지 않습니다");
			}
			
			return ResponseEntity.status(HttpStatus.OK).body(result);
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			e.printStackTrace();
			result.put(ConstantsUtils.CODE, ConstantsUtils.ERROR_CODE);
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}

		
	}

	/**
	 * 비밀번호 암호화
	 * 
	 * @param authentication
	 * @param userDto
	 * @return
	 * @throws NoSuchAlgorithmException
	 * @throws InvalidKeySpecException
	 */
	@ResponseBody
	@PostMapping("/rsa")
	public ResponseEntity<?> passwordRsa(Authentication authentication, HttpServletRequest request, HttpServletResponse reponse, HttpSession session, Model model) {

		Map<String, Object> result = new HashMap<>();

		// Private Key 삭제
		request.getSession().removeAttribute(ConstantsUtils.RSA_WEB_KEY);

		try {
			
			// PrivateKey, PublicKey 생성
			KeyPair keyPair = RsaUtil.generateKeypair();

			RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
			RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

			// PrivateKey Session 저장
			session.setAttribute(ConstantsUtils.RSA_WEB_KEY, privateKey);

			// PublicKey input hidden 저장
			result.put(ConstantsUtils.RSA_MODULUS, RsaUtil.getRSAPublicModulus(publicKey));
			result.put(ConstantsUtils.RSA_EXPONENT, RsaUtil.getRSAPublicExponent(publicKey));
			
			return ResponseEntity.status(HttpStatus.OK).body(result);

		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			e.printStackTrace();
			result.put(ConstantsUtils.RSA_MODULUS, "");
			result.put(ConstantsUtils.RSA_EXPONENT, "");
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	}
	
	/**
	 * 세션 정보 조회
	 * 
	 */
	@PostMapping("/session")
	public ResponseEntity<?> getSession(Authentication authentication) {
		
		UserDetailsDto user = null;
		
		if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsDto)) {
			System.out.println(">>> 테스트 사용자");
			
			// 내부 DTO 생성
			UserDto userDto = new UserDto();
			userDto.setUserId("test");
			userDto.setUserName("테스트");
			userDto.setUserGrade(0); // 슈퍼관리자
			userDto.setCompanyCode(1); // G마켓
			userDto.setSmsYn("Y");
			userDto.setExcelYn("Y");
			userDto.setFileYn("Y");
			userDto.setDbYn("Y");
			userDto.setLmsYn("Y");
			userDto.setMmsYn("Y");
			
			user = new UserDetailsDto(userDto);
			
		} else {
			System.out.println(">>> 로그인 사용자");
			
			user = (UserDetailsDto) authentication.getPrincipal();
		}
		
		Map<String, Object> result = new HashMap<>();
		result.put("userId", user.getUserId());
		result.put("userName", user.getUsername());
		result.put("userGrade", user.getUserGrade());
		result.put("companyCode", user.getCompanyCode());
	    result.put("smsYn", user.getSmsYn());
	    result.put("excelYn", user.getExcelYn());
	    result.put("fileYn", user.getFileYn());
	    result.put("dbYn", user.getDbYn());
	    result.put("lmsYn", user.getLmsYn());
	    result.put("mmsYn", user.getMmsYn());
	    
		return ResponseEntity.ok(result);
	}
}