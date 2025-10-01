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
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.Errors;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

import jakarta.servlet.http.HttpServletResponse;
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
	*/
	/**
	 * 메시지 전송 데이터 생성
	 * @throws IOException
	 */
	@PostMapping("/createSendData")
	public Map<String, Object> createSendData(
		@RequestParam("excelFile") String excelFile,
		@RequestParam("sheetName") String sheetName,
		@RequestParam("title") String title,
		@RequestParam("message") String messageTemplate,
		@RequestParam("messageType") String messageType,
		@RequestParam("callbackFlag") String callbackFlag,   // 발신번호 직접입력(1), 열선택(2)
		@RequestParam("callbackRow") String callbackRow,     // 발신번호 열선택 값
		@RequestParam("tranCallback") String tranCallback,   // 발신번호 직접입력 값
		@RequestParam("calleeFlag") String calleeFlag,       // 수신번호 직접입력(1), 열선택(2)
		@RequestParam("calleeRow") String calleeRow,         // 수신번호 열선택 값
		@RequestParam("tranCallee") String tranCallee,       // 수신번호 직접입력 값
		@RequestParam(value = "imageName01", required = false) String imageName01, // 이미지1
    	@RequestParam(value = "imageName02", required = false) String imageName02  // 이미지2
	) throws IOException {
		
		// 시트 데이터 읽기
		Map<String, Object> validation = ExcelSendService.readExcelData(excelFile, sheetName);
		if ("error".equals(validation.get("status"))) {
			return validation; // 실패 시 그대로 리턴
		}

		@SuppressWarnings("unchecked")
		List<List<String>> retData = (List<List<String>>) validation.get("retData");

		// 결과 데이터
		List<List<String>> newData = new ArrayList<>();
		Map<String, Object> result = new HashMap<>();

		// ========== header 세팅 ==========
		List<String> header = new ArrayList<>();
		header.add("발신번호");
		header.add("수신번호");
		header.add("전송시간");

		if ("lms".equalsIgnoreCase(messageType) || "mms".equalsIgnoreCase(messageType)) {
			header.add("제목");
		}

		header.add("길이");
		header.add("메시지");
		header.add("에러내용");

		if ("mms".equalsIgnoreCase(messageType)) {
			header.add("이미지1");
			header.add("이미지2");
		}

		newData.add(header);

		// ========== 데이터 세팅 ==========
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
			newRow.add(callback);                       // 발신번호
			newRow.add(callee);                         // 수신번호
			newRow.add("즉시전송");                      // 전송시간

			if ("lms".equalsIgnoreCase(messageType) || "mms".equalsIgnoreCase(messageType)) {
				newRow.add(title);                      // 제목
			}

			newRow.add(String.valueOf(messageLen));     // 길이
			newRow.add(decodedMessage);                 // 메시지
			newRow.add(errorMsg);                       // 에러내용

			if ("mms".equalsIgnoreCase(messageType)) {
				newRow.add(imageName01 != null ? imageName01 : ""); // 이미지1
				newRow.add(imageName02 != null ? imageName02 : ""); // 이미지2
			}

			newData.add(newRow);
		}

		result.put("status", "success");
		result.put("retData", newData);
		return result;
	}


	/**
	 * 엑셀 저장
	 * @throws IOException  
	 */
	@PostMapping("/downloadExcel")
	public void downloadExcel(@RequestBody Map<String, Object> requestData,
							HttpServletResponse response) throws IOException {

		@SuppressWarnings("unchecked")
		List<List<String>> retData = (List<List<String>>) requestData.get("retData");
		String msgType = (String) requestData.get("msgType");

		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("전송데이터");

		int rowNo = 0;

		// 헤더 생성
		XSSFRow headerRow = sheet.createRow(rowNo++);
		headerRow.createCell(0).setCellValue("발신번호");
		headerRow.createCell(1).setCellValue("수신번호");
		headerRow.createCell(2).setCellValue("전송시간");

		int colIdx = 3;
		if("lms".equals(msgType) || "mms".equals(msgType)) {
			headerRow.createCell(colIdx++).setCellValue("제목");
		}

		headerRow.createCell(colIdx++).setCellValue("길이");
		headerRow.createCell(colIdx++).setCellValue("메시지");
		headerRow.createCell(colIdx++).setCellValue("에러내용");

		if("mms".equals(msgType)) {
			headerRow.createCell(colIdx++).setCellValue("이미지1");
			headerRow.createCell(colIdx++).setCellValue("이미지2");
		}

		// 데이터 채우기
		for(int i = 1; i < retData.size(); i++) { // 0번은 헤더
			List<String> rowData = retData.get(i);
			Row row = sheet.createRow(rowNo++);
			for(int j = 0; j < rowData.size(); j++) {
				row.createCell(j).setCellValue(rowData.get(j));
			}
		}

		// response 설정
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-Disposition", "attachment; filename=\"엑셀발송.xls\"");

		workbook.write(response.getOutputStream());
		workbook.close();
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
				result.put(ConstantsUtils.CODE, ConstantsUtils.USER_NOT_EXCEL_SEND);
				result.put(ConstantsUtils.RESULT, "엑셀 발송 권한이 없습니다.");
				
				return ResponseEntity.status(HttpStatus.OK).body(result);
			}
			
			// 유효성 체크
			if(ValidateHandingUtils.validateHandling(errors) != null) {
				return ValidateHandingUtils.validateHandling(errors);
			}
			
			// 엑셀 발송 중인 상태 저장
			String jobId = UUID.randomUUID().toString();
			uploadStatus.put(jobId, new UploadProgress(0, 0, 0, "시작"));
			
			CompletableFuture.runAsync(() -> {
			    try {
			        excelSendService.insertExcelSend(dto, uploadStatus, jobId);
			    } catch (Exception e) {
			        throw new RuntimeException(e);
			    }
			});
			
			result.put(ConstantsUtils.CODE, ConstantsUtils.SUCCESS_CODE);
			result.put(ConstantsUtils.RESULT, jobId);
			
			return ResponseEntity.status(HttpStatus.OK).body(result);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("엑셀 발송 중 에러가 발생했습니다.", e);
			
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
        return ResponseEntity.ok(progress != null ? progress : new UploadProgress(-1, 0, 0, "작업을 찾을 수 없음"));
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
