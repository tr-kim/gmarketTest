package com.web.gmarket.alarm.controller;

import java.util.List;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

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
			alarmDto.setQueryMode("EXCEL"); // excel 리스트 조회
			List<AlarmDto> list = alarmService.selectAlarmList(alarmDto);
			
			// 파일명
			String startDateFormatted = ExcelUtils.formatFileDate(alarmDto.getStartDate());
			String endDateFormatted = ExcelUtils.formatFileDate(alarmDto.getEndDate());
			String fileName = String.format("알림이력조회(%s~%s).xlsx", startDateFormatted, endDateFormatted);
			
			SXSSFWorkbook workbook = new SXSSFWorkbook(100); // 메모리에 유지할 row 수
			SXSSFSheet sheet = workbook.createSheet("알림이력조회");
			
			sheet.setColumnWidth(0, 4000);  // 대분류
			sheet.setColumnWidth(1, 4000);  // 서버
			sheet.setColumnWidth(2, 6000);  // 서비스
			sheet.setColumnWidth(3, 4500);  // 프로세스
			sheet.setColumnWidth(4, 4500);  // 오류
			sheet.setColumnWidth(5, 6000);  // 알림
			sheet.setColumnWidth(6, 5000);  // 상세
			sheet.setColumnWidth(7, 5000);  // 알림 발생 시간
			
			// 헤더
			SXSSFRow header = sheet.createRow(0);
			header.createCell(0).setCellValue("대분류");
			header.createCell(1).setCellValue("서버");
			header.createCell(2).setCellValue("서비스");
			header.createCell(3).setCellValue("프로세스");
			header.createCell(4).setCellValue("오류");
			header.createCell(5).setCellValue("알림");
			header.createCell(6).setCellValue("상세");
			header.createCell(7).setCellValue("알림 발생 시간");
			
			// 데이터
			int rowIdx = 1;
			for (AlarmDto item : list) {
				SXSSFRow row = sheet.createRow(rowIdx++);
				
	            String companyName = ExcelUtils.switchCompanyCode(item.getCOMPANY_CODE());
	            //String tranDate = ExcelUtils.formatDate(item.getTRAN_DATE());
	            //String tranRslt = ExcelUtils.switchTranRslt(item.getTRAN_RSLT());
	            
				row.createCell(0).setCellValue(companyName);
				row.createCell(1).setCellValue(item.getSERVER_ID() + "번");
				row.createCell(2).setCellValue(item.getSVC_NAME());
				row.createCell(3).setCellValue(item.getPROC_NAME());
				row.createCell(4).setCellValue(item.getMON_COMMENT());
				row.createCell(5).setCellValue(item.getALM_COMMENT());
				row.createCell(6).setCellValue(item.getALM_INFO());
				row.createCell(7).setCellValue(item.getALM_DATE());
			}
			
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