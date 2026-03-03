package com.web.gmarket.alarm.controller;

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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

import com.web.gmarket.common.utils.ConstantsUtils;
import com.web.gmarket.common.utils.ExcelUtils;
import com.web.gmarket.alarm.dto.AlarmDto;
import com.web.gmarket.alarm.service.AlarmService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/alarm")
public class RestAlarmController {
	
	@Autowired
	private AlarmService alarmService;

	@ResponseBody
	@PostMapping("/list")
	public ResponseEntity<?> getAlarmList(Authentication authentication, @RequestBody AlarmDto alarmDto) {
		
		 Map<String, Object> result = new HashMap<>();

		try {
			alarmDto.setQueryMode("GRID"); // grid 리스트 조회
	        result.put(ConstantsUtils.LIST, alarmService.selectAlarmList(alarmDto));
	        result.put(ConstantsUtils.TOTAL_COUNT, alarmService.selectAlarmListCount(alarmDto));
	        
			return ResponseEntity.ok(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			
	        result.put(ConstantsUtils.MESSAGE, "알림 이력 조회 실패");
	        result.put(ConstantsUtils.ERROR, e.getMessage());
	        
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
		}
	}

	@PostMapping("/excel")
	public void downloadExcel(@RequestBody AlarmDto alarmDto, HttpServletResponse response) {
		try {
			// 조회일자 재사용 방지
			String startDate = alarmDto.getStartDate();
			String endDate = alarmDto.getEndDate();
			
			alarmDto.setQueryMode("EXCEL"); // excel 리스트 조회
			List<AlarmDto> list = alarmService.selectAlarmList(alarmDto);
			
			SXSSFWorkbook workbook = new SXSSFWorkbook(100); // 메모리에 유지할 row 수
			SXSSFSheet sheet = workbook.createSheet("알림이력조회");
			
			// 컬럼 너비
			int[] widths = {4000, 4000, 6000, 4500, 4500, 6000, 5000, 5000};
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
			String[] headers = {"대분류", "서버", "서비스", "프로세스", "오류", "알림", "상세", "알림 발생 시간"};
			SXSSFRow headerRow = sheet.createRow(0);
			
            for (int i = 0; i < headers.length; i++) {
                SXSSFCell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
			
			// 데이터
			int rowIdx = 1;
			for (AlarmDto item : list) {
				SXSSFRow row = sheet.createRow(rowIdx++);
				
	            String companyName = ExcelUtils.switchCompanyCode(item.getCOMPANY_CODE());
	            
				row.createCell(0).setCellValue(companyName);
				row.createCell(1).setCellValue(item.getSERVER_ID() + "번");
				row.createCell(2).setCellValue(item.getSVC_NAME());
				row.createCell(3).setCellValue(item.getPROC_NAME());
				row.createCell(4).setCellValue(item.getMON_COMMENT());
				row.createCell(5).setCellValue(item.getALM_COMMENT());
				row.createCell(6).setCellValue(item.getALM_INFO());
				row.createCell(7).setCellValue(item.getALM_DATE());
			}
			
			// 필터 적용 
            if (rowIdx > 1) { 
                sheet.setAutoFilter(new CellRangeAddress(0, rowIdx - 1, 0, 7));
            }
            
			// 파일명
			String startDateFormatted = ExcelUtils.formatFileDate(startDate);
			String endDateFormatted = ExcelUtils.formatFileDate(endDate);
			String fileName = String.format("알림이력조회(%s~%s).xlsx", startDateFormatted, endDateFormatted);
			
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