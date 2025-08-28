package com.web.gmarket.bulk.excel.service;

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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.web.gmarket.common.utils.ConstantsUtils;

public interface ExcelSendService {
	
	int EXCEL_CELL_MAX = ConstantsUtils.EXCEL_CELL_MAX;
	int EXCEL_ROW_MAX = ConstantsUtils.EXCEL_ROW_MAX;
	
	String EXCEL_PATH = ConstantsUtils.EXCEL_PATH;
	
	
	/**
	 * 엑셀 파일 업로드 및 시트 목록 추출
	 * @throws IOException 
	 */
	public static Map<String, Object> uploadExcelFile(MultipartFile file, String userId) throws IOException {
		Map<String, Object> result = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		
		// 1. 파일 저장 경로 생성
		File dir = new File(EXCEL_PATH);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		
		// 2. 저장 파일명 생성
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String nowStr = sdf.format(new Date());
		
		String originalFilename = file.getOriginalFilename();
		String ext = "";
		int dotIndex = originalFilename.lastIndexOf(".");
		if (dotIndex != -1) {
			ext = originalFilename.substring(dotIndex); // 확장자 추출
		}
		
		// String savedFileName = "SEND_" + nowStr + "_" + originalFilename;
		String savedFileName = "SEND_" + nowStr + "_" + userId + ext;
		File savedFile = new File(EXCEL_PATH, savedFileName);
		
		Workbook workbook = null;
		try {
			// 3. 파일 저장
			file.transferTo(savedFile);
			
			// 4. Workbook 생성
			try (InputStream is = new FileInputStream(savedFile)) {
				if (savedFileName.endsWith(".xls")) {
					workbook = new HSSFWorkbook(is);
				} else if (savedFileName.endsWith(".xlsx")) {
					workbook = new XSSFWorkbook(is);
				} else {
					result.put("status", "error");
					result.put("message", "엑셀 파일 형식이 아닙니다.");
					return result;
				}
				
				// 5. 시트 이름 추출
				List<String> sheetNames = new ArrayList<>();
				int sheetNum = workbook.getNumberOfSheets();
				for (int i = 0; i < sheetNum; i++) {
					sheetNames.add(workbook.getSheetName(i));
				}
				
				data.put("excelFile", savedFileName);
				data.put("sheetName", sheetNames);
				
				result.put("status", "success");
				result.put("retData", data);
			}
			
		} catch (Exception e) {
			result.put("status", "error");
			result.put("message", e.getMessage());
			
		} finally {
			if (workbook != null) {
				workbook.close();
			}
			
			// 파일 삭제
			// savedFile.delete();
		}
		
		return result;
	}
	
	
	/**
	 * 엑셀 파일 검증
	 * @throws IOException 
	 */
	public static Map<String, Object> validateExcelFile(String excelFile, String sheetName) throws IOException {
		Map<String, Object> result = new HashMap<>();
		
		// 1. 파일 찾기
		File file = new File(EXCEL_PATH, excelFile);
		if (!file.exists()) {
			result.put("status", "error");
			result.put("message", "파일을 찾을 수 없습니다.");
			return result;
		}
		
		// 2. 확장자에 따라 Workbook 생성
		Workbook workbook = null;
		try (InputStream is = new FileInputStream(file)) {
			if (excelFile.endsWith(".xls")) {
				workbook = new HSSFWorkbook(is);
			} else if (excelFile.endsWith(".xlsx")) {
				workbook = new XSSFWorkbook(is);
			} else {
				result.put("status", "error");
				result.put("message", "엑셀 파일 형식이 아닙니다.");
				return result;
			}
			
			// 3. 시트 찾기
			Sheet sheet = workbook.getSheet(sheetName);
			if (sheet == null) {
	            result.put("status", "error");
	            result.put("message", "해당 시트를 찾을 수 없습니다.");
	            return result;
			}
			
			// 4. 최대 행/열 계산
			// 내용이 없어도 개수 포함
			int maxRows = sheet.getLastRowNum() + 1; // 행 수는 +1
			int maxCells = 0;
			for (Row row : sheet) {
				if (row != null && row.getLastCellNum() > maxCells) {
					maxCells = row.getLastCellNum();
				}
			}
			
			// 4. 최대 행/열 계산
			// 내용이 없으면 개수 제외
			/*int maxRows = sheet.getPhysicalNumberOfRows();
			int maxCells = 0;
			for (int i = 0; i < maxRows; i++) {
				Row row = sheet.getRow(i);
				if (row != null && row.getPhysicalNumberOfCells() > maxCells) {
					maxCells = row.getPhysicalNumberOfCells();
				}
			}*/
			
			if (maxRows > EXCEL_ROW_MAX) {
				result.put("status", "error");
				result.put("message", "엑셀파일은 " + EXCEL_ROW_MAX + "줄까지 가능합니다.");
				return result;
			}
			
			if (maxCells > EXCEL_CELL_MAX) {
				result.put("status", "error");
				result.put("message", "엑셀파일은 " + EXCEL_CELL_MAX + "열까지 가능합니다.");
				return result;
			}
			
			result.put("status", "success");
			result.put("sheet", sheet);
			result.put("maxRows", maxRows);
			result.put("maxCells", maxCells);
			return result;
			
		} catch (Exception e) {
			result.put("status", "error");
			result.put("message", e.getMessage());
			
		} finally {
			if (workbook != null) {
				workbook.close();
			}
		}
		
		return result;
	}
	
	
	/**
	 * 엑셀 시트 읽기
	 * @throws IOException 
	 */
	public static Map<String, Object> readExcelData(String excelFile, String sheetName) throws IOException {
		Map<String, Object> result = new HashMap<>();
		List<List<String>> data = new ArrayList<>();
		
		// 1. 파일 검증
		Map<String, Object> validation = validateExcelFile(excelFile, sheetName);
		if ("error".equals(validation.get("status"))) {
			return validation; // 실패 시 그대로 리턴
		}
		
		Sheet sheet = (Sheet) validation.get("sheet");
		int maxRows = (int) validation.get("maxRows");
		int maxCells = (int) validation.get("maxCells");
		
		// 2. 열번호 행 추가
		List<String> colHeaders = new ArrayList<>();
		for (int i = 0; i < maxCells; i++) {
			colHeaders.add(getColumnName(i));
		}
		data.add(colHeaders);
		
		// 3. 데이터 행 추가
		for (int r = 0; r < maxRows; r++) {
			Row row = sheet.getRow(r);
			List<String> rowData = new ArrayList<>();
			
			for (int c = 0; c < maxCells; c++) {
				String excelValue = "";
				if (row != null) {
					Cell cell = row.getCell(c);
					if (cell != null) {
						switch (cell.getCellType()) {
							case FORMULA:
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
		
		result.put("status", "success");
		result.put("retData", data);
		
		return result;
	}
	
	
	/**
	 * 엑셀 열번호(A, B, C... AA, AB...)
	 */
	public static String getColumnName(int index) {
		StringBuilder columnName = new StringBuilder();
		
		while (index >= 0) {
			columnName.insert(0, (char) ('A' + (index % 26)));
			index = (index / 26) - 1;
		}
		
		return columnName.toString();
	}
	
	
	/**
	 * 엑셀 열 인덱스(문자열 → 숫자 변환)
	 */
	public static int getColumnNameToIndex(String colName) {
		
		return new CellReference(colName + "1").getCol(); // "B" → 1
	}
	
	
	/**
	 * 메시지 길이(한글: 2 / 영어,숫자: 1)
	 */
	public static int getSMSLen(String str) {
		int iLength = 0;
		
		if (str != null && str.length() > 0) {
			byte[] by = str.getBytes();
			iLength = by.length;
		}
		
		return iLength;
	}
	
	
	/**
	 * 메시지 에러 체크
	 */
	public static String checkStrLen(int messageLen, int titleLen, String callee, String callback, String messageType) {
		Pattern p = Pattern.compile("^[0-9]*$"); // 숫자만
		String result = "";
		
		int MAX_LEN = messageType.equals("sms") ? 80 : 2000; // 메시지 최대 길이
		Matcher m = p.matcher(callee);
		Matcher m2 = p.matcher(callback);
		
		// 매치되지 않을 경우
		if (!m.matches()) result = "수신번호 이상";
		else if (!m2.matches()) result = "회신번호 이상";
		else if (messageLen == 0) result = "메시지 비어있음";
		else if (messageLen > MAX_LEN) result = "메시지길이 초과";
		else result = "발송가능";
		
		if (callee.equals("")) result = "수신번호 이상";
		if (callback.equals("")) result = "회신번호 이상";
		
		if (!messageType.equals("sms")) {
			if (titleLen > 200) result = "제목길이 초과";
			else if (titleLen == 0) result = "제목 없음";
		}
		
		return result;
	}
	
	
	/**
	 * 발신번호, 수신번호 치환
	 */
	public static String applyTranNum(String flag, String colLetters, String directValue, List<String> row) {
		// 직접입력
		if ("1".equals(flag)) return directValue == null ? "" : directValue;
		if (!"2".equals(flag)) return ""; // 그 외
		
		// 열선택
		int idx = getColumnNameToIndex(colLetters);
		if (idx >= 0 && idx < row.size()) return row.get(idx) == null ? "" : row.get(idx);
		
		return "";
	}
	
	
	/**
	 * 메시지 치환
	 */
	public static String applyMessage(String template, List<String> row) {
		if (template == null) return "";
		String msg = template;
		
		for (int c = 0; c < row.size(); c++) {
			String token = "[%" + getColumnName(c) + "%]"; //열변수
			String val = row.get(c) == null ? "" : row.get(c);
			msg = msg.replace(token, val);
		}
		
		return msg;
	}
	
	
}
