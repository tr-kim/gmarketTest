package com.web.gmarket.bulk.hist.controller;

import java.util.List;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

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
			List<BulkHistDto> result = bulkHistService.getBulkHistList(bulkHistDto);
			int totalCount = bulkHistService.getBulkHistCount(bulkHistDto);
			
	        Map<String, Object> response = new HashMap<>();
	        response.put("data", result);
	        response.put("totalCount", totalCount);
	        
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
	        error.put("message", "대량발송 이력 조회 실패");
	        error.put("error", e.getMessage());
	        
			return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(error);
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