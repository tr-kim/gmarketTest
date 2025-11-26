package com.web.gmarket.bulk.file.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
import com.web.gmarket.common.vo.UploadProgress;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/fileSend")
public class RestFileSendController {
	
	@Autowired
	private FileSendService fileSendService;
	
	private final Map<String, UploadProgress> uploadStatus = new ConcurrentHashMap<>();
	
	/**
	 * 텍스트 파일 업로드
	 */
	@PostMapping("/txtUpload")
	public Map<String, Object> uploadTxtFile(@RequestParam("file") MultipartFile file, Authentication authentication) {
		
		UserDetailsDto user = (UserDetailsDto) authentication.getPrincipal();
		String userId = user.getUserId();
		
		return fileSendService.uploadTxtFile(file, userId);
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
			if(ConstantsUtils.FLAG_N.equals(userDto.getFileYn())) {
				result.put(ConstantsUtils.CODE, ConstantsUtils.USER_NOT_FILE_SEND);
				result.put(ConstantsUtils.RESULT, "파일 발송 권한이 없습니다.");
				
				return ResponseEntity.status(HttpStatus.OK).body(result);
			}
			
			// 유효성 체크
			if(ValidateHandingUtils.validateHandling(errors) != null) {
				return ValidateHandingUtils.validateHandling(errors);
			}
			
			// 파일 발송 중인 상태 저장
			String jobId = UUID.randomUUID().toString();
			uploadStatus.put(jobId, new UploadProgress(0, 0, 0, "시작"));
			
			CompletableFuture.runAsync(() -> {
			    try {
			    	fileSendService.insertFileSend(dto, uploadStatus, jobId);
			    } catch (Exception e) {
			        throw new RuntimeException(e);
			    }
			});
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.SUCCESS_CODE);
			result.put(ConstantsUtils.RESULT, jobId);
			
			return ResponseEntity.status(HttpStatus.OK).body(result);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("파일 발송 중 에러가 발생했습니다.", e);
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.ERROR_CODE);
			result.put(ConstantsUtils.RESULT, "파일 발송 중 에러가 발생했습니다.");
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	}
	
	/**
	 * 파일 발송 상태 체크
	 * 
	 * @param jobId
	 * @return
	 */
	@GetMapping("/uploadStatus/{jobId}")
    public ResponseEntity<UploadProgress> getUploadStatus(@PathVariable("jobId") String jobId) {
        UploadProgress progress = uploadStatus.get(jobId);
        return ResponseEntity.ok(progress != null ? progress : new UploadProgress(-1, 0, 0, "작업을 찾을 수 없음"));
    }
	
	/**
	 * 파일 발송 상태 삭제
	 * 
	 * @param jobId
	 * @return
	 */
	@GetMapping("/uploadStatus/delete/{jobId}")
    public ResponseEntity<?> getUploadStatusDel(@PathVariable("jobId") String jobId) {
        return ResponseEntity.ok(uploadStatus.remove(jobId));
    }
}
