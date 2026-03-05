package com.web.gmarket.bulk.hist.controller;

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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.web.gmarket.bulk.hist.dto.BulkHistDto;
import com.web.gmarket.bulk.hist.service.BulkHistService;
import com.web.gmarket.common.utils.ExcelUtils;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/bulkHist")
public class RestBulkHistController {

	private final BulkHistService bulkHistService;
	
	public RestBulkHistController(BulkHistService bulkHistService) {
		this.bulkHistService = bulkHistService;
	}
	
	@PostMapping("/list")
	public ResponseEntity<?> getBulkHistList(@RequestBody BulkHistDto bulkHistDto) {
		try {
			bulkHistDto.setQueryMode("GRID"); // grid 리스트 조회
			List<BulkHistDto> result = bulkHistService.getBulkHistList(bulkHistDto);
			int totalCount = bulkHistService.getBulkHistCount(bulkHistDto);
			
	        Map<String, Object> response = new HashMap<>();
	        response.put("data", result);
	        response.put("totalCount", totalCount);
	        
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
	        error.put("message", "대량 발송 이력 조회 실패");
	        error.put("error", e.getMessage());
	        
			return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(error);
		}
	}
	
	@PostMapping("/excel")
	public void downloadExcel(@RequestBody BulkHistDto bulkHistDto, HttpServletResponse response) {
		try {
			// 조회일자 재사용 방지
			String startDate = bulkHistDto.getStartDate();
			String endDate = bulkHistDto.getEndDate();
			
			bulkHistDto.setQueryMode("EXCEL"); // excel 리스트 조회
			List<BulkHistDto> list = bulkHistService.getBulkHistList(bulkHistDto);
			
			SXSSFWorkbook workbook = new SXSSFWorkbook(100); // 메모리에 유지할 row 수
			SXSSFSheet sheet = workbook.createSheet("대량발송이력");
			
			// 컬럼 너비
			int[] widths = {3000, 6000, 6500, 12000, 3000, 4000, 4000, 4000};
			for (int i = 0; i < widths.length; i++) {
				sheet.setColumnWidth(i, widths[i]);
			}
			
			// 첫번째 행 고정
			sheet.createFreezePane(0, 1);
			
			// 헤더 스타일
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true); // 글씨 굵게
            headerStyle.setFont(headerFont);
			headerStyle.setAlignment(HorizontalAlignment.CENTER); // 가운데 정렬
			
			// 헤더
			String[] headers = {"대분류", "제목", "전송 일시", "메시지 내용", "전체", "발송ID", "TYPE", "성공/실패"};
			SXSSFRow headerRow = sheet.createRow(0);
			
            for (int i = 0; i < headers.length; i++) {
                SXSSFCell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
			
			// 데이터
			int rowIdx = 1;
			for (BulkHistDto item : list) {
				SXSSFRow row = sheet.createRow(rowIdx++);
				
	            String companyName = ExcelUtils.switchCompanyCode(item.getCOMPANY_CODE());
				String tranDate = ExcelUtils.formatDate(item.getREQ_TIME());
				Integer failCount = item.getCNT_DUP() + item.getCNT_SENDFAIL();
	            
				row.createCell(0).setCellValue(companyName);
				row.createCell(1).setCellValue(item.getTITLE());
				row.createCell(2).setCellValue(tranDate);
				row.createCell(3).setCellValue(item.getMSG());
				row.createCell(4).setCellValue(item.getCNT());
				row.createCell(5).setCellValue(item.getUSER_ID());
				row.createCell(6).setCellValue(item.getSVC_TYPE());
				row.createCell(7).setCellValue(item.getCNT_SUCC() + "/" + failCount);
			}
			
			// 필터 적용 
            if (rowIdx > 1) { 
                sheet.setAutoFilter(new CellRangeAddress(0, rowIdx - 1, 0, 7));
            }
            
			// 파일명
			String startDateFormatted = ExcelUtils.formatFileDate(startDate);
			String endDateFormatted = ExcelUtils.formatFileDate(endDate);
			String fileName = String.format("대량발송이력(%s~%s).xlsx", startDateFormatted, endDateFormatted);
			
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
	
	@PostMapping("/downloadTxt")
	public ResponseEntity<StreamingResponseBody> downloadTxt(@RequestBody BulkHistDto bulkHistDto) {
		try {
			StreamingResponseBody stream = bulkHistService.getBulkTextList(bulkHistDto);
	        
			String fileName = "수신번호목록.xlsx";
			String encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
			
			return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
				.contentType(MediaType.TEXT_PLAIN)
				.body(stream);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}