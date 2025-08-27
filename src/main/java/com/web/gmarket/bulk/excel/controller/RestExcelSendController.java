package com.web.gmarket.bulk.excel.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.text.StringEscapeUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.bulk.excel.service.ExcelSendService;
import com.web.gmarket.common.auth.dto.UserDetailsDto;
import com.web.gmarket.common.utils.ConstantsUtils;

@RestController
@RequestMapping("/api/v1/excelSend")
public class RestExcelSendController {
	
	String EXCEL_PATH = ConstantsUtils.EXCEL_PATH;
	
	
	/**
	 * 엑셀 파일 업로드
	 * @throws IOException 
	 */
	@PostMapping("/fileUpload")
	public Map<String, Object> uploadExcelFile(@RequestParam("file") MultipartFile file, Authentication authentication) throws IOException {
		Map<String, Object> result = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		
		// 1. 파일 저장 경로
		File dir = new File(EXCEL_PATH);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		
		// 2. 파일 저장
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String nowStr = sdf.format(new Date());
		String originalFilename = file.getOriginalFilename();
		//String savedFileName = "SEND_" + nowStr + "_" + originalFilename;
		
		String ext = "";
		int dotIndex = originalFilename.lastIndexOf(".");
		if (dotIndex != -1) {
			ext = originalFilename.substring(dotIndex); // 확장자 추출
		}
		
		//String userId = ((UserDetails) authentication.getPrincipal()).getUsername(); // 서버 세션 ID
		UserDetailsDto user = (UserDetailsDto) authentication.getPrincipal();
		String userId = user.getUserId();
		String savedFileName = "SEND_" + nowStr + "_" + userId + ext;
		
		File savedFile = new File(EXCEL_PATH + "/" + savedFileName);
		file.transferTo(savedFile);
		
		Workbook workbook = null;
		try (InputStream is = new FileInputStream(savedFile)) {
			// 3. 확장자에 따라 Workbook 생성
			if (savedFileName.endsWith(".xls")) {
				workbook = new HSSFWorkbook(is);
			} else if (savedFileName.endsWith(".xlsx")) {
				workbook = new XSSFWorkbook(is);
			} else {
		        result.put("status", "error");
		        result.put("message", "엑셀 파일 형식이 아닙니다.");
		        return result;
			}
			
			// 4. 시트 이름 추가
			int sheetNum = workbook.getNumberOfSheets();
			List<String> sheetNames = new ArrayList<>();
			for (int i = 0; i < sheetNum; i++) {
				sheetNames.add(workbook.getSheetName(i));
			}
			
			// 리턴값 셋팅
			data.put("excelFile", savedFileName);
			data.put("sheetName", sheetNames);
			
			result.put("status", "success");
			result.put("retData", data);
			
		} catch (Exception e) {
			result.put("status", "error");
			result.put("message", e.getMessage());
			
		} finally {
			if (workbook != null) {
				workbook.close();
			}
			
			// 5. 파일 삭제
			//savedFile.delete();
		}
		
		return result;
	}
	
	
	/**
	 * 엑셀 시트 읽기
	 * @throws IOException 
	 */
	@PostMapping("/readSheet")
	public Map<String, Object> readExcelSheet(@RequestParam("excelFile") String excelFile, @RequestParam("sheetName") String sheetName) throws IOException {
		
		Map<String, Object> result = new HashMap<>();
		List<List<String>> data = new ArrayList<>();
		
		// 1. 엑셀 파일 검증
		Map<String, Object> validation = ExcelSendService.validateExcelFile(excelFile, sheetName);
		if ("error".equals(validation.get("status"))) {
			return validation; // 실패 시 그대로 리턴
		}
		
		// 2. 시트 내용 읽기
		Sheet sheet = (Sheet) validation.get("sheet");
		int maxRows = (int) validation.get("maxRows");
		int maxCells = (int) validation.get("maxCells");
		
		// 3. 열번호 행 추가
		List<String> colHeaders = new ArrayList<>();
		for (int i = 0; i < maxCells; i++) {
			colHeaders.add(ExcelSendService.getColumnName(i));
		}
		data.add(colHeaders);
		
		// 4. 데이터 행 추가
		for (int r = 0; r < maxRows; r++) {
			Row row = sheet.getRow(r);
			List<String> rowData = new ArrayList<>();
			
			for (int c = 0; c < maxCells; c++) {
				String excelValue = "";
				if (row != null) {
					Cell cell = row.getCell(c);
					if (cell != null) {
						switch (cell.getCellType()) {
							case FORMULA: // 수식이 들어있는 경우
								excelValue = cell.getCellFormula();
								break;
								
							case NUMERIC:
								if (DateUtil.isCellDateFormatted(cell)) {
									excelValue = new SimpleDateFormat("yyyy-MM-dd").format(cell.getDateCellValue());
								} else {
									excelValue = String.valueOf((int) cell.getNumericCellValue());
								}
								break;
								
							case STRING:
								excelValue = cell.getStringCellValue();
								break;
								
							case BLANK:
								excelValue = "";
								break;
								
							case BOOLEAN:
								excelValue = String.valueOf(cell.getBooleanCellValue());
								break;
								
							case ERROR:
								excelValue = String.valueOf(cell.getErrorCellValue());
								break;
								
							default:
								excelValue = "";
						}
					}
				}
				rowData.add(excelValue);
			}
			data.add(rowData);
		}
		
		// 리턴값 셋팅
		result.put("status", "success");
		result.put("retData", data);
		
		return result;
	}
	
	
	/**
	 * 발신번호, 수신번호, 전송시간 추가
	 * @throws IOException  
	 */
	@PostMapping("/reserve")
	public Map<String, Object> reserve(
		@RequestParam("excelFile") String excelFile,
		@RequestParam("sheetName") String sheetName,
		// 발신번호
		@RequestParam("callbackFlag") String callbackFlag, 	// 직접입력(1), 드롭다운(2)
		@RequestParam("callbackRow") String callbackRow, 	// 드롭다운 값
		@RequestParam("tranCallback") String tranCallback, 	// 직접입력 값
		// 수신번호
		@RequestParam("calleeFlag") String calleeFlag, 	// 직접입력(1), 드롭다운(2)
		@RequestParam("calleeRow") String calleeRow, 	// 드롭다운 값
		@RequestParam("tranCallee") String tranCallee 	// 직접입력 값
	) throws IOException {
		
		Map<String, Object> result = new HashMap<>();
		List<List<String>> data = new ArrayList<>();
		
		// 1. 엑셀 파일 검증
		Map<String, Object> validation = ExcelSendService.validateExcelFile(excelFile, sheetName);
		if ("error".equals(validation.get("status"))) {
			return validation; // 실패 시 그대로 리턴
		}
		
		// 2. 시트 내용 읽기
		Sheet sheet = (Sheet) validation.get("sheet");
		int maxRows = (int) validation.get("maxRows");
		int maxCells = (int) validation.get("maxCells");
		
		// 3. 열번호 행 추가
		List<String> colHeaders = new ArrayList<>();
		for (int i = 0; i < maxCells; i++) {
			colHeaders.add(ExcelSendService.getColumnName(i));
		}
		data.add(colHeaders);
		
		// 4. 데이터 행 추가
		for (int r = 0; r < maxRows; r++) {
			Row row = sheet.getRow(r);
			List<String> rowData = new ArrayList<>();
			
			for (int c = 0; c < maxCells; c++) {
				String excelValue = "";
				if (row != null) {
					Cell cell = row.getCell(c);
					if (cell != null) {
						switch (cell.getCellType()) {
							case FORMULA: // 수식이 들어있는 경우
								excelValue = cell.getCellFormula();
								break;
								
							case NUMERIC:
								if (DateUtil.isCellDateFormatted(cell)) {
									excelValue = new SimpleDateFormat("yyyy-MM-dd").format(cell.getDateCellValue());
								} else {
									excelValue = String.valueOf((int) cell.getNumericCellValue());
								}
								break;
								
							case STRING:
								excelValue = cell.getStringCellValue();
								break;
								
							case BLANK:
								excelValue = "";
								break;
								
							case BOOLEAN:
								excelValue = String.valueOf(cell.getBooleanCellValue());
								break;
								
							case ERROR:
								excelValue = String.valueOf(cell.getErrorCellValue());
								break;
								
							default:
								excelValue = "";
						}
					}
				}
				rowData.add(excelValue);
			}
			data.add(rowData);
		}
		
		// 발신번호, 수신번호, 전송시간 추가 시작
		List<List<String>> newData = new ArrayList<>();
		
		List<String> header = new ArrayList<>();
		header.add("발신번호");
		header.add("수신번호");
		header.add("전송시간");
		header.addAll(data.get(0)); // 기존 열번호(ABC) 그대로 유지
		newData.add(header);
		
		// 열 인덱스 구하기 (문자열 → 숫자 변환)
		int callbackCol = -1;
		if ("2".equals(callbackFlag)) {
			callbackCol = ExcelSendService.getColumnNameToIndex(callbackRow); // 예: "B" → 1
		}
		
		int calleeCol = -1;
		if ("2".equals(calleeFlag)) {
			calleeCol = ExcelSendService.getColumnNameToIndex(calleeRow);
		}
		
		// 데이터 채우기
		// 0:열번호, 1부터 실제데이터
		for (int i = 1; i < data.size(); i++) {
			List<String> row = data.get(i); List<String> newRow = new ArrayList<>();
			
			// 발신번호
			String callback = "";
			if ("1".equals(callbackFlag)) {
				callback = tranCallback;
			} else if ("2".equals(callbackFlag) && callbackCol >= 0 && callbackCol < row.size()) {
				callback = row.get(callbackCol);
			}
			
			// 수신번호
			String callee = "";
			if ("1".equals(calleeFlag)) {
				callee = tranCallee; 
			} else if ("2".equals(calleeFlag) && calleeCol >= 0 && calleeCol < row.size()) {
				callee = row.get(calleeCol);
			}
			
			// 전송시간
			newRow.add(callback);
			newRow.add(callee);
			newRow.add("즉시전송");
			newRow.addAll(row);
			newData.add(newRow);
		}
		// 발신번호, 수신번호, 전송시간 추가 종료
		
		// 리턴값 셋팅
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
			@RequestParam("callbackFlag") String callbackFlag,
			@RequestParam("callbackRow") String callbackRow,
			@RequestParam("tranCallback") String tranCallback,
			@RequestParam("calleeFlag") String calleeFlag,
			@RequestParam("calleeRow") String calleeRow,
			@RequestParam("tranCallee") String tranCallee
	) throws IOException {

		Map<String, Object> result = new HashMap<>();
		List<List<String>> data = new ArrayList<>();

		// 1. 엑셀 파일 검증
		Map<String, Object> validation = ExcelSendService.validateExcelFile(excelFile, sheetName);
		if ("error".equals(validation.get("status"))) {
			return validation; // 실패 시 그대로 리턴
		}

		// 2. 시트 내용 읽기
		Sheet sheet = (Sheet) validation.get("sheet");
		int maxRows = (int) validation.get("maxRows");
		int maxCells = (int) validation.get("maxCells");

		// 3. 헤더 설정
		List<String> header = new ArrayList<>();
		header.add("발신번호");
		header.add("수신번호");
		header.add("전송시간");
		header.add("길이");
		header.add("메시지");
		header.add("에러내용");
		data.add(header);

		// 4. 데이터 처리
		for (int r = 0; r < maxRows; r++) {
			Row row = sheet.getRow(r);
			if (row == null) continue;

			List<String> rowData = new ArrayList<>();
			List<String> cellValues = new ArrayList<>();
			for (int c = 0; c < maxCells; c++) {
				Cell cell = row.getCell(c);
				cellValues.add(cell != null ? cell.toString() : "");
			}

			// 메시지 변수 치환
			String message = messageTemplate;
			for (int c = 0; c < cellValues.size(); c++) {
				String code = String.valueOf((char)('A' + c));
				message = message.replace("[%"+code+"%]", cellValues.get(c));
			}

			// 발신번호 처리
			String callbackValue = "1".equals(callbackFlag) ? tranCallback
					: (callbackRow.charAt(0) - 'A' < cellValues.size() ? cellValues.get(callbackRow.charAt(0) - 'A') : "");

			// 수신번호 처리
			String calleeValue = "1".equals(calleeFlag) ? tranCallee
					: (calleeRow.charAt(0) - 'A' < cellValues.size() ? cellValues.get(calleeRow.charAt(0) - 'A') : "");

			int messageLen = ExcelSendService.getSMSLen(message);
			int titleLen = (title != null) ? title.length() : 0;
			String errorMsg = ExcelSendService.checkStrLen(messageLen, titleLen, calleeValue, callbackValue, messageType);
			String decodedMessage = StringEscapeUtils.unescapeHtml4(message);

			// 2차원 배열로 추가
			List<String> newRow = new ArrayList<>();
			newRow.add(callbackValue);
			newRow.add(calleeValue);
			newRow.add("즉시전송");
			newRow.add(String.valueOf(messageLen));
			newRow.add(decodedMessage);
			newRow.add(errorMsg);

			data.add(newRow);
		}

		result.put("status", "success");
		result.put("retData", data);

		return result;
	}
	// @PostMapping("/createSendData")
	// public Map<String, Object> createSendData(
	// 	@RequestParam("excelFile") String excelFile,
	// 	@RequestParam("sheetName") String sheetName,
	// 	//제목, 내용
	// 	@RequestParam("title") String title,
	// 	@RequestParam("message") String messageTemplate,
	// 	@RequestParam("messageType") String messageType,
	// 	// 발신번호
	// 	@RequestParam("callbackFlag") String callbackFlag, 	// 직접입력(1), 드롭다운(2)
	// 	@RequestParam("callbackRow") String callbackRow, 	// 드롭다운 값
	// 	@RequestParam("tranCallback") String tranCallback, 	// 직접입력 값
	// 	// 수신번호
	// 	@RequestParam("calleeFlag") String calleeFlag, 	// 직접입력(1), 드롭다운(2)
	// 	@RequestParam("calleeRow") String calleeRow, 	// 드롭다운 값
	// 	@RequestParam("tranCallee") String tranCallee 	// 직접입력 값
	// ) throws IOException {
		
	// 	Map<String, Object> result = new HashMap<>();
	// 	List<Map<String, Object>> data = new ArrayList<>();
		
	// 	// 1. 엑셀 파일 검증
	// 	Map<String, Object> validation = ExcelSendService.validateExcelFile(excelFile, sheetName);
	// 	if ("error".equals(validation.get("status"))) {
	// 		return validation; // 실패 시 그대로 리턴
	// 	}
		
	// 	// 2. 시트 내용 읽기
	// 	Sheet sheet = (Sheet) validation.get("sheet");
	// 	int maxRows = (int) validation.get("maxRows");
	// 	int maxCells = (int) validation.get("maxCells");
		
	// 	// 길이, 메시지, 에러내용 추가 시작
	// 	for (int r = 0; r < maxRows; r++) {
	// 		Row row = sheet.getRow(r);
	// 		if (row == null) continue;

	// 		List<String> rowData = new ArrayList<>();
	// 		for (int c = 0; c < maxCells; c++) {
	// 			Cell cell = row.getCell(c);
	// 			rowData.add(cell != null ? cell.toString() : "");
	// 		}

	// 		// 메시지 변수 치환
	// 		String message = messageTemplate;
	// 		for (int c = 0; c < rowData.size(); c++) {
	// 			String code = String.valueOf((char)('A' + c));
	// 			message = message.replace("[%"+code+"%]", rowData.get(c));
	// 		}

	// 		// 발신번호 처리
	// 		String callbackValue;
	// 		if ("1".equals(callbackFlag)) {
	// 			callbackValue = tranCallback;
	// 		} else {
	// 			int colIdx = callbackRow.charAt(0) - 'A';
	// 			callbackValue = colIdx < rowData.size() ? rowData.get(colIdx) : "";
	// 		}

	// 		// 수신번호 처리
	// 		String calleeValue;
	// 		if ("1".equals(calleeFlag)) {
	// 			calleeValue = tranCallee;
	// 		} else {
	// 			int colIdx = calleeRow.charAt(0) - 'A';
	// 			calleeValue = colIdx < rowData.size() ? rowData.get(colIdx) : "";
	// 		}

	// 		//메시지 길이, 오류 체크, 엔티티변환
	// 		int messageLen = ExcelSendService.getSMSLen(message);  
	// 		int titleLen = (title != null) ? title.length() : 0;

	// 		String errorMsg = ExcelSendService.checkStrLen(messageLen, titleLen, calleeValue, callbackValue, messageType);

	// 		String decodedMessage = StringEscapeUtils.unescapeHtml4(message);

	// 		// 리턴값 셋팅
	// 		Map<String, Object> rowMap = new HashMap<>();
	// 		rowMap.put("수신번호", calleeValue);
	// 		rowMap.put("발신번호", callbackValue);
	// 		rowMap.put("전송시간", "즉시전송");
	// 		rowMap.put("길이", messageLen);
	// 		rowMap.put("메시지", decodedMessage);
	// 		rowMap.put("에러내용", errorMsg);

	// 		data.add(rowMap);
	// 	}
	// 	// 길이, 메시지, 에러내용 추가 종료
		
	// 	// 리턴값 셋팅
	// 	result.put("status", "success");
	// 	result.put("retData", data);
		
	// 	return result;
	// }
	
	
}