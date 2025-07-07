package com.web.gmarket.bulk.hist.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	public ResponseEntity<?> getHistList(@RequestBody BulkHistDto bulkHistDto) {
		try {
			List<BulkHistDto> result = bulkHistService.getHistList(bulkHistDto);
			int totalCount = bulkHistService.getHistCount(bulkHistDto);
			
	        Map<String, Object> response = new HashMap<>();
	        response.put("data", result);
	        response.put("totalCount", totalCount);
	        
			return ResponseEntity.ok(response);
			
		} catch (Exception e) {
			Map<String, Object> error = new HashMap<>();
	        error.put("message", "이력 조회 실패");
	        error.put("error", e.getMessage());
	        
			return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(error);
		}
	}
	
	@PutMapping("/update")
	public void update() {
	}
	
	@DeleteMapping("/delete")
	public void delete() {
	}
}