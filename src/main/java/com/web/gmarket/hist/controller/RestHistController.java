package com.web.gmarket.hist.controller;

import java.util.List;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.ExcelUtils;
import com.web.gmarket.hist.dto.HistDto;
import com.web.gmarket.hist.service.HistService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/hist")
public class RestHistController {
	
	private final HistService histService;
	
	public RestHistController(HistService histService) {
		this.histService = histService;
	}
	
	@PostMapping("/list")
	public ResponseEntity<?> getHistList(@RequestBody HistDto histDto) {
		try {
			histDto.setQueryMode("GRID"); // grid 리스트 조회
			List<HistDto> result = histService.getHistList(histDto);
			int totalCount = histService.getHistCount(histDto);
			
	        Map<String, Object> response = new HashMap<>();
	        response.put(ConstantsUtils.DATA, result);
	        response.put(ConstantsUtils.TOTAL_COUNT, totalCount);
	        
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			e.printStackTrace();
	        Map<String, Object> error = new HashMap<>();
	        error.put(ConstantsUtils.MESSAGE, "이력 조회 실패");
	        error.put(ConstantsUtils.ERROR, e.getMessage());
	        
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
		}
	}
	
	@PostMapping("/excel")
	public void downloadExcel(@RequestBody HistDto histDto, HttpServletResponse response) {
		try {
			// 조회일자 재사용 방지
			String startDate = histDto.getStartTime();
			String endDate = histDto.getEndTime();
			
			histDto.setQueryMode("EXCEL"); // excel 리스트 조회
			List<HistDto> list = histService.getHistList(histDto);
			
			SXSSFWorkbook workbook = new SXSSFWorkbook(100); // 메모리에 유지할 row 수
			SXSSFSheet sheet = workbook.createSheet("이력조회");
			
			sheet.setColumnWidth(0, 2500);  // NO
			sheet.setColumnWidth(1, 4000);  // 대분류
			sheet.setColumnWidth(2, 6000);  // 중분류
			sheet.setColumnWidth(3, 4500);  // 수신번호
			sheet.setColumnWidth(4, 4500);  // 발신번호
			sheet.setColumnWidth(5, 6000);  // 발송일시
			sheet.setColumnWidth(6, 15000); // 메시지 내용
			sheet.setColumnWidth(7, 5000);  // 결과
			sheet.setColumnWidth(8, 4000);  // Flow

			// 헤더용 스타일 설정
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true); // 글씨 굵게
            headerStyle.setFont(headerFont);
			headerStyle.setAlignment(HorizontalAlignment.CENTER); // 가운데 정렬
			
			// 헤더
			SXSSFRow header = sheet.createRow(0);
			String[] headerLabels = {"NO", "대분류", "중분류", "수신번호", "발신번호", "발송일시", "메시지 내용", "결과", "Flow #"};
            
            for (int i = 0; i < headerLabels.length; i++) {
                SXSSFCell cell = header.createCell(i);
                cell.setCellValue(headerLabels[i]);
                cell.setCellStyle(headerStyle);
            }
			
			// 데이터
			int rowIdx = 1;
			for (HistDto item : list) {
				SXSSFRow row = sheet.createRow(rowIdx++);
				
	            String companyName = ExcelUtils.switchCompanyCode(item.getCOMPANY_CODE());
	            String tranDate = ExcelUtils.formatDate(item.getTRAN_DATE());
	            String tranRslt = ExcelUtils.switchTranRslt(item.getTRAN_RSLT());
	            
				row.createCell(0).setCellValue(item.getTRAN_PR());
				row.createCell(1).setCellValue(companyName);
				row.createCell(2).setCellValue(item.getTABLE_NAME());
				row.createCell(3).setCellValue(item.getTRAN_PHONE());
				row.createCell(4).setCellValue(item.getTRAN_CALLBACK());
				row.createCell(5).setCellValue(tranDate);
				row.createCell(6).setCellValue(item.getTRAN_MSG());
				row.createCell(7).setCellValue(tranRslt);
				row.createCell(8).setCellValue(item.getCORP_RESERVED2());
			}
			
			// 필터 적용 
            if (rowIdx > 1) { 
                sheet.setAutoFilter(new CellRangeAddress(0, rowIdx - 1, 0, 8));
            }

			// 헤더 고정
            sheet.createFreezePane(0, 1);

			// 파일명
			String startDateFormatted = ExcelUtils.formatFileDate(startDate);
			String endDateFormatted = ExcelUtils.formatFileDate(endDate);
			String fileName = String.format("이력조회(%s~%s).xlsx", startDateFormatted, endDateFormatted);
			
			// 응답
			response.setContentType(
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			response.setHeader(
					"Content-Disposition",
					"attachment; filename=" + URLEncoder.encode(fileName, "UTF-8"));
			
			workbook.write(response.getOutputStream());
	        workbook.dispose();
	        workbook.close();
	        
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}