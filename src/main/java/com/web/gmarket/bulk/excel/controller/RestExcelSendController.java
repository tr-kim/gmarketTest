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

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/excelSend")
public class RestExcelSendController {
	
	@PostMapping("/list")
	public void list() {
	}
	
	@PutMapping("/update")
	public void update() {
	}
	
	@DeleteMapping("/delete")
	public void delete() {
	}
	
	@PostMapping("/upload")
	public Map<String, Object> uploadExcel(@RequestParam("file") MultipartFile file) throws IOException {
		Map<String, Object> result = new HashMap<>();
		
		// 1. 파일 저장 경로
		String uploadDir = "C:/excel_web/excel";
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
				throw new IllegalArgumentException("엑셀 파일 형식이 아닙니다.");
			}
			
			// 시트 이름 배열
			int sheetNum = workbook.getNumberOfSheets();
			List<String> sheetNames = new ArrayList<>();
			for (int i = 0; i < sheetNum; i++) {
				sheetNames.add(workbook.getSheetName(i));
			}
			
			// 리턴값 셋팅
			result.put("excelFile", savedFileName);
			result.put("sheetName", sheetNames);
			
		} finally {
			if (workbook != null) {
				workbook.close();
			}
			
			// 4. 파일 삭제
			//savedFile.delete();
		}
		
		return result;
	}
	
}