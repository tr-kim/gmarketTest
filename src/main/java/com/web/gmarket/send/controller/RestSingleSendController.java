package com.web.gmarket.send.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.common.auth.dto.UserDetailsDto;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.ValidateHandingUtils;
import com.web.gmarket.common.validation.ValidationSequence;
import com.web.gmarket.send.dto.SingleSendDto;
import com.web.gmarket.send.service.SingleSendService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/singleSend")
public class RestSingleSendController {
	private final SingleSendService singleSendService;
	
	public RestSingleSendController(SingleSendService singleSendService) {
		this.singleSendService = singleSendService;
	}
	
	// 개별 발송
	@ResponseBody
	@PostMapping("/insert")
	public ResponseEntity<?> insert(Authentication authentication, @Validated(ValidationSequence.class) SingleSendDto singleSendDto, Errors errors) {
		Map<String, Object> result = new HashMap<>();
		
		try {
			UserDetailsDto userDto = (UserDetailsDto) authentication.getPrincipal();
			
			// SMS 사용 여부 체크
			if(ConstantsUtils.FALG_N.equals(userDto.getSmsYn())) {
				result.put(ConstantsUtils.CODE, ConstantsUtils.USER_NOT_SMS_SEND);
				result.put(ConstantsUtils.RESULT, "SMS 발송 권한이 없습니다.");
				
				return ResponseEntity.status(HttpStatus.OK).body(result);
			}
			
			// 유효성 체크
			if(ValidateHandingUtils.validateHandling(errors) != null) {
				return ValidateHandingUtils.validateHandling(errors);
			}
			
			Map<String, Integer> sendResult = singleSendService.insertSingleSend(singleSendDto);
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.SUCCESS_CODE);
			result.put(ConstantsUtils.RESULT, sendResult);
			
			return ResponseEntity.status(HttpStatus.OK).body(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.ERROR);
			result.put(ConstantsUtils.RESULT, "개별 발송 실패");
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	}
}