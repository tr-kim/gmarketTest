package com.web.gmarket.bulk.file.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.bulk.file.dto.FileSendDto;
import com.web.gmarket.bulk.file.service.FileSendService;
import com.web.gmarket.common.auth.dto.UserDetailsDto;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.ValidateHandingUtils;
import com.web.gmarket.common.validation.ValidationSequence;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/fileSend")
public class RestFileSendController {
	
	@Autowired
	private FileSendService fileSendService;
	
	/**
	 * 텍스트 파일 업로드
	 */
	@PostMapping("/txtUpload")
	public Map<String, Object> uploadTxtFile(@RequestParam("file") MultipartFile file, Authentication authentication) {
		
		UserDetailsDto user = (UserDetailsDto) authentication.getPrincipal();
		String userId = user.getUserId();
		
		return FileSendService.uploadTxtFile(file, userId);
	}
	
	
	/**
	 * 파일 업로드
	 * 
	 * @param authentication
	 * @param dto
	 * @param errors
	 * @return
	 */
	@ResponseBody
	@PostMapping("/insert")
	public ResponseEntity<?> insert(Authentication authentication, @Validated(ValidationSequence.class) FileSendDto dto, Errors errors) {
		
		Map<String, Object> result = new HashMap<>();
		
		try {
			
			UserDetailsDto userDto = (UserDetailsDto) authentication.getPrincipal();
			
			// 파일 발송 여부 체크
			if(ConstantsUtils.FALG_N.equals(userDto.getFileYn())) {
				result.put(ConstantsUtils.CODE, ConstantsUtils.USER_NOT_FILE_SEND);
				result.put(ConstantsUtils.RESULT, "파일 발송 권한이 없습니다.");
				
				return ResponseEntity.status(HttpStatus.OK).body(result);
			}
			
			// 유효성 체크
			if(ValidateHandingUtils.validateHandling(errors) != null) {
				return ValidateHandingUtils.validateHandling(errors);
			}
			
			Map<String, Integer> sendResult = fileSendService.insertFileSend(dto);
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.SUCCESS_CODE);
			result.put(ConstantsUtils.RESULT, sendResult);
			
			return ResponseEntity.status(HttpStatus.OK).body(result);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("파일 발송 중 에러가 발생했습니다.", e);
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.ERROR_CODE);
			result.put(ConstantsUtils.RESULT, "파일 발송 중 에러가 발생했습니다.");
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	}
}
