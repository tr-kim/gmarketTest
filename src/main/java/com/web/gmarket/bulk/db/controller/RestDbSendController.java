package com.web.gmarket.bulk.db.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.bulk.db.dto.DbSendDto;
import com.web.gmarket.bulk.db.service.DbSendService;
import com.web.gmarket.common.auth.dto.UserDetailsDto;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.ValidateHandingUtils;
import com.web.gmarket.common.validation.ValidationSequence;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/dbSend")
public class RestDbSendController {
	private final DbSendService dbSendService;
	
	public RestDbSendController(DbSendService dbSendService) {
		this.dbSendService = dbSendService;
	}
	
	//요청번호 조회
	@PostMapping("/search")
	public ResponseEntity<?> getDbSendList(@RequestBody DbSendDto dbSendDto) {
		try {
			List<DbSendDto> result = dbSendService.getDbSendList(dbSendDto);
			int totalCount = dbSendService.getDbSendCount(dbSendDto);
			
			Map<String, Object> response = new HashMap<>();
			response.put(ConstantsUtils.DATA, result);
			response.put(ConstantsUtils.TOTAL_COUNT, totalCount);
			
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			
			Map<String, Object> error = new HashMap<>();
			error.put(ConstantsUtils.MESSAGE, "요청번호 조회 실패");
			error.put(ConstantsUtils.ERROR, e.getMessage());
			
			return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(error);
		}
	}
	
	//요청번호 삭제
	@DeleteMapping("/delete")
	public ResponseEntity<?> delete(@RequestBody DbSendDto dbSendDto) {
		try {
			Map<String, Object> response = new HashMap<>();
			
			int deletedCount = dbSendService.deleteDbSend(dbSendDto);
			
			if (deletedCount > 0) {
				response.put(ConstantsUtils.STATUS, ConstantsUtils.SUCCESS);
				response.put(ConstantsUtils.MESSAGE, "삭제 성공");
				return ResponseEntity.ok(response);
				
			} else {
				response.put(ConstantsUtils.STATUS, ConstantsUtils.FAIL);
				
				if (dbSendDto.getReserved4() == null) {
					response.put(ConstantsUtils.MESSAGE, "잘못된 요청 (필수 값 없음)");
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); // 400
				} else {
					response.put(ConstantsUtils.MESSAGE, "삭제 대상 없음");
					return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response); // 404
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			
			Map<String, Object> error = new HashMap<>();
			error.put(ConstantsUtils.STATUS, ConstantsUtils.ERROR);
			error.put(ConstantsUtils.MESSAGE, "요청번호 삭제 실패");
			error.put(ConstantsUtils.ERROR, e.getMessage());
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}
	
	// DB 발송
	@ResponseBody
	@PostMapping("/insert")
	public ResponseEntity<?> insert(Authentication authentication, @Validated(ValidationSequence.class) DbSendDto dbSendDto, Errors errors) {
		Map<String, Object> result = new HashMap<>();
		
		try {
			
			UserDetailsDto userDto = (UserDetailsDto) authentication.getPrincipal();
			
			// DB 발송 여부 체크
			if(ConstantsUtils.FALG_N.equals(userDto.getDbYn())) {
				result.put(ConstantsUtils.CODE, ConstantsUtils.USESR_NOT_DB_SEND);
				result.put(ConstantsUtils.RESULT, "DB 발송을 할 수 없습니다.");
				
				return ResponseEntity.status(HttpStatus.OK).body(result);
			}
			
			// 유효성 체크
			if(ValidateHandingUtils.validateHandling(errors) != null) {
				return ValidateHandingUtils.validateHandling(errors);
			}
			
			int cnt = dbSendService.insertDbSend(dbSendDto);
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.SUCCESS_CODE);
			result.put(ConstantsUtils.RESULT, cnt);
			
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.ERROR);
			result.put(ConstantsUtils.MESSAGE, "DB 발송 실패");
			result.put(ConstantsUtils.ERROR, e.getMessage());
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	} 
	
}