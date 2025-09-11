package com.web.gmarket.bulk.excel.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.text.StringEscapeUtils;
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

import com.web.gmarket.bulk.excel.dto.ExcelSendDto;
import com.web.gmarket.bulk.excel.service.ExcelSendService;
import com.web.gmarket.common.auth.dto.UserDetailsDto;
import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.ValidateHandingUtils;
import com.web.gmarket.common.validation.ValidationSequence;
import com.web.gmarket.common.vo.UploadProgress;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/excelSend")
public class RestExcelSendController {
	
	@Autowired
	private ExcelSendService excelSendService;
	
	private final Map<String, UploadProgress> uploadStatus = new ConcurrentHashMap<>();
	   
	/**
	 * 엑셀 파일 업로드
	 * @throws IOException 
	 */
	@PostMapping("/fileUpload")
	public Map<String, Object> uploadExcelFile(@RequestParam("file") MultipartFile file, Authentication authentication) throws IOException {
		
		UserDetailsDto user = (UserDetailsDto) authentication.getPrincipal();
		String userId = user.getUserId();
		
		return ExcelSendService.uploadExcelFile(file, userId);
	}
	
	
	/**
	 * 엑셀 시트 읽기
	 * @throws IOException 
	 */
	@PostMapping("/readSheet")
	public Map<String, Object> readExcelSheet(@RequestParam("excelFile") String excelFile, @RequestParam("sheetName") String sheetName) throws IOException {
		
		return ExcelSendService.readExcelData(excelFile, sheetName);
	}
	
	
	/**
	 * 발신번호, 수신번호, 전송시간 추가
	 * @throws IOException  
	 */
	@PostMapping("/reserve")
	public Map<String, Object> reserve(
		@RequestParam("excelFile") String excelFile,
		@RequestParam("sheetName") String sheetName,
		@RequestParam("callbackFlag") String callbackFlag, 		// 발신번호 직접입력(1), 열선택(2)
		@RequestParam("callbackRow") String callbackRow, 		// 발신번호 열선택 값
		@RequestParam("tranCallback") String tranCallback, 		// 발신번호 직접입력 값
		@RequestParam("calleeFlag") String calleeFlag, 			// 수신번호 직접입력(1), 열선택(2)
		@RequestParam("calleeRow") String calleeRow, 			// 수신번호 열선택 값
		@RequestParam("tranCallee") String tranCallee 			// 수신번호 직접입력 값
	) throws IOException {
		
		// 시트 데이터 읽기
		Map<String, Object> validation = ExcelSendService.readExcelData(excelFile, sheetName);
		if ("error".equals(validation.get("status"))) {
			return validation; // 실패 시 그대로 리턴
		}
		
		@SuppressWarnings("unchecked")
		List<List<String>> retData = (List<List<String>>) validation.get("retData");
		
		// 발신번호, 수신번호, 전송시간 추가 시작
		List<List<String>> newData = new ArrayList<>();
		Map<String, Object> result = new HashMap<>();
		
		List<String> header = new ArrayList<>();
		header.add("발신번호");
		header.add("수신번호");
		header.add("전송시간");
		header.addAll(retData.get(0)); // 기존 열번호(ABC) 그대로 유지
		newData.add(header);
		
		// 데이터
		for (int i = 1; i < retData.size(); i++) {
			List<String> row = retData.get(i);
			
			String callback = ExcelSendService.applyTranNum(callbackFlag, callbackRow, tranCallback, row);
			String callee   = ExcelSendService.applyTranNum(calleeFlag,   calleeRow,   tranCallee,   row);
			
			List<String> newRow = new ArrayList<>();
			newRow.add(callback); 	// 발신번호
			newRow.add(callee); 	// 수신번호
			newRow.add("즉시전송"); 	// 전송시간
			newRow.addAll(row); 	// 원본
			newData.add(newRow);
		}
		// 발신번호, 수신번호, 전송시간 추가 종료
		
		result.put("status", "success");
		result.put("retData", newData);
		
		return result;
	}
	
	
	/**
	 * 길이, 메시지, 에러내용 추가
	 * @throws IOException  
	 */
	@PostMapping("/createSendData")
	public Map<String, Object> createSendData(
		@RequestParam("excelFile") String excelFile,
		@RequestParam("sheetName") String sheetName,
		@RequestParam("title") String title,
		@RequestParam("message") String messageTemplate,
		@RequestParam("messageType") String messageType,
		@RequestParam("callbackFlag") String callbackFlag, 		// 발신번호 직접입력(1), 열선택(2)
		@RequestParam("callbackRow") String callbackRow, 		// 발신번호 열선택 값
		@RequestParam("tranCallback") String tranCallback, 		// 발신번호 직접입력 값
		@RequestParam("calleeFlag") String calleeFlag, 			// 수신번호 직접입력(1), 열선택(2)
		@RequestParam("calleeRow") String calleeRow, 			// 수신번호 열선택 값
		@RequestParam("tranCallee") String tranCallee 			// 수신번호 직접입력 값
	) throws IOException {
		
		// 시트 데이터 읽기
	    Map<String, Object> validation = ExcelSendService.readExcelData(excelFile, sheetName);
		if ("error".equals(validation.get("status"))) {
			return validation; // 실패 시 그대로 리턴
		}
		
	    @SuppressWarnings("unchecked")
	    List<List<String>> retData = (List<List<String>>) validation.get("retData");
	    
	    // 길이, 메시지, 에러내용 추가 시작
	    List<List<String>> newData = new ArrayList<>();
	    Map<String, Object> result = new HashMap<>();
	    
		List<String> header = new ArrayList<>();
		header.add("발신번호");
		header.add("수신번호");
		header.add("전송시간");
		header.add("길이");
		header.add("메시지");
		header.add("에러내용");
		// header.addAll(retData.get(0)); // 기존 열번호(ABC) 그대로 유지
		newData.add(header);
		
		// 데이터
		for (int i = 1; i < retData.size(); i++) {
			List<String> row = retData.get(i);
			
			String callback = ExcelSendService.applyTranNum(callbackFlag, callbackRow, tranCallback, row);
			String callee   = ExcelSendService.applyTranNum(calleeFlag,   calleeRow,   tranCallee,   row);
			
			String message  = ExcelSendService.applyMessage(messageTemplate, row);
			int messageLen  = ExcelSendService.getSMSLen(message);
			int titleLen    = (title == null) ? 0 : title.length();
			String errorMsg = ExcelSendService.checkStrLen(messageLen, titleLen, callee, callback, messageType);
			String decodedMessage = StringEscapeUtils.unescapeHtml4(message);
			
			List<String> newRow = new ArrayList<>();
			newRow.add(callback); 						// 발신번호
			newRow.add(callee); 						// 수신번호
			newRow.add("즉시전송"); 						// 전송시간
			newRow.add(String.valueOf(messageLen)); 	// 길이
			newRow.add(decodedMessage); 				// 메시지
			newRow.add(errorMsg); 						// 에러내용
			// newRow.addAll(row); 						// 원본
			newData.add(newRow);
		}
		// 길이, 메시지, 에러내용 추가 종료
		
		result.put("status", "success");
		result.put("retData", newData);
		
		return result;
	}
	
	
	/**
	 * 엑셀 파일 업로드
	 * @throws IOException 
	 */
	@ResponseBody
	@PostMapping("/insert")
	public ResponseEntity<?> insert(Authentication authentication, @Validated(ValidationSequence.class) ExcelSendDto dto, Errors errors) {
		
		Map<String, Object> result = new HashMap<>();
		
		try {
			
			UserDetailsDto userDto = (UserDetailsDto) authentication.getPrincipal();
			
			// 엑셀 발송 여부 체크
			if(ConstantsUtils.FALG_N.equals(userDto.getExcelYn())) {
				result.put(ConstantsUtils.CODE, ConstantsUtils.USESR_NOT_EXCEL_SEND);
				result.put(ConstantsUtils.RESULT, "엑셀 발송을 할 수 없습니다.");
				
				return ResponseEntity.status(HttpStatus.OK).body(result);
			}
			
			// 유효성 체크
			if(ValidateHandingUtils.validateHandling(errors) != null) {
				return ValidateHandingUtils.validateHandling(errors);
			}
			
			// 엑셀 발송 중인 상태 저장
			String jobId = UUID.randomUUID().toString();
			uploadStatus.put(jobId, new UploadProgress(0, 0, 0, "시작"));
			
			CompletableFuture.runAsync(() -> excelSendService.insertExcelSend(dto, uploadStatus, jobId));
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.SUCCESS_CODE);
			result.put(ConstantsUtils.RESULT, jobId);
			
			return ResponseEntity.status(HttpStatus.OK).body(result);
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage());
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.ERROR_CODE);
			result.put(ConstantsUtils.RESULT, "엑셀 발송 중 에러가 발생했습니다.");
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	} 
	
	/**
	 * 엑셀 발송 상태 체크
	 * 
	 * @param jobId
	 * @return
	 */
	@GetMapping("/uploadStatus/{jobId}")
    public ResponseEntity<UploadProgress> getUploadStatus(@PathVariable("jobId") String jobId) {
        UploadProgress progress = uploadStatus.get(jobId);
        return ResponseEntity.ok(progress != null ? progress : new UploadProgress(0, 0, 0, "작업을 찾을 수 없음"));
    }
	
	/**
	 * 엑셀 발송 상태 삭제
	 * 
	 * @param jobId
	 * @return
	 */
	@GetMapping("/uploadStatus/delete/{jobId}")
    public ResponseEntity<?> getUploadStatusDel(@PathVariable("jobId") String jobId) {
        return ResponseEntity.ok(uploadStatus.remove(jobId));
    }
	
}
