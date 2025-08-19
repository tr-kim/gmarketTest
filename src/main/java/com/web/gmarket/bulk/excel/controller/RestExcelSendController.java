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

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/excelSend")
public class RestExcelSendController {
	
    final int EXCEL_CELL_MAX = 5;
    final int EXCEL_ROW_MAX = 20000;
    
    final String EXCEL_PATH   = "C:/excel_web/excel";
    
    
	/**
	 * 엑셀 파일 업로드
	 */
	@PostMapping("/upload")
	public Map<String, Object> uploadExcel(@RequestParam("file") MultipartFile file) throws IOException {
		Map<String, Object> result = new HashMap<>();
		Map<String, Object> data = new HashMap<>();
		
		// 1. 파일 저장 경로
		String uploadDir = EXCEL_PATH;
		File dir = new File(uploadDir);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		
		// 2. 파일 저장
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String nowStr = sdf.format(new Date());
		String savedFileName = "SEND_" + nowStr + "_" + file.getOriginalFilename();
		File savedFile = new File(uploadDir + "/" + savedFileName);
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
			
			// 시트 이름 배열
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
			
			// 4. 파일 삭제
			//savedFile.delete();
		}
		
		return result;
	}
	
	
	/**
	 * 엑셀 시트 읽기
	 */
	@PostMapping("/readSheet")
	public Map<String, Object> readExcelSheet(
		@RequestParam("excelFile") String excelFile,
		@RequestParam("sheetName") String sheetName) throws IOException {
		
		Map<String, Object> result = new HashMap<>();
		List<List<String>> data = new ArrayList<>();
		
		// 1. 파일 찾기
		String uploadDir = EXCEL_PATH;
		File file = new File(uploadDir, excelFile);
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
			int maxRows = sheet.getLastRowNum();
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
			
			// 5. 시트 내용 읽기
			// 0번째 행에 열번호 추가
			List<String> colHeaders = new ArrayList<>();
			for (int i = 0; i < maxCells; i++) {
				colHeaders.add(getColumnName(i));
			}
			data.add(colHeaders);
			
			// 6. 데이터 행 추가
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
	 * 엑셀 열번호(A, B, C... AA, AB...)
	 */
	private String getColumnName(int index) {
		StringBuilder columnName = new StringBuilder();
		while (index >= 0) {
			columnName.insert(0, (char) ('A' + (index % 26)));
			index = (index / 26) - 1;
		}
		return columnName.toString();
	}
	
	
}